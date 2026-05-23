import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import PageSection from "@/components/shared/PageSection";

export default function BotNotFound() {
  return (
    <PageWrapper
      hero={{
        eyebrow: "Strategy Catalogue",
        title: "Bot",
        accent: "not found.",
        description: "This strategy may have been removed or the link is incorrect.",
        cta: { label: "Browse all bots", href: "/bots" },
      }}
    >
      <PageSection underHero narrow>
        <div className="card-surface card-pad text-center stack-4">
          <p className="text-sm text-muted-foreground">
            Check the URL or return to the catalogue to find an active Expert Advisor.
          </p>
          <Link href="/bots" className="btn-primary-brand justify-center w-fit mx-auto">
            View trading bots
          </Link>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
