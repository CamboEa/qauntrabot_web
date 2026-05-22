import {
  Shield,
  GitBranch,
  Zap,
  Layers,
  Clock,
  BarChart3,
  Boxes,
  Lock,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const FEATURES = [
  { icon: Shield, title: "Smart Risk Management", description: "Adaptive trailing stops, auto position sizing, and configurable max drawdown caps per strategy.", tags: ["Trailing SL/TP", "Position Sizing", "Drawdown Cap"] },
  { icon: GitBranch, title: "Market-Neutral Frameworks", description: "Grid and hedging architectures for ranging, trending, or volatile conditions with basket management.", tags: ["Grid Trading", "Hedging", "Basket Mgmt"] },
  { icon: Zap, title: "Low-Latency Execution", description: "VPS-ready with sub-10ms latency on co-located servers. ECN-compatible with slippage control.", tags: ["VPS Ready", "ECN", "Slippage Control"] },
  { icon: Layers, title: "Multi-Asset Coverage", description: "Gold, forex, indices, and crypto CFDs from a single EA with isolated risk per instrument.", tags: ["XAUUSD", "Forex", "Crypto"] },
  { icon: Clock, title: "24/7 Autonomous Operation", description: "Session filters, news avoidance, and automatic Friday close protect capital around the clock.", tags: ["Session Filters", "News Block", "Auto Close"] },
  { icon: BarChart3, title: "Advanced Analytics", description: "Live dashboards, webhook alerts, and KPI tracking via MT5 or external integrations.", tags: ["Dashboard", "Webhooks", "KPIs"] },
  { icon: Boxes, title: "Multi-Strategy Architecture", description: "Up to 12 strategies with shared risk budgeting and portfolio-level drawdown limits.", tags: ["Portfolio", "Risk Budget", "Correlation Guard"] },
  { icon: Lock, title: "Secure License Delivery", description: "Hardware-locked licensing, instant delivery, and full onboarding with parameter files.", tags: ["Hardware Lock", "Instant", "Setup Docs"] },
];

export default function FeaturesSection({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section id="features" className={`section-cream ${hideHeader ? "page-body-y" : "section-y"}`}>
      <div className="container-site stack-6">
        {!hideHeader && (
          <div className="headline-gap">
            <SectionHeader
              eyebrow="Technical Capabilities"
              title="Built for professionals."
              accent="Engineered for edge."
              description="Every module architected for reliability, configurability, and institutional-grade risk discipline."
            />
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 grid-site">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-surface-hover card-pad flex flex-col stack-4 h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                <f.icon size={18} className="text-primary" strokeWidth={1.75} />
              </div>
              <div className="flex-1 stack-2">
                <h3 className="font-display text-base font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border">
                {f.tags.map((tag) => (
                  <span key={tag} className="text-[0.65rem] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-data">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
