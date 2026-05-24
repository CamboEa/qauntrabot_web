"use client";

import Link from "next/link";
import { useState } from "react";
import { Key, Copy, Check, ShieldCheck, Monitor, ArrowRight } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import ContentHeading from "@/components/shared/ContentHeading";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import DashboardSubscriptionAlerts from "@/components/dashboard/DashboardSubscriptionAlerts";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default function DashboardLicense() {
  const { subscription, loading, active, platform, mtAccountNumber } = useDashboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!subscription?.licenseKey) return;
    try {
      await navigator.clipboard.writeText(subscription.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!loading && !active) {
    return (
      <div className="dashboard-page">
        <DashboardSectionHead
          eyebrow="License"
          title="License key"
          description="Available when your subscription is active."
        />
        <DashboardSubscriptionAlerts />
        <Link href="/pricing" className="btn-primary-brand w-fit">
          View pricing <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="License"
        title="License key"
        description="Paste this in each Expert Advisor's inputs on your linked MT account."
      />

      {loading ? (
        <div className="dashboard-skeleton" />
      ) : subscription ? (
        <>
          <DashboardCard variant="accent">
            <ContentHeading icon={Key} as="h3">
              Your license
            </ContentHeading>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Locked to MT account{" "}
              <strong className="font-data text-foreground">{mtAccountNumber}</strong> on{" "}
              <strong>{platform}</strong>.
            </p>
            <div className="meta-cell flex items-center gap-3">
              <code className="font-data text-sm sm:text-base break-all flex-1 text-foreground">
                {subscription.licenseKey}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2.5 rounded-lg border border-border hover:border-primary cursor-pointer shrink-0"
                title="Copy license key"
              >
                {copied ? <Check size={18} className="text-profit" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-profit">
              <ShieldCheck size={14} />
              Full catalogue access — all live & beta bots
            </div>
          </DashboardCard>

          <Link
            href="/dashboard/trading-account"
            className="dashboard-card !flex-row items-center gap-3 hover:border-primary/25 transition-colors"
          >
            <Monitor size={18} className="text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground text-sm">Trading account</p>
              <p className="text-xs text-muted-foreground font-data">{mtAccountNumber}</p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground shrink-0" />
          </Link>
        </>
      ) : null}
    </div>
  );
}
