import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import PerformanceSection from "@/components/sections/PerformanceSection";

export const metadata: Metadata = {
  title: "Live Results — QauntraBot",
  description: "Verified live trading performance across all QauntraBot strategies.",
};

export default function PerformancePage() {
  return (
    <PageWrapper
      hero={{
        eyebrow: "Verified Data",
        title: "Live",
        accent: "results.",
        description: "Real account statistics — independently verifiable on MyFxBook and FXBlue. No simulated projections.",
        cta: { label: "Browse bots", href: "/bots" },
      }}
    >
      <PerformanceSection hideHeader />
    </PageWrapper>
  );
}
