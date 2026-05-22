"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

type Tier = {
  name: string;
  badge?: string;
  price: { monthly: number; annual: number; lifetime?: number };
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Starter",
    price: { monthly: 79, annual: 59, lifetime: 299 },
    description: "Single-strategy access for traders beginning their automation journey.",
    features: [
      "1 MT4 or MT5 License",
      "XAUUSD Grid Strategy",
      "Standard parameter file",
      "Email support (48h response)",
      "Monthly build updates",
      "Basic setup documentation",
      "MyFxBook integration guide",
    ],
    cta: "Get Starter",
    highlighted: false,
  },
  {
    name: "Pro",
    badge: "Most Popular",
    price: { monthly: 149, annual: 109, lifetime: 499 },
    description: "Full strategy suite for active traders seeking maximum market coverage.",
    features: [
      "3 MT4 / MT5 Licenses",
      "All 3 Strategy Modules",
      "Priority support (4h response)",
      "Weekly build updates",
      "VPS optimization guide",
      "Advanced parameter configuration",
      "Telegram alert integration",
      "Portfolio risk dashboard",
      "1-on-1 onboarding call (30 min)",
    ],
    cta: "Get Pro",
    highlighted: true,
  },
  {
    name: "Institutional",
    price: { monthly: 399, annual: 299, lifetime: 1499 },
    description: "Unlimited deployment for proprietary trading desks and fund managers.",
    features: [
      "Unlimited MT4 / MT5 Licenses",
      "All Strategies + Custom Tuning",
      "Dedicated account manager",
      "Same-day build updates",
      "White-label option available",
      "Strategy consultation calls (monthly)",
      "Custom parameter profiles",
      "FIX API execution support",
      "Risk committee reporting templates",
      "Priority co-location setup",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

type Billing = "monthly" | "annual" | "lifetime";

export default function PricingSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const [billing, setBilling] = useState<Billing>("annual");

  const getPrice = (tier: Tier): string => {
    if (billing === "lifetime" && tier.price.lifetime) return `$${tier.price.lifetime}`;
    if (billing === "annual") return `$${tier.price.annual}`;
    return `$${tier.price.monthly}`;
  };

  const getPeriod = (): string => (billing === "lifetime" ? "one-time" : "/ mo");

  const getSavings = (tier: Tier): string | null => {
    if (billing === "annual") {
      const saved = Math.round(((tier.price.monthly - tier.price.annual) / tier.price.monthly) * 100);
      return `Save ${saved}%`;
    }
    return null;
  };

  return (
    <section id="pricing" className={`bg-background ${hideHeader ? "page-body-y" : "section-y"}`}>
      <div className="container-site stack-6">
        {!hideHeader && (
          <div className="headline-gap flex justify-center">
            <SectionHeader
              align="center"
              eyebrow="Instant Digital Delivery"
              title="Transparent pricing."
              accent="Immediate access."
              description="No hidden fees or performance commissions. Hardware-locked EA delivered instantly."
            />
          </div>
        )}

        <div className="flex justify-center">
          <div className="tab-group">
            {(["monthly", "annual", "lifetime"] as Billing[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBilling(b)}
                className={`relative capitalize ${billing === b ? "tab-pill-active" : ""}`}
              >
                {b}
                {b === "annual" && billing !== "annual" && (
                  <span className="absolute -top-2.5 -right-2 text-[0.6rem] bg-profit text-white px-1.5 py-0.5 rounded-full font-data leading-none">
                    Best
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-site items-stretch">
          {TIERS.map((tier) => {
            const savings = getSavings(tier);
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl h-full ${
                  tier.highlighted ? "pricing-featured bg-primary text-primary-foreground" : "card-surface"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-card text-primary text-xs font-bold px-3 py-1 rounded-full border border-border font-data uppercase">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="card-pad flex flex-col flex-1 stack-4">
                  <div className="stack-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                      {savings && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 font-data ${tier.highlighted ? "bg-primary-foreground/15" : "bg-profit/10 text-profit"}`}>
                          {savings}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${tier.highlighted ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                      {tier.description}
                    </p>
                  </div>

                  <div className={`pb-4 border-b ${tier.highlighted ? "border-primary-foreground/15" : "border-border"}`}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl md:text-4xl font-bold tracking-tight">{getPrice(tier)}</span>
                      <span className={`text-sm font-data ${tier.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {getPeriod()}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/register"
                    className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-full cursor-pointer ${
                      tier.highlighted ? "bg-primary-foreground text-primary" : "btn-primary-brand w-full"
                    }`}
                  >
                    {tier.cta} <ArrowRight size={16} />
                  </Link>

                  <ul className="flex flex-col gap-2.5 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check size={15} className={`shrink-0 mt-0.5 ${tier.highlighted ? "text-profit" : "text-primary"}`} />
                        <span className={`text-sm leading-snug ${tier.highlighted ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className={`text-xs text-center pb-5 font-data ${tier.highlighted ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                  Instant delivery · Hardware-locked
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground max-w-lg mx-auto">
          All plans include a <span className="font-semibold text-foreground">7-day money-back guarantee</span>. Secure checkout via Stripe.
        </p>
      </div>
    </section>
  );
}
