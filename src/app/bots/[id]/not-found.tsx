import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";

export default function BotNotFound() {
  return (
    <PageWrapper>
      <div className="section-cream section-y">
        <div className="container-site stack-6 text-center max-w-md mx-auto">
          <h1 className="page-title">Bot not found</h1>
          <p className="text-muted-foreground">
            This strategy may have been removed or the link is incorrect.
          </p>
          <Link href="/bots" className="btn-primary-brand justify-center w-fit mx-auto">
            Browse all bots
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
