import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Zap, CheckCircle2 } from "lucide-react";
import TradingChart from "@/components/shared/TradingChart";
import TickerTape from "@/components/shared/TickerTape";

const TRUST_ITEMS = [
  { icon: TrendingUp, label: "MT4 / MT5 Compatible" },
  { icon: Shield, label: "Built-in Risk Management" },
  { icon: Zap, label: "24/7 Autonomous Execution" },
];

const STATS = [
  { value: "$4.2M+", label: "Aggregate Profit" },
  { value: "2,400+", label: "Active Licenses" },
  { value: "99.7%", label: "System Uptime" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden section-cream ring-motif min-h-[calc(100dvh-5rem)] flex items-center"
    >
      <div
        className="absolute -right-32 top-1/4 w-[420px] h-[420px] rounded-full border-[3rem] border-primary/[0.04] pointer-events-none"
        aria-hidden
      />

      <div className="relative container-site w-full section-y">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="stack-6 order-2 lg:order-1">
            <span className="eyebrow w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse shrink-0" />
              Live · 847 Active Strategies
            </span>

            <div className="stack-3">
              <h1 className="hero-title">
                Automate your trading.
                <span className="block section-title-accent mt-2">Maximize precision.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Institutional-grade Expert Advisors for MT4 and MT5 — sub-millisecond execution, 24/7 operation, and built-in risk controls.
              </p>
            </div>

            <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 text-sm text-foreground/90 bg-card border border-border rounded-full px-3 py-1.5"
                >
                  <Icon size={15} className="text-primary shrink-0" />
                  {label}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/pricing" className="btn-primary-brand justify-center sm:w-auto">
                View Pricing <ArrowRight size={16} />
              </Link>
              <Link href="/performance" className="btn-outline-brand justify-center sm:w-auto">
                Live Results
              </Link>
            </div>

            <div className="stats-grid pt-6 border-t border-border">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center sm:text-left">
                  <div className="stat-value font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    {value}
                  </div>
                  <div className="text-[0.6875rem] text-muted-foreground mt-1 font-data uppercase tracking-wider">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-profit" />
                7-day money-back
              </span>
              <span className="w-px h-3 bg-border" />
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-profit" />
                No performance fees
              </span>
            </div>
          </div>

          <div className="order-1 lg:order-2 w-full">
            <div className="card-surface overflow-hidden shadow-[0_16px_48px_rgba(11,31,61,0.1)]">
              <TickerTape />
              <TradingChart />
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                {[
                  { label: "Total Gain", value: "+247.3%", color: "text-profit" },
                  { label: "Win Rate", value: "73.2%", color: "text-foreground" },
                  { label: "Profit Factor", value: "2.84×", color: "text-profit" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-4 text-center bg-card">
                    <div className={`text-base font-bold font-data ${color}`}>{value}</div>
                    <div className="text-[0.625rem] text-muted-foreground mt-1 uppercase tracking-wide font-data">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
