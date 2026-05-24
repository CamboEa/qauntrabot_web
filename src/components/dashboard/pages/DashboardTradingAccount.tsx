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
  Bot,
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
import DashboardBotRow from "@/components/dashboard/DashboardBotRow";

export default function DashboardTradingAccount() {
  const { profile } = useAuth();
  const {
    subscription,
    loading,
    active,
    email,
    platform,
    mtAccountNumber,
    accessibleBots,
    lockedBots,
    tradingSnapshot,
    refresh,
  } = useDashboard();
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const mtAccount = mtAccountNumber;
  const hasProfileOnly = !subscription?.mtAccountNumber && Boolean(profile?.mtAccountNumber);
  const currency = tradingSnapshot?.currency ?? "USD";
  const botList = active ? accessibleBots : lockedBots.length ? lockedBots : accessibleBots;

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
        description="Live balance from your EA, subscription status, and bots linked to this account."
        aside={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 text-xs font-data text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      <DashboardSubscriptionAlerts />

      {loading ? (
        <div className="card-surface card-pad h-48 animate-pulse" />
      ) : (
        <div className="stack-8">
          <section className="stack-4">
            <h2 className="font-display text-sm font-bold text-foreground">Account overview</h2>
            <DashboardOverviewStats showTradingAccountLink={false} />
          </section>

          {tradingSnapshot ? (
            <div className="card-surface card-pad stack-4 border-primary/15">
              <ContentHeading icon={Monitor}>Live MT5 stats</ContentHeading>
              <p className="text-xs text-muted-foreground">
                Updated {formatRelativeTime(tradingSnapshot.updatedAt)}
                {tradingSnapshot.server ? (
                  <>
                    {" "}
                    · <Server size={12} className="inline -mt-0.5" /> {tradingSnapshot.server}
                  </>
                ) : null}
              </p>
              <dl className="grid sm:grid-cols-3 gap-4">
                <div className="meta-cell">
                  <dt className="stat-label normal-case text-[0.65rem]">Balance</dt>
                  <dd className="font-data text-xl font-bold mt-1">
                    {formatMoney(tradingSnapshot.balance, currency)}
                  </dd>
                </div>
                <div className="meta-cell">
                  <dt className="stat-label normal-case text-[0.65rem]">Equity</dt>
                  <dd className="font-data text-xl font-bold mt-1">
                    {formatMoney(tradingSnapshot.equity, currency)}
                  </dd>
                </div>
                <div className="meta-cell">
                  <dt className="stat-label normal-case text-[0.65rem]">Floating P/L</dt>
                  <dd
                    className={`font-data text-xl font-bold mt-1 ${
                      tradingSnapshot.profit >= 0 ? "text-profit" : "text-loss"
                    }`}
                  >
                    {formatMoney(tradingSnapshot.profit, currency)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="card-surface card-pad stack-3 bg-secondary/30 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">No live balance yet.</strong> Attach a licensed EA on
                this MT account — it syncs balance and equity to your dashboard every few minutes.
              </p>
              {active && (
                <Link href="/dashboard/setup" className="text-primary font-medium inline-flex items-center gap-1 hover:underline w-fit">
                  Setup guide <ArrowRight size={14} />
                </Link>
              )}
            </div>
          )}

          {!mtAccount ? (
            <p className="text-sm text-muted-foreground">
              No trading account on file. Add your MT login when registering, or contact support.
            </p>
          ) : (
            <div className="card-surface card-pad stack-4 border-primary/15">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <ContentHeading icon={Monitor}>Linked trading account</ContentHeading>
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

              <div className="meta-cell stack-3 py-6 text-center sm:text-left">
                <p className="stat-label normal-case">MT account number</p>
                <p className="font-data text-2xl sm:text-3xl font-bold text-foreground tracking-tight break-all">
                  {mtAccount}
                </p>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="btn-outline-brand text-xs w-fit mx-auto sm:mx-0 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-profit" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy account number"}
                </button>
              </div>

              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="meta-cell">
                  <dt className="stat-label normal-case text-[0.65rem]">Platform</dt>
                  <dd className="font-medium mt-1">{platform}</dd>
                </div>
                {subscription ? (
                  <>
                    <div className="meta-cell">
                      <dt className="stat-label normal-case text-[0.65rem]">Plan</dt>
                      <dd className="font-medium mt-1">
                        {BILLING_PERIOD_LABEL[subscription.billingPeriod]}
                      </dd>
                    </div>
                    <div className="meta-cell">
                      <dt className="stat-label normal-case text-[0.65rem]">Valid until</dt>
                      <dd className="font-data mt-1">{formatDisplayDate(subscription.validUntil)}</dd>
                    </div>
                    <div className="meta-cell">
                      <dt className="stat-label normal-case text-[0.65rem]">Subscription</dt>
                      <dd className={`font-medium mt-1 ${active ? "text-profit" : ""}`}>
                        {active ? "Active" : subscription.status}
                      </dd>
                    </div>
                  </>
                ) : (
                  <div className="meta-cell">
                    <dt className="stat-label normal-case text-[0.65rem]">Subscription</dt>
                    <dd className="font-medium mt-1 text-muted-foreground">Not active yet</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <section className="stack-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="font-display text-sm font-bold text-foreground inline-flex items-center gap-2">
                <Bot size={16} className="text-primary" />
                {active ? "Your bots" : "Bot catalogue"}
              </h2>
              {active && (
                <Link
                  href="/dashboard/bots"
                  className="text-xs font-data text-primary inline-flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight size={12} />
                </Link>
              )}
            </div>
            <div className="dashboard-bot-list">
              {botList.slice(0, 4).map((bot) => (
                <DashboardBotRow key={bot.id} bot={bot} canDownload={active} userPlatform={platform} />
              ))}
              {botList.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">No bots in the catalogue yet.</p>
              )}
            </div>
            {!active && botList.length > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                <Link href="/pricing" className="text-primary font-medium hover:underline">
                  Subscribe
                </Link>{" "}
                to download EAs for this account.
              </p>
            )}
          </section>

          <div className="card-surface card-pad stack-4">
            <ContentHeading icon={Mail}>Login email</ContentHeading>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Portal sign-in (separate from your MT account number).
            </p>
            <p className="font-medium break-all">{email}</p>
            {profile?.createdAt && (
              <p className="text-xs font-data text-muted-foreground">
                Member since {formatDisplayDate(profile.createdAt)}
              </p>
            )}
          </div>

          <div className="card-surface card-pad stack-3 bg-secondary/30">
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
          </div>
        </div>
      )}
    </div>
  );
}
