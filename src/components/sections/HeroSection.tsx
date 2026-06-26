import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const FEATURE_CALLOUTS = [
  "Account-bound license",
  "Tier-3 datacenter VPS",
  "Read-only API keys",
  "7-day money back",
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-x-clip section-cream pt-28 pb-16 md:pt-32 md:pb-20"
    >
      <div className="relative container-site w-full flex flex-col items-center text-center gap-8">
        {/* Live badge */}
        <div className="hero-enter hero-d-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground/80 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-profit" />
          </span>
          Live · 12,480 bots trading now
        </div>

        {/* Headline */}
        <div className="stack-3 hero-enter hero-d-1 max-w-4xl">
          <h1 className="hero-title">
            Earn while you sleep.{" "}
            <span className="text-primary">Let the algo work the night shift.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            QauntraBot runs an institutional-grade MT5 expert advisor on a managed VPS, 24/7.
            Free EA with our partner broker. Sub-12ms execution. Zero babysitting.
          </p>
        </div>

        {/* CTAs */}
        <div className="hero-enter hero-d-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="group btn-primary-brand justify-center transition-transform duration-200 hover:-translate-y-0.5">
            Start free — 7-day refund
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link href="/pricing" className="btn-outline-brand justify-center transition-transform duration-200 hover:-translate-y-0.5">
            See pricing →
          </Link>
        </div>

        {/* Feature callouts */}
        <ul className="hero-enter hero-d-3 flex flex-wrap justify-center gap-2">
          {FEATURE_CALLOUTS.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1.5 text-xs text-foreground/70 bg-card border border-border rounded-full px-3 py-1.5"
            >
              <CheckCircle2 size={12} className="text-profit shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* Hero image */}
        <div className="hero-card-enter hero-d-chart w-full max-w-5xl">
          <Image
            src="/asset/mt5screen.webp"
            alt="MetaTrader 5 platform showing XAUUSD chart with QauntraBot running live"
            width={1200}
            height={750}
            className="w-full h-auto rounded-2xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          />
        </div>
      </div>
    </section>
  );
}
