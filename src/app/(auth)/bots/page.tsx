import PageWrapper from "@/components/layout/PageWrapper";
import BotsSection from "@/components/sections/BotsSection";
import { getCachedBots } from "@/lib/cached-bots";
import { createPageMetadata } from "@/lib/seo";
import { SHOW_LIVE_RESULTS_PAGE } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: "Trading Bots",
  description: "Browse all available QauntraBot Expert Advisors for MT4 and MT5.",
  path: "/bots",
});

export default async function BotsPage() {
  const initialBots = await getCachedBots();

  return (
    <PageWrapper
      hero={{
        eyebrow: "Strategy Catalogue",
        title: "Trading",
        accent: "bots.",
        description: "Expert Advisor modules for gold, forex, and more — deployable on MT4 or MT5 with isolated risk parameters.",
        cta: { label: "View pricing", href: "/pricing" },
        ...(SHOW_LIVE_RESULTS_PAGE
          ? { secondaryCta: { label: "Live results", href: "/performance" } }
          : {}),
      }}
    >
      <BotsSection hideHeader initialBots={initialBots} />
    </PageWrapper>
  );
}
