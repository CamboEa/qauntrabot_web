"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
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
import { getUserSubscription, type BacktestProof, LiveProof } from "@/lib/firestore";
import { isSubscriptionActive } from "@/lib/subscription-plans";
import {
  BOT_RISK_COLOR,
  BOT_STATUS_CONFIG,
  type SerializableBot,
} from "@/lib/bot-display";
import PageSection from "@/components/shared/PageSection";
import ContentHeading from "@/components/shared/ContentHeading";
import R2Image from "@/components/shared/R2Image";

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
      <div className="flex items-center gap-2 flex-wrap">
        <ContentHeading icon={Icon} className="!text-lg flex-1 min-w-0">
          {title}
        </ContentHeading>
        <span className="inline-flex items-center gap-1 text-[0.65rem] font-data px-2 py-0.5 rounded-full bg-profit/8 text-profit border border-profit/20">
          <ShieldCheck size={12} />
          Verified
        </span>
      </div>

      <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {meta.map(({ label, value }) => (
          <div key={label} className="meta-cell">
            <dt className="stat-label">{label}</dt>
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
            <R2Image
              key={key}
              objectKey={key}
              alt={`${title} screenshot ${i + 1}`}
              aspectClassName="aspect-video"
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
};

export default function BotDetailView({ bot }: Props) {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    if (!user) {
      setHasSubscription(false);
      return;
    }
    getUserSubscription(user.uid)
      .then((sub) => setHasSubscription(sub ? isSubscriptionActive(sub.validUntil, sub.status) : false))
      .catch(() => setHasSubscription(false));
  }, [user]);
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
    <PageSection underHero containerClassName="stack-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.65rem] font-data font-medium ${st.border} ${st.bg} ${st.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </span>
          <span className="pair-tag">{bot.assetTag}</span>
          <span className={`text-xs font-data font-semibold ${BOT_RISK_COLOR[bot.risk]}`}>
            {bot.risk} risk
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
          <div className="stack-6 min-w-0">
            <R2Image
              objectKey={bot.imageKey}
              alt={bot.name}
              aspectClassName="aspect-[21/9] max-h-72"
              imgClassName="w-full h-full max-h-72 object-cover"
            />

            <section className="stack-3">
              <ContentHeading icon={TrendingUp}>Overview</ContentHeading>
              <p className="text-base text-muted-foreground leading-relaxed">{bot.description}</p>
              <div className="flex flex-wrap gap-2">
                {bot.pairs.map((p) => (
                  <span key={p} className="pair-tag">
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
              <p className="stat-label">Performance</p>

              {isActive ? (
                <div className="grid grid-cols-2 gap-3">
                  {stats.map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl bg-secondary/60 p-3 text-center">
                      <div className={`text-lg font-bold font-data ${color}`}>{value}</div>
                      <div className="stat-label mt-1 normal-case tracking-normal text-[0.6rem]">
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
                {user && hasSubscription && isActive && bot.fileKey && (
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
                Active subscription unlocks every bot in the catalogue — deploy on MT4 or MT5 with
                isolated risk settings.
              </p>
            </div>
          </aside>
        </div>
    </PageSection>
  );
}
