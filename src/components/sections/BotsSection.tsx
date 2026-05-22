"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import { getAllBots, type BotDoc, type BotStatus } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import SectionHeader from "@/components/shared/SectionHeader";

const STATIC_BOTS: BotDoc[] = [
  {
    id: "xauusd-grid",
    name: "XAUUSD Grid",
    subtitle: "Gold Grid System",
    asset: "XAUUSD",
    assetTag: "Gold",
    status: "live",
    risk: "Medium",
    gain: "+247.3%",
    drawdown: "12.4%",
    winRate: "73.2%",
    trades: "847",
    description: "Grid-based strategy on Gold with dynamic lot sizing. Profits from price oscillations within defined ranges.",
    pairs: ["XAUUSD"],
    minDeposit: "$500",
    imageKey: "",
    fileKey: "bots/files/xauusd-grid-mt5.ex5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "forex-scalper",
    name: "Forex Scalper",
    subtitle: "Major Pairs Scalper",
    asset: "EURUSD · GBPUSD",
    assetTag: "Majors",
    status: "live",
    risk: "Low",
    gain: "+158.9%",
    drawdown: "8.7%",
    winRate: "68.5%",
    trades: "1,342",
    description: "High-frequency scalping on major forex pairs during London and New York sessions.",
    pairs: ["EURUSD", "GBPUSD", "USDJPY"],
    minDeposit: "$300",
    imageKey: "",
    fileKey: "bots/files/forex-scalper-mt5.ex5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "multi-asset",
    name: "Multi-Asset",
    subtitle: "Diversified Portfolio",
    asset: "Gold · Forex · CFDs",
    assetTag: "Portfolio",
    status: "live",
    risk: "High",
    gain: "+312.6%",
    drawdown: "15.1%",
    winRate: "71.8%",
    trades: "623",
    description: "Runs all strategy modules across correlated and uncorrelated instruments with portfolio-level drawdown controls.",
    pairs: ["XAUUSD", "EURUSD", "NASDAQ", "BTCUSD"],
    minDeposit: "$1,000",
    imageKey: "",
    fileKey: "bots/files/multi-asset-mt5.ex5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "index-momentum",
    name: "Index Momentum",
    subtitle: "US & EU Indices",
    asset: "NASDAQ · SP500",
    assetTag: "Indices",
    status: "beta",
    risk: "Medium",
    gain: "+94.1%",
    drawdown: "11.2%",
    winRate: "65.4%",
    trades: "312",
    description: "Trend-following on equity indices with momentum signals and session-based filters.",
    pairs: ["NAS100", "SPX500", "GER40"],
    minDeposit: "$500",
    imageKey: "",
    fileKey: "bots/files/index-momentum-mt5.ex5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "crypto-cfd",
    name: "Crypto CFD",
    subtitle: "Digital Asset Strategy",
    asset: "BTC · ETH · SOL",
    assetTag: "Crypto",
    status: "soon",
    risk: "High",
    gain: "—",
    drawdown: "—",
    winRate: "—",
    trades: "—",
    description: "Volatility-adaptive strategy for crypto CFDs with momentum and mean-reversion techniques.",
    pairs: ["BTCUSD", "ETHUSD", "SOLUSD"],
    minDeposit: "$500",
    imageKey: "",
    fileKey: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "news-event",
    name: "News Event",
    subtitle: "High-Impact Releases",
    asset: "Multi-Asset",
    assetTag: "Event-Driven",
    status: "soon",
    risk: "High",
    gain: "—",
    drawdown: "—",
    winRate: "—",
    trades: "—",
    description: "Positions ahead of high-impact economic releases with rapid entry and trailing exits.",
    pairs: ["EURUSD", "XAUUSD", "USDJPY"],
    minDeposit: "$1,000",
    imageKey: "",
    fileKey: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const STATUS_CONFIG: Record<BotStatus, { label: string; dot: string; text: string; border: string; bg: string }> = {
  live: { label: "Live", dot: "bg-profit", text: "text-profit", border: "border-profit/25", bg: "bg-profit/8" },
  beta: { label: "Beta", dot: "bg-warning", text: "text-warning", border: "border-warning/25", bg: "bg-warning/8" },
  soon: { label: "Soon", dot: "bg-muted-foreground", text: "text-muted-foreground", border: "border-border", bg: "bg-secondary" },
};

const RISK_COLOR: Record<string, string> = {
  Low: "text-profit",
  Medium: "text-warning",
  High: "text-loss",
};

type Filter = "all" | "live" | "beta" | "soon";

export default function BotsSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [bots, setBots] = useState<BotDoc[]>(STATIC_BOTS);
  const [loadingBots, setLoadingBots] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    getAllBots()
      .then((data) => { if (data.length > 0) setBots(data); })
      .catch(() => {})
      .finally(() => setLoadingBots(false));
  }, []);

  const filtered = filter === "all" ? bots : bots.filter((b) => b.status === filter);

  const handleDownload = async (bot: BotDoc) => {
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
              const st = STATUS_CONFIG[bot.status];
              const isActive = bot.status !== "soon";
              const isDownloading = downloadingId === bot.id;

              return (
                <article
                  key={bot.id}
                  className={`card-surface-hover flex flex-col card-pad h-full stack-4 ${!isActive ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="stack-2 min-w-0">
                      <h3 className="font-display text-lg font-bold text-foreground">{bot.name}</h3>
                      <p className="text-sm text-muted-foreground">{bot.subtitle}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.65rem] font-data font-medium shrink-0 ${st.border} ${st.bg} ${st.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-data">
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{bot.assetTag}</span>
                    <span className={`font-semibold ${RISK_COLOR[bot.risk]}`}>{bot.risk} Risk</span>
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

                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{bot.description}</p>

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
                          onClick={() => handleDownload(bot)}
                          disabled={isDownloading}
                          className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                          title="Download EA"
                        >
                          <Download size={16} />
                        </button>
                      )}
                      {isActive ? (
                        <Link href="/pricing" className="btn-primary-brand !text-xs !py-2.5 !px-4">
                          Subscribe <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <button type="button" disabled className="btn-outline-brand !text-xs !py-2.5 !px-4 opacity-50 cursor-not-allowed">
                          Notify Me
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Live bots verifiable on{" "}
          <span className="text-primary font-medium cursor-pointer hover:underline">MyFxBook</span> and{" "}
          <span className="text-primary font-medium cursor-pointer hover:underline">FXBlue</span>.
        </p>
      </div>
    </section>
  );
}
