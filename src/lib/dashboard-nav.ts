import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Monitor,
  Key,
  Bot,
  BookOpen,
} from "lucide-react";

export type DashboardNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Only show when subscription is active */
  requiresActive?: boolean;
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { id: "overview", label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { id: "trading-account", label: "Trading account", href: "/dashboard/trading-account", icon: Monitor },
  { id: "license", label: "License key", href: "/dashboard/license", icon: Key, requiresActive: true },
  { id: "bots", label: "My bots", href: "/dashboard/bots", icon: Bot },
  { id: "setup", label: "Quick setup", href: "/dashboard/setup", icon: BookOpen, requiresActive: true },
];

export function isDashboardNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
