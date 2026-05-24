"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSubscription } from "@/lib/firestore";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import PageSection from "@/components/shared/PageSection";
import type { SubscriptionPlanDoc } from "@/lib/firestore";
import {
  ALL_ACCESS_FEATURES,
  BILLING_PERIOD_LABEL,
  getDefaultPlans,
  type BillingPeriod,
  isSubscriptionActive,
} from "@/lib/subscription-plans";

export default function PricingSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlanDoc[]>(getDefaultPlans());
  const [loading, setLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState<BillingPeriod | null>(null);

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((data: SubscriptionPlanDoc[]) => {
        if (Array.isArray(data) && data.length > 0) setPlans(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!user) {
      setCurrentPeriod(null);
      return;
    }

    getUserSubscription(user.uid)
      .then((sub) => {
        if (sub && isSubscriptionActive(sub.validUntil, sub.status)) {
          setCurrentPeriod(sub.billingPeriod);
        } else {
          setCurrentPeriod(null);
        }
      })
      .catch(() => setCurrentPeriod(null));
  }, [user]);

  return (
    <PageSection id="pricing" underHero={hideHeader} standalone={!hideHeader}>
      {!hideHeader && (
        <div className="headline-gap flex justify-center">
          <SectionHeader
            align="center"
            eyebrow="All-access subscription"
            title="One plan."
            accent="Every bot."
            description="Same full catalogue access — choose monthly, 6-month, or yearly billing."
          />
        </div>
      )}

      <div
        className={`grid md:grid-cols-3 grid-site items-stretch max-w-5xl mx-auto w-full transition-opacity duration-300 ${
          loading ? "opacity-60" : "opacity-100"
        }`}
      >
        {plans.map((plan) => {
          const period = plan.id as BillingPeriod;
          const featured = Boolean(plan.highlighted);
          const isCurrentPlan = currentPeriod === period;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl h-full ${
                featured
                  ? "pricing-featured bg-primary text-primary-foreground shadow-[0_20px_48px_rgba(11,31,61,0.18)] md:-translate-y-1"
                  : "card-surface"
              }`}
            >
              {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-card text-primary text-xs font-bold px-3 py-1 rounded-full border border-border font-data uppercase">
                    Best value
                  </span>
                </div>
              )}

              <div className={`card-pad flex flex-col flex-1 stack-4 ${featured ? "pt-8" : ""}`}>
                <div className="stack-2">
                  <h3 className="font-display text-xl font-bold">
                    {plan.label || BILLING_PERIOD_LABEL[period]}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed min-h-[3.25rem] ${
                      featured ? "text-primary-foreground/75" : "text-muted-foreground"
                    }`}
                  >
                    {plan.description}
                  </p>
                  {plan.savingsNote && (
                    <p className="text-xs font-data font-semibold text-profit">{plan.savingsNote}</p>
                  )}
                </div>

                <div
                  className={`pb-4 border-b ${
                    featured ? "border-primary-foreground/15" : "border-border"
                  }`}
                >
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                      ${plan.priceTotal}
                    </span>
                    <span
                      className={`text-sm font-data ${
                        featured ? "text-primary-foreground/60" : "text-muted-foreground"
                      }`}
                    >
                      {plan.periodLabel}
                    </span>
                  </div>
                  {period !== "monthly" && (
                    <p
                      className={`text-xs font-data mt-1 ${
                        featured ? "text-primary-foreground/55" : "text-muted-foreground"
                      }`}
                    >
                      ≈ ${plan.pricePerMonth}/mo
                    </p>
                  )}
                </div>

                {isCurrentPlan ? (
                  <div
                    className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-full mt-auto ${
                      featured
                        ? "bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30"
                        : "border border-primary/25 text-primary bg-primary/5"
                    }`}
                  >
                    Current
                  </div>
                ) : (
                  <Link
                    href={`/register?plan=${period}`}
                    className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-full cursor-pointer mt-auto ${
                      featured
                        ? "bg-primary-foreground text-primary"
                        : "btn-primary-brand w-full"
                    }`}
                  >
                    Subscribe
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>

              <p
                className={`text-xs text-center pb-5 font-data ${
                  featured ? "text-primary-foreground/50" : "text-muted-foreground"
                }`}
              >
                7-day money-back
              </p>
            </div>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto w-full card-surface card-pad stack-3">
        <p className="stat-label text-center">Everything included on every plan</p>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {ALL_ACCESS_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check size={15} className="shrink-0 mt-0.5 text-primary" />
              <span className="text-sm text-muted-foreground leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-center text-sm text-muted-foreground max-w-lg mx-auto">
        Secure checkout via Stripe (coming soon). Cancel anytime.
      </p>
    </PageSection>
  );
}
