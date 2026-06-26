import Link from "next/link";
import { ArrowRight, Cpu, Server, Zap } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";

const PILLARS = [
  {
    icon: Cpu,
    title: "Quant-grade EA",
    description:
      "A battle-tested expert advisor refined on years of MT5 tick data. Adaptive risk controls built in from day one.",
  },
  {
    icon: Server,
    title: "Managed VPS",
    description:
      "Pre-configured cloud host with 99.98% uptime. The bot never sleeps — even when your laptop does.",
  },
  {
    icon: Zap,
    title: "Sub-12ms latency",
    description:
      "Co-located with the broker for institutional-grade execution speed. Tighter fills, less slippage.",
  },
];

export default function HomeFeaturesSection() {
  return (
    <section id="features" className="section-y" style={{ background: "var(--secondary)" }}>
      <div className="container-site">
        <ScrollReveal variant="up" className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow="Why it works"
            eyebrowDot
            title="Set it once."
            accent="Earn while you sleep."
            description="Three pillars keep QauntraBot running flawlessly, even when you're not watching."
          />
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200 shrink-0"
          >
            Explore every feature <ArrowRight size={15} />
          </Link>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map(({ icon: Icon, title, description }, i) => (
            <ScrollReveal key={title} variant="up" delay={i * 80}>
              <div className="card-surface-hover p-7 h-full group">
                <div className="icon-tile mb-5">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="content-heading mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
