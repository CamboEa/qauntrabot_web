import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import FeaturesSection from "@/components/sections/FeaturesSection";

export const metadata: Metadata = {
  title: "Features — QauntraBot",
  description: "Institutional-grade EA features: risk management, multi-asset, analytics, and secure licensing.",
};

export default function FeaturesPage() {
  return (
    <PageWrapper
      hero={{
        eyebrow: "Technical Capabilities",
        title: "Built for",
        accent: "professionals.",
        description: "Eight core modules architected for reliability, configurability, and institutional-grade risk discipline.",
        cta: { label: "Get access", href: "/register" },
      }}
    >
      <FeaturesSection hideHeader />
    </PageWrapper>
  );
}
