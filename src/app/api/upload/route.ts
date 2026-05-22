import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, r2Keys } from "@/lib/r2";

// POST /api/upload
// Body: FormData with fields: file, type ("bot-image" | "bot-file" | "avatar"), id, platform?
export async function POST(req: NextRequest) {
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

    switch (type) {
      case "bot-image":
        key = r2Keys.botImage(id);
        contentType = file.type || "image/webp";
        break;
      case "bot-file":
        key = r2Keys.botFile(id, platform);
        contentType = "application/octet-stream";
        break;
      case "avatar":
        key = r2Keys.userAvatar(id);
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
