import { doc, getDocFromServer } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { TradingSnapshot } from "@/lib/firestore";
import { parseTradingSnapshot } from "@/lib/trading-snapshot-parse";

/** Keep the newest snapshot when Firestore + API poll overlap. */
export function mergeTradingSnapshot(
  prev: TradingSnapshot | null,
  next: TradingSnapshot | null,
): TradingSnapshot | null {
  if (!next) return prev;
  if (!prev) return next;
  return next.updatedAt.getTime() >= prev.updatedAt.getTime() ? next : prev;
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
        const data = (await res.json()) as { snapshot: unknown };
        if (!data.snapshot) return null;
        return parseTradingSnapshot({
          ...(data.snapshot as object),
          updatedAt: (data.snapshot as { updatedAt?: string }).updatedAt,
        });
      }
    } catch {
      /* fall through */
    }
  }

  try {
    const snap = await getDocFromServer(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return parseTradingSnapshot(snap.data().tradingSnapshot);
  } catch {
    return null;
  }
}
