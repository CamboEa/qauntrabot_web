import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function SleepCtaSection() {
  return (
    <section className="section-y section-white">
      <div className="container-site">
        <ScrollReveal variant="up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title mb-5">
              Sleep is the{" "}
              <span className="section-title-accent">new edge.</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              $29/month for the managed VPS. EA included free with our partner broker.
              7-day money-back guarantee.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/register" className="group btn-primary-brand justify-center transition-transform duration-200 hover:-translate-y-0.5">
                Start with QauntraBot
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/pricing" className="btn-outline-brand justify-center transition-transform duration-200 hover:-translate-y-0.5">
                Compare what you're paying today →
              </Link>
            </div>

            {/* Risk disclosure */}
            <p className="text-[0.6875rem] text-muted-foreground font-data leading-relaxed border-t border-border pt-8 max-w-2xl mx-auto">
              Risk disclosure. Trading foreign exchange and CFDs carries substantial risk and may not
              be suitable for all investors. Past performance is not indicative of future results.
              You may lose more than your initial deposit. Only trade with capital you can afford to lose.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
