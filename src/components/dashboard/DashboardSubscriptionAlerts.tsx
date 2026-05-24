import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

export default function DashboardSubscriptionAlerts() {
  const { subscription, loading, active } = useDashboard();

  if (loading) return null;

  if (!subscription) {
    return (
      <div className="card-surface card-pad border-warning/30 bg-warning/5 dashboard-callout">
        <div className="dashboard-callout-inner">
          <AlertCircle size={20} className="text-warning shrink-0 mt-0.5" />
          <div className="dashboard-callout-body">
            <p className="font-display font-bold text-foreground">No active subscription</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Subscribe to unlock every Expert Advisor, your license key, and EA downloads tied to your
              MT account.
            </p>
            <Link href="/pricing" className="btn-primary-brand w-fit">
              View pricing <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="card-surface card-pad border-loss/20 bg-loss/5 dashboard-callout">
        <div className="dashboard-callout-inner">
          <AlertCircle size={20} className="text-loss shrink-0" />
          <div className="dashboard-callout-body">
            <p className="font-display font-bold text-foreground">Subscription expired</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Renew to restore access to all bots and downloads for account{" "}
              <span className="font-data">{subscription.mtAccountNumber || "—"}</span>.
            </p>
            <Link href="/pricing" className="btn-primary-brand w-fit text-sm">
              Renew now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
