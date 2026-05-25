"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import PageSection from "@/components/shared/PageSection";
import { FAQ_ITEMS } from "@/lib/faq-data";

export default function FAQSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PageSection id="faqs" underHero={hideHeader} standalone={!hideHeader} narrow>
        {!hideHeader && (
          <div className="headline-gap">
            <SectionHeader eyebrow="Common Questions" title="Frequently asked" accent="questions." />
          </div>
        )}

        <div className="card-surface divide-y divide-border overflow-hidden">
          {FAQ_ITEMS.map((faq, i) => (
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
    </PageSection>
  );
}
