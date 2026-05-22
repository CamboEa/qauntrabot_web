"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { adminJson } from "@/lib/admin-client";
import type { Subscription, PlanTier, UserProfile, BotDoc } from "@/lib/firestore";

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [bots, setBots] = useState<BotDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [plan, setPlan] = useState<PlanTier>("starter");
  const [botIds, setBotIds] = useState<string[]>([]);
  const [mtAccount, setMtAccount] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [s, u, b] = await Promise.all([
        adminJson<Subscription[]>("/api/admin/subscriptions"),
        adminJson<UserProfile[]>("/api/admin/users"),
        adminJson<BotDoc[]>("/api/admin/bots"),
      ]);
      setSubs(s);
      setUsers(u);
      setBots(b);
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
      await adminJson("/api/admin/subscriptions", {
        method: "POST",
        body: JSON.stringify({
          uid,
          plan,
          botIds: plan === "institutional" ? bots.map((b) => b.id) : botIds,
          mtAccountNumber: mtAccount,
        }),
      });
      setModalOpen(false);
      setUid("");
      setBotIds([]);
      setMtAccount("");
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

  const toggleBot = (id: string) => {
    setBotIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <AdminShell
      title="Subscriptions"
      description="Assign plans and bot access to users."
      action={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary-brand text-sm cursor-pointer"
        >
          <Plus size={16} /> Assign plan
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
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Bots</th>
                <th className="px-4 py-3">License</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : subs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
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
                    <td className="px-4 py-3 capitalize">{s.plan}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {s.plan === "institutional" ? "All bots" : s.botIds.join(", ") || "—"}
                    </td>
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

            <div className="stack-2">
              <label className="text-xs font-data uppercase text-muted-foreground">User</label>
              <select
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              >
                <option value="">Select user…</option>
                {users.map((u) => (
                  <option key={u.uid} value={u.uid}>
                    {u.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="stack-2">
              <label className="text-xs font-data uppercase text-muted-foreground">Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as PlanTier)}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              >
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="institutional">Institutional</option>
              </select>
            </div>

            {plan !== "institutional" && (
              <div className="stack-2">
                <label className="text-xs font-data uppercase text-muted-foreground">Bot access</label>
                <div className="flex flex-wrap gap-2">
                  {bots.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => toggleBot(b.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                        botIds.includes(b.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
