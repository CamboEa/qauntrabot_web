import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import SectionHeader from "@/components/shared/SectionHeader";
import { ArrowRight, Bot, TrendingUp, Zap, Shield, HelpCircle, DollarSign } from "lucide-react";

const SITE_SECTIONS = [
  {
    href: "/bots",
    icon: Bot,
    label: "Trading Bots",
    tag: "Strategy Catalogue",
    description: "Browse all 6 available Expert Advisors. 3 live, 1 in beta, 2 coming soon.",
    stat: "6 Bots",
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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />

        <section className="section-alt section-y">
          <div className="container-site">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8 headline-gap">
              <SectionHeader
                eyebrow="Explore the Platform"
                title="Everything you need."
                accent="All in one place."
                className="max-w-xl"
              />
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed lg:text-right lg:max-w-xs">
                Navigate strategies, results, pricing, and support.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-site">
              {SITE_SECTIONS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="card-surface-hover group flex flex-col card-pad cursor-pointer h-full"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl border border-border bg-secondary flex items-center justify-center group-hover:border-primary/20 transition-colors">
                      <s.icon size={20} className="text-primary" strokeWidth={1.75} />
                    </div>
                    <span className={`text-xs font-data font-semibold ${s.statColor ?? "text-muted-foreground"}`}>
                      {s.stat}
                    </span>
                  </div>

                  <span className="text-[0.6875rem] text-muted-foreground font-data uppercase tracking-wider mb-2">
                    {s.tag}
                  </span>

                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{s.label}</h3>

                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.description}</p>

                  <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 text-sm font-semibold text-primary">
                    Explore
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-cream border-y border-border section-y-sm">
          <div className="container-site">
            <div className="card-surface flex flex-col md:flex-row items-center justify-between gap-6 card-pad md:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                  <Image src="/logo/logo.png" alt="" width={32} height={32} className="object-contain" aria-hidden />
                </div>
                <div className="stack-2 items-center sm:items-start">
                  <p className="font-display text-lg md:text-xl font-bold text-foreground">Ready to automate?</p>
                  <p className="text-sm text-muted-foreground">7-day money-back · No performance fees</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Link href="/pricing" className="btn-outline-brand justify-center">
                  View Plans
                </Link>
                <Link href="/register" className="btn-primary-brand justify-center">
                  Get Access <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
