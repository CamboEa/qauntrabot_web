import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAllBots, createBot, type BotInput } from "@/lib/firestore-api";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  try {
    const bots = await getAllBots();
    return NextResponse.json(bots);
  } catch (err) {
    console.error("[admin/bots GET]", err);
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  try {
    const body = await req.json();
    const { id, ...data } = body as { id: string } & BotInput;

    if (!id?.trim()) {
      return NextResponse.json({ error: "Bot id is required" }, { status: 400 });
    }

    await createBot(id.trim(), data);
    return NextResponse.json({ ok: true, id: id.trim() });
  } catch (err) {
    console.error("[admin/bots POST]", err);
    return NextResponse.json({ error: "Failed to create bot" }, { status: 500 });
  }
}
