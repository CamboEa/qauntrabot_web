import { toDate } from "./dates";

/** Subscription billing period — one plan, all bots while active. */
export type BillingPeriod = "monthly" | "semiannual" | "yearly";

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export const BILLING_PERIOD_LABEL: Record<BillingPeriod, string> = {
  monthly: "Monthly",
  semiannual: "6 months",
  yearly: "Yearly",
};

/** Monthly baseline: $30/mo — longer plans discount vs paying month-to-month */
export const MONTHLY_BASE_PRICE = 30;

/** Display pricing (USD). Checkout integration should read these same values. */
export const SUBSCRIPTION_PLANS: Record<
  BillingPeriod,
  {
    id: BillingPeriod;
    label: string;
    priceTotal: number;
    pricePerMonth: number;
    periodLabel: string;
    description: string;
    savingsNote?: string;
    highlighted?: boolean;
  }
> = {
  monthly: {
    id: "monthly",
    label: "Monthly",
    priceTotal: 30,
    pricePerMonth: 30,
    periodLabel: "/ month",
    description:
      "Flexible month-to-month access. Ideal for testing strategies on demo or live before committing longer.",
  },
  semiannual: {
    id: "semiannual",
    label: "6 months",
    // $30 × 6 = $180 → 20% off = $144 ($24/mo)
    priceTotal: 144,
    pricePerMonth: 24,
    periodLabel: "every 6 months",
    description:
      "Six months of full catalogue access at a lower effective rate. A solid choice for consistent live trading.",
    savingsNote: "Save $36 vs monthly ($180)",
  },
  yearly: {
    id: "yearly",
    label: "Yearly",
    // $30 × 12 = $360 → pay for 8 months = $240 ($20/mo, 4 months free)
    priceTotal: 240,
    pricePerMonth: 20,
    periodLabel: "/ year",
    description:
      "Lowest cost per month with a full year of access. Best for traders running EAs long term on funded accounts.",
    savingsNote: "Save $120 vs monthly ($360)",
    highlighted: true,
  },
};

import type { SubscriptionPlanDoc } from "./firestore";

export const BILLING_ORDER: BillingPeriod[] = ["monthly", "semiannual", "yearly"];

/** Fallback when Firestore `plans` collection is empty */
export function getDefaultPlans(): SubscriptionPlanDoc[] {
  return BILLING_ORDER.map((id) => {
    const p = SUBSCRIPTION_PLANS[id];
    return {
      id,
      label: p.label,
      priceTotal: p.priceTotal,
      pricePerMonth: p.pricePerMonth,
      periodLabel: p.periodLabel,
      description: p.description,
      savingsNote: p.savingsNote ?? null,
      highlighted: p.highlighted ?? false,
      sortOrder: BILLING_ORDER.indexOf(id) + 1,
    };
  });
}

export const ALL_ACCESS_FEATURES = [
  "Access to every bot in the catalogue",
  "MT4 & MT5 Expert Advisors",
  "Hardware-locked license for your account",
  "EA downloads while subscription is active",
  "Email support",
  "Strategy & build updates",
  "7-day money-back guarantee",
];

const PERIOD_MONTHS: Record<BillingPeriod, number> = {
  monthly: 1,
  semiannual: 6,
  yearly: 12,
};

/** @deprecated Legacy tiers — mapped when reading old Firestore docs */
export type LegacyPlanTier = "starter" | "pro" | "institutional";

export function isBillingPeriod(value: string): value is BillingPeriod {
  return value === "monthly" || value === "semiannual" || value === "yearly";
}

export function normalizeBillingPeriod(
  billingPeriod?: string,
  legacyPlan?: string
): BillingPeriod {
  if (billingPeriod && isBillingPeriod(billingPeriod)) return billingPeriod;
  if (legacyPlan === "starter") return "monthly";
  if (legacyPlan === "pro") return "semiannual";
  if (legacyPlan === "institutional") return "yearly";
  return "monthly";
}

export function computeValidUntil(
  billingPeriod: BillingPeriod,
  from: Date = new Date()
): Date {
  const end = new Date(from);
  end.setMonth(end.getMonth() + PERIOD_MONTHS[billingPeriod]);
  return end;
}

export function isSubscriptionActive(
  validUntil: Date | string | null | undefined,
  status?: SubscriptionStatus
): boolean {
  if (status === "cancelled" || status === "expired") return false;
  const end = toDate(validUntil);
  if (!end) return true;
  return end.getTime() > Date.now();
}
