import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  getAllSubscriptions,
  getUserProfile,
  upsertSubscription,
  type SubscriptionInput,
} from "@/lib/firestore-api";
import { normalizeMtAccountNumber } from "@/lib/mt-account";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  try {
    const subs = await getAllSubscriptions();
    return NextResponse.json(
      subs.map((s) => ({
        ...s,
        validUntil: s.validUntil?.toISOString() ?? null,
        createdAt: s.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    console.error("[admin/subscriptions GET]", err);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  try {
    const body = await req.json();
    const { uid, ...data } = body as { uid: string } & SubscriptionInput;

    if (!uid) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    let mtAccountNumber = normalizeMtAccountNumber(data.mtAccountNumber ?? "");
    if (!mtAccountNumber) {
      const profile = await getUserProfile(uid);
      mtAccountNumber = normalizeMtAccountNumber(profile?.mtAccountNumber ?? "");
    }

    await upsertSubscription(uid, {
      ...data,
      mtAccountNumber,
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/subscriptions POST]", err);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
