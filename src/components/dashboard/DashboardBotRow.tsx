"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Lock } from "lucide-react";
import type { BotDoc } from "@/lib/firestore";
import { fetchSignedDownloadUrl } from "@/lib/download-client";
import { BOT_RISK_COLOR, BOT_STATUS_CONFIG } from "@/lib/bot-display";

type DashboardBotRowProps = {
  bot: BotDoc;
  canDownload: boolean;
  userPlatform?: string;
};

export default function DashboardBotRow({ bot, canDownload, userPlatform }: DashboardBotRowProps) {
  const [downloading, setDownloading] = useState(false);
  const st = BOT_STATUS_CONFIG[bot.status];
  const isDeployable = bot.status !== "soon" && Boolean(bot.fileKey);
  const platformHint =
    userPlatform && bot.fileKey
      ? bot.fileKey.toLowerCase().includes(userPlatform.toLowerCase() === "mt4" ? ".ex4" : ".ex5") ||
        bot.fileKey.toLowerCase().includes(".mq5")
      : true;

  const handleDownload = async () => {
    if (!bot.fileKey || !canDownload) return;
    setDownloading(true);
    try {
      const url = await fetchSignedDownloadUrl(bot.fileKey);
      const a = document.createElement("a");
      a.href = url;
      a.download = bot.fileKey.split("/").pop() ?? "ea-file";
      a.click();
    } catch {
      alert("Download failed. Please contact support.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <article className="dashboard-bot-row">
      <div className="dashboard-bot-row-main min-w-0 stack-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[0.6rem] font-data font-medium ${st.border} ${st.bg} ${st.text}`}
          >
            <span className={`w-1 h-1 rounded-full ${st.dot}`} />
            {st.label}
          </span>
          <span className="pair-tag text-[0.6rem]">{bot.assetTag}</span>
          <span className={`text-[0.65rem] font-data font-semibold ${BOT_RISK_COLOR[bot.risk]}`}>
            {bot.risk} risk
          </span>
        </div>
        <h3 className="font-display text-base font-bold text-foreground truncate">{bot.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{bot.subtitle}</p>
        <div className="flex flex-wrap gap-3 text-[0.65rem] font-data text-muted-foreground">
          <span>
            Gain <strong className="text-profit">{bot.gain}</strong>
          </span>
          <span>
            DD <strong className="text-warning">{bot.drawdown}</strong>
          </span>
          <span>Min {bot.minDeposit}</span>
        </div>
      </div>

      <div className="dashboard-bot-row-actions shrink-0 flex flex-col sm:flex-row gap-3">
        <Link
          href={`/bots/${bot.id}`}
          className="btn-outline-brand text-xs !py-2 !px-3 justify-center whitespace-nowrap"
        >
          Details
          <ArrowRight size={14} />
        </Link>
        {canDownload && isDeployable ? (
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary-brand text-xs !py-2 !px-3 justify-center whitespace-nowrap cursor-pointer disabled:opacity-60"
            title={platformHint ? undefined : `Built for ${userPlatform === "MT4" ? "MT5" : "MT4"} — check file type`}
          >
            <Download size={14} />
            {downloading ? "…" : "Download EA"}
          </button>
        ) : (
          <span className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground px-3 py-2 rounded-lg border border-dashed border-border">
            <Lock size={14} />
            {bot.status === "soon" ? "Coming soon" : "Subscribe to download"}
          </span>
        )}
      </div>
    </article>
  );
}
