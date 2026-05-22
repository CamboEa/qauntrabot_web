import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/r2";

// GET /api/download?key=bots/files/xauusd-grid-mt5.ex5
// Returns a signed R2 URL valid for 1 hour.
// In production, verify the user has an active subscription before issuing the URL.
export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key");
    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    // TODO: Verify auth token and subscription before issuing signed URL
    // const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    // const uid = await verifyFirebaseToken(token);
    // const hasAccess = await hasAccessToBot(uid, botIdFromKey(key));
    // if (!hasAccess) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const url = await getDownloadUrl(key, 3600);
    return NextResponse.json({ url, expiresIn: 3600 });
  } catch (err) {
    console.error("[download]", err);
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}
