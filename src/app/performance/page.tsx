import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import PerformanceSection from "@/components/sections/PerformanceSection";
import { SHOW_LIVE_RESULTS_PAGE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Live Results — QauntraBot",
  description: "Verified live trading performance across all QauntraBot strategies.",
};

export default function PerformancePage() {
  if (!SHOW_LIVE_RESULTS_PAGE) {
    redirect("/");
  }

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
