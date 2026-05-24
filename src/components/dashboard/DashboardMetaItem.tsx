import type { ReactNode } from "react";

type DashboardMetaItemProps = {
  label: string;
  value: ReactNode;
  mono?: boolean;
  valueClassName?: string;
};

export default function DashboardMetaItem({
  label,
  value,
  mono = false,
  valueClassName = "",
}: DashboardMetaItemProps) {
  return (
    <div className="meta-cell dashboard-meta-item">
      <p className="stat-label normal-case">{label}</p>
      <p className={`mt-1 text-sm font-medium text-foreground ${mono ? "font-data" : ""} ${valueClassName}`.trim()}>
        {value}
      </p>
    </div>
  );
}
