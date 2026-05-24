import { doc, getDocFromServer } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { TradingSnapshot } from "@/lib/firestore";
import { toDate } from "@/lib/dates";

function parseSnapshot(data: unknown): TradingSnapshot | null {
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

/** Fetch latest balance from API (server/Firestore admin) with Firestore server read fallback. */
export async function fetchTradingSnapshot(uid: string): Promise<TradingSnapshot | null> {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/trading/snapshot", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as {
          snapshot: {
            balance: number;
            equity: number;
            profit: number;
            currency: string;
            server: string | null;
            updatedAt: string;
          } | null;
        };
        if (!data.snapshot) return null;
        return {
          ...data.snapshot,
          server: data.snapshot.server ?? undefined,
          updatedAt: new Date(data.snapshot.updatedAt),
        };
      }
    } catch {
      /* fall through */
    }
  }

  try {
    const snap = await getDocFromServer(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return parseSnapshot(snap.data().tradingSnapshot);
  } catch {
    return null;
  }
}
