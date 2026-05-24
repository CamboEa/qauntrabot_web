import type { ReactNode } from "react";

type Variant = "default" | "accent" | "soft";

type DashboardCardProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

const variantClass: Record<Variant, string> = {
  default: "dashboard-card",
  accent: "dashboard-card dashboard-card--accent",
  soft: "dashboard-card dashboard-card--soft",
};

export default function DashboardCard({
  children,
  variant = "default",
  className = "",
}: DashboardCardProps) {
  return <div className={`${variantClass[variant]} ${className}`.trim()}>{children}</div>;
}
