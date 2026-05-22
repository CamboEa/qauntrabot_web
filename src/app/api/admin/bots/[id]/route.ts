import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { resolveBotStorageFolder } from "@/lib/bot-storage";
import { deleteBotFolderFromR2 } from "@/lib/r2";
import { getBot, updateBot, deleteBot, type BotInput } from "@/lib/firestore-api";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await params;
  try {
    const bot = await getBot(id);
    if (!bot) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(bot);
  } catch (err) {
    console.error("[admin/bots/id GET]", err);
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await params;
  try {
    const data = (await req.json()) as Partial<BotInput>;
    await updateBot(id, data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/bots/id PATCH]", err);
    return NextResponse.json({ error: "Failed to update bot" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await params;
  try {
    const bot = await getBot(id);
    if (bot) {
      const folder = resolveBotStorageFolder(bot.name, {
        storageFolder: bot.storageFolder,
        botId: bot.id,
      });
      try {
        await deleteBotFolderFromR2(folder);
      } catch (r2Err) {
        console.error("[admin/bots/id DELETE] R2 cleanup failed:", r2Err);
      }
    }
    await deleteBot(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/bots/id DELETE]", err);
    return NextResponse.json({ error: "Failed to delete bot" }, { status: 500 });
  }
}
