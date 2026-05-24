"use client";

import type { ReactNode } from "react";
import {
  Activity,
  Clock,
  Gauge,
  Grid3x3,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import type { BotRuntimeStatus } from "@/lib/firestore";
import { formatMoney } from "@/lib/format-money";
import DashboardBlock from "@/components/dashboard/DashboardBlock";

type Props = {
  status: BotRuntimeStatus;
  currency: string;
  botLabel?: string;
};

function trendTone(trend: string | null | undefined): string {
  if (!trend) return "text-muted-foreground";
  const t = trend.toLowerCase();
  if (t.includes("strong up") || t.includes("mild up")) return "text-loss";
  if (t.includes("strong down") || t.includes("mild down")) return "text-profit";
  if (t.includes("down")) return "text-profit";
  if (t.includes("up")) return "text-loss";
  return "text-muted-foreground";
}

function filterTone(filter: string | null | undefined): string {
  if (!filter || filter === "clear") return "text-profit";
  return "text-warning";
}

function SituationRow({
  label,
  value,
  valueClassName = "",
  sub,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  sub?: string;
}) {
  return (
    <div className="bot-situation-row">
      <dt className="bot-situation-label">{label}</dt>
      <dd className={`bot-situation-value ${valueClassName}`}>{value}</dd>
      {sub ? <dd className="bot-situation-sub col-span-2">{sub}</dd> : null}
    </div>
  );
}

function SideBySide({
  buy,
  sell,
  label,
}: {
  label: string;
  buy: ReactNode;
  sell: ReactNode;
}) {
  return (
    <div className="bot-situation-grid-row">
      <span className="bot-situation-label">{label}</span>
      <span className="bot-situation-buy">{buy}</span>
      <span className="bot-situation-sell">{sell}</span>
    </div>
  );
}

export default function BotLiveSituation({ status, currency, botLabel }: Props) {
  const title = botLabel ?? status.botName ?? "EA";
  const dist =
    status.emaDistancePips != null
      ? `${status.emaDistancePips >= 0 ? "+" : ""}${Math.round(status.emaDistancePips)}p ${
          status.emaDistancePips >= 0 ? "above" : "below"
        }`
      : "—";

  return (
    <DashboardBlock
      title={
        <>
          <Activity size={16} className="text-primary" />
          Bot live situation
        </>
      }
      action={
        <span className="text-xs font-data text-muted-foreground">
          {title} · {status.symbol}
        </span>
      }
    >
      <div className="bot-situation-panels">
        <section className="bot-situation-panel">
          <h4 className="bot-situation-heading">
            <Clock size={14} />
            Status
          </h4>
          <dl className="bot-situation-dl">
            <SituationRow label="Server time" value={status.serverTime ?? "—"} />
            <SituationRow
              label="Today P/L"
              value={formatMoney(status.todayPnl, currency)}
              valueClassName={status.todayPnl >= 0 ? "text-profit" : "text-loss"}
            />
            <SituationRow
              label="Floating P/L"
              value={formatMoney(status.floatingPnl, currency)}
              valueClassName={status.floatingPnl >= 0 ? "text-profit" : "text-loss"}
            />
            <SituationRow
              label="Day target"
              value={formatMoney(status.dayTarget, currency)}
            />
            <SituationRow
              label="Market"
              value={
                status.marketOpen
                  ? "Open — OK"
                  : `Blocked${status.marketBlockReason ? ` (${status.marketBlockReason})` : ""}`
              }
              valueClassName={status.marketOpen ? "text-profit" : "text-warning"}
              sub="Session / Friday shutdown / profit stop — same as EA dashboard"
            />
          </dl>
        </section>

        <section className="bot-situation-panel">
          <h4 className="bot-situation-heading">
            <TrendingUp size={14} />
            EMA trend
          </h4>
          <dl className="bot-situation-dl">
            <SituationRow
              label={`EMA (${status.emaPeriod ?? "—"})`}
              value={
                status.emaValue != null ? status.emaValue.toFixed(status.emaValue > 100 ? 2 : 5) : "unavailable"
              }
            />
            <SituationRow label="Dist EMA" value={dist} />
            <SituationRow
              label="Slope"
              value={
                status.emaSlopePips != null
                  ? `${status.emaSlopePips >= 0 ? "+" : ""}${status.emaSlopePips.toFixed(1)}p`
                  : "—"
              }
              sub={status.emaTrend ?? undefined}
              valueClassName={trendTone(status.emaTrend)}
            />
            <SituationRow
              label="BUY filter"
              value={status.buyFilter ?? "—"}
              valueClassName={filterTone(status.buyFilter)}
            />
            <SituationRow
              label="SELL filter"
              value={status.sellFilter ?? "—"}
              valueClassName={filterTone(status.sellFilter)}
            />
          </dl>
        </section>

        <section className="bot-situation-panel bot-situation-panel--wide">
          <h4 className="bot-situation-heading">
            <Grid3x3 size={14} />
            Grid positions
          </h4>
          <div className="bot-situation-grid-table">
            <div className="bot-situation-grid-head">
              <span />
              <span className="text-profit">BUY</span>
              <span className="text-loss">SELL</span>
            </div>
            <SideBySide
              label="Positions"
              buy={status.buyPositions || "—"}
              sell={status.sellPositions || "—"}
            />
            <SideBySide
              label="Lots"
              buy={status.buyLots > 0 ? status.buyLots.toFixed(2) : "—"}
              sell={status.sellLots > 0 ? status.sellLots.toFixed(2) : "—"}
            />
            <SideBySide
              label="P / L"
              buy={
                status.buyPositions > 0 ? (
                  <span className={status.buyPnl >= 0 ? "text-profit" : "text-loss"}>
                    {formatMoney(status.buyPnl, currency)}
                  </span>
                ) : (
                  "—"
                )
              }
              sell={
                status.sellPositions > 0 ? (
                  <span className={status.sellPnl >= 0 ? "text-profit" : "text-loss"}>
                    {formatMoney(status.sellPnl, currency)}
                  </span>
                ) : (
                  "—"
                )
              }
            />
            <SideBySide
              label="SL armed"
              buy={
                <span className="inline-flex items-center gap-1">
                  {status.buySlArmed ? (
                    <>
                      <ShieldAlert size={12} className="text-warning" />
                      ARMED
                    </>
                  ) : (
                    "off"
                  )}
                </span>
              }
              sell={
                status.sellSlArmed ? (
                  <span className="inline-flex items-center gap-1 text-warning">
                    <ShieldAlert size={12} />
                    ARMED
                  </span>
                ) : (
                  "off"
                )
              }
            />
            <SideBySide
              label="Hedge override"
              buy={status.buyHedgeOverride ? "ON" : "off"}
              sell={status.sellHedgeOverride ? "ON" : "off"}
            />
          </div>
        </section>
      </div>

      <p className="text-xs text-muted-foreground font-data flex items-center gap-1.5 mt-1">
        <Gauge size={12} />
        Mirrors your MT5 on-chart dashboard. Recompile &amp; attach the EA to refresh — updates every ~60s or on balance change.
      </p>
    </DashboardBlock>
  );
}
