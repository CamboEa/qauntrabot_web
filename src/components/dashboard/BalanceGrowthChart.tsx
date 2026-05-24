"use client";

import { useId, useMemo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { BalanceHistoryPoint } from "@/lib/firestore";
import { formatMoney } from "@/lib/format-money";

type Props = {
  history: BalanceHistoryPoint[];
  currency: string;
  currentBalance: number;
};

const W = 400;
const H = 160;
const PAD_TOP = 12;
const PAD_BOTTOM = 20;

function buildPath(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
}

function buildFillPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  const line = buildPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  const baseY = H - PAD_BOTTOM;
  return `${line} L ${last[0]} ${baseY} L ${first[0]} ${baseY} Z`;
}

export default function BalanceGrowthChart({ history, currency, currentBalance }: Props) {
  const uid = useId().replace(/:/g, "");
  const fillId = `balanceFill-${uid}`;
  const lineId = `balanceLine-${uid}`;

  const { points, growthPct, yLabels } = useMemo(() => {
    const samples =
      history.length >= 2
        ? history
        : history.length === 1
          ? [history[0], { balance: currentBalance, at: history[0].at }]
          : [{ balance: currentBalance, at: new Date() }];

    const balances = samples.map((p) => p.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const range = max - min || Math.max(max * 0.02, 1);
    const paddedMin = min - range * 0.08;
    const paddedMax = max + range * 0.08;
    const plotH = H - PAD_TOP - PAD_BOTTOM;

    const coords: [number, number][] = samples.map((p, i) => {
      const x = samples.length === 1 ? W / 2 : (i / (samples.length - 1)) * W;
      const t = (p.balance - paddedMin) / (paddedMax - paddedMin);
      const y = PAD_TOP + plotH * (1 - t);
      return [x, y];
    });

    const first = samples[0].balance;
    const last = samples[samples.length - 1].balance;
    const pct = first > 0 ? ((last - first) / first) * 100 : 0;

    const labels = [paddedMax, (paddedMax + paddedMin) / 2, paddedMin].map((v) =>
      formatMoney(v, currency),
    );

    return {
      points: coords,
      growthPct: pct,
      yLabels: labels,
    };
  }, [history, currency, currentBalance]);

  const growing = growthPct >= 0;
  const hasTrend = history.length >= 2;

  return (
    <div className="balance-growth-chart">
      <div className="balance-growth-chart-head">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-profit hero-live-dot shrink-0" />
          <span className="text-xs text-muted-foreground font-data uppercase tracking-wide truncate">
            Balance growth
          </span>
          {hasTrend && (
            <span
              className={`text-xs font-semibold font-data inline-flex items-center gap-0.5 shrink-0 ${
                growing ? "text-profit" : "text-loss"
              }`}
            >
              {growing ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {growing ? "+" : ""}
              {growthPct.toFixed(2)}%
            </span>
          )}
        </div>
        <span className="text-[0.65rem] border border-profit/30 text-profit rounded-full px-2 py-0.5 font-data">
          LIVE
        </span>
      </div>

      <div className="balance-growth-chart-body">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full balance-growth-chart-svg"
          preserveAspectRatio="none"
          aria-label="Account balance over time"
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A7F5A" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#1A7F5A" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1A7F5A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1A7F5A" stopOpacity="1" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1="0"
              y1={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
              x2={W}
              y2={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
              stroke="rgba(11,31,61,0.06)"
              strokeWidth="1"
            />
          ))}

          {points.length >= 2 && (
            <>
              <path d={buildFillPath(points)} fill={`url(#${fillId})`} />
              <path
                d={buildPath(points)}
                fill="none"
                stroke={`url(#${lineId})`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {points.length === 1 && (
            <circle cx={points[0][0]} cy={points[0][1]} r="4" fill="#1A7F5A" />
          )}

          {points.length >= 2 && (
            <>
              <circle
                cx={points[points.length - 1][0]}
                cy={points[points.length - 1][1]}
                r="3"
                fill="#1A7F5A"
              />
              <circle
                cx={points[points.length - 1][0]}
                cy={points[points.length - 1][1]}
                r="7"
                fill="#1A7F5A"
                opacity="0.15"
              />
            </>
          )}
        </svg>

        <div className="balance-growth-chart-yaxis" aria-hidden>
          {yLabels.map((label) => (
            <span key={label} className="text-[0.55rem] text-muted-foreground font-data">
              {label}
            </span>
          ))}
        </div>
      </div>

      {!hasTrend && (
        <p className="text-xs text-muted-foreground px-3 pb-2 font-data">
          Chart builds as your EA syncs balance changes.
        </p>
      )}
    </div>
  );
}
