import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { resolveBotStorageFolder } from "@/lib/bot-storage";
import { uploadToR2, r2Keys, isAllowedEaFilename } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

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

    const index = Number(form.get("index") ?? "0");
    const filename = file.name || "file";

    const isBotAsset = type.startsWith("bot-") || type.startsWith("proof-");
    if (isBotAsset) {
      const folder = resolveBotStorageFolder(botName ?? "", {
        storageFolder: folderField ?? undefined,
        botId: botId ?? undefined,
      });
      if (!folder || folder === "unnamed") {
        return NextResponse.json(
          { error: "Set bot name on step 1 before uploading files" },
          { status: 400 }
        );
      }

      switch (type) {
        case "bot-image":
          key = r2Keys.botImage(folder, filename);
          contentType = file.type || "image/png";
          break;
        case "bot-file":
          if (!isAllowedEaFilename(filename)) {
            return NextResponse.json(
              { error: "EA file must be .ex4, .ex5, or .mq5" },
              { status: 400 }
            );
          }
          key = r2Keys.botFile(folder, filename);
          contentType = file.type || "application/octet-stream";
          break;
        case "proof-backtest-image":
          key = r2Keys.proofBacktestImage(folder, index, filename);
          contentType = file.type || "image/png";
          break;
        case "proof-backtest-report":
          key = r2Keys.proofBacktestReport(folder, filename);
          contentType = file.type || "application/pdf";
          break;
        case "proof-live-image":
          key = r2Keys.proofLiveImage(folder, index, filename);
          contentType = file.type || "image/png";
          break;
        case "proof-live-report":
          key = r2Keys.proofLiveReport(folder, filename);
          contentType = file.type || "application/pdf";
          break;
        default:
          return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    const url = await uploadToR2(key, buffer, contentType);
    return NextResponse.json({ key, url });
  } catch (err) {
    console.error("[admin/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
