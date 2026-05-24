"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { adminJson } from "@/lib/admin-client";
import {
  BILLING_PERIOD_LABEL,
  computeValidUntil,
  type BillingPeriod,
} from "@/lib/subscription-plans";
import type { Subscription, UserProfile } from "@/lib/firestore";
import { formatDisplayDate } from "@/lib/dates";

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [mtAccount, setMtAccount] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([
        adminJson<Subscription[]>("/api/admin/subscriptions"),
        adminJson<UserProfile[]>("/api/admin/users"),
      ]);
      setSubs(s);
      setUsers(u);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const userEmail = (id: string) => users.find((u) => u.uid === id)?.email ?? id.slice(0, 8) + "…";

  const handleSave = async () => {
    if (!uid) {
      alert("Select a user");
      return;
    }
    setSaving(true);
    try {
      const validUntil = computeValidUntil(billingPeriod);
      await adminJson("/api/admin/subscriptions", {
        method: "POST",
        body: JSON.stringify({
          uid,
          billingPeriod,
          status: "active",
          mtAccountNumber: mtAccount,
          validUntil: validUntil.toISOString(),
        }),
      });
      setModalOpen(false);
      setUid("");
      setMtAccount("");
      setBillingPeriod("monthly");
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subUid: string) => {
    if (!confirm("Remove this subscription?")) return;
    try {
      await adminJson(`/api/admin/subscriptions/${subUid}`, { method: "DELETE" });
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <AdminShell
      title="Subscriptions"
      description="All-access plans — active subscribers can use every bot."
      action={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary-brand text-sm cursor-pointer"
        >
          <Plus size={16} /> Assign subscription
        </button>
      }
    >
      {error && (
        <div className="rounded-xl border border-loss/25 bg-loss/5 px-4 py-3 text-sm text-loss">{error}</div>
      )}

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left text-xs font-data uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Billing</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Valid until</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3">License</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : subs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No subscriptions yet.
                  </td>
                </tr>
              ) : (
                subs.map((s) => (
                  <tr key={s.uid} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{userEmail(s.uid)}</p>
                      <p className="text-xs font-data text-muted-foreground">{s.uid}</p>
                    </td>
                    <td className="px-4 py-3">{BILLING_PERIOD_LABEL[s.billingPeriod]}</td>
                    <td className="px-4 py-3 capitalize">{s.status}</td>
                    <td className="px-4 py-3 font-data text-xs">{formatDisplayDate(s.validUntil)}</td>
                    <td className="px-4 py-3 text-xs text-profit font-medium">All bots</td>
                    <td className="px-4 py-3 font-data text-xs">{s.licenseKey || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(s.uid)}
                        className="p-2 rounded-lg hover:bg-loss/10 text-loss cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="card-surface w-full max-w-md card-pad stack-4">
            <h2 className="font-display text-lg font-bold">Assign subscription</h2>
            <p className="text-sm text-muted-foreground">
              Grants access to every bot until the period ends. Billing period sets expiry
              automatically.
            </p>

            <div className="stack-2">
              <label className="text-xs font-data uppercase text-muted-foreground">User</label>
              <select
                value={uid}
                onChange={(e) => {
                  const id = e.target.value;
                  setUid(id);
                  const selected = users.find((u) => u.uid === id);
                  if (selected?.mtAccountNumber) {
                    setMtAccount(selected.mtAccountNumber);
                  }
                }}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              >
                <option value="">Select user…</option>
                {users.map((u) => (
                  <option key={u.uid} value={u.uid}>
                    {u.email}
                    {u.mtAccountNumber ? ` · MT ${u.mtAccountNumber}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="stack-2">
              <label className="text-xs font-data uppercase text-muted-foreground">Billing period</label>
              <select
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value as BillingPeriod)}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              >
                <option value="monthly">Monthly (1 month)</option>
                <option value="semiannual">6 months</option>
                <option value="yearly">Yearly (12 months)</option>
              </select>
            </div>

            <div className="stack-2">
              <label className="text-xs font-data uppercase text-muted-foreground">MT account # (optional)</label>
              <input
                value={mtAccount}
                onChange={(e) => setMtAccount(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                placeholder="12345678"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-outline-brand text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary-brand text-sm cursor-pointer disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
