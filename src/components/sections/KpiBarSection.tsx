const KPIS = [
  { value: "12,480+", label: "Active Bots" },
  { value: "99.98%", label: "VPS Uptime" },
  { value: "<12ms", label: "Avg Latency" },
  { value: "24/7", label: "Monitoring" },
];

export default function KpiBarSection() {
  return (
    <section className="section-cream py-6">
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border border-border rounded-2xl overflow-hidden bg-transparent">
          {KPIS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col gap-1.5 px-6 py-5 md:px-8 md:py-6"
            >
              <span
                className="font-semibold text-foreground tabular-nums leading-none tracking-tight"
                style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.875rem)", letterSpacing: "-0.03em" }}
              >
                {value}
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
