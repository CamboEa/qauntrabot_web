"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { adminJson } from "@/lib/admin-client";
import type { BotDoc } from "@/lib/firestore";

export default function AdminBotsPage() {
  const [bots, setBots] = useState<BotDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminJson<BotDoc[]>("/api/admin/bots")
      .then(setBots)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete bot "${id}"?`)) return;
    try {
      await adminJson(`/api/admin/bots/${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const proofLabel = (bot: BotDoc) => {
    const parts: string[] = [];
    if (bot.proof?.backtest) parts.push("BT");
    if (bot.proof?.live) parts.push("Live");
    return parts.length ? parts.join(" · ") : "—";
  };

  return (
    <AdminShell
      title="Trading bots"
      description="Add bots step-by-step with backtest and live performance proof."
      action={
        <Link href="/admin/bots/new" className="btn-primary-brand text-sm inline-flex items-center gap-1.5">
          <Plus size={16} /> New bot
        </Link>
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Proof</th>
                <th className="px-4 py-3">Gain</th>
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
              ) : bots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No bots yet.{" "}
                    <Link href="/admin/bots/new" className="text-primary underline">
                      Create your first bot
                    </Link>
                  </td>
                </tr>
              ) : (
                bots.map((bot) => (
                  <tr key={bot.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{bot.name}</p>
                      <p className="text-xs text-muted-foreground font-data">{bot.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-data uppercase px-2 py-0.5 rounded-full bg-secondary">
                        {bot.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {proofLabel(bot) !== "—" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-data text-profit">
                          <ShieldCheck size={14} />
                          {proofLabel(bot)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-data text-profit">{bot.gain}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/bots/${bot.id}/edit`}
                          className="p-2 rounded-lg hover:bg-secondary cursor-pointer text-muted-foreground hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(bot.id)}
                          className="p-2 rounded-lg hover:bg-loss/10 cursor-pointer text-loss"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
