"use client";

import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="bg-card border-b border-border px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="stack-2">
              <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {action}
          </div>
        </header>
        <div className="p-6 stack-6">{children}</div>
      </div>
    </div>
  );
}
