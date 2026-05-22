"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch, adminJson } from "@/lib/admin-client";
import type { BotDoc, BotStatus, RiskLevel } from "@/lib/firestore";

const EMPTY_BOT: Omit<BotDoc, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  subtitle: "",
  asset: "",
  assetTag: "",
  status: "soon",
  risk: "Medium",
  gain: "—",
  drawdown: "—",
  winRate: "—",
  trades: "—",
  description: "",
  pairs: [],
  minDeposit: "$500",
  imageKey: "",
  fileKey: "",
};

export default function AdminBotsPage() {
  const [bots, setBots] = useState<BotDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formId, setFormId] = useState("");
  const [form, setForm] = useState(EMPTY_BOT);
  const [pairsText, setPairsText] = useState("");
  const [saving, setSaving] = useState(false);

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

  const openCreate = () => {
    setEditingId(null);
    setFormId("");
    setForm(EMPTY_BOT);
    setPairsText("");
    setModalOpen(true);
  };

  const openEdit = (bot: BotDoc) => {
    setEditingId(bot.id);
    setFormId(bot.id);
    setForm({
      name: bot.name,
      subtitle: bot.subtitle,
      asset: bot.asset,
      assetTag: bot.assetTag,
      status: bot.status,
      risk: bot.risk,
      gain: bot.gain,
      drawdown: bot.drawdown,
      winRate: bot.winRate,
      trades: bot.trades,
      description: bot.description,
      pairs: bot.pairs,
      minDeposit: bot.minDeposit,
      imageKey: bot.imageKey,
      fileKey: bot.fileKey,
    });
    setPairsText(bot.pairs.join(", "));
    setModalOpen(true);
  };

  const handleSave = async () => {
    const id = (editingId ?? formId).trim().toLowerCase().replace(/\s+/g, "-");
    if (!id) {
      alert("Bot ID is required (e.g. xauusd-grid)");
      return;
    }

    const payload = {
      ...form,
      pairs: pairsText.split(",").map((p) => p.trim()).filter(Boolean),
    };

    setSaving(true);
    try {
      if (editingId) {
        await adminJson(`/api/admin/bots/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminJson("/api/admin/bots", {
          method: "POST",
          body: JSON.stringify({ id, ...payload }),
        });
      }
      setModalOpen(false);
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete bot "${id}"?`)) return;
    try {
      await adminJson(`/api/admin/bots/${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleUpload = async (type: "bot-image" | "bot-file", file: File) => {
    const id = (editingId ?? formId).trim();
    if (!id) {
      alert("Set bot ID first");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    fd.append("id", id);
    if (type === "bot-file") fd.append("platform", "MT5");

    const res = await adminFetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");

    if (type === "bot-image") setForm((f) => ({ ...f, imageKey: data.key }));
    else setForm((f) => ({ ...f, fileKey: data.key }));
  };

  return (
    <AdminShell
      title="Trading bots"
      description="Create, edit, and publish Expert Advisor modules."
      action={
        <button type="button" onClick={openCreate} className="btn-primary-brand text-sm cursor-pointer">
          <Plus size={16} /> Add bot
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Risk</th>
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
                    No bots in Firestore. Add one or they will show static fallback on the site.
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
                    <td className="px-4 py-3 text-muted-foreground">{bot.risk}</td>
                    <td className="px-4 py-3 font-data text-profit">{bot.gain}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(bot)}
                          className="p-2 rounded-lg hover:bg-secondary cursor-pointer text-muted-foreground hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="card-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto card-pad stack-4">
            <h2 className="font-display text-lg font-bold">
              {editingId ? `Edit ${editingId}` : "New bot"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {!editingId && (
                <div className="stack-2 sm:col-span-2">
                  <label className="text-xs font-data uppercase text-muted-foreground">Bot ID (slug)</label>
                  <input
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                    placeholder="xauusd-grid"
                  />
                </div>
              )}
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
              <Field label="Asset" value={form.asset} onChange={(v) => setForm({ ...form, asset: v })} />
              <Field label="Asset tag" value={form.assetTag} onChange={(v) => setForm({ ...form, assetTag: v })} />
              <div className="stack-2">
                <label className="text-xs font-data uppercase text-muted-foreground">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as BotStatus })}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                >
                  <option value="live">live</option>
                  <option value="beta">beta</option>
                  <option value="soon">soon</option>
                </select>
              </div>
              <div className="stack-2">
                <label className="text-xs font-data uppercase text-muted-foreground">Risk</label>
                <select
                  value={form.risk}
                  onChange={(e) => setForm({ ...form, risk: e.target.value as RiskLevel })}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <Field label="Gain" value={form.gain} onChange={(v) => setForm({ ...form, gain: v })} />
              <Field label="Drawdown" value={form.drawdown} onChange={(v) => setForm({ ...form, drawdown: v })} />
              <Field label="Win rate" value={form.winRate} onChange={(v) => setForm({ ...form, winRate: v })} />
              <Field label="Trades" value={form.trades} onChange={(v) => setForm({ ...form, trades: v })} />
              <Field label="Min deposit" value={form.minDeposit} onChange={(v) => setForm({ ...form, minDeposit: v })} />
              <div className="stack-2 sm:col-span-2">
                <label className="text-xs font-data uppercase text-muted-foreground">Pairs (comma-separated)</label>
                <input
                  value={pairsText}
                  onChange={(e) => setPairsText(e.target.value)}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                  placeholder="XAUUSD, EURUSD"
                />
              </div>
              <div className="stack-2 sm:col-span-2">
                <label className="text-xs font-data uppercase text-muted-foreground">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm resize-y"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
              <label className="btn-outline-brand text-xs cursor-pointer">
                <Upload size={14} /> Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload("bot-image", e.target.files[0])}
                />
              </label>
              <label className="btn-outline-brand text-xs cursor-pointer">
                <Upload size={14} /> EA file (.ex5)
                <input
                  type="file"
                  accept=".ex4,.ex5"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload("bot-file", e.target.files[0])}
                />
              </label>
              {form.imageKey && (
                <span className="text-xs text-muted-foreground font-data self-center">img: {form.imageKey}</span>
              )}
              {form.fileKey && (
                <span className="text-xs text-muted-foreground font-data self-center">file: {form.fileKey}</span>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
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
                {saving ? "Saving…" : "Save bot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="stack-2">
      <label className="text-xs font-data uppercase text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border px-3 py-2 text-sm"
      />
    </div>
  );
}
