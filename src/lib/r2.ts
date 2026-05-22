import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

// Server-only — never import this from a "use client" file
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  // Return public URL if bucket has public access, otherwise use signed URL
  const publicBase = process.env.R2_PUBLIC_URL;
  return publicBase ? `${publicBase}/${key}` : key;
}

// ─── Signed download URL (expires in 1 hour) ──────────────────────────────────

export async function getDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(r2, command, { expiresIn });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteFromR2(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

// ─── Check existence ──────────────────────────────────────────────────────────

export async function objectExists(key: string): Promise<boolean> {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// ─── Key helpers ──────────────────────────────────────────────────────────────

function extFromFilename(name: string, fallback: string): string {
  const m = name.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : fallback;
}

export const r2Keys = {
  botImage: (botId: string) => `bots/images/${botId}.webp`,
  botFile: (botId: string, platform: "MT4" | "MT5") =>
    `bots/files/${botId}-${platform.toLowerCase()}.ex${platform === "MT5" ? "5" : "4"}`,
  proofBacktestImage: (botId: string, index: number, filename: string) =>
    `bots/${botId}/proof/backtest/img-${index}.${extFromFilename(filename, "png")}`,
  proofBacktestReport: (botId: string, filename: string) =>
    `bots/${botId}/proof/backtest/report.${extFromFilename(filename, "pdf")}`,
  proofLiveImage: (botId: string, index: number, filename: string) =>
    `bots/${botId}/proof/live/img-${index}.${extFromFilename(filename, "png")}`,
  proofLiveReport: (botId: string, filename: string) =>
    `bots/${botId}/proof/live/report.${extFromFilename(filename, "pdf")}`,
  userAvatar: (uid: string) => `users/avatars/${uid}.webp`,
};
