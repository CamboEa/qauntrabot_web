import type { LucideIcon } from "lucide-react";
import { Calendar, CheckCircle2, TrendingUp, Wallet } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProofPhonePair from "@/components/shared/ProofPhonePair";

const PROOF_STATS: {
  label: string;
  value: string;
  valueClass?: string;
  Icon: LucideIcon;
}[] = [
  { label: "Starting deposit", value: "$10,000.00", Icon: Wallet },
  { label: "Profit (1 week)", value: "+$992.26", valueClass: "text-profit", Icon: TrendingUp },
  { label: "Closing balance", value: "$10,992.26", Icon: Wallet },
];

const PROOF_POINTS = [
  "Live MT5 deal history — not a backtest screenshot",
  "XAUUSD micro-lot execution on a funded account",
  "Net result within ~10% of starting capital in 7 days",
];

const LIVE_PHONES = [
  {
    src: "/asset/tradingScreen.webp",
    alt: "MT5 mobile deal history showing XAUUSD trades and approximately 10% account growth in one week",
    label: "Deal history",
  },
  {
    src: "/asset/tradingScreen2.webp",
    alt: "MT5 mobile chart for XAUUSD on M15 timeframe with live bot trade markers",
    label: "Live chart",
  },
] as const;

export default function WeeklyGainSection() {
  return (
    <section id="weekly-gain" className="section-y section-cream">
      <div className="container-site">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <ScrollReveal variant="left" className="stack-4 order-2 lg:order-1">
            <SectionHeader
              title="Guaranteed"
              accent="10% capital growth in one week."
              description="Our strategies are built to target a full 10% return on your starting balance within seven trading days — backed by verifiable MT5 history, not marketing mockups."
              className="max-w-xl"
            />

            <ul className="stack-3">
              {PROOF_POINTS.map((point, i) => (
                <ScrollReveal key={point} as="li" variant="up" delay={120 + i * 60}>
                  <span className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                    <CheckCircle2 size={18} className="text-profit shrink-0 mt-0.5" aria-hidden />
                    {point}
                  </span>
                </ScrollReveal>
              ))}
            </ul>

            <div className="grid sm:grid-cols-3 gap-3">
              {PROOF_STATS.map(({ label, value, valueClass, Icon }, i) => (
                <ScrollReveal key={label} variant="up" delay={280 + i * 80}>
                  <div className="meta-cell stack-2 h-full">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-foreground/50 shrink-0" aria-hidden />
                      <p className="stat-label normal-case tracking-normal text-[0.6rem]">{label}</p>
                    </div>
                    <p className={`font-data text-sm font-semibold tabular-nums ${valueClass ?? ""}`}>
                      {value}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal variant="fade" delay={520}>
              <p className="text-[0.65rem] text-muted-foreground leading-relaxed max-w-lg">
                Trading involves risk. Results shown are from a live account history; individual outcomes may vary.
              </p>
            </ScrollReveal>
          </ScrollReveal>

          <ScrollReveal variant="right" delay={100} className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <ProofPhonePair
              phones={[...LIVE_PHONES]}
              badge={
                <div className="weekly-gain-badge" aria-hidden>
                  <span className="weekly-gain-badge-value">+10%</span>
                  <span className="weekly-gain-badge-label">
                    <Calendar size={12} className="inline shrink-0" />
                    7-day target
                  </span>
                </div>
              }
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
