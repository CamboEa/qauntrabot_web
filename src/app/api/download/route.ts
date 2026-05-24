import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/r2";
import { isAllowedBotFileKey, requireActiveSubscriber } from "@/lib/download-auth";

const EXPIRES_SEC = 3600;

/** Signed R2 URL for EA files — requires active subscription. */
export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key");
    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    if (!isAllowedBotFileKey(key)) {
      return NextResponse.json({ error: "Invalid file key" }, { status: 400 });
    }

    const session = await requireActiveSubscriber(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = await getDownloadUrl(key, EXPIRES_SEC);
    return NextResponse.json({ url, expiresIn: EXPIRES_SEC });
  } catch (err) {
    console.error("[download]", err);
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}
