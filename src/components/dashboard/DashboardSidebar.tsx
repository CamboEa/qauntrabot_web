"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, X, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { signOut } from "@/lib/auth";
import { DASHBOARD_NAV, isDashboardNavActive } from "@/lib/dashboard-nav";


function userInitials(email: string): string {
  const part = email.split("@")[0] ?? "U";
  return part.slice(0, 2).toUpperCase();
}

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function DashboardMobileToggle({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="lg:hidden flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground cursor-pointer"
      aria-label="Open dashboard menu"
    >
      <Menu size={18} />
      Menu
    </button>
  );
}

export default function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const { active } = useDashboard();

  const email = user?.email ?? profile?.email ?? "";

  const navItems = DASHBOARD_NAV.filter((item) => !item.requiresActive || active);

  const handleSignOut = async () => {
    onMobileClose();
    await signOut();
    window.location.href = "/";
  };

  const sidebarContent = (
    <>
      <div className="dashboard-sidebar-brand">
        <Link href="/dashboard" className="flex items-center gap-2.5 cursor-pointer" onClick={onMobileClose}>
          <Image src="/logo/logo.png" alt="" width={28} height={28} className="object-contain" />
          <span className="font-display text-sm font-bold text-foreground">Member area</span>
        </Link>
        {mobileOpen && (
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-secondary cursor-pointer"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="dashboard-sidebar-user">
        <span className="dashboard-sidebar-avatar">{userInitials(email)}</span>
        <div className="min-w-0">
          <p className="text-xs font-data text-muted-foreground">Signed in as</p>
          <p className="text-sm font-medium text-foreground truncate">{email}</p>
        </div>
      </div>

      <nav className="dashboard-sidebar-nav" aria-label="Dashboard">
        <p className="dashboard-sidebar-group-label">Dashboard</p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map(({ id, label, href, icon: Icon }) => {
            const isActive = isDashboardNavActive(pathname, href);
            return (
              <li key={id}>
                <Link
                  href={href}
                  onClick={onMobileClose}
                  className={`dashboard-sidebar-link ${isActive ? "dashboard-sidebar-link--active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={16} className="shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="dashboard-sidebar-footer">
        <button
          type="button"
          onClick={handleSignOut}
          className="dashboard-sidebar-link w-full text-left text-loss hover:bg-loss/10 hover:text-loss cursor-pointer"
        >
          <LogOut size={16} className="shrink-0" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="dashboard-sidebar-backdrop lg:hidden"
          aria-label="Close menu"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`dashboard-sidebar ${mobileOpen ? "dashboard-sidebar--open" : ""}`}
        aria-label="Dashboard navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
