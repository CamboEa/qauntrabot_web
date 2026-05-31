import { NextResponse } from "next/server";
import { getCachedBots } from "@/lib/cached-bots";

// GET /api/bots — returns all bots from Firestore (cached)
export async function GET() {
  try {
    const bots = await getCachedBots();
    return NextResponse.json(bots, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("[bots]", err);
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 });
  }
}
