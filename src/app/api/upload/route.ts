import { NextRequest, NextResponse } from "next/server";
import { resolveBotStorageFolder } from "@/lib/bot-storage";
import { uploadToR2, r2Keys, isAllowedEaFilename } from "@/lib/r2";

// POST /api/upload
// Body: FormData with fields: file, type ("bot-image" | "bot-file" | "avatar"), folder?, name?, id?, platform?
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const type = form.get("type") as string | null;
    const botId = form.get("id") as string | null;
    const folderField = form.get("folder") as string | null;
    const botName = form.get("name") as string | null;
    const platform = (form.get("platform") as "MT4" | "MT5") ?? "MT5";

    if (!file || !type) {
      return NextResponse.json({ error: "Missing file or type" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let key: string;
    let contentType: string;
    const filename = file.name || "file";

    switch (type) {
      case "bot-image": {
        const folder = resolveBotStorageFolder(botName ?? "", {
          storageFolder: folderField ?? undefined,
          botId: botId ?? undefined,
        });
        key = r2Keys.botImage(folder, filename);
        contentType = file.type || "image/webp";
        break;
      }
      case "bot-file": {
        if (!isAllowedEaFilename(filename)) {
          return NextResponse.json(
            { error: "EA file must be .ex4, .ex5, or .mq5" },
            { status: 400 }
          );
        }
        const folder = resolveBotStorageFolder(botName ?? "", {
          storageFolder: folderField ?? undefined,
          botId: botId ?? undefined,
        });
        key = r2Keys.botFile(folder, filename);
        contentType = file.type || "application/octet-stream";
        break;
      }
      case "avatar":
        if (!botId) {
          return NextResponse.json({ error: "Missing id for avatar" }, { status: 400 });
        }
        key = r2Keys.userAvatar(botId);
        contentType = file.type || "image/webp";
        break;
      default:
        return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    const url = await uploadToR2(key, buffer, contentType);
    return NextResponse.json({ key, url });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
