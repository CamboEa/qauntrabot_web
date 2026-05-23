import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { botStoragePrefix, slugifyBotFolder } from "./bot-storage";

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

/** Delete all objects under a bot folder prefix (e.g. when removing a bot). */
export async function deleteBotFolderFromR2(folder: string): Promise<void> {
  const prefix = `${botStoragePrefix(folder)}/`;
  let continuationToken: string | undefined;

  do {
    const list = await r2.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    const keys = (list.Contents ?? [])
      .map((o) => o.Key)
      .filter((k): k is string => Boolean(k));

    if (keys.length > 0) {
      await r2.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        })
      );
    }

    continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined;
  } while (continuationToken);
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

// ─── Key helpers (all files live under bots/{folder-name}/) ───────────────────

export const EA_FILE_EXTENSIONS = ["ex4", "ex5", "mq5"] as const;

function extFromFilename(name: string, fallback: string): string {
  const m = name.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : fallback;
}

export function isAllowedEaFilename(filename: string): boolean {
  const ext = extFromFilename(filename, "");
  return (EA_FILE_EXTENSIONS as readonly string[]).includes(ext);
}

function botRoot(folder: string): string {
  return botStoragePrefix(folder);
}

export const r2Keys = {
  botImage: (folder: string, filename: string) =>
    `${botRoot(folder)}/cover.${extFromFilename(filename, "webp")}`,
  botFile: (folder: string, filename: string) => {
    const ext = extFromFilename(filename, "ex5");
    const safeExt = (EA_FILE_EXTENSIONS as readonly string[]).includes(ext) ? ext : "ex5";
    return `${botRoot(folder)}/ea.${safeExt}`;
  },
  proofBacktestImage: (folder: string, index: number, filename: string) =>
    `${botRoot(folder)}/proof/backtest/images/img-${index}.${extFromFilename(filename, "png")}`,
  proofBacktestReport: (folder: string, filename: string) =>
    `${botRoot(folder)}/proof/backtest/report.${extFromFilename(filename, "pdf")}`,
  proofLiveImage: (folder: string, index: number, filename: string) =>
    `${botRoot(folder)}/proof/live/images/img-${index}.${extFromFilename(filename, "png")}`,
  proofLiveReport: (folder: string, filename: string) =>
    `${botRoot(folder)}/proof/live/report.${extFromFilename(filename, "pdf")}`,
  userAvatar: (uid: string) => `users/avatars/${uid}.webp`,
};

export { slugifyBotFolder };
