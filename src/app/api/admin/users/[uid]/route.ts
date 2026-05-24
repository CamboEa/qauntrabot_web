import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  getUserProfile,
  getUserSubscription,
  updateUserProfile,
  upsertSubscription,
} from "@/lib/firestore-api";
import { isValidMtAccountNumber, normalizeMtAccountNumber } from "@/lib/mt-account";

const PLATFORMS = ["MetaTrader 5 (MT5)", "MetaTrader 4 (MT4)"] as const;

type PatchBody = {
  platform?: string;
  mtAccountNumber?: string;
  /** When true (default), copy MT account to subscription if one exists */
  syncSubscription?: boolean;
};

export async function PATCH(
  req: Request,
  context: { params: Promise<{ uid: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { uid } = await context.params;

  try {
    const existing = await getUserProfile(uid);
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await req.json()) as PatchBody;
    const updates: { platform?: string; mtAccountNumber?: string } = {};

    if (body.platform !== undefined) {
      if (!PLATFORMS.includes(body.platform as (typeof PLATFORMS)[number])) {
        return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
      }
      updates.platform = body.platform;
    }

    let mtNormalized = existing.mtAccountNumber ?? "";
    if (body.mtAccountNumber !== undefined) {
      mtNormalized = normalizeMtAccountNumber(body.mtAccountNumber);
      if (mtNormalized && !isValidMtAccountNumber(mtNormalized)) {
        return NextResponse.json(
          { error: "MT account must be 4–15 digits" },
          { status: 400 }
        );
      }
      updates.mtAccountNumber = mtNormalized;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    await updateUserProfile(uid, updates);

    const syncSubscription = body.syncSubscription !== false;
    if (syncSubscription && body.mtAccountNumber !== undefined) {
      const sub = await getUserSubscription(uid);
      if (sub) {
        await upsertSubscription(uid, {
          billingPeriod: sub.billingPeriod,
          status: sub.status,
          licenseKey: sub.licenseKey,
          validUntil: sub.validUntil,
          mtAccountNumber: mtNormalized,
        });
      }
    }

    const updated = await getUserProfile(uid);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[admin/users PATCH]", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
