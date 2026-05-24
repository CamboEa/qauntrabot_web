/**
 * Server-only Firestore access via Firebase Admin SDK (bypasses security rules).
 * Use in API routes — never import from client components.
 */
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { getAdminFirestore } from "./firebase-admin";
import {
  getUidByLicenseKey,
  normalizeLicenseKeyDocId,
  removeLicenseIndex,
  setLicenseIndex,
} from "./license-index";
import {
  normalizeBillingPeriod,
  isSubscriptionActive,
  computeValidUntil,
  type SubscriptionStatus,
} from "./subscription-plans";
import type {
  BotDoc,
  BotInput,
  BotStatus,
  BillingPeriod,
  PlanTier,
  RiskLevel,
  Subscription,
  SubscriptionInput,
  SubscriptionPlanDoc,
  UserProfile,
  TradingSnapshot,
} from "./firestore";

export type {
  BotDoc,
  BotInput,
  BotStatus,
  BillingPeriod,
  PlanTier,
  RiskLevel,
  Subscription,
  SubscriptionInput,
  SubscriptionPlanDoc,
  SubscriptionStatus,
  UserProfile,
  TradingSnapshot,
};

function db() {
  return getAdminFirestore();
}

function parseTradingSnapshot(data: unknown): TradingSnapshot | null {
  if (!data || typeof data !== "object") return null;
  const s = data as Record<string, unknown>;
  const updated = toDate(s.updatedAt);
  if (!updated) return null;
  return {
    balance: Number(s.balance) || 0,
    equity: Number(s.equity) || 0,
    profit: Number(s.profit) || 0,
    currency: (s.currency as string) || "USD",
    server: (s.server as string) || undefined,
    updatedAt: updated,
  };
}

function toDate(value: unknown): Date {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  if (value && typeof value === "object" && "_seconds" in value) {
    const v = value as { _seconds: number };
    return new Date(v._seconds * 1000);
  }
  return new Date();
}

// ─── Subscription plans ───────────────────────────────────────────────────────

export async function getAllPlans(): Promise<SubscriptionPlanDoc[]> {
  const snap = await db().collection("plans").orderBy("sortOrder", "asc").get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id as BillingPeriod,
      label: data.label as string,
      priceTotal: data.priceTotal as number,
      pricePerMonth: data.pricePerMonth as number,
      periodLabel: data.periodLabel as string,
      description: data.description as string,
      savingsNote: (data.savingsNote as string | null) ?? undefined,
      highlighted: Boolean(data.highlighted),
      sortOrder: data.sortOrder as number | undefined,
      createdAt: data.createdAt ? toDate(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? toDate(data.updatedAt) : undefined,
    };
  });
}

// ─── Bots ─────────────────────────────────────────────────────────────────────

export async function getAllBots(): Promise<BotDoc[]> {
  const snap = await db().collection("bots").orderBy("createdAt", "asc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BotDoc));
}

export async function getLiveBots(): Promise<BotDoc[]> {
  const snap = await db()
    .collection("bots")
    .where("status", "==", "live")
    .orderBy("createdAt", "asc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BotDoc));
}

export async function getBot(botId: string): Promise<BotDoc | null> {
  const snap = await db().collection("bots").doc(botId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as BotDoc;
}

export async function createBot(botId: string, data: BotInput): Promise<void> {
  await db()
    .collection("bots")
    .doc(botId)
    .set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function updateBot(botId: string, data: Partial<BotInput>): Promise<void> {
  await db()
    .collection("bots")
    .doc(botId)
    .update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    } as DocumentData);
}

export async function deleteBot(botId: string): Promise<void> {
  await db().collection("bots").doc(botId).delete();
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await db().collection("users").doc(uid).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return {
    uid: snap.id,
    email: data.email as string,
    platform: data.platform as string,
    mtAccountNumber: (data.mtAccountNumber as string) ?? "",
    displayName: data.displayName as string | undefined,
    createdAt: toDate(data.createdAt),
    tradingSnapshot: parseTradingSnapshot(data.tradingSnapshot),
  };
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await db().collection("users").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      email: data.email as string,
      platform: data.platform as string,
      mtAccountNumber: (data.mtAccountNumber as string) ?? "",
      displayName: data.displayName as string | undefined,
      createdAt: toDate(data.createdAt),
      tradingSnapshot: parseTradingSnapshot(data.tradingSnapshot),
    };
  });
}

export async function updateTradingSnapshot(
  uid: string,
  snapshot: Omit<TradingSnapshot, "updatedAt">,
): Promise<void> {
  const ref = db().collection("users").doc(uid);
  const existing = await ref.get();
  const prev = existing.exists
    ? parseTradingSnapshot(existing.data()?.tradingSnapshot)
    : null;

  if (
    prev &&
    Math.abs(prev.balance - snapshot.balance) < 0.01 &&
    Math.abs(prev.equity - snapshot.equity) < 0.01 &&
    Math.abs(prev.profit - snapshot.profit) < 0.01 &&
    prev.currency === snapshot.currency &&
    (prev.server ?? "") === (snapshot.server ?? "")
  ) {
    return;
  }

  await ref.update({
    tradingSnapshot: {
      ...snapshot,
      updatedAt: FieldValue.serverTimestamp(),
    },
  });
}

export async function createUserProfile(
  uid: string,
  data: { email: string; platform: string; mtAccountNumber: string; displayName?: string }
): Promise<void> {
  await db()
    .collection("users")
    .doc(uid)
    .set({
      ...data,
      uid,
      createdAt: FieldValue.serverTimestamp(),
    });
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "platform" | "mtAccountNumber" | "displayName">>
): Promise<void> {
  await db().collection("users").doc(uid).update(data as DocumentData);
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

function parseSubscriptionDoc(uid: string, data: DocumentData): Subscription {
  const validUntil = data.validUntil ? toDate(data.validUntil) : null;
  const billingPeriod = normalizeBillingPeriod(
    data.billingPeriod as string | undefined,
    data.plan as string | undefined
  );
  const rawStatus = (data.status as SubscriptionStatus) ?? "active";
  let status: SubscriptionStatus = rawStatus;
  if (rawStatus !== "cancelled") {
    status = isSubscriptionActive(validUntil, "active") ? "active" : "expired";
  }

  return {
    uid,
    billingPeriod,
    status,
    mtAccountNumber: (data.mtAccountNumber as string) ?? "",
    licenseKey: (data.licenseKey as string) ?? "",
    validUntil,
    createdAt: toDate(data.createdAt),
    plan: data.plan as PlanTier | undefined,
    botIds: (data.botIds as string[]) ?? [],
  };
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  const snap = await db().collection("subscriptions").get();
  return snap.docs.map((d) => parseSubscriptionDoc(d.id, d.data()));
}

export async function getUserSubscription(uid: string): Promise<Subscription | null> {
  const snap = await db().collection("subscriptions").doc(uid).get();
  if (!snap.exists) return null;
  return parseSubscriptionDoc(uid, snap.data()!);
}

export async function getSubscriptionByLicenseKey(
  licenseKey: string,
): Promise<Subscription | null> {
  const key = normalizeLicenseKeyDocId(licenseKey);
  if (!key) return null;

  const uid = await getUidByLicenseKey(key);
  if (uid) {
    return getUserSubscription(uid);
  }

  const snap = await db()
    .collection("subscriptions")
    .where("licenseKey", "==", key)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const docSnap = snap.docs[0];
  await setLicenseIndex(docSnap.id, key);
  return parseSubscriptionDoc(docSnap.id, docSnap.data());
}

export async function upsertSubscription(uid: string, data: SubscriptionInput): Promise<void> {
  const ref = db().collection("subscriptions").doc(uid);
  const existing = await ref.get();
  const previousKey = existing.exists
    ? normalizeLicenseKeyDocId((existing.data()?.licenseKey as string) ?? "")
    : "";

  const validUntil =
    data.validUntil !== undefined
      ? data.validUntil
      : computeValidUntil(data.billingPeriod);

  const licenseKey = normalizeLicenseKeyDocId(data.licenseKey ?? generateLicenseKey());

  const payload: DocumentData = {
    billingPeriod: data.billingPeriod,
    status: data.status ?? "active",
    mtAccountNumber: data.mtAccountNumber ?? "",
    licenseKey,
    validUntil,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (existing.exists) {
    await ref.update(payload);
  } else {
    await ref.set({
      ...payload,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  if (previousKey && previousKey !== licenseKey) {
    await removeLicenseIndex(previousKey);
  }
  await setLicenseIndex(uid, licenseKey);
}

export async function deleteSubscription(uid: string): Promise<void> {
  const ref = db().collection("subscriptions").doc(uid);
  const existing = await ref.get();
  if (existing.exists) {
    const key = normalizeLicenseKeyDocId((existing.data()?.licenseKey as string) ?? "");
    if (key) await removeLicenseIndex(key);
  }
  await ref.delete();
}

function generateLicenseKey(): string {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QB-${seg()}-${seg()}-${seg()}`;
}
