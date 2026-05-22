import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import FAQSection from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "FAQs — QauntraBot",
  description: "Answers about brokers, licensing, VPS setup, performance data, and support.",
};

export default function FAQsPage() {
  return (
    <PageWrapper
      hero={{
        eyebrow: "Support",
        title: "Frequently asked",
        accent: "questions.",
        description: "Everything you need to know before deploying QauntraBot on your trading account.",
        cta: { label: "Contact support", href: "/register" },
      }}
    >
      <FAQSection hideHeader />
    </PageWrapper>
  );
}
