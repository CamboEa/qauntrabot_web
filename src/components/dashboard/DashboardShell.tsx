"use client";

import { useState, type ReactNode } from "react";
import DashboardSidebar, { DashboardMobileToggle } from "@/components/dashboard/DashboardSidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="dashboard-main">
        <header className="dashboard-main-header lg:hidden">
          <DashboardMobileToggle onOpen={() => setMobileOpen(true)} />
        </header>
        <div className="dashboard-main-inner">{children}</div>
      </div>
    </div>
  );
}
