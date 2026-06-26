import { Star } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";

const TESTIMONIALS = [
  {
    quote:
      "I set it up on a Sunday and forgot about it. Three months in, the equity curve is what sold my brother on it too.",
    name: "Marcus T.",
    role: "Software engineer, Berlin",
    gain: "+18.4%",
    gainLabel: "3-month return",
    initial: "M",
  },
  {
    quote:
      "The dashboard is the cleanest one I've used. No noisy gauges, just the numbers I actually check.",
    name: "Aisha R.",
    role: "Part-time trader, Dubai",
    gain: "+12.1%",
    gainLabel: "Last 30 days",
    initial: "A",
  },
  {
    quote:
      "Latency is the real story. My fills are tighter than what I get running MT5 on my desktop.",
    name: "Daniel K.",
    role: "Prop firm trader, London",
    gain: "+22.7%",
    gainLabel: "Cumulative",
    initial: "D",
  },
  {
    quote:
      "The backtests looked conservative. Live results have been better. That's the first time that's happened to me with an EA.",
    name: "Sophie W.",
    role: "Forex trader, Singapore",
    gain: "+9.8%",
    gainLabel: "This month",
    initial: "S",
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-y section-white">
      <div className="container-site">
        <ScrollReveal variant="up">
          <SectionHeader
            eyebrow="Trusted by traders"
            eyebrowDot
            title="Quiet returns."
            accent="Honest reviews."
            description="From prop firm traders to engineers who'd rather not watch charts — QauntraBot runs quietly in the background."
            align="center"
          />
        </ScrollReveal>

        <div className="headline-gap" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map(({ quote, name, role, gain, gainLabel, initial }, i) => (
            <ScrollReveal key={name} variant="up" delay={i * 80}>
              <div className="card-surface-hover h-full flex flex-col gap-4 p-5 group">
                <div className="flex items-center justify-between">
                  <StarRow />
                  <div className="text-right">
                    <div className="font-data text-sm font-semibold text-profit tabular-nums leading-none">
                      {gain}
                    </div>
                    <div className="text-[0.6rem] text-muted-foreground uppercase tracking-wider font-data mt-0.5">
                      {gainLabel}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                  &ldquo;{quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold font-display shrink-0">
                    {initial}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground leading-none">{name}</div>
                    <div className="text-[0.6875rem] text-muted-foreground mt-0.5">{role}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal variant="up" delay={200}>
          <p className="mt-8 text-center text-xs text-muted-foreground font-data">
            Results shown are from verified live accounts. Individual outcomes may vary. Trading involves risk.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
