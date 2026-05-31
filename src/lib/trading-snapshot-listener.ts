"use client";

import { doc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseTradingSnapshot } from "@/lib/trading-snapshot-parse";
import type { TradingSnapshot } from "@/lib/firestore";

/** Real-time balance updates when the EA writes to Firestore. */
export function subscribeTradingSnapshot(
  uid: string,
  onUpdate: (snapshot: TradingSnapshot | null) => void,
  onError?: () => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, "users", uid),
    (snap) => {
      if (!snap.exists()) {
        onUpdate(null);
        return;
      }
      onUpdate(parseTradingSnapshot(snap.data().tradingSnapshot));
    },
    (err) => {
      console.error("[trading-snapshot] Firestore listener error:", err);
      onError?.();
    },
  );
}
