"use client";

import Link from "next/link";
import {
  Monitor,
  ShieldCheck,
  Key,
  Mail,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Server,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { BILLING_PERIOD_LABEL } from "@/lib/subscription-plans";
import { formatDisplayDate, formatRelativeTime } from "@/lib/dates";
import { formatMoney } from "@/lib/format-money";
import ContentHeading from "@/components/shared/ContentHeading";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import DashboardSubscriptionAlerts from "@/components/dashboard/DashboardSubscriptionAlerts";
import DashboardOverviewStats from "@/components/dashboard/DashboardOverviewStats";
import DashboardBlock from "@/components/dashboard/DashboardBlock";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardMetaItem from "@/components/dashboard/DashboardMetaItem";

export default function DashboardTradingAccount() {
  const { profile } = useAuth();
  const {
    subscription,
    loading,
    active,
    email,
    platform,
    mtAccountNumber,
    tradingSnapshot,
    refresh,
  } = useDashboard();
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const mtAccount = mtAccountNumber;
  const hasProfileOnly = !subscription?.mtAccountNumber && Boolean(profile?.mtAccountNumber);
  const currency = tradingSnapshot?.currency ?? "USD";

  const handleCopyAccount = async () => {
    if (!mtAccount) return;
    try {
      await navigator.clipboard.writeText(mtAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="Trading account"
        title="Your MT account"
        description="Live balance from your EA and subscription linked to this account."
        aside={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="btn-outline-brand text-xs !py-2 !px-3 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      <DashboardSubscriptionAlerts />

      {loading ? (
        <div className="dashboard-skeleton" />
      ) : (
        <>
          <DashboardBlock
            title={
              <>
                <Monitor size={16} className="text-primary" />
                Live account
              </>
            }
            action={
              tradingSnapshot ? (
                <span className="text-xs font-data text-muted-foreground inline-flex items-center gap-1">
                  <Server size={12} />
                  {formatRelativeTime(tradingSnapshot.updatedAt)}
                </span>
              ) : null
            }
          >
            {tradingSnapshot ? (
              <div className="dashboard-hero-stats">
                <div className="dashboard-hero-stat">
                  <p className="stat-label normal-case">Balance</p>
                  <p className="dashboard-hero-value">{formatMoney(tradingSnapshot.balance, currency)}</p>
                </div>
                <div className="dashboard-hero-stat">
                  <p className="stat-label normal-case">Equity</p>
                  <p className="dashboard-hero-value">{formatMoney(tradingSnapshot.equity, currency)}</p>
                </div>
                <div className="dashboard-hero-stat">
                  <p className="stat-label normal-case">Floating P/L</p>
                  <p
                    className={`dashboard-hero-value ${
                      tradingSnapshot.profit >= 0 ? "text-profit" : "text-loss"
                    }`}
                  >
                    {formatMoney(tradingSnapshot.profit, currency)}
                  </p>
                </div>
              </div>
            ) : (
              <DashboardCard variant="soft">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">No live balance yet.</strong> Attach a licensed EA on
                  this MT account — it syncs every few minutes while the EA is running.
                </p>
                {active && (
                  <Link
                    href="/dashboard/setup"
                    className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline w-fit"
                  >
                    Setup guide <ArrowRight size={14} />
                  </Link>
                )}
              </DashboardCard>
            )}
            {tradingSnapshot?.server && (
              <p className="text-xs font-data text-muted-foreground -mt-1">
                Broker server: {tradingSnapshot.server}
              </p>
            )}
          </DashboardBlock>

          <DashboardBlock title="Subscription & access">
            <DashboardOverviewStats showTradingAccountLink={false} compact />
          </DashboardBlock>

          {mtAccount ? (
            <DashboardCard variant="accent">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <ContentHeading icon={Monitor} as="h3">
                  Linked trading account
                </ContentHeading>
                <div className="flex flex-wrap gap-2">
                  {hasProfileOnly && (
                    <span className="inline-flex items-center text-xs font-data text-muted-foreground px-2 py-1 rounded-full bg-secondary border border-border">
                      Registered at sign-up
                    </span>
                  )}
                  {active && subscription && (
                    <span className="inline-flex items-center gap-1 text-xs font-data text-profit px-2 py-1 rounded-full bg-profit/10 border border-profit/20">
                      <ShieldCheck size={12} />
                      Licensed
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center sm:text-left py-2">
                <p className="stat-label normal-case mb-2">MT account number</p>
                <p className="font-data text-2xl sm:text-3xl font-bold text-foreground tracking-tight break-all">
                  {mtAccount}
                </p>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="btn-outline-brand text-xs w-fit mx-auto sm:mx-0 mt-4 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-profit" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy account number"}
                </button>
              </div>

              <div className="dashboard-meta-grid">
                <DashboardMetaItem label="Platform" value={platform} />
                {subscription ? (
                  <>
                    <DashboardMetaItem
                      label="Plan"
                      value={BILLING_PERIOD_LABEL[subscription.billingPeriod]}
                    />
                    <DashboardMetaItem
                      label="Valid until"
                      value={formatDisplayDate(subscription.validUntil)}
                      mono
                    />
                    <DashboardMetaItem
                      label="Subscription"
                      value={active ? "Active" : subscription.status}
                      valueClassName={active ? "text-profit" : ""}
                    />
                  </>
                ) : (
                  <DashboardMetaItem label="Subscription" value="Not active yet" />
                )}
              </div>
            </DashboardCard>
          ) : (
            <p className="text-sm text-muted-foreground">
              No trading account on file. Add your MT login when registering, or contact support.
            </p>
          )}

          <div className="dashboard-grid-2">
            <DashboardCard>
              <ContentHeading icon={Mail} as="h3">
                Login email
              </ContentHeading>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Portal sign-in (separate from your MT account number).
              </p>
              <p className="font-medium break-all text-sm">{email}</p>
              {profile?.createdAt && (
                <p className="text-xs font-data text-muted-foreground">
                  Member since {formatDisplayDate(profile.createdAt)}
                </p>
              )}
            </DashboardCard>

            <DashboardCard variant="soft">
              <p className="text-sm text-foreground/90 leading-relaxed">
                <strong>One account per license.</strong> EAs verify account{" "}
                <span className="font-data">{mtAccount || "—"}</span> and sync balance to this page.
              </p>
              {active && (
                <Link
                  href="/dashboard/license"
                  className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline w-fit"
                >
                  <Key size={14} />
                  View license key
                  <ArrowRight size={14} />
                </Link>
              )}
            </DashboardCard>
          </div>
        </>
      )}
    </div>
  );
}
