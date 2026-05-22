"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import BotWizard, { botToFormData } from "@/components/admin/BotWizard";
import { adminJson } from "@/lib/admin-client";
import type { BotDoc } from "@/lib/firestore";

export default function EditBotPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bot, setBot] = useState<BotDoc | null>(null);

  useEffect(() => {
    if (!id) return;
    adminJson<BotDoc>(`/api/admin/bots/${id}`)
      .then(setBot)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load bot"))
      .finally(() => setLoading(false));
  }, [id]);

  const { form, pairsText } = bot ? botToFormData(bot) : { form: undefined, pairsText: "" };

  return (
    <AdminShell
      title={bot ? `Edit ${bot.name}` : "Edit bot"}
      description={id ? `Bot ID: ${id}` : undefined}
      action={
        <Link href="/admin/bots" className="btn-outline-brand text-sm inline-flex items-center gap-1.5">
          <ArrowLeft size={16} />
          Back to bots
        </Link>
      }
    >
      {loading && (
        <p className="text-sm text-muted-foreground font-data">Loading bot…</p>
      )}
      {error && (
        <div className="rounded-xl border border-loss/25 bg-loss/5 px-4 py-3 text-sm text-loss">
          {error}
        </div>
      )}
      {!loading && !error && bot && form && (
        <BotWizard
          mode="edit"
          editingId={id}
          initialFormId={id}
          initialForm={form}
          initialPairsText={pairsText}
        />
      )}
    </AdminShell>
  );
}
