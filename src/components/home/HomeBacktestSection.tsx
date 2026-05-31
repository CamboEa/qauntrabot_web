"use client";

import { BarChart2, CalendarDays, CheckCircle2, FlaskConical } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProofMediaShowcase, { type ProofMediaItem } from "@/components/shared/ProofMediaShowcase";

const BACKTEST_MEDIA: ProofMediaItem[] = [
  {
    id: "tester",
    tabLabel: "Tester",
    windowTitle: "MetaTrader 5 — Strategy Tester",
    label: "Strategy Tester — XAUUSD, Feb 2020 – May 2025, real ticks",
    src: "/asset/strategyTesting2.webp",
    alt: "MetaTrader 5 Strategy Tester showing SuperFibonacciBBot backtested on XAUUSD from Feb 2020 to May 2025",
    width: 1280,
    height: 720,
  },
  {
    id: "equity",
    tabLabel: "Equity",
    windowTitle: "MetaTrader 5 — Backtest report",
    label: "Balance / equity & deposit load — Feb–Mar 2026",
    src: "/asset/equityGraph.webp",
    alt: "MT5 backtest equity curve showing balance and equity growth from February to March 2026 with deposit load panel",
    width: 2984,
    height: 1350,
  },
  {
    id: "analytics",
    tabLabel: "Analytics",
    windowTitle: "MetaTrader 5 — Graph",
    label: "Entries & P/L by hour, weekday, and month — Asia / Europe / USA",
    src: "/asset/graphBackTesting.webp",
    alt: "MT5 backtest report charts showing trade entries and profit/loss by hour, weekday, and month with session breakdown",
    width: 2962,
    height: 778,
  },
];

const BACKTEST_STATS = [
  { label: "History depth", value: "5+ Years", Icon: CalendarDays },
  { label: "Markets covered", value: "Multi-asset", Icon: BarChart2 },
  { label: "Test method", value: "Real Ticks", Icon: FlaskConical },
];

const BACKTEST_POINTS = [
  "Backtested on MT5 Strategy Tester using real tick data — not interpolated OHLC",
  "Covers Feb 2020 – May 2025: bull runs, COVID crash, rate-hike cycles, and more across multiple markets",
  "Optimised for robustness across volatile and ranging market conditions",
];

// Photo by rc.xyz NFT gallery on Unsplash (free licence)
// Premium alternative (Unsplash+): https://plus.unsplash.com/premium_photo-1681487769650-a0c3fbaed85a?fm=jpg&q=80&w=1920&auto=format&fit=crop
const BG_URL =
  "https://images.unsplash.com/photo-1634542984003-e0fb8e200e91?fm=jpg&q=80&w=1920&auto=format&fit=crop";

const DARK_VARS = {
  "--foreground": "#F4F2EB",
  "--muted-foreground": "rgba(244,242,235,0.60)",
  "--primary": "#93C5FD",
  "--primary-foreground": "#0B1F3D",
  "--card": "rgba(11,31,61,0.65)",
  "--secondary": "rgba(11,31,61,0.50)",
  "--border": "rgba(244,242,235,0.14)",
  "--profit": "#34d399",
  "--background": "rgba(11,31,61,0.60)",
} as React.CSSProperties;

export default function HomeBacktestSection() {
  return (
    <section
      id="backtest"
      className="min-h-dvh flex items-center section-y relative overflow-hidden bg-[#0B1F3D]"
      style={{ backgroundImage: `url('${BG_URL}')`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black/65" />
      <div className="container-site w-full relative z-10" style={DARK_VARS}>
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <ScrollReveal variant="left" delay={60} className="order-1">
          <ProofMediaShowcase items={BACKTEST_MEDIA} autoAdvance autoAdvanceMs={5000} />
        </ScrollReveal>

        <ScrollReveal variant="right" delay={100} className="stack-4 order-2">
          <SectionHeader
            eyebrow="Battle-tested strategy"
            eyebrowDot
            title="5 years of market"
            accent="history. Zero guesswork."
            description="Every bot we ship has been stress-tested across half a decade of live market data — including crashes, rallies, and everything in between."
          />

          <ul className="stack-3">
            {BACKTEST_POINTS.map((point, i) => (
              <ScrollReveal key={point} as="li" variant="up" delay={200 + i * 70}>
                <span className="flex items-start gap-3 text-sm text-foreground/90 leading-relaxed">
                  <CheckCircle2 size={18} className="text-profit shrink-0 mt-0.5" aria-hidden />
                  {point}
                </span>
              </ScrollReveal>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-3">
            {BACKTEST_STATS.map(({ label, value, Icon }, i) => (
              <ScrollReveal key={label} variant="up" delay={400 + i * 80}>
                <div className="meta-cell stack-2 h-full">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-primary shrink-0" aria-hidden />
                    <p className="stat-label normal-case tracking-normal text-[0.6rem]">{label}</p>
                  </div>
                  <p className="font-data text-sm font-semibold tabular-nums text-foreground">
                    {value}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal variant="fade" delay={640}>
            <p className="text-[0.65rem] text-muted-foreground font-data leading-relaxed max-w-lg">
              Past backtest performance does not guarantee future results. Backtest conducted with highest-quality MT5 tick data.
            </p>
          </ScrollReveal>
        </ScrollReveal>
      </div>
      </div>
    </section>
  );
}
