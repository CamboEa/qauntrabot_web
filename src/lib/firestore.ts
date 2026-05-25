import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { parseTradingSnapshot } from "./trading-snapshot-parse";

export { parseTradingSnapshot };

// ─── Types ────────────────────────────────────────────────────────────────────

export type BotStatus = "live" | "beta" | "soon";
export type RiskLevel = "Low" | "Medium" | "High";
import {
  type BillingPeriod,
  type SubscriptionStatus,
  normalizeBillingPeriod,
  isSubscriptionActive,
  computeValidUntil,
} from "./subscription-plans";

/** @deprecated Use BillingPeriod — kept for reading legacy documents */
export type PlanTier = "starter" | "pro" | "institutional";

export type { BillingPeriod, SubscriptionStatus };

export type SubscriptionPlanDoc = {
  id: BillingPeriod;
  label: string;
  priceTotal: number;
  pricePerMonth: number;
  periodLabel: string;
  description: string;
  savingsNote?: string | null;
  highlighted?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
export type TradingPlatform = "MT4" | "MT5";

/** Verified backtest evidence (Strategy Tester / third-party reports). */
export type BacktestProof = {
  period: string;
  platform: TradingPlatform;
  broker: string;
  timeframe: string;
  initialDeposit: string;
  imageKeys: string[];
  reportKey?: string;
  notes?: string;
};

/** Verified live / forward-test evidence (real account screenshots). */
export type LiveProof = {
  runningSince: string;
  platform: TradingPlatform;
  broker: string;
  accountType: string;
  imageKeys: string[];
  reportKey?: string;
  notes?: string;
};

export type BotProof = {
  backtest?: BacktestProof | null;
  live?: LiveProof | null;
};

export const EMPTY_BOT_PROOF: BotProof = {
  backtest: null,
  live: null,
};

export type BotDoc = {
  id: string;
  name: string;
  subtitle: string;
  asset: string;
  assetTag: string;
  status: BotStatus;
  risk: RiskLevel;
  gain: string;
  drawdown: string;
  winRate: string;
  trades: string;
  description: string;
  pairs: string[];
  minDeposit: string;
  /** Slug folder under `bots/` in R2 (from bot name), e.g. `xauusd-grid-pro` */
  storageFolder?: string;
  imageKey: string;   // R2 object key for thumbnail
  fileKey: string;    // R2 object key for EA file (.ex4 / .ex5 / .mq5)
  proof?: BotProof;
  createdAt: Date;
  updatedAt: Date;
};

export type BalanceHistoryPoint = {
  balance: number;
  at: Date;
};

/** Mirrors the EA on-chart dashboard (SuperFiveCentBot sections). */
export type BotRuntimeStatus = {
  botName?: string;
  symbol: string;
  /** Chart period the EA is attached to (e.g. M15, H1) */
  timeframe?: string;
  serverTime?: string;
  todayPnl: number;
  dayTarget: number;
  floatingPnl: number;
  marketOpen: boolean;
  marketBlockReason?: string;
  emaPeriod?: number;
  emaValue?: number | null;
  emaDistancePips?: number | null;
  emaSlopePips?: number | null;
  emaTrend?: string | null;
  buyFilter?: string | null;
  sellFilter?: string | null;
  buyPositions: number;
  sellPositions: number;
  buyLots: number;
  sellLots: number;
  buyAvgEntry?: number | null;
  sellAvgEntry?: number | null;
  buyPnl: number;
  sellPnl: number;
  buySlArmed: boolean;
  sellSlArmed: boolean;
  buyHedgeOverride: boolean;
  sellHedgeOverride: boolean;
};

/** Live stats reported from MT5 Expert Advisor (WebRequest). */
export type TradingSnapshot = {
  balance: number;
  equity: number;
  profit: number;
  currency: string;
  server?: string;
  /** Worst floating P/L (≤ 0) while EA has been attached this session */
  maxFloatingLoss?: number;
  /** Balance samples for equity curve (newest last) */
  balanceHistory?: BalanceHistoryPoint[];
  /** Live bot dashboard: trend, market hours, grid */
  botStatus?: BotRuntimeStatus | null;
  updatedAt: Date;
};

export type UserProfile = {
  uid: string;
  email: string;
  platform: string;
  /** MT4/MT5 trading account login (registered at sign-up) */
  mtAccountNumber?: string;
  displayName?: string;
  createdAt: Date;
  tradingSnapshot?: TradingSnapshot | null;
};

export type Subscription = {
  uid: string;
  /** Billing cycle — active subscription grants all bots */
  billingPeriod: BillingPeriod;
  status: SubscriptionStatus;
  mtAccountNumber: string;
  licenseKey: string;
  validUntil: Date | null;
  createdAt: Date;
  /** @deprecated Legacy fields — ignored for access */
  plan?: PlanTier;
  botIds?: string[];
};

function parseSubscriptionDoc(uid: string, data: DocumentData): Subscription {
  const validUntil = data.validUntil?.toDate?.() ?? null;
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
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    plan: data.plan as PlanTier | undefined,
    botIds: (data.botIds as string[]) ?? [],
  };
}

// ─── User profile ─────────────────────────────────────────────────────────────

export async function createUserProfile(
  uid: string,
  data: { email: string; platform: string; mtAccountNumber: string; displayName?: string }
): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid: snap.id,
    email: data.email as string,
    platform: (data.platform as string) ?? "",
    mtAccountNumber: (data.mtAccountNumber as string) ?? "",
    displayName: data.displayName as string | undefined,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    tradingSnapshot: parseTradingSnapshot(data.tradingSnapshot),
  };
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, "users", uid), data as DocumentData);
}

export async function updateTradingSnapshot(
  uid: string,
  snapshot: Omit<TradingSnapshot, "updatedAt">,
): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    tradingSnapshot: {
      ...snapshot,
      updatedAt: serverTimestamp(),
    },
  });
}

// ─── Subscription plans (pricing) ─────────────────────────────────────────────

export async function getAllPlans(): Promise<SubscriptionPlanDoc[]> {
  const snap = await getDocs(query(collection(db, "plans"), orderBy("sortOrder", "asc")));
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
      createdAt: data.createdAt?.toDate?.(),
      updatedAt: data.updatedAt?.toDate?.(),
    };
  });
}

// ─── Bots ─────────────────────────────────────────────────────────────────────

export async function getAllBots(): Promise<BotDoc[]> {
  const snap = await getDocs(query(collection(db, "bots"), orderBy("createdAt", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BotDoc));
}

export async function getLiveBots(): Promise<BotDoc[]> {
  const snap = await getDocs(
    query(collection(db, "bots"), where("status", "==", "live"), orderBy("createdAt", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BotDoc));
}

export async function getBot(botId: string): Promise<BotDoc | null> {
  const snap = await getDoc(doc(db, "bots", botId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as BotDoc;
}

export type BotInput = Omit<BotDoc, "id" | "createdAt" | "updatedAt">;

export async function createBot(
  botId: string,
  data: BotInput
): Promise<void> {
  await setDoc(doc(db, "bots", botId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateBot(botId: string, data: Partial<BotInput>): Promise<void> {
  await updateDoc(doc(db, "bots", botId), {
    ...data,
    updatedAt: serverTimestamp(),
  } as DocumentData);
}

export async function deleteBot(botId: string): Promise<void> {
  await deleteDoc(doc(db, "bots", botId));
}

// ─── Users (admin) ──────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      email: data.email as string,
      platform: data.platform as string,
      mtAccountNumber: (data.mtAccountNumber as string) ?? "",
      displayName: data.displayName as string | undefined,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    };
  });
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function getUserSubscription(uid: string): Promise<Subscription | null> {
  const snap = await getDoc(doc(db, "subscriptions", uid));
  if (!snap.exists()) return null;
  return parseSubscriptionDoc(uid, snap.data());
}

export async function getSubscriptionByLicenseKey(
  licenseKey: string,
): Promise<Subscription | null> {
  const key = licenseKey.trim().toUpperCase();
  if (!key) return null;

  const snap = await getDocs(
    query(collection(db, "subscriptions"), where("licenseKey", "==", key)),
  );
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return parseSubscriptionDoc(docSnap.id, docSnap.data());
}

/** Active subscription → access to every bot in the catalogue */
export async function hasActiveSubscription(uid: string): Promise<boolean> {
  const sub = await getUserSubscription(uid);
  if (!sub) return false;
  return isSubscriptionActive(sub.validUntil, sub.status);
}

export async function hasAccessToBot(uid: string, _botId: string): Promise<boolean> {
  return hasActiveSubscription(uid);
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  const snap = await getDocs(collection(db, "subscriptions"));
  return snap.docs.map((d) => parseSubscriptionDoc(d.id, d.data()));
}

export type SubscriptionInput = {
  billingPeriod: BillingPeriod;
  status?: SubscriptionStatus;
  mtAccountNumber?: string;
  licenseKey?: string;
  validUntil?: Date | null;
};

export async function upsertSubscription(uid: string, data: SubscriptionInput): Promise<void> {
  const existing = await getDoc(doc(db, "subscriptions", uid));
  const validUntil =
    data.validUntil !== undefined ? data.validUntil : computeValidUntil(data.billingPeriod);

  const licenseKey = (data.licenseKey ?? generateLicenseKey()).trim().toUpperCase();

  const payload: DocumentData = {
    billingPeriod: data.billingPeriod,
    status: data.status ?? "active",
    mtAccountNumber: data.mtAccountNumber ?? "",
    licenseKey,
    validUntil,
    updatedAt: serverTimestamp(),
  };

  if (existing.exists()) {
    await updateDoc(doc(db, "subscriptions", uid), payload);
  } else {
    await setDoc(doc(db, "subscriptions", uid), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  }
}

export async function deleteSubscription(uid: string): Promise<void> {
  await deleteDoc(doc(db, "subscriptions", uid));
}

function generateLicenseKey(): string {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QB-${seg()}-${seg()}-${seg()}`;
}
