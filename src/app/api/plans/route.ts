import { NextResponse } from "next/server";
import { getCachedPlans } from "@/lib/cached-plans";

export async function GET() {
  try {
    const plans = await getCachedPlans();
    return NextResponse.json(plans, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("[plans GET]", err);
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 });
  }
}
