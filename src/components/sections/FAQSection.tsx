"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const FAQS = [
  { q: "Which brokers are compatible with QauntraBot EAs?", a: "QauntraBot operates on any MT4 or MT5 broker that supports automated trading. We recommend ECN/STP brokers with raw spreads and low latency." },
  { q: "How is the license delivered after purchase?", a: "Immediately after payment, your license key and hardware-locked EA file are delivered to your email. Setup is typically complete within 15 minutes." },
  { q: "Do I need to run the EA on my own computer 24/7?", a: "No. QauntraBot is designed for VPS deployment, ensuring continuous operation independent of your personal machine." },
  { q: "Are the performance statistics live or backtested?", a: "All published statistics are from live trading accounts, verifiable via MyFxBook tracking links." },
  { q: "What is the drawdown, and how is it managed?", a: "Maximum drawdown varies by strategy (8.7%–15.1% historically). Each strategy has configurable hard drawdown limits." },
  { q: "Can I change the license to a different account number?", a: "License transfers are supported up to twice per calendar year at no charge. Institutional holders receive unrestricted transfers." },
  { q: "What happens if the EA stops working after a broker update?", a: "All active licenses receive build updates via email. Critical fixes are deployed within 24 hours." },
  { q: "Is there a trial period or demo version available?", a: "We offer a 7-day money-back guarantee. Starter and Pro licenses include demo-account mode." },
];

export default function FAQSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className={`section-cream ${hideHeader ? "page-body-y" : "section-y"}`}>
      <div className="container-site max-w-3xl stack-6">
        {!hideHeader && (
          <div className="headline-gap">
            <SectionHeader eyebrow="Common Questions" title="Frequently asked" accent="questions." />
          </div>
        )}

        <div className="card-surface divide-y divide-border overflow-hidden">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 card-pad text-left hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className={`text-base font-semibold leading-snug pr-2 ${open === i ? "text-foreground" : "text-foreground/85"}`}>
                  {faq.q}
                </span>
                <span className={`shrink-0 p-1 rounded-full ${open === i ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                  {open === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Still have questions?{" "}
          <span className="text-primary font-semibold hover:underline cursor-pointer">Contact support</span>
          {" "}— avg. response under 4 hours.
        </p>
      </div>
    </section>
  );
}
