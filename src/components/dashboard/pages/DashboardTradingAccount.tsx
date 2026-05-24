"use client";

import Link from "next/link";
import { Monitor, ShieldCheck, Key, Mail, ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { BILLING_PERIOD_LABEL } from "@/lib/subscription-plans";
import { formatDisplayDate } from "@/lib/dates";
import ContentHeading from "@/components/shared/ContentHeading";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import DashboardSubscriptionAlerts from "@/components/dashboard/DashboardSubscriptionAlerts";

export default function DashboardTradingAccount() {
  const { profile } = useAuth();
  const { subscription, loading, active, email, platform } = useDashboard();
  const [copied, setCopied] = useState(false);

  const mtAccount = subscription?.mtAccountNumber?.trim() || "";

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

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="Trading account"
        title="Your MT account"
        description="The MetaTrader account registered with QauntraBot. Your license and EAs are locked to this account."
      />

      <DashboardSubscriptionAlerts />

      {loading ? (
        <div className="card-surface card-pad h-48 animate-pulse" />
      ) : !subscription ? (
        <p className="text-sm text-muted-foreground">
          Subscribe first — we&apos;ll link your MT account when your subscription is activated.
        </p>
      ) : (
        <div className="stack-6">
          <div className="card-surface card-pad stack-4 border-primary/15">
            <div className="flex items-start justify-between gap-4">
              <ContentHeading icon={Monitor}>Linked trading account</ContentHeading>
              {active && (
                <span className="inline-flex items-center gap-1 text-xs font-data text-profit px-2 py-1 rounded-full bg-profit/10 border border-profit/20">
                  <ShieldCheck size={12} />
                  Active
                </span>
              )}
            </div>

            <div className="meta-cell stack-3 py-6 text-center sm:text-left">
              <p className="stat-label normal-case">MT account number</p>
              {mtAccount ? (
                <p className="font-data text-2xl sm:text-3xl font-bold text-foreground tracking-tight break-all">
                  {mtAccount}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No account number on file — contact support to link your MT login.
                </p>
              )}
              {mtAccount && (
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="btn-outline-brand text-xs w-fit mx-auto sm:mx-0 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-profit" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy account number"}
                </button>
              )}
            </div>

            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="meta-cell">
                <dt className="stat-label normal-case text-[0.65rem]">Platform</dt>
                <dd className="font-medium mt-1">{platform}</dd>
              </div>
              <div className="meta-cell">
                <dt className="stat-label normal-case text-[0.65rem]">Plan</dt>
                <dd className="font-medium mt-1">{BILLING_PERIOD_LABEL[subscription.billingPeriod]}</dd>
              </div>
              <div className="meta-cell">
                <dt className="stat-label normal-case text-[0.65rem]">Valid until</dt>
                <dd className="font-data mt-1">{formatDisplayDate(subscription.validUntil)}</dd>
              </div>
              <div className="meta-cell">
                <dt className="stat-label normal-case text-[0.65rem]">Status</dt>
                <dd className={`font-medium mt-1 ${active ? "text-profit" : ""}`}>
                  {active ? "Active" : subscription.status}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card-surface card-pad stack-4">
            <ContentHeading icon={Mail}>Login email</ContentHeading>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your QauntraBot portal email (for signing in). This is separate from your MT account number
              above.
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
              <strong>One account per license.</strong> Expert Advisors verify your MT account number against
              your subscription. Do not share your license key — it only works on account{" "}
              {mtAccount ? (
                <span className="font-data">{mtAccount}</span>
              ) : (
                "registered with us"
              )}
              .
            </p>
            {active && (
              <Link href="/dashboard/license" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline w-fit">
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
