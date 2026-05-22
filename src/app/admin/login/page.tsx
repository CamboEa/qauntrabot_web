"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/lib/auth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/contexts/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "forbidden"
      ? "This account does not have admin access."
      : null
  );
  const [submitting, setSubmitting] = useState(false);

  const redirecting = !loading && !!user && isAdmin;

  useEffect(() => {
    if (redirecting) router.replace("/admin");
  }, [redirecting, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      // Redirect happens in useEffect once auth state updates
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-data">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md card-surface card-pad stack-6">
        <div className="flex flex-col items-center stack-3 text-center">
          <Image src="/logo/logo.png" alt="QauntraBot" width={48} height={48} />
          <h1 className="font-display text-2xl font-bold text-foreground">Admin sign in</h1>
          <p className="text-sm text-muted-foreground">
            Restricted to authorized administrators only.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-loss/25 bg-loss/5 px-4 py-3 text-sm text-loss">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="stack-4">
          <div className="stack-2">
            <label className="text-xs font-semibold text-muted-foreground font-data uppercase">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary"
              placeholder="admin@example.com"
            />
          </div>
          <div className="stack-2">
            <label className="text-xs font-semibold text-muted-foreground font-data uppercase">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary-brand w-full disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
