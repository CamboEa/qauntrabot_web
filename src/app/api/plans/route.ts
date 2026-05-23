import { NextResponse } from "next/server";
import { getAllPlans } from "@/lib/firestore-api";
import { getDefaultPlans } from "@/lib/subscription-plans";

export async function GET() {
  try {
    const plans = await getAllPlans();
    if (plans.length > 0) {
      return NextResponse.json(plans);
    }
    return NextResponse.json(getDefaultPlans());
  } catch (err) {
    console.error("[plans GET]", err);
    return NextResponse.json(getDefaultPlans());
  }
}
