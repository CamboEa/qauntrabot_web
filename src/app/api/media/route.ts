import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/r2";

/** Allowed R2 prefixes for public media redirects (catalogue images & proof). */
const ALLOWED_PREFIXES = ["bots/", "users/avatars/"];

// GET /api/media?key=bots/my-bot/cover.png
// Redirects to a short-lived signed R2 URL so private buckets work in <img> tags.
export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key");
    if (!key?.trim()) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const normalized = key.replace(/^\/+/, "");
    if (!ALLOWED_PREFIXES.some((p) => normalized.startsWith(p))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = await getDownloadUrl(normalized, 3600);
    return NextResponse.redirect(url);
  } catch (err) {
    console.error("[media]", err);
    return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  }
}
