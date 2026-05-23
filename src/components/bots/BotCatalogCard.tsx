"use client";

import Link from "next/link";
import { ArrowRight, Download, ShieldCheck } from "lucide-react";
import type { BotDoc } from "@/lib/firestore";
import { BOT_RISK_COLOR, BOT_STATUS_CONFIG } from "@/lib/bot-display";

type BotCatalogCardProps = {
  bot: BotDoc;
  showDownload?: boolean;
  isDownloading?: boolean;
  onDownload?: (e: React.MouseEvent) => void;
};

export default function BotCatalogCard({
  bot,
  showDownload = false,
  isDownloading = false,
  onDownload,
}: BotCatalogCardProps) {
  const st = BOT_STATUS_CONFIG[bot.status];
  const isActive = bot.status !== "soon";
  const hasProof = Boolean(bot.proof?.backtest || bot.proof?.live);

  return (
    <Link
      href={`/bots/${bot.id}`}
      data-status={bot.status}
      className={`card-surface-hover group bot-card cursor-pointer ${!isActive ? "opacity-75" : ""}`}
    >
      <div className="bot-card-head">
        <span className="bot-card-asset">{bot.assetTag}</span>
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[0.6rem] font-data font-medium shrink-0 ${st.border} ${st.bg} ${st.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 min-w-0 pr-1">
        <h3 className="font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
          {bot.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-snug">{bot.subtitle}</p>
      </div>

      <div className="flex items-center flex-wrap gap-2 mt-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[0.65rem] font-data font-semibold ${BOT_RISK_COLOR[bot.risk]} border-current/15 bg-current/5`}
        >
          {bot.risk} risk
        </span>
        {hasProof && (
          <span className="inline-flex items-center gap-1 text-[0.65rem] font-data text-muted-foreground">
            <ShieldCheck size={12} className="text-profit shrink-0" />
            {bot.proof?.backtest && bot.proof?.live
              ? "Verified"
              : bot.proof?.backtest
                ? "Backtest"
                : "Live"}
          </span>
        )}
      </div>

      {isActive ? (
        <div className="bot-card-metrics">
          <div className="bot-card-metric-primary">
            <p className="stat-label mb-1">Total gain</p>
            <p className="bot-card-metric-gain text-profit">{bot.gain}</p>
          </div>
          <div className="bot-card-metric-secondary">
            <div className="bot-card-metric-cell">
              <p className="stat-label normal-case tracking-normal text-[0.6rem]">Drawdown</p>
              <p className="bot-card-metric-value text-warning">{bot.drawdown}</p>
            </div>
            <div className="bot-card-metric-cell">
              <p className="stat-label normal-case tracking-normal text-[0.6rem]">Win rate</p>
              <p className="bot-card-metric-value text-foreground">{bot.winRate}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bot-card-pending">Performance data coming soon</div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 min-h-[2.75rem]">
        {bot.description}
      </p>

      {bot.pairs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {bot.pairs.slice(0, 4).map((p) => (
            <span key={p} className="pair-tag">
              {p}
            </span>
          ))}
          {bot.pairs.length > 4 && (
            <span className="pair-tag">+{bot.pairs.length - 4}</span>
          )}
        </div>
      )}

      <div className="bot-card-footer">
        <div>
          <p className="stat-label">Min. deposit</p>
          <p className="font-display text-lg font-bold text-foreground leading-none mt-0.5">
            {bot.minDeposit}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showDownload && onDownload && (
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading}
              className="p-2 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
              title="Download EA"
              aria-label={`Download ${bot.name} EA`}
            >
              <Download size={15} />
            </button>
          )}
          <span className="bot-card-cta pointer-events-none">
            View strategy
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BotCatalogCardSkeleton() {
  return (
    <div className="card-surface bot-card animate-pulse" data-status="live">
      <div className="bot-card-head">
        <div className="h-3 w-16 bg-secondary rounded" />
        <div className="h-5 w-14 bg-secondary rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-secondary rounded-lg mb-2" />
      <div className="h-4 w-1/2 bg-secondary rounded mb-4" />
      <div className="h-5 w-20 bg-secondary rounded mb-3" />
      <div className="bot-card-metrics border-0">
        <div className="bot-card-metric-primary h-[4.5rem] bg-secondary/80" />
        <div className="bot-card-metric-secondary">
          <div className="bot-card-metric-cell h-full bg-secondary/60" />
          <div className="bot-card-metric-cell h-full bg-secondary/40" />
        </div>
      </div>
      <div className="h-10 bg-secondary/50 rounded mt-3" />
      <div className="flex gap-1.5 mt-3">
        <div className="h-5 w-14 bg-secondary rounded" />
        <div className="h-5 w-14 bg-secondary rounded" />
      </div>
      <div className="bot-card-footer">
        <div className="h-10 w-20 bg-secondary rounded" />
        <div className="h-5 w-24 bg-secondary rounded" />
      </div>
    </div>
  );
}
