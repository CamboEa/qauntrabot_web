"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { signUp, signIn, resetPassword } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import SectionHeader from "@/components/shared/SectionHeader";
import PageSection from "@/components/shared/PageSection";

const PLATFORMS = ["MetaTrader 5 (MT5)", "MetaTrader 4 (MT4)"];

type FormData = { email: string; password: string; platform: string };
type Mode = "register" | "login";

export default function RegistrationSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("register");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState<FormData>({ email: "", password: "", platform: PLATFORMS[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (user && !submitted) {
    return (
      <PageSection id="registration" underHero narrow>
          <div className="card-surface card-pad text-center stack-4">
            <div className="w-14 h-14 rounded-full bg-profit/10 flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-profit">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="stack-2">
              <h3 className="font-display text-xl font-bold text-foreground">You&apos;re signed in</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" onClick={() => router.push("/profile")} className="btn-primary-brand cursor-pointer">
                My profile <ArrowRight size={16} />
              </button>
              <button type="button" onClick={() => router.push("/bots")} className="btn-outline-brand cursor-pointer">
                Browse bots
              </button>
            </div>
          </div>
      </PageSection>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") await signUp(form.email, form.password, form.platform);
      else await signIn(form.email, form.password);
      setSubmitted(true);
      setTimeout(() => {
        const next = new URLSearchParams(window.location.search).get("next");
        router.push(next?.startsWith("/") ? next : "/profile");
      }, 1500);
    } catch (err: unknown) {
      setError(friendlyError(err instanceof Error ? err.message : "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!form.email) {
      setError("Enter your email address first.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(form.email);
      setResetSent(true);
      setError(null);
    } catch {
      setError("Could not send reset email. Check the address and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageSection id="registration" underHero={hideHeader} standalone={!hideHeader} narrow>
        {!hideHeader && (
          <SectionHeader
            eyebrow="Secure Access Portal"
            title={mode === "register" ? "Begin your" : "Welcome"}
            accent={mode === "register" ? "automation." : "back."}
            description={
              mode === "register"
                ? "Create your account to access licensed Expert Advisors."
                : "Sign in to manage licenses and download builds."
            }
          />
        )}

        <div className="card-surface overflow-hidden">
          {submitted ? (
            <div className="card-pad text-center stack-4">
              <div className="w-14 h-14 rounded-full bg-profit/10 flex items-center justify-center mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-profit">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="stack-2">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {mode === "register" ? "Account created" : "Signed in"}
                </h3>
                <p className="text-sm text-muted-foreground">Redirecting to your bots…</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4">
                <div className="tab-group w-full flex">
                  {(["register", "login"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setMode(m); setError(null); setResetSent(false); }}
                      className={`flex-1 cursor-pointer ${mode === m ? "tab-pill-active" : ""}`}
                    >
                      {m === "register" ? "Create account" : "Sign in"}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="card-pad pt-0 stack-4">
                {error && (
                  <div className="alert-error">
                    <AlertCircle size={16} className="shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                {resetSent && (
                  <div className="alert-success">
                    Password reset email sent — check your inbox.
                  </div>
                )}

                <div className="stack-2">
                  <label className="field-label">Email</label>
                  <input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" disabled={loading} />
                </div>

                <div className="stack-2">
                  <label className="field-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      minLength={mode === "register" ? 8 : undefined}
                      placeholder={mode === "register" ? "Min. 8 characters" : "Your password"}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      className="input-field pr-12"
                      disabled={loading}
                    />
                    <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div className="stack-2">
                    <label className="field-label">Platform</label>
                    <select value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))} className="input-field cursor-pointer" disabled={loading}>
                      {PLATFORMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                )}

                {mode === "login" && (
                  <div className="text-right">
                    <button type="button" onClick={handleResetPassword} disabled={loading} className="text-sm text-primary font-medium hover:underline cursor-pointer">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary-brand w-full disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Please wait…" : (
                    <>
                      {mode === "register" ? "Create account" : "Sign in"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  By continuing, you agree to our Terms and Privacy Policy.
                </p>
              </form>
            </>
          )}
        </div>
    </PageSection>
  );
}

function friendlyError(msg: string): string {
  if (msg.includes("email-already-in-use")) return "An account with this email already exists. Try signing in.";
  if (msg.includes("user-not-found") || msg.includes("invalid-credential")) return "Incorrect email or password.";
  if (msg.includes("weak-password")) return "Password must be at least 8 characters.";
  if (msg.includes("invalid-email")) return "Please enter a valid email address.";
  if (msg.includes("too-many-requests")) return "Too many attempts. Please wait and try again.";
  return "Something went wrong. Please try again.";
}
