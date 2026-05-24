"use client";

import Link from "next/link";
import { Bot, Calendar, CreditCard, Monitor, Sparkles, Wallet, TrendingUp, ArrowRight } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { BILLING_PERIOD_LABEL } from "@/lib/subscription-plans";
import { daysUntil, formatDisplayDate } from "@/lib/dates";
import { formatMoney } from "@/lib/format-money";

type Props = {
  showTradingAccountLink?: boolean;
};

export default function DashboardOverviewStats({ showTradingAccountLink = true }: Props) {
  const {
    subscription,
    loading,
    active,
    mtAccountNumber,
    accessibleBots,
    bots,
    tradingSnapshot,
  } = useDashboard();
  const expiryDaysVal = daysUntil(subscription?.validUntil);

  if (loading) {
    return (
      <div className="dashboard-grid-stats">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card-surface card-pad h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  const currency = tradingSnapshot?.currency ?? "USD";

  return (
    <div className="dashboard-grid-stats">
      <div className="card-surface card-pad dashboard-stat-card">
        <Wallet size={16} className="text-primary shrink-0" />
        <div className="min-w-0">
          <p className="dashboard-stat-label">Balance</p>
          <p className="dashboard-stat-value font-data">
            {tradingSnapshot ? formatMoney(tradingSnapshot.balance, currency) : "—"}
          </p>
        </div>
      </div>
      <div className="card-surface card-pad dashboard-stat-card">
        <TrendingUp size={16} className="text-primary shrink-0" />
        <div className="min-w-0">
          <p className="dashboard-stat-label">Equity</p>
          <p className="dashboard-stat-value font-data">
            {tradingSnapshot ? formatMoney(tradingSnapshot.equity, currency) : "—"}
          </p>
        </div>
      </div>
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
      <div className="card-surface card-pad dashboard-stat-card">
        <Bot size={16} className="text-primary shrink-0" />
        <div>
          <p className="dashboard-stat-label">Bots</p>
          <p className="dashboard-stat-value">
            {active ? `${accessibleBots.length} ready` : `${bots.length} in catalogue`}
          </p>
        </div>
      </div>
      {showTradingAccountLink ? (
        <Link
          href="/dashboard/trading-account"
          className="card-surface card-pad dashboard-stat-card hover:border-primary/30 transition-colors cursor-pointer sm:col-span-2"
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
      ) : null}
    </div>
  );
}
