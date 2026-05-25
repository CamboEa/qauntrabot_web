import PageWrapper from "@/components/layout/PageWrapper";
import PricingSection from "@/components/sections/PricingSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Pricing",
  description:
    "Transparent pricing for QauntraBot Expert Advisors. Instant delivery, hardware-locked licenses.",
  path: "/pricing",
});

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
