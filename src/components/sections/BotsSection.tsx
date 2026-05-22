"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Download, ShieldCheck } from "lucide-react";
import { getAllBots, type BotDoc } from "@/lib/firestore";
import { FALLBACK_BOTS } from "@/lib/fallback-bots";
import { BOT_RISK_COLOR, BOT_STATUS_CONFIG } from "@/lib/bot-display";
import { useAuth } from "@/contexts/AuthContext";
import SectionHeader from "@/components/shared/SectionHeader";

type Filter = "all" | "live" | "beta" | "soon";

export default function BotsSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [bots, setBots] = useState<BotDoc[]>(FALLBACK_BOTS);
  const [loadingBots, setLoadingBots] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    getAllBots()
      .then((data) => { if (data.length > 0) setBots(data); })
      .catch(() => {})
      .finally(() => setLoadingBots(false));
  }, []);

  const filtered = filter === "all" ? bots : bots.filter((b) => b.status === filter);

  const handleDownload = async (e: React.MouseEvent, bot: BotDoc) => {
    e.preventDefault();
    e.stopPropagation();
    if (!bot.fileKey) return;
    setDownloadingId(bot.id);
    try {
      const res = await fetch(`/api/download?key=${encodeURIComponent(bot.fileKey)}`);
      const { url } = await res.json();
      const a = document.createElement("a");
      a.href = url;
      a.download = bot.fileKey.split("/").pop() ?? "bot.ex5";
      a.click();
    } catch {
      alert("Download failed. Please contact support.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section id="bots" className={`section-cream ${hideHeader ? "page-body-y" : "section-y"}`}>
      <div className="container-site stack-6">
        {!hideHeader && (
          <div className="headline-gap">
            <SectionHeader
              eyebrow="Strategy Catalogue"
              title="Available"
              accent="Trading Bots."
              description="Each bot is an independent Expert Advisor, deployable on MT4 or MT5 with isolated risk parameters."
            />
          </div>
        )}

        <div className="tab-group">
          {(["all", "live", "beta", "soon"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 ${filter === f ? "tab-pill-active" : ""}`}
            >
              {f === "soon" ? "Coming Soon" : f === "all" ? "All Bots" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loadingBots && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-site">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-surface card-pad animate-pulse h-72">
                <div className="h-5 w-2/3 bg-secondary rounded-lg mb-4" />
                <div className="h-4 w-1/3 bg-secondary rounded mb-6" />
                <div className="h-20 bg-secondary rounded-xl mb-6" />
                <div className="h-10 bg-secondary rounded-full" />
              </div>
            ))}
          </div>
        )}

        {!loadingBots && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-site">
            {filtered.map((bot) => {
              const st = BOT_STATUS_CONFIG[bot.status];
              const isActive = bot.status !== "soon";
              const isDownloading = downloadingId === bot.id;
              const detailHref = `/bots/${bot.id}`;

              return (
                <Link
                  key={bot.id}
                  href={detailHref}
                  className={`card-surface-hover flex flex-col card-pad h-full stack-4 group ${!isActive ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="stack-2 min-w-0">
                      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {bot.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{bot.subtitle}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.65rem] font-data font-medium shrink-0 ${st.border} ${st.bg} ${st.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 text-xs font-data">
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{bot.assetTag}</span>
                    <span className={`font-semibold ${BOT_RISK_COLOR[bot.risk]}`}>{bot.risk} Risk</span>
                    {bot.proof?.backtest && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-profit/8 text-profit border border-profit/20">
                        <ShieldCheck size={12} />
                        Backtest verified
                      </span>
                    )}
                    {bot.proof?.live && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/15">
                        <ShieldCheck size={12} />
                        Live verified
                      </span>
                    )}
                  </div>

                  {isActive ? (
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-secondary/60">
                      {[
                        { label: "Gain", value: bot.gain, color: "text-profit" },
                        { label: "DD", value: bot.drawdown, color: "text-warning" },
                        { label: "Win", value: bot.winRate, color: "text-foreground" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="text-center">
                          <div className={`text-sm font-bold font-data ${color}`}>{value}</div>
                          <div className="text-[0.6rem] text-muted-foreground uppercase mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-secondary/60 py-5 text-center text-xs text-muted-foreground font-data uppercase">
                      Performance pending
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                    {bot.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {bot.pairs.map((p) => (
                      <span key={p} className="text-[0.65rem] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-data">
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div>
                      <p className="text-[0.65rem] text-muted-foreground font-data uppercase">Min. deposit</p>
                      <p className="font-display font-bold text-foreground">{bot.minDeposit}</p>
                    </div>
                    <div className="flex gap-2">
                      {user && isActive && bot.fileKey && (
                        <button
                          type="button"
                          onClick={(e) => handleDownload(e, bot)}
                          disabled={isDownloading}
                          className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                          title="Download EA"
                        >
                          <Download size={16} />
                        </button>
                      )}
                      <span className="btn-outline-brand !text-xs !py-2.5 !px-4 pointer-events-none">
                        Details <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
