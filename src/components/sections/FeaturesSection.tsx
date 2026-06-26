import {
  Cpu,
  Shield,
  Zap,
  LineChart,
  Lock,
  Bell,
  Globe,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import PageSection from "@/components/shared/PageSection";

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Cpu,
    title: "Quant-grade EA",
    description:
      "MT5 expert advisor refined on years of tick data and walk-forward optimization.",
  },
  {
    icon: Shield,
    title: "Managed VPS",
    description:
      "Pre-configured Windows cloud host. 99.98% uptime so your bot never sleeps.",
  },
  {
    icon: Zap,
    title: "Sub-12ms latency",
    description:
      "Co-located with the broker for institutional-grade execution speed.",
  },
  {
    icon: LineChart,
    title: "Real-time analytics",
    description:
      "Live equity curve, P&L, and drawdown right inside the Quantra dashboard.",
  },
  {
    icon: Lock,
    title: "Account-bound license",
    description:
      "Generate a key that binds the EA to your MT5 account number.",
  },
  {
    icon: Bell,
    title: "Smart alerts",
    description:
      "Optional email / Telegram alerts on trades, drawdown thresholds, or VPS health.",
  },
  {
    icon: Globe,
    title: "Multi-broker ready",
    description:
      "Works with any MT5-compatible broker. Recommended partner unlocks the EA free.",
  },
  {
    icon: Layers,
    title: "Risk presets",
    description:
      "Conservative, balanced, and aggressive presets — switch with one click.",
  },
];

export default function FeaturesSection({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <PageSection id="features" underHero={hideHeader} standalone={!hideHeader}>
      {!hideHeader && (
        <div className="headline-gap">
          <SectionHeader
            eyebrow="Features"
            title="Everything you need to trade"
            accent="on autopilot."
            description="Quantra packages a battle-tested expert advisor, a managed VPS, and a clean control panel into one subscription."
          />
        </div>
      )}

      <div className="features-grid">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="features-grid-cell">
            <Icon
              size={22}
              strokeWidth={1.5}
              className="text-foreground/70 shrink-0"
              aria-hidden
            />
            <div className="flex flex-col gap-2 mt-2">
              <h3 className="font-semibold text-[0.9375rem] text-foreground leading-snug tracking-[-0.01em]">
                {title}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
