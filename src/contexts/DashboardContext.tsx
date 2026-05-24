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
import { fetchTradingSnapshot } from "@/lib/trading-snapshot-client";
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
  refresh: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [bots, setBots] = useState<BotDoc[]>([]);
  const [tradingSnapshot, setTradingSnapshot] = useState<TradingSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

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
      const [sub, allBots, snapshot] = await Promise.all([
        getUserSubscription(user.uid),
        getAllBots(),
        fetchTradingSnapshot(user.uid),
      ]);
      setSubscription(sub);
      setBots(allBots);
      setTradingSnapshot(snapshot);
    } catch {
      setSubscription(null);
      setBots([]);
      setTradingSnapshot(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user) return;

    const poll = () => {
      fetchTradingSnapshot(user.uid).then(setTradingSnapshot);
    };

    const intervalId = window.setInterval(poll, 15_000);
    const onFocus = () => poll();
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [user]);

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
      refresh: load,
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
      load,
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
