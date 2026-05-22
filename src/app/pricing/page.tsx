import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import PricingSection from "@/components/sections/PricingSection";

export const metadata: Metadata = {
  title: "Pricing — QauntraBot",
  description: "Transparent pricing for QauntraBot Expert Advisors. Instant delivery, hardware-locked licenses.",
};

export default function PricingPage() {
  return (
    <PageWrapper
      hero={{
        eyebrow: "Instant Delivery",
        title: "Simple",
        accent: "pricing.",
        description: "No hidden fees or performance commissions. Choose monthly, annual, or lifetime access.",
        cta: { label: "Get access", href: "/register" },
      }}
    >
      <PricingSection hideHeader />
    </PageWrapper>
  );
}
