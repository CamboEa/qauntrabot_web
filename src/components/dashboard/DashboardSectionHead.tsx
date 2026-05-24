import type { ReactNode } from "react";

type DashboardSectionHeadProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
};

export default function DashboardSectionHead({
  eyebrow,
  title,
  description,
  aside,
}: DashboardSectionHeadProps) {
  return (
    <div className={`dashboard-section-head ${aside ? "dashboard-section-head--row" : ""}`}>
      <div className="dashboard-section-head-text">
        <p className="dashboard-section-eyebrow">{eyebrow}</p>
        <h2 className="dashboard-section-title">{title}</h2>
        {description && <div className="dashboard-section-desc">{description}</div>}
      </div>
      {aside && <div className="dashboard-section-aside">{aside}</div>}
    </div>
  );
}
