"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import BotWizard from "@/components/admin/BotWizard";

export default function NewBotPage() {
  return (
    <AdminShell
      title="New bot"
      description="Create a trading bot step by step — identity, performance, proof, and files."
      action={
        <Link href="/admin/bots" className="btn-outline-brand text-sm inline-flex items-center gap-1.5">
          <ArrowLeft size={16} />
          Back to bots
        </Link>
      }
    >
      <BotWizard mode="create" />
    </AdminShell>
  );
}
