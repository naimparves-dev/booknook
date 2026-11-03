"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { describeAuthError } from "@/lib/auth-errors";
import { getPostLoginRedirect, readRedirectParam } from "@/lib/redirect";
import { toast } from "react-hot-toast";
import {
  AuthErrorAlert,
  AuthSpinner,
  BrandMark,
  GoogleIcon,
  PasswordVisibilityToggle,
  SocialDivider,
  authInputClassName,
} from "@/components/auth/AuthUI";

/**
 * BookNook sign-in form. Rendered inside a server component that passes
 * `googleEnabled`, so the Google button always matches the providers the
 * server actually registered — there is no second flag to keep in sync.
 */
export default function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Surfaces a message in the inline alert (existing behaviour) *and* as a
   * toast. The fixed id keeps repeated failures from stacking up.
   */
  const showError = (message: string) => {
    setError(message);
    toast.error(message, { id: "auth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || googleLoading) return;
    setSubmitting(true);
    setError(null);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        showError(describeAuthError(signInError, "Could not sign you in. Please try again."));
        return;
      }

      toast.success("Welcome back! You are signed in.", { id: "auth" });

      // Back to the page src/proxy.ts bounced them from, or home.
      router.push(getPostLoginRedirect());
      router.refresh();
    } catch {
      showError("Something went wrong while signing you in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (submitting || googleLoading) return;
    setGoogleLoading(true);
    setError(null);

    try {
      // `callbackURL` sends the user back to the page the proxy bounced
      // them from after the OAuth round-trip; it falls back to `/`.
      const { error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: getPostLoginRedirect(),
      });

      // Better Auth reports OAuth problems on the result instead of throwing.
      if (socialError) {
        showError(describeAuthError(socialError, "Could not start Google sign-in. Please try again."));
        setGoogleLoading(false);
        return;
      }

      // The client is redirected to Google, so nothing else runs here.
    } catch {
      showError("Could not start Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  };

  const loading = submitting || googleLoading;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-[#F1F6F9] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8">
          <BrandMark />
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/80 bg-white p-8 shadow-xl shadow-slate-200/60">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Sign in to continue to BookNook.
          </p>

          {error && <div className="mt-6"><AuthErrorAlert message={error} /></div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#0F172A]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className={authInputClassName}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#0F172A]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className={`${authInputClassName} pr-11`}
                />
                <PasswordVisibilityToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F4A6B] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#0F4A6B]/20 transition-all hover:bg-[#0d3f5c] focus:ring-2 focus:ring-[#0F4A6B]/40 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <AuthSpinner className="h-4 w-4" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Social login */}
          {googleEnabled && (
            <>
              <SocialDivider />
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#0F172A] shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 focus:ring-2 focus:ring-[#0F4A6B]/25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {googleLoading ? (
                  <>
                    <AuthSpinner className="h-4 w-4 text-slate-500" />
                    Redirecting to Google…
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                  </>
                )}
              </button>
            </>
          )}

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-[#64748B]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#F97316] transition-colors hover:text-[#ea6a09]"
              onClick={(event) => {
                // Keep the proxy's destination alive across the detour to
                // the sign-up screen.
                const target = readRedirectParam();
                if (!target) return;
                event.preventDefault();
                router.push(`/register?redirect=${encodeURIComponent(target)}`);
              }}
            >
              Register
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#94A3B8]">
          &copy; BookNook. All rights reserved.
        </p>
      </div>
    </div>
  );
}
