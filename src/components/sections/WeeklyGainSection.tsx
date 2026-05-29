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
  { label: "Closing balance", value: "$10,992.26", valueClass: "text-foreground", Icon: Wallet },
];

const PROOF_POINTS = [
  "Live MT5 deal history — not a backtest screenshot",
  "XAUUSD micro-lot execution on a funded account",
  "Net result within ~10% of starting capital in 7 days",
];

const LIVE_PHONES = [
  {
    src: "/asset/tradingScreen.png",
    alt: "MT5 mobile deal history showing XAUUSD trades and approximately 10% account growth in one week",
    label: "Deal history",
  },
  {
    src: "/asset/tradingScreen2.png",
    alt: "MT5 mobile chart for XAUUSD on M15 timeframe with live bot trade markers",
    label: "Live chart",
  },
] as const;

// Photo by Jakub Żerdzicki on Unsplash (free licence)
const BG_URL =
  "https://images.unsplash.com/photo-1767424412548-1a1ac7f4b9bc?fm=jpg&q=80&w=1920&auto=format&fit=crop";

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

export default function WeeklyGainSection() {
  return (
    <section
      id="weekly-gain"
      className="min-h-dvh flex items-center section-y relative overflow-hidden bg-[#0B1F3D]"
      style={{ backgroundImage: `url('${BG_URL}')`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="container-site w-full relative z-10" style={DARK_VARS}>
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
                <span className="flex items-start gap-3 text-sm text-foreground/90 leading-relaxed">
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
                    <Icon size={14} className="text-primary shrink-0" aria-hidden />
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
            <p className="text-[0.65rem] text-muted-foreground font-data leading-relaxed max-w-lg">
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
