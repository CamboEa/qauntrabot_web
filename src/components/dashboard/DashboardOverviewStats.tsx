"use client";

import Link from "next/link";
import {
  Bot,
  Calendar,
  CandlestickChart,
  CreditCard,
  Monitor,
  Sparkles,
  Wallet,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { BILLING_PERIOD_LABEL } from "@/lib/subscription-plans";
import { formatSymbolTimeframe } from "@/lib/chart-context";
import { daysUntil, formatDisplayDate, formatRelativeTime } from "@/lib/dates";
import { formatMoney } from "@/lib/format-money";

type Props = {
  showTradingAccountLink?: boolean;
  /** Hide balance/equity (shown in hero on trading account page). */
  compact?: boolean;
};

export default function DashboardOverviewStats({
  showTradingAccountLink = true,
  compact = false,
}: Props) {
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
  const currency = tradingSnapshot?.currency ?? "USD";
  const syncedLabel = tradingSnapshot
    ? `Updated ${formatRelativeTime(tradingSnapshot.updatedAt)}`
    : null;

  if (loading) {
    const count = compact ? 4 : 6;
    return (
      <div className={`dashboard-grid-stats ${compact ? "" : "dashboard-grid-stats--wide"}`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="card-surface card-pad h-[5.5rem] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="stack-3">
      {syncedLabel && (
        <p className="text-xs font-data text-muted-foreground">{syncedLabel} · auto-sync while EA is on chart</p>
      )}
      <div className={`dashboard-grid-stats ${compact ? "" : "dashboard-grid-stats--wide"}`}>
      {!compact && (
        <>
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
        </>
      )}
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
      {tradingSnapshot?.botStatus && (
        <div className="card-surface card-pad dashboard-stat-card">
          <CandlestickChart size={16} className="text-primary shrink-0" />
          <div className="min-w-0">
            <p className="dashboard-stat-label">Attached chart</p>
            <p className="dashboard-stat-value font-data text-sm">
              {formatSymbolTimeframe(
                tradingSnapshot.botStatus.symbol,
                tradingSnapshot.botStatus.timeframe,
              )}
            </p>
          </div>
        </div>
      )}
      <div className="card-surface card-pad dashboard-stat-card">
        <Bot size={16} className="text-primary shrink-0" />
        <div>
          <p className="dashboard-stat-label">Bots</p>
          <p className="dashboard-stat-value">
            {active ? `${accessibleBots.length} ready` : `${bots.length} in catalogue`}
          </p>
        </div>
      </div>
      {showTradingAccountLink && (
        <Link
          href="/dashboard/trading-account"
          className="card-surface card-pad dashboard-stat-card hover:border-primary/30 transition-colors cursor-pointer lg:col-span-1"
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
      )}
      </div>
    </div>
  );
}
