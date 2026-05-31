import PageWrapper from "@/components/layout/PageWrapper";
import { FaqPageJsonLd } from "@/components/seo/JsonLd";
import FAQSection from "@/components/sections/FAQSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "FAQs",
  description: "Answers about brokers, licensing, VPS setup, performance data, and support.",
  path: "/faqs",
});

export default function FAQsPage() {
  return (
    <>
      <FaqPageJsonLd />
    <PageWrapper
      authNav={false}
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
    </>
  );
}
