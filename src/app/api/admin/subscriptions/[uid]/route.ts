import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { deleteSubscription } from "@/lib/firestore-api";

type Params = { params: Promise<{ uid: string }> };

export async function DELETE(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { uid } = await params;
  try {
    await deleteSubscription(uid);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/subscriptions DELETE]", err);
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
