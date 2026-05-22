import type { BotDoc, BotStatus } from "@/lib/firestore";

export const BOT_STATUS_CONFIG: Record<
  BotStatus,
  { label: string; dot: string; text: string; border: string; bg: string }
> = {
  live: {
    label: "Live",
    dot: "bg-profit",
    text: "text-profit",
    border: "border-profit/25",
    bg: "bg-profit/8",
  },
  beta: {
    label: "Beta",
    dot: "bg-warning",
    text: "text-warning",
    border: "border-warning/25",
    bg: "bg-warning/8",
  },
  soon: {
    label: "Soon",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    border: "border-border",
    bg: "bg-secondary",
  },
};

export const BOT_RISK_COLOR: Record<string, string> = {
  Low: "text-profit",
  Medium: "text-warning",
  High: "text-loss",
};

/** Public CDN URL when R2 bucket is exposed (server or NEXT_PUBLIC). */
export function publicAssetUrl(key: string | undefined): string | null {
  if (!key?.trim()) return null;
  const base =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim() ||
    process.env.R2_PUBLIC_URL?.trim();
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}

export type SerializableBot = Omit<BotDoc, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export function serializeBot(bot: BotDoc): SerializableBot {
  return {
    ...bot,
    createdAt: bot.createdAt instanceof Date ? bot.createdAt.toISOString() : String(bot.createdAt),
    updatedAt: bot.updatedAt instanceof Date ? bot.updatedAt.toISOString() : String(bot.updatedAt),
  };
}
