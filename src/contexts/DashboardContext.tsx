"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllBots,
  getUserSubscription,
  type BotDoc,
  type Subscription,
  type TradingSnapshot,
} from "@/lib/firestore";
import { subscribeTradingSnapshot } from "@/lib/trading-snapshot-listener";
import { fetchTradingSnapshot, mergeTradingSnapshot } from "@/lib/trading-snapshot-client";
import { TRADING_STREAM_FALLBACK_POLL_MS } from "@/lib/trading-stream";
import { isSubscriptionActive } from "@/lib/subscription-plans";
import { resolveMtAccountNumber } from "@/lib/mt-account";

type DashboardContextValue = {
  subscription: Subscription | null;
  bots: BotDoc[];
  loading: boolean;
  active: boolean;
  email: string;
  platform: string;
  mtAccountNumber: string;
  accessibleBots: BotDoc[];
  lockedBots: BotDoc[];
  tradingSnapshot: TradingSnapshot | null;
  refresh: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [bots, setBots] = useState<BotDoc[]>([]);
  const [tradingSnapshot, setTradingSnapshot] = useState<TradingSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [listenerFailed, setListenerFailed] = useState(false);

  const applySnapshot = useCallback((incoming: TradingSnapshot | null) => {
    setTradingSnapshot((prev) => mergeTradingSnapshot(prev, incoming));
  }, []);

  const load = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setBots([]);
      setTradingSnapshot(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [sub, allBots] = await Promise.all([
        getUserSubscription(user.uid),
        getAllBots(),
      ]);
      setSubscription(sub);
      setBots(allBots);
    } catch {
      setSubscription(null);
      setBots([]);
      setTradingSnapshot(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refresh = useCallback(async () => {
    await load();
    if (!user) return;
    const snap = await fetchTradingSnapshot(user.uid);
    applySnapshot(snap);
  }, [user, load, applySnapshot]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user) {
      setTradingSnapshot(null);
      setListenerFailed(false);
      return;
    }
    setListenerFailed(false);
    return subscribeTradingSnapshot(user.uid, applySnapshot, () => setListenerFailed(true));
  }, [user, applySnapshot]);

  useEffect(() => {
    if (!user || !listenerFailed) return;

    let cancelled = false;

    const poll = async () => {
      if (document.visibilityState === "hidden") return;
      const snap = await fetchTradingSnapshot(user.uid);
      if (!cancelled) applySnapshot(snap);
    };

    poll();
    const id = window.setInterval(poll, TRADING_STREAM_FALLBACK_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [user, applySnapshot, listenerFailed]);

  const active = subscription
    ? isSubscriptionActive(subscription.validUntil, subscription.status)
    : false;

  const email = user?.email ?? profile?.email ?? "";
  const platform = profile?.platform ?? "—";
  const mtAccountNumber = resolveMtAccountNumber(
    subscription?.mtAccountNumber,
    profile?.mtAccountNumber,
  );

  const { accessibleBots, lockedBots } = useMemo(() => {
    const sorted = [...bots].sort((a, b) => {
      const order = { live: 0, beta: 1, soon: 2 };
      return order[a.status] - order[b.status];
    });
    if (!active) {
      return { accessibleBots: [] as BotDoc[], lockedBots: sorted };
    }
    return {
      accessibleBots: sorted.filter((b) => b.status !== "soon"),
      lockedBots: sorted.filter((b) => b.status === "soon"),
    };
  }, [bots, active]);

  const value = useMemo(
    () => ({
      subscription,
      bots,
      loading,
      active,
      email,
      platform,
      mtAccountNumber,
      accessibleBots,
      lockedBots,
      tradingSnapshot,
      refresh,
    }),
    [
      subscription,
      bots,
      loading,
      active,
      email,
      platform,
      mtAccountNumber,
      accessibleBots,
      lockedBots,
      tradingSnapshot,
      refresh,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
