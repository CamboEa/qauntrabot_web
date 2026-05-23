import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type PageCtaBandProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export default function PageCtaBand({
  title,
  description,
  icon,
  primary,
  secondary,
}: PageCtaBandProps) {
  return (
    <section className="section-cream border-y border-border section-y-sm">
      <div className="container-site">
        <div className="card-surface flex flex-col md:flex-row items-center justify-between gap-6 card-pad md:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {icon && (
              <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div className="stack-2 items-center sm:items-start">
              <p className="font-display text-lg md:text-xl font-bold text-foreground">{title}</p>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {(primary || secondary) && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {secondary && (
                <Link href={secondary.href} className="btn-outline-brand justify-center">
                  {secondary.label}
                </Link>
              )}
              {primary && (
                <Link href={primary.href} className="btn-primary-brand justify-center">
                  {primary.label} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
