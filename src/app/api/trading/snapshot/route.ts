import { NextResponse } from "next/server";
import { getUserProfile } from "@/lib/firestore-api";
import { getBearerToken, verifySessionToken } from "@/lib/session-auth";

/** Latest trading snapshot for the signed-in user (bypasses stale client cache). */
export async function GET(req: Request) {
  const token = getBearerToken(req);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await getUserProfile(session.uid);
    const snap = profile?.tradingSnapshot;

    return NextResponse.json({
      snapshot: snap
        ? {
            balance: snap.balance,
            equity: snap.equity,
            profit: snap.profit,
            currency: snap.currency,
            server: snap.server ?? null,
            maxFloatingLoss: snap.maxFloatingLoss ?? null,
            balanceHistory: (snap.balanceHistory ?? []).map((p) => ({
              balance: p.balance,
              at: p.at.toISOString(),
            })),
            botStatus: snap.botStatus ?? null,
            updatedAt: snap.updatedAt.toISOString(),
          }
        : null,
    });
  } catch (err) {
    console.error("[trading/snapshot GET]", err);
    return NextResponse.json({ error: "Failed to load snapshot" }, { status: 500 });
  }
}
