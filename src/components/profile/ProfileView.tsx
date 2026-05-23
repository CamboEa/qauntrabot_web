"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Monitor,
  Key,
  Calendar,
  CreditCard,
  Copy,
  Check,
  LogOut,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSubscription, type Subscription } from "@/lib/firestore";
import { signOut } from "@/lib/auth";
import { BILLING_PERIOD_LABEL, isSubscriptionActive } from "@/lib/subscription-plans";
import { formatDisplayDate } from "@/lib/dates";
import PageSection from "@/components/shared/PageSection";
import ContentHeading from "@/components/shared/ContentHeading";

export default function ProfileView() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/register?next=/profile");
      return;
    }
    getUserSubscription(user.uid)
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setSubLoading(false));
  }, [user, authLoading, router]);

  const handleCopyLicense = async () => {
    if (!subscription?.licenseKey) return;
    try {
      await navigator.clipboard.writeText(subscription.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading || !user) {
    return (
      <PageSection underHero narrow>
        <div className="card-surface card-pad animate-pulse h-64" />
      </PageSection>
    );
  }

  const email = user.email ?? profile?.email ?? "";
  const platform = profile?.platform ?? "—";
  const active = subscription ? isSubscriptionActive(subscription.validUntil, subscription.status) : false;

  return (
    <PageSection underHero narrow containerClassName="stack-6">
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 items-start">
        <div className="card-surface card-pad stack-4">
          <ContentHeading icon={User}>Account</ContentHeading>

          <dl className="stack-3 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <dt className="stat-label normal-case tracking-normal text-[0.65rem]">Email</dt>
                <dd className="font-medium text-foreground break-all">{email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Monitor size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <dt className="stat-label normal-case tracking-normal text-[0.65rem]">Platform</dt>
                <dd className="text-foreground">{platform}</dd>
              </div>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleSignOut}
            className="btn-outline-brand w-full justify-center text-loss border-loss/30 hover:border-loss hover:text-loss cursor-pointer"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>

        <div className="card-surface card-pad stack-4">
          <ContentHeading icon={CreditCard}>Subscription</ContentHeading>

          {subLoading ? (
            <div className="h-32 bg-secondary/60 rounded-xl animate-pulse" />
          ) : !subscription ? (
            <div className="stack-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                You don&apos;t have an active subscription yet. Subscribe to unlock every bot and EA
                downloads.
              </p>
              <Link href="/pricing" className="btn-primary-brand w-full justify-center">
                View pricing <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="stack-4">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-data font-medium ${
                    active
                      ? "border-profit/25 bg-profit/8 text-profit"
                      : "border-border bg-secondary text-muted-foreground"
                  }`}
                >
                  {active && <ShieldCheck size={12} />}
                  {active ? "Active" : subscription.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  {BILLING_PERIOD_LABEL[subscription.billingPeriod]} plan
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                Full access to all bots in the catalogue while your subscription is active.
              </p>

              <dl className="grid gap-3 text-sm">
                <div className="meta-cell flex items-start gap-3">
                  <Calendar size={16} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <dt className="stat-label normal-case tracking-normal text-[0.65rem]">
                      Valid until
                    </dt>
                    <dd className="font-data font-medium">{formatDisplayDate(subscription.validUntil)}</dd>
                  </div>
                </div>
                {subscription.mtAccountNumber && (
                  <div className="meta-cell flex items-start gap-3">
                    <Monitor size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <dt className="stat-label normal-case tracking-normal text-[0.65rem]">
                        MT account
                      </dt>
                      <dd className="font-data font-medium">{subscription.mtAccountNumber}</dd>
                    </div>
                  </div>
                )}
                {subscription.licenseKey && (
                  <div className="meta-cell flex items-start gap-3">
                    <Key size={16} className="text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <dt className="stat-label normal-case tracking-normal text-[0.65rem]">
                        License key
                      </dt>
                      <dd className="font-data text-xs break-all">{subscription.licenseKey}</dd>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyLicense}
                      className="p-2 rounded-lg border border-border hover:border-primary text-muted-foreground hover:text-primary cursor-pointer shrink-0"
                      title="Copy license key"
                    >
                      {copied ? <Check size={16} className="text-profit" /> : <Copy size={16} />}
                    </button>
                  </div>
                )}
              </dl>

              {active ? (
                <Link href="/bots" className="btn-primary-brand w-full justify-center">
                  Browse bots <ArrowRight size={16} />
                </Link>
              ) : (
                <Link href="/pricing" className="btn-primary-brand w-full justify-center">
                  Renew subscription <ArrowRight size={16} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </PageSection>
  );
}
