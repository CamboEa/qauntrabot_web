import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Zap, CheckCircle2 } from "lucide-react";
import { SHOW_LIVE_RESULTS_PAGE } from "@/lib/site-config";

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
      className="relative overflow-x-clip section-cream ring-motif hero-fullscreen"
    >
      <div
        className="absolute -right-32 top-1/4 w-[420px] h-[420px] rounded-full border-[3rem] border-primary/[0.04] pointer-events-none hero-ring-float"
        aria-hidden
      />

      <div className="relative container-site w-full">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div className="stack-6 order-2 lg:order-1">
            <div className="stack-3">
              <h1 className="hero-title hero-enter hero-d-0">
                Automate your trading.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg hero-enter hero-d-1">
                Institutional-grade Expert Advisors for MT4 and MT5 — sub-millisecond execution, 24/7 operation, and built-in risk controls.
              </p>
            </div>

            <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
                <li
                  key={label}
                  className={[
                    "inline-flex items-center gap-2 text-sm text-foreground/90 bg-card border border-border rounded-full px-3 py-1.5 hero-enter transition-transform duration-200 hover:-translate-y-0.5",
                    i === 0 ? "hero-d-2" : i === 1 ? "hero-d-3" : "hero-d-4",
                  ].join(" ")}
                >
                  <Icon size={15} className="text-primary shrink-0" />
                  {label}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 hero-enter hero-d-5">
              <Link href="/pricing" className="group btn-primary-brand justify-center sm:w-auto transition-transform duration-200 hover:-translate-y-0.5">
                View Pricing <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              {SHOW_LIVE_RESULTS_PAGE ? (
                <Link href="/performance" className="btn-outline-brand justify-center sm:w-auto transition-transform duration-200 hover:-translate-y-0.5">
                  Live Results
                </Link>
              ) : (
                <Link href="/bots" className="btn-outline-brand justify-center sm:w-auto transition-transform duration-200 hover:-translate-y-0.5">
                  Browse Bots
                </Link>
              )}
            </div>

            <div className="stats-grid pt-6 border-t border-border">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={[
                    "text-center sm:text-left hero-stat-in",
                    i === 0 ? "hero-d-6" : i === 1 ? "hero-d-7" : "hero-d-8",
                  ].join(" ")}
                >
                  <div className="stat-value font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    {value}
                  </div>
                  <div className="text-[0.6875rem] text-muted-foreground mt-1 font-data uppercase tracking-wider">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground hero-enter hero-d-8">
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

          <div className="order-1 lg:order-2 w-full hero-card-enter hero-d-chart flex justify-center lg:justify-end lg:-me-6 xl:-me-10">
            <div className="hero-mt5-visual w-full max-w-2xl sm:max-w-3xl lg:w-[112%] lg:max-w-[44rem] xl:max-w-[52rem]">
              <Image
                src="/asset/mt5screen.png"
                alt="MetaTrader 5 platform showing XAUUSD chart, market watch, and algo trading tools"
                width={1200}
                height={750}
                className="w-full h-auto drop-shadow-[0_24px_56px_rgba(11,31,61,0.18)]"
                priority
                sizes="(max-width: 1024px) min(100vw - 2.5rem, 48rem), 52rem"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
