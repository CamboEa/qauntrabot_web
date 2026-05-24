"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import DashboardSubscriptionAlerts from "@/components/dashboard/DashboardSubscriptionAlerts";
import DashboardOverviewStats from "@/components/dashboard/DashboardOverviewStats";
import DashboardBlock from "@/components/dashboard/DashboardBlock";

export default function DashboardOverview() {
  const { loading, active, email, platform } = useDashboard();

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="Overview"
        title="Welcome back"
        description={<p className="font-data truncate max-w-lg">{email}</p>}
      />

      <DashboardBlock title="At a glance">
        <DashboardOverviewStats />
      </DashboardBlock>

      <DashboardSubscriptionAlerts />

      {!loading && (
        <div className="dashboard-quick-links">
          <Link
            href="/dashboard/trading-account"
            className="dashboard-card hover:border-primary/25 transition-colors"
          >
            <p className="font-display font-bold text-foreground">Trading account</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Balance, equity, MT number, platform ({platform}), and your bots.
            </p>
          </Link>
          <Link
            href={active ? "/dashboard/bots" : "/pricing"}
            className="dashboard-card hover:border-primary/25 transition-colors"
          >
            <p className="font-display font-bold text-foreground">
              {active ? "My bots" : "Get access"}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {active ? "Download EAs and view your full catalogue." : "Subscribe to unlock all Expert Advisors."}
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
