import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { uploadToR2, r2Keys } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const type = form.get("type") as string | null;
    const id = form.get("id") as string | null;
    const platform = (form.get("platform") as "MT4" | "MT5") ?? "MT5";

    if (!file || !type || !id) {
      return NextResponse.json({ error: "Missing file, type, or id" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let key: string;
    let contentType: string;

    const index = Number(form.get("index") ?? "0");
    const filename = file.name || "file";

    switch (type) {
      case "bot-image":
        key = r2Keys.botImage(id);
        contentType = file.type || "image/png";
        break;
      case "bot-file":
        key = r2Keys.botFile(id, platform);
        contentType = "application/octet-stream";
        break;
      case "proof-backtest-image":
        key = r2Keys.proofBacktestImage(id, index, filename);
        contentType = file.type || "image/png";
        break;
      case "proof-backtest-report":
        key = r2Keys.proofBacktestReport(id, filename);
        contentType = file.type || "application/pdf";
        break;
      case "proof-live-image":
        key = r2Keys.proofLiveImage(id, index, filename);
        contentType = file.type || "image/png";
        break;
      case "proof-live-report":
        key = r2Keys.proofLiveReport(id, filename);
        contentType = file.type || "application/pdf";
        break;
      default:
        return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    const url = await uploadToR2(key, buffer, contentType);
    return NextResponse.json({ key, url });
  } catch (err) {
    console.error("[admin/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
