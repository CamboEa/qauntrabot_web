import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import BotsSection from "@/components/sections/BotsSection";
import { SHOW_LIVE_RESULTS_PAGE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Trading Bots — QauntraBot",
  description: "Browse all available QauntraBot Expert Advisors for MT4 and MT5.",
};

export default function BotsPage() {
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
      <BotsSection hideHeader />
    </PageWrapper>
  );
}
