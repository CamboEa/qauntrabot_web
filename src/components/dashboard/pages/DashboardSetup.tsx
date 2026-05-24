"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";

const SETUP_STEPS = [
  "Install the EA file on your MT4 or MT5 terminal (File → Open Data Folder → MQL5/Experts).",
  "Attach the EA to a chart for the bot’s symbol and paste your license key in inputs.",
  "Use the MT account number registered on your subscription — one account per license.",
];

export default function DashboardSetup() {
  const { loading, active, subscription, platform } = useDashboard();

  if (!loading && !active) {
    return (
      <div className="dashboard-page">
        <DashboardSectionHead
          eyebrow="Setup"
          title="Quick setup"
          description="Subscribe to get your license key and linked MT account."
        />
        <Link href="/pricing" className="btn-primary-brand w-fit">
          View pricing <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="Setup"
        title="Quick setup"
        description="Deploy your first Expert Advisor in three steps."
      />

      {subscription && (
        <div className="card-surface card-pad stack-3 text-sm">
          <p className="text-muted-foreground">
            Use account{" "}
            <span className="font-data font-medium text-foreground">{subscription.mtAccountNumber}</span> on{" "}
            <span className="font-medium text-foreground">{platform}</span>.{" "}
            <Link href="/dashboard/license" className="text-primary hover:underline">
              Copy your license key
            </Link>
            .
          </p>
        </div>
      )}

      <div className="card-surface card-pad stack-4">
        <ol className="stack-4">
          {SETUP_STEPS.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-foreground/90 leading-relaxed">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-data font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/bots" className="btn-primary-brand text-sm">
          Download a bot <ArrowRight size={16} />
        </Link>
        <Link href="/dashboard/trading-account" className="btn-outline-brand text-sm">
          View trading account
        </Link>
      </div>
    </div>
  );
}
