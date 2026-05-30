import { NextResponse } from "next/server";
import {
  getUserProfile,
  getUserSubscription,
  updateUserProfile,
  upsertSubscription,
} from "@/lib/firestore-api";
import { isValidMtAccountNumber, normalizeMtAccountNumber } from "@/lib/mt-account";
import { requireSignedInUser } from "@/lib/user-auth";

const PLATFORMS = ["MetaTrader 5 (MT5)", "MetaTrader 4 (MT4)"] as const;

type PatchBody = {
  platform?: string;
  mtAccountNumber?: string;
};

export async function PATCH(req: Request) {
  const session = await requireSignedInUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await getUserProfile(session.uid);
    if (!existing) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
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
      if (!isValidMtAccountNumber(mtNormalized)) {
        return NextResponse.json(
          { error: "MT account must be 4–15 digits" },
          { status: 400 },
        );
      }
      updates.mtAccountNumber = mtNormalized;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    await updateUserProfile(session.uid, updates);

    if (body.mtAccountNumber !== undefined) {
      const sub = await getUserSubscription(session.uid);
      if (sub) {
        await upsertSubscription(session.uid, {
          billingPeriod: sub.billingPeriod,
          status: sub.status,
          licenseKey: sub.licenseKey,
          validUntil: sub.validUntil,
          mtAccountNumber: mtNormalized,
        });
      }
    }

    const updated = await getUserProfile(session.uid);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[user/profile PATCH]", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
