"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, Users, CreditCard, ArrowRight } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { adminJson } from "@/lib/admin-client";

type Stats = {
  bots: { total: number; live: number };
  users: { total: number };
  subscriptions: {
    total: number;
    active: number;
    monthly: number;
    semiannual: number;
    yearly: number;
  };
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminJson<Stats>("/api/admin/stats")
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  const cards = stats
    ? [
        {
          label: "Trading bots",
          value: stats.bots.total,
          sub: `${stats.bots.live} live`,
          href: "/admin/bots",
          icon: Bot,
        },
        {
          label: "Registered users",
          value: stats.users.total,
          sub: "All accounts",
          href: "/admin/users",
          icon: Users,
        },
        {
          label: "Active subscriptions",
          value: stats.subscriptions.total,
          sub: `${stats.subscriptions.active} active · ${stats.subscriptions.monthly} mo / ${stats.subscriptions.semiannual} 6mo / ${stats.subscriptions.yearly} yr`,
          href: "/admin/subscriptions",
          icon: CreditCard,
        },
      ]
    : [];

  return (
    <AdminShell
      title="Dashboard"
      description="Overview of bots, users, and subscriptions."
    >
      {error && (
        <div className="rounded-xl border border-loss/25 bg-loss/5 px-4 py-3 text-sm text-loss">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-3 grid-site">
        {cards.map(({ label, value, sub, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="card-surface-hover card-pad stack-3 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
              <ArrowRight size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold font-display text-foreground">{value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {!stats && !error && (
        <p className="text-sm text-muted-foreground font-data">Loading stats…</p>
      )}

      <div className="card-surface card-pad stack-3">
        <h2 className="font-display font-semibold text-foreground">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/bots" className="btn-primary-brand text-sm">
            Manage bots
          </Link>
          <Link href="/admin/subscriptions" className="btn-outline-brand text-sm">
            Assign subscription
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
