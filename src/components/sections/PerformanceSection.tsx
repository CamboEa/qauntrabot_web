"use client";

import { useState } from "react";
import SectionHeader from "@/components/shared/SectionHeader";

type Strategy = {
  name: string;
  tag: string;
  gain: string;
  drawdown: string;
  winRate: string;
  profitFactor: string;
  trades: string;
  avgRR: string;
  monthly: { month: string; value: number }[];
};

const STRATEGIES: Strategy[] = [
  {
    name: "XAUUSD Grid",
    tag: "Gold",
    gain: "+247.3%",
    drawdown: "12.4%",
    winRate: "73.2%",
    profitFactor: "2.84",
    trades: "847",
    avgRR: "1:2.8",
    monthly: [
      { month: "Jun", value: 14.2 }, { month: "Jul", value: 22.8 },
      { month: "Aug", value: -6.1 }, { month: "Sep", value: 31.4 },
      { month: "Oct", value: 18.9 }, { month: "Nov", value: 27.3 },
      { month: "Dec", value: 41.2 }, { month: "Jan", value: 19.7 },
      { month: "Feb", value: 33.1 }, { month: "Mar", value: -4.2 },
      { month: "Apr", value: 28.6 }, { month: "May", value: 20.4 },
    ],
  },
  {
    name: "Forex Scalper",
    tag: "Majors",
    gain: "+158.9%",
    drawdown: "8.7%",
    winRate: "68.5%",
    profitFactor: "2.31",
    trades: "1,342",
    avgRR: "1:1.9",
    monthly: [
      { month: "Jun", value: 8.4 }, { month: "Jul", value: 12.1 },
      { month: "Aug", value: 15.6 }, { month: "Sep", value: -3.8 },
      { month: "Oct", value: 18.2 }, { month: "Nov", value: 22.4 },
      { month: "Dec", value: 14.7 }, { month: "Jan", value: 11.3 },
      { month: "Feb", value: 19.8 }, { month: "Mar", value: 16.2 },
      { month: "Apr", value: -2.1 }, { month: "May", value: 24.7 },
    ],
  },
  {
    name: "Multi-Asset",
    tag: "Portfolio",
    gain: "+312.6%",
    drawdown: "15.1%",
    winRate: "71.8%",
    profitFactor: "3.12",
    trades: "623",
    avgRR: "1:3.2",
    monthly: [
      { month: "Jun", value: 18.7 }, { month: "Jul", value: 26.4 },
      { month: "Aug", value: 31.2 }, { month: "Sep", value: -8.4 },
      { month: "Oct", value: 42.1 }, { month: "Nov", value: 28.9 },
      { month: "Dec", value: 37.4 }, { month: "Jan", value: 22.3 },
      { month: "Feb", value: 44.8 }, { month: "Mar", value: -6.1 },
      { month: "Apr", value: 36.7 }, { month: "May", value: 30.2 },
    ],
  },
];

function MonthlyBar({ value, max }: { value: number; max: number }) {
  const isPos = value >= 0;
  const pct = Math.abs(value / max) * 100;
  return (
    <div className="flex flex-col items-center justify-end h-full min-h-[3.5rem]">
      <div
        style={{ height: `${Math.max(pct, 8)}%` }}
        className={`w-full max-w-[1.125rem] rounded-t-sm ${isPos ? "bg-profit/75" : "bg-loss/65"}`}
      />
    </div>
  );
}

export default function PerformanceSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const [active, setActive] = useState(0);
  const s = STRATEGIES[active];
  const maxMonthly = Math.max(...s.monthly.map((m) => Math.abs(m.value)));

  return (
    <section id="performance" className={`bg-background ${hideHeader ? "page-body-y" : "section-y"}`}>
      <div className="container-site stack-6">
        {!hideHeader && (
          <div className="headline-gap">
            <SectionHeader
              eyebrow="Verified Performance Data"
              eyebrowDot
              title="Live results."
              accent="No simulations."
              description="All statistics from live accounts, independently verifiable on MyFxBook and FXBlue."
            />
          </div>
        )}

        <div className="tab-group">
          {STRATEGIES.map((st, i) => (
            <button
              key={st.name}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 ${active === i ? "tab-pill-active" : ""}`}
            >
              {st.name}
              <span className="ml-1.5 opacity-60 text-xs">{st.tag}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 grid-site">
          {[
            { label: "Total Gain", value: s.gain, color: "text-profit" },
            { label: "Max Drawdown", value: s.drawdown, color: "text-warning" },
            { label: "Win Rate", value: s.winRate, color: "text-foreground" },
            { label: "Profit Factor", value: s.profitFactor, color: "text-profit" },
          ].map(({ label, value, color }) => (
            <div key={label} className="card-surface card-pad stack-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-data">{label}</p>
              <p className={`font-display text-2xl md:text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 grid-site">
          <div className="card-surface card-pad stack-3">
            <p className="text-xs font-data uppercase tracking-wide text-muted-foreground">Additional stats</p>
            {[
              { label: "Closed Trades", value: s.trades },
              { label: "Avg Risk:Reward", value: s.avgRR },
              { label: "Max Win Streak", value: "14" },
              { label: "Max Loss Streak", value: "3" },
              { label: "Avg Duration", value: "4h 22m" },
              { label: "Profitable Months", value: "10 / 12" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm gap-4 py-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-data font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 card-surface card-pad stack-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-data uppercase tracking-wide text-muted-foreground">Monthly performance (%)</p>
              <div className="flex gap-4 text-xs text-muted-foreground font-data">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-profit/75" />Gain</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-loss/65" />Loss</span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-1.5 h-24 items-end">
              {s.monthly.map((m) => (
                <MonthlyBar key={m.month} value={m.value} max={maxMonthly} />
              ))}
            </div>
            <div className="grid grid-cols-12 gap-1 text-center">
              {s.monthly.map((m) => (
                <span key={m.month} className="text-[0.6rem] text-muted-foreground font-data">{m.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
