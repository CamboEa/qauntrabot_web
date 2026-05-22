import { NextResponse } from "next/server";
import { getBot } from "@/lib/firestore-api";
import { serializeBot } from "@/lib/bot-display";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const bot = await getBot(id);
    if (!bot) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(serializeBot(bot));
  } catch (err) {
    console.error("[bots/id GET]", err);
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 });
  }
}
