"use client";

import Link from "next/link";
import { Calendar, CreditCard, Monitor, Sparkles, ArrowRight } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { BILLING_PERIOD_LABEL } from "@/lib/subscription-plans";
import { daysUntil, formatDisplayDate } from "@/lib/dates";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import DashboardSubscriptionAlerts from "@/components/dashboard/DashboardSubscriptionAlerts";

export default function DashboardOverview() {
  const { subscription, loading, active, email, platform, mtAccountNumber } = useDashboard();
  const expiryDaysVal = daysUntil(subscription?.validUntil);

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="Overview"
        title="Welcome back"
        description={<p className="font-data truncate max-w-lg">{email}</p>}
      />

      {loading ? (
        <div className="dashboard-grid-stats">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card-surface card-pad h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="dashboard-grid-stats">
          <div className="card-surface card-pad dashboard-stat-card">
            <CreditCard size={16} className="text-primary shrink-0" />
            <div>
              <p className="dashboard-stat-label">Subscription</p>
              <p className={`dashboard-stat-value ${active ? "text-profit" : ""}`}>
                {subscription ? (active ? "Active" : subscription.status) : "None"}
              </p>
            </div>
          </div>
          <div className="card-surface card-pad dashboard-stat-card">
            <Sparkles size={16} className="text-primary shrink-0" />
            <div>
              <p className="dashboard-stat-label">Plan</p>
              <p className="dashboard-stat-value">
                {subscription ? BILLING_PERIOD_LABEL[subscription.billingPeriod] : "—"}
              </p>
            </div>
          </div>
          <div className="card-surface card-pad dashboard-stat-card">
            <Calendar size={16} className="text-primary shrink-0" />
            <div>
              <p className="dashboard-stat-label">Valid until</p>
              <p className="dashboard-stat-value text-sm">
                {subscription ? formatDisplayDate(subscription.validUntil) : "—"}
              </p>
              {active && expiryDaysVal != null && expiryDaysVal >= 0 && (
                <p className="text-[0.65rem] font-data text-muted-foreground mt-1">
                  {expiryDaysVal === 0 ? "Expires today" : `${expiryDaysVal} days left`}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/dashboard/trading-account"
            className="card-surface card-pad dashboard-stat-card hover:border-primary/30 transition-colors cursor-pointer"
          >
            <Monitor size={16} className="text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="dashboard-stat-label">Trading account</p>
                  <p className="dashboard-stat-value font-data text-sm break-all">
                    {mtAccountNumber || "Not linked"}
                  </p>
              <p className="text-[0.65rem] font-data text-primary mt-1 inline-flex items-center gap-1">
                View details <ArrowRight size={12} />
              </p>
            </div>
          </Link>
        </div>
      )}

      <DashboardSubscriptionAlerts />

      {!loading && (
        <div className="dashboard-quick-links grid sm:grid-cols-2 gap-4">
          <Link href="/dashboard/trading-account" className="card-surface card-pad stack-3 hover:border-primary/25 transition-colors">
            <p className="font-display font-bold text-foreground">Trading account</p>
            <p className="text-sm text-muted-foreground">
              MT number, platform ({platform}), and how your license is linked.
            </p>
          </Link>
          <Link
            href={active ? "/dashboard/bots" : "/pricing"}
            className="card-surface card-pad stack-3 hover:border-primary/25 transition-colors"
          >
            <p className="font-display font-bold text-foreground">
              {active ? "My bots" : "Get access"}
            </p>
            <p className="text-sm text-muted-foreground">
              {active ? "Download EAs and view your full catalogue." : "Subscribe to unlock all Expert Advisors."}
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
