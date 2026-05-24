"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/register?next=/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-main">
          <div className="dashboard-main-inner dashboard-page">
            <div className="h-10 w-48 bg-secondary rounded-lg animate-pulse" />
            <div className="dashboard-grid-stats">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="card-surface card-pad h-24 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
