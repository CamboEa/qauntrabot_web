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
import { getAllBots, getUserSubscription, type BotDoc, type Subscription } from "@/lib/firestore";
import { isSubscriptionActive } from "@/lib/subscription-plans";

type DashboardContextValue = {
  subscription: Subscription | null;
  bots: BotDoc[];
  loading: boolean;
  active: boolean;
  email: string;
  platform: string;
  accessibleBots: BotDoc[];
  lockedBots: BotDoc[];
  refresh: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [bots, setBots] = useState<BotDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setBots([]);
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
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const active = subscription
    ? isSubscriptionActive(subscription.validUntil, subscription.status)
    : false;

  const email = user?.email ?? profile?.email ?? "";
  const platform = profile?.platform ?? "—";

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
      accessibleBots,
      lockedBots,
      refresh: load,
    }),
    [subscription, bots, loading, active, email, platform, accessibleBots, lockedBots, load],
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
