import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type PageHeroProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default function PageHero({
  eyebrow,
  title,
  accent,
  description,
  cta,
  secondaryCta,
}: PageHeroProps) {
  const hasActions = Boolean(cta || secondaryCta);

  return (
    <header className="bg-background border-b border-border">
      <div className="container-site page-header-y">
        <div
          className={
            hasActions
              ? "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8"
              : "max-w-2xl stack-3"
          }
        >
          <div className={hasActions ? "max-w-2xl stack-3" : undefined}>
            {eyebrow && <span className="eyebrow w-fit">{eyebrow}</span>}
            <h1 className="page-title">
              {title}
              {accent && (
                <>
                  {" "}
                  <span className="page-title-accent">{accent}</span>
                </>
              )}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
          </div>

          {hasActions && (
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {cta && (
                <Link href={cta.href} className="btn-primary-brand justify-center">
                  {cta.label} <ArrowRight size={16} />
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="btn-outline-brand justify-center">
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
