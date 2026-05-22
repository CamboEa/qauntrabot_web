"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ShieldCheck,
  TrendingUp,
  Activity,
  FileCheck,
  Layers,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { BacktestProof, LiveProof } from "@/lib/firestore";
import {
  BOT_RISK_COLOR,
  BOT_STATUS_CONFIG,
  type SerializableBot,
} from "@/lib/bot-display";

function SignedAssetImage({
  objectKey,
  alt,
  className = "",
}: {
  objectKey: string;
  alt: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/download?key=${encodeURIComponent(objectKey)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.url) setSrc(d.url);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [objectKey]);

  if (loading) {
    return (
      <div
        className={`bg-secondary animate-pulse rounded-xl aspect-video ${className}`}
        aria-hidden
      />
    );
  }

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-secondary rounded-xl aspect-video text-xs text-muted-foreground font-data ${className}`}
      >
        Preview unavailable
      </div>
    );
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className={`block overflow-hidden rounded-xl border border-border bg-card ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-auto object-cover" />
    </a>
  );
}

function ProofBlock({
  title,
  icon: Icon,
  proof,
  variant,
}: {
  title: string;
  icon: typeof FileCheck;
  proof: BacktestProof | LiveProof;
  variant: "backtest" | "live";
}) {
  const meta =
    variant === "backtest"
      ? [
          { label: "Period", value: (proof as BacktestProof).period },
          { label: "Platform", value: proof.platform },
          { label: "Broker", value: proof.broker },
          { label: "Timeframe", value: (proof as BacktestProof).timeframe },
          { label: "Initial deposit", value: (proof as BacktestProof).initialDeposit },
        ]
      : [
          { label: "Running since", value: (proof as LiveProof).runningSince },
          { label: "Platform", value: proof.platform },
          { label: "Broker", value: proof.broker },
          { label: "Account", value: (proof as LiveProof).accountType },
        ];

  return (
    <section className="card-surface card-pad stack-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-primary shrink-0" />
        <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
        <span className="inline-flex items-center gap-1 ml-auto text-[0.65rem] font-data px-2 py-0.5 rounded-full bg-profit/8 text-profit border border-profit/20">
          <ShieldCheck size={12} />
          Verified
        </span>
      </div>

      <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {meta.map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-secondary/50 px-3 py-2">
            <dt className="text-[0.65rem] font-data uppercase text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium text-foreground mt-0.5">{value || "—"}</dd>
          </div>
        ))}
      </dl>

      {proof.notes && (
        <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
          {proof.notes}
        </p>
      )}

      {proof.imageKeys.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {proof.imageKeys.map((key, i) => (
            <SignedAssetImage
              key={key}
              objectKey={key}
              alt={`${title} screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}

      {proof.reportKey && (
        <a
          href={`/api/download?key=${encodeURIComponent(proof.reportKey)}`}
          className="btn-outline-brand text-xs inline-flex items-center gap-1.5 w-fit"
          onClick={async (e) => {
            e.preventDefault();
            const res = await fetch(`/api/download?key=${encodeURIComponent(proof.reportKey!)}`);
            const { url } = await res.json();
            if (url) window.open(url, "_blank");
          }}
        >
          <FileText size={14} />
          View report
        </a>
      )}
    </section>
  );
}

type Props = {
  bot: SerializableBot;
  coverUrl: string | null;
};

export default function BotDetailView({ bot, coverUrl }: Props) {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const st = BOT_STATUS_CONFIG[bot.status];
  const isActive = bot.status !== "soon";

  const handleDownload = async () => {
    if (!bot.fileKey) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/download?key=${encodeURIComponent(bot.fileKey)}`);
      const { url } = await res.json();
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = bot.fileKey.split("/").pop() ?? "bot.ex5";
        a.click();
      }
    } catch {
      alert("Download failed. Please contact support.");
    } finally {
      setDownloading(false);
    }
  };

  const stats = [
    { label: "Total gain", value: bot.gain, color: "text-profit" },
    { label: "Max drawdown", value: bot.drawdown, color: "text-warning" },
    { label: "Win rate", value: bot.winRate, color: "text-foreground" },
    { label: "Trades", value: bot.trades, color: "text-foreground" },
  ];

  return (
    <div className="section-cream section-y">
      <div className="container-site stack-8">
        <Link
          href="/bots"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-data"
        >
          <ArrowLeft size={16} />
          All bots
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
          <div className="stack-8 min-w-0">
            <header className="stack-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.65rem] font-data font-medium ${st.border} ${st.bg} ${st.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs font-data">
                  {bot.assetTag}
                </span>
                <span className={`text-xs font-data font-semibold ${BOT_RISK_COLOR[bot.risk]}`}>
                  {bot.risk} risk
                </span>
              </div>

              <div>
                <h1 className="page-title">{bot.name}</h1>
                <p className="text-lg text-muted-foreground mt-2">{bot.subtitle}</p>
                <p className="text-sm font-data text-muted-foreground mt-1">{bot.asset}</p>
              </div>

              {coverUrl && (
                <div className="overflow-hidden rounded-xl border border-border bg-card max-h-72">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl}
                    alt={bot.name}
                    className="w-full h-auto max-h-72 object-cover"
                  />
                </div>
              )}
            </header>

            <section className="stack-3">
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Overview
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">{bot.description}</p>
              <div className="flex flex-wrap gap-2">
                {bot.pairs.map((p) => (
                  <span
                    key={p}
                    className="text-[0.65rem] px-2.5 py-1 rounded-md bg-secondary text-muted-foreground font-data"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </section>

            {bot.proof?.backtest && (
              <ProofBlock
                title="Backtest proof"
                icon={FileCheck}
                proof={bot.proof.backtest}
                variant="backtest"
              />
            )}

            {bot.proof?.live && (
              <ProofBlock
                title="Live / forward proof"
                icon={Activity}
                proof={bot.proof.live}
                variant="live"
              />
            )}
          </div>

          <aside className="lg:sticky lg:top-28 stack-4">
            <div className="card-surface card-pad stack-4">
              <p className="text-xs font-data uppercase text-muted-foreground tracking-wider">
                Performance
              </p>

              {isActive ? (
                <div className="grid grid-cols-2 gap-3">
                  {stats.map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl bg-secondary/60 p-3 text-center">
                      <div className={`text-lg font-bold font-data ${color}`}>{value}</div>
                      <div className="text-[0.6rem] text-muted-foreground uppercase mt-1">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-data py-4 text-center">
                  Performance pending launch
                </p>
              )}

              <div className="pt-3 border-t border-border stack-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-data">Min. deposit</span>
                  <span className="font-display font-bold">{bot.minDeposit}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-data">Trades</span>
                  <span className="font-data font-medium">{bot.trades}</span>
                </div>
              </div>

              <div className="stack-2 pt-2">
                {isActive ? (
                  <Link href="/pricing" className="btn-primary-brand w-full justify-center">
                    Subscribe <ArrowRight size={16} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="btn-outline-brand w-full justify-center opacity-50 cursor-not-allowed"
                  >
                    Coming soon
                  </button>
                )}
                {user && isActive && bot.fileKey && (
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="btn-outline-brand w-full justify-center cursor-pointer disabled:opacity-50"
                  >
                    <Download size={16} />
                    {downloading ? "Preparing…" : "Download EA"}
                  </button>
                )}
              </div>

              {(bot.proof?.backtest || bot.proof?.live) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {bot.proof?.backtest && (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-data text-profit">
                      <ShieldCheck size={12} />
                      Backtest
                    </span>
                  )}
                  {bot.proof?.live && (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-data text-primary">
                      <ShieldCheck size={12} />
                      Live
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="card-surface card-pad flex items-start gap-3 text-sm text-muted-foreground">
              <Layers size={18} className="shrink-0 text-primary mt-0.5" />
              <p>
                Deploy on MT4 or MT5 with isolated risk settings. License and setup guide sent after
                subscription.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
