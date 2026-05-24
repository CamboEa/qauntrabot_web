"use client";

import { doc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

/** Real-time balance updates when the EA writes to Firestore. */
export function subscribeTradingSnapshot(
  uid: string,
  onUpdate: (snapshot: TradingSnapshot | null) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, "users", uid),
    (snap) => {
      if (!snap.exists()) {
        onUpdate(null);
        return;
      }
      onUpdate(parseSnapshot(snap.data().tradingSnapshot));
    },
    () => onUpdate(null),
  );
}
