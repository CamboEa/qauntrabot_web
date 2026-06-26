import { Link2, Server, KeyRound } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";

const STEPS = [
  {
    number: "01",
    icon: Link2,
    title: "Link broker",
    description:
      "Open a free account with our partner broker to unlock EA access. Takes under five minutes — no deposit required to start.",
  },
  {
    number: "02",
    icon: Server,
    title: "Subscribe VPS",
    description:
      "Spin up a managed VPS in seconds. Pre-configured for MT5 with all dependencies installed and latency optimized.",
  },
  {
    number: "03",
    icon: KeyRound,
    title: "Generate key",
    description:
      "Bind the EA to your MT5 account number. QauntraBot validates and runs 24/7 — no babysitting required.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-y section-white">
      <div className="container-site">
        <ScrollReveal variant="up">
          <SectionHeader
            eyebrow="Setup in minutes"
            title="A three-step setup."
            description="No coding knowledge required. If you can fill out a form, you can run a QauntraBot strategy."
            align="center"
          />
        </ScrollReveal>

        <div className="relative mt-14 grid md:grid-cols-3">
          {/* Single connector line spanning all three icon centers */}
          <div
            className="hidden md:block absolute h-px border-t border-dashed border-border"
            style={{ top: "2.5rem", left: "calc(100% / 6)", right: "calc(100% / 6)" }}
            aria-hidden
          />

          {STEPS.map(({ number, icon: Icon, title, description }, i) => (
            <ScrollReveal
              key={number}
              variant="up"
              delay={i * 100}
              className="flex flex-col items-center text-center px-6 md:px-10 pb-10 md:pb-0"
            >
              {/* Step icon — bg-card covers the connector line */}
              <div className="relative mb-6 z-10">
                <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center">
                  <Icon size={26} strokeWidth={1.5} className="text-foreground/70" />
                </div>
                <span
                  className="absolute -top-2 -right-2 text-[0.6rem] font-semibold text-foreground/30 tracking-widest"
                >
                  {number}
                </span>
              </div>

              <h3 className="font-semibold text-base text-foreground mb-2 tracking-tight">{title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-[14rem]">
                {description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
