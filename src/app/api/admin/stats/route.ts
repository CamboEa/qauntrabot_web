import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAllBots, getAllUsers, getAllSubscriptions } from "@/lib/firestore-api";
import { isSubscriptionActive } from "@/lib/subscription-plans";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  try {
    const [bots, users, subscriptions] = await Promise.all([
      getAllBots(),
      getAllUsers(),
      getAllSubscriptions(),
    ]);

    return NextResponse.json({
      bots: { total: bots.length, live: bots.filter((b) => b.status === "live").length },
      users: { total: users.length },
      subscriptions: {
        total: subscriptions.length,
        active: subscriptions.filter((s) =>
          isSubscriptionActive(s.validUntil, s.status)
        ).length,
        monthly: subscriptions.filter((s) => s.billingPeriod === "monthly").length,
        semiannual: subscriptions.filter((s) => s.billingPeriod === "semiannual").length,
        yearly: subscriptions.filter((s) => s.billingPeriod === "yearly").length,
      },
    });
  } catch (err) {
    console.error("[admin/stats]", err);
    const code = (err as { code?: string })?.code;
    const hint =
      code === "permission-denied"
        ? "Publish firestore.rules in Firebase Console (Firestore → Rules) or add FIREBASE_SERVICE_ACCOUNT_PATH to .env"
        : undefined;
    return NextResponse.json({ error: "Failed to load stats", hint }, { status: 500 });
  }
}
