"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { adminJson } from "@/lib/admin-client";
import type { UserProfile } from "@/lib/firestore";
import { formatDisplayDate } from "@/lib/dates";

const PLATFORMS = ["MetaTrader 5 (MT5)", "MetaTrader 4 (MT4)"] as const;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserProfile | null>(null);
  const [platform, setPlatform] = useState<string>(PLATFORMS[0]);
  const [mtAccount, setMtAccount] = useState("");
  const [syncSubscription, setSyncSubscription] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminJson<UserProfile[]>("/api/admin/users")
      .then(setUsers)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (user: UserProfile) => {
    setEditing(user);
    setPlatform(
      PLATFORMS.includes(user.platform as (typeof PLATFORMS)[number])
        ? (user.platform as (typeof PLATFORMS)[number])
        : PLATFORMS[0]
    );
    setMtAccount(user.mtAccountNumber ?? "");
    setSyncSubscription(true);
    setError(null);
  };

  const closeEdit = () => {
    setEditing(null);
    setMtAccount("");
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await adminJson<UserProfile>(`/api/admin/users/${editing.uid}`, {
        method: "PATCH",
        body: JSON.stringify({
          platform,
          mtAccountNumber: mtAccount,
          syncSubscription,
        }),
      });
      setUsers((prev) => prev.map((u) => (u.uid === updated.uid ? updated : u)));
      closeEdit();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Users"
      description="Edit trading account numbers and platforms for registered members."
    >
      {error && (
        <div className="rounded-xl border border-loss/25 bg-loss/5 px-4 py-3 text-sm text-loss">{error}</div>
      )}

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left text-xs font-data uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">MT account</th>
                <th className="px-4 py-3">UID</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No users yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.uid} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium text-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.platform}</td>
                    <td className="px-4 py-3 font-data text-xs">{u.mtAccountNumber || "—"}</td>
                    <td className="px-4 py-3 font-data text-xs text-muted-foreground max-w-[140px] truncate">
                      {u.uid}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDisplayDate(u.createdAt, "—")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(u)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-secondary cursor-pointer"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="card-surface w-full max-w-md card-pad stack-4">
            <h2 className="font-display text-lg font-bold">Edit user</h2>
            <p className="text-sm text-muted-foreground break-all">{editing.email}</p>

            <div className="stack-2">
              <label className="text-xs font-data uppercase text-muted-foreground">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm cursor-pointer"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="stack-2">
              <label className="text-xs font-data uppercase text-muted-foreground">MT account number</label>
              <input
                value={mtAccount}
                onChange={(e) => setMtAccount(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm font-data"
                placeholder="12345678"
                inputMode="numeric"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={syncSubscription}
                onChange={(e) => setSyncSubscription(e.target.checked)}
                className="mt-1"
              />
              <span>
                Also update this MT account on the user&apos;s subscription (if they have one)
              </span>
            </label>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeEdit}
                className="btn-outline-brand text-sm cursor-pointer"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary-brand text-sm cursor-pointer disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
