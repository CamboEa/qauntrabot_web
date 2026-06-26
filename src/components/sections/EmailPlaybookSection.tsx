"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function EmailPlaybookSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="section-cream py-8">
      <div className="container-site">
        <ScrollReveal variant="up">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
            {/* Left: copy */}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground leading-tight mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.03em" }}>
                Get the algo-trading playbook.
              </h2>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-sm">
                A free 14-page PDF on EAs, VPS hosting, and the risk frameworks we use internally.
                No spam — unsubscribe anytime.
              </p>
            </div>

            {/* Right: form */}
            <div className="w-full md:w-auto md:min-w-[26rem]">
              {submitted ? (
                <div className="flex items-center gap-2 text-sm text-foreground/70 py-3">
                  <span className="text-profit font-semibold">✓</span>
                  Check your inbox — the playbook is on its way.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 min-w-0 rounded-full border border-border bg-transparent px-5 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-foreground transition-colors"
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    className="btn-primary-brand shrink-0 group"
                  >
                    Get the playbook
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
