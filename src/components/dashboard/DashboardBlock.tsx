import type { ReactNode } from "react";

type DashboardBlockProps = {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function DashboardBlock({
  title,
  action,
  children,
  className = "",
}: DashboardBlockProps) {
  return (
    <section className={`dashboard-block ${className}`.trim()}>
      {(title || action) && (
        <div className="dashboard-block-head">
          {title ? <h3 className="dashboard-block-title">{title}</h3> : <span />}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
