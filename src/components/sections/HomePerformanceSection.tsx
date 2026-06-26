import Image from "next/image";
import ScrollReveal from "@/components/shared/ScrollReveal";

const PERF_METRICS = [
  { value: "+18.4%", label: "90-day return", color: "text-profit" },
  { value: "4.8%", label: "Max drawdown", color: "text-foreground" },
  { value: "1.92", label: "Sharpe ratio", color: "text-foreground" },
];

export default function HomePerformanceSection() {
  return (
    <section id="performance" className="section-y section-white">
      <div className="container-site">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: chart image */}
          <ScrollReveal variant="left">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-[0_16px_48px_rgba(20,26,58,0.08)]">
              <Image
                src="/asset/equityGraph.webp"
                alt="QauntraBot equity curve — aggregated anonymized performance across live accounts"
                width={1200}
                height={600}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-card/90 backdrop-blur border border-border rounded-xl px-4 py-2.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-profit" />
                </span>
                <span className="font-data text-xs text-foreground font-semibold">Live · aggregated data</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: copy + metrics */}
          <ScrollReveal variant="right" className="stack-6">
            <div className="stack-3">
              <h2 className="section-title">
                The chart you'd watch —{" "}
                <span className="section-title-accent">if you ever needed to.</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Aggregated, anonymized performance across live QauntraBot accounts.
                Past performance is not a guarantee of future returns.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {PERF_METRICS.map(({ value, label, color }, i) => (
                <ScrollReveal key={label} variant="up" delay={i * 80}>
                  <div className="card-surface p-4 text-center">
                    <div className={`font-display font-bold tabular-nums leading-none mb-1 ${color}`}
                      style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.625rem)" }}>
                      {value}
                    </div>
                    <div className="text-[0.6rem] text-muted-foreground uppercase tracking-wider font-data">
                      {label}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <p className="text-[0.6875rem] text-muted-foreground font-data leading-relaxed">
              Results shown are aggregated and anonymized from live accounts. Individual outcomes may vary.
              Trading involves risk of loss.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
