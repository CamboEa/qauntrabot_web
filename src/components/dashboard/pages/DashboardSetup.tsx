"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import { LICENSE_VERIFY_URL, SITE_HOST } from "@/lib/site-config";

const SETUP_STEPS = [
  "Install the EA file on your MT5 terminal (File → Open Data Folder → MQL5/Experts).",
  `In MT5: Tools → Options → Expert Advisors → allow WebRequest for https://${SITE_HOST}`,
  "Attach the EA, paste your license key, and set the license API URL below — run only on your registered MT account.",
];

export default function DashboardSetup() {
  const { loading, active, mtAccountNumber, platform } = useDashboard();

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

      {mtAccountNumber && (
        <div className="card-surface card-pad stack-3 text-sm">
          <p className="text-muted-foreground">
            Use account{" "}
            <span className="font-data font-medium text-foreground">{mtAccountNumber}</span> on{" "}
            <span className="font-medium text-foreground">{platform}</span>.{" "}
            {active && (
              <>
                <Link href="/dashboard/license" className="text-primary hover:underline">
                  Copy your license key
                </Link>
                .
              </>
            )}
          </p>
        </div>
      )}

      <div className="card-surface card-pad stack-4 text-sm border-primary/20">
        <p className="font-medium text-foreground">MT5 — required before attaching the EA</p>
        <ol className="stack-2 text-muted-foreground list-decimal list-inside">
          <li>
            <strong className="text-foreground">Tools → Options → Expert Advisors</strong>
          </li>
          <li>
            Enable <strong className="text-foreground">Allow algorithmic trading</strong>
          </li>
          <li>
            Enable <strong className="text-foreground">Allow WebRequest for listed URL</strong>
          </li>
          <li>
            Click <strong className="text-foreground">Add</strong> and paste exactly:
            <code className="font-data text-xs break-all block mt-1 text-foreground bg-muted/50 p-2 rounded">
              https://{SITE_HOST}
            </code>
          </li>
          <li>
            <strong className="text-foreground">Restart MetaTrader 5</strong> (close fully, reopen)
          </li>
        </ol>
        <p className="text-xs text-muted-foreground">
          License API (built into the EA):{" "}
          <span className="font-data text-foreground">{LICENSE_VERIFY_URL}</span>
        </p>
      </div>

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
