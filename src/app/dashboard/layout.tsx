import type { Metadata } from "next";
import DashboardGate from "@/components/dashboard/DashboardGate";
import { DashboardProvider } from "@/contexts/DashboardContext";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard — QauntraBot",
  description: "Manage your subscription, license, and Expert Advisor downloads.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="dashboard-root">
      <DashboardGate>
        <DashboardProvider>
          <DashboardShell>{children}</DashboardShell>
        </DashboardProvider>
      </DashboardGate>
    </main>
  );
}
