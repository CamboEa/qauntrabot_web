/**
 * Server-only Firestore access via Firebase Admin SDK (bypasses security rules).
 * Use in API routes — never import from client components.
 */
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { getAdminFirestore } from "./firebase-admin";
import type {
  BotDoc,
  BotInput,
  BotStatus,
  PlanTier,
  RiskLevel,
  Subscription,
  SubscriptionInput,
  UserProfile,
} from "./firestore";

export type { BotDoc, BotInput, BotStatus, PlanTier, RiskLevel, Subscription, SubscriptionInput, UserProfile };

function db() {
  return getAdminFirestore();
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

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await db().collection("users").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      email: data.email as string,
      platform: data.platform as string,
      displayName: data.displayName as string | undefined,
      createdAt: toDate(data.createdAt),
    };
  });
}

export async function createUserProfile(
  uid: string,
  data: { email: string; platform: string; displayName?: string }
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

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function getAllSubscriptions(): Promise<Subscription[]> {
  const snap = await db().collection("subscriptions").get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      plan: data.plan as PlanTier,
      botIds: (data.botIds as string[]) ?? [],
      mtAccountNumber: (data.mtAccountNumber as string) ?? "",
      licenseKey: (data.licenseKey as string) ?? "",
      validUntil: data.validUntil ? toDate(data.validUntil) : null,
      createdAt: toDate(data.createdAt),
    };
  });
}

export async function getUserSubscription(uid: string): Promise<Subscription | null> {
  const snap = await db().collection("subscriptions").doc(uid).get();
  if (!snap.exists) return null;
  return { uid, ...snap.data() } as Subscription;
}

export async function upsertSubscription(uid: string, data: SubscriptionInput): Promise<void> {
  const ref = db().collection("subscriptions").doc(uid);
  const existing = await ref.get();
  const payload: DocumentData = {
    plan: data.plan,
    botIds: data.botIds,
    mtAccountNumber: data.mtAccountNumber ?? "",
    licenseKey: data.licenseKey ?? generateLicenseKey(),
    validUntil: data.validUntil ?? null,
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
}

export async function deleteSubscription(uid: string): Promise<void> {
  await db().collection("subscriptions").doc(uid).delete();
}

function generateLicenseKey(): string {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QB-${seg()}-${seg()}-${seg()}`;
}
