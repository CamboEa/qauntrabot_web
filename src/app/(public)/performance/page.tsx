import { redirect } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import PerformanceSection from "@/components/sections/PerformanceSection";
import { createPageMetadata } from "@/lib/seo";
import { SHOW_LIVE_RESULTS_PAGE } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: "Live Results",
  description: "Verified live trading performance across all QauntraBot strategies.",
  path: "/performance",
});

export default function PerformancePage() {
  if (!SHOW_LIVE_RESULTS_PAGE) {
    redirect("/");
  }

  return (
    <PageWrapper
      authNav={false}
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
