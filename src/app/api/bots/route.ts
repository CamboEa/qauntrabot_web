import { NextResponse } from "next/server";
import { getAllBots } from "@/lib/firestore-api";

// GET /api/bots — returns all bots from Firestore
export async function GET() {
  try {
    const bots = await getAllBots();
    return NextResponse.json(bots);
  } catch (err) {
    console.error("[bots]", err);
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 });
  }
}
