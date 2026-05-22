"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (isLoginPage) {
      if (user && isAdmin) router.replace("/admin");
      return;
    }
    if (!user) router.replace("/admin/login");
    else if (!isAdmin) router.replace("/admin/login?error=forbidden");
  }, [user, loading, isAdmin, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-data">Loading…</p>
      </div>
    );
  }
  if (!user || !isAdmin) return null;

  return <>{children}</>;
}
