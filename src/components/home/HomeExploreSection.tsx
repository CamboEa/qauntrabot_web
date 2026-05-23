"use client";

import Link from "next/link";
import { ArrowRight, Bot, TrendingUp, Zap, Shield, HelpCircle, DollarSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import PageSection from "@/components/shared/PageSection";
import IconTile from "@/components/shared/IconTile";
import ScrollReveal from "@/components/shared/ScrollReveal";

type SiteSection = {
  href: string;
  icon: LucideIcon;
  label: string;
  tag: string;
  description: string;
  stat: string;
  statColor?: string;
};

const SITE_SECTIONS: SiteSection[] = [
  {
    href: "/bots",
    icon: Bot,
    label: "Trading Bots",
    tag: "Strategy Catalogue",
    description: "Browse live and upcoming Expert Advisors with verified performance data.",
    stat: "Catalogue",
  },
  {
    href: "/performance",
    icon: TrendingUp,
    label: "Live Results",
    tag: "Verified Data",
    description: "Real account performance — independently verifiable on MyFxBook.",
    stat: "+312.6%",
    statColor: "text-profit",
  },
  {
    href: "/features",
    icon: Zap,
    label: "Features",
    tag: "Technical",
    description: "8 institutional-grade modules: risk, multi-asset, analytics, and more.",
    stat: "8 Modules",
  },
  {
    href: "/pricing",
    icon: DollarSign,
    label: "Pricing",
    tag: "Instant Access",
    description: "From $59/mo. No performance commissions. Hardware-locked EA delivered instantly.",
    stat: "From $59",
    statColor: "text-profit",
  },
  {
    href: "/faqs",
    icon: HelpCircle,
    label: "FAQs",
    tag: "Support",
    description: "Broker compatibility, VPS setup, licenses, drawdown, and more.",
    stat: "8 Topics",
  },
  {
    href: "/register",
    icon: Shield,
    label: "Get Access",
    tag: "Secure Portal",
    description: "Create your account and receive your EA within minutes of purchase.",
    stat: "< 15 min",
    statColor: "text-profit",
  },
];

export default function HomeExploreSection() {
  return (
    <PageSection variant="alt" standalone>
      <ScrollReveal variant="up" className="headline-gap">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
          <SectionHeader
            title="Everything you need."
            accent="All in one place."
            className="max-w-xl"
          />
        </div>
      </ScrollReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-site">
        {SITE_SECTIONS.map((s, i) => (
          <ScrollReveal key={s.href} variant="up" delay={80 + i * 70} className="h-full">
            <Link href={s.href} className="card-surface-hover group flex flex-col card-pad h-full">
              <div className="flex items-start justify-between gap-4 mb-4">
                <IconTile icon={s.icon} />
                <span
                  className={`text-xs font-data font-semibold ${s.statColor ?? "text-muted-foreground"}`}
                >
                  {s.stat}
                </span>
              </div>

              <span className="stat-label mb-2">{s.tag}</span>

              <h3 className="font-display text-lg font-bold text-foreground mb-2">{s.label}</h3>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.description}</p>

              <div className="card-link-footer">
                Explore
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </PageSection>
  );
}
