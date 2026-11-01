"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { authClient, isGoogleAuthEnabled } from "@/lib/auth-client";

/* ------------------------------------------------------------------ */
/* BookNook brand mark – shared by the sign-in and sign-up screens      */
/* ------------------------------------------------------------------ */
function BrandMark() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F97316]/25 bg-[#FFF4ED] shadow-sm">
        {/* Open book icon */}
        <svg
          className="h-7 w-7 text-[#0F4A6B]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>

      <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
        Book<span className="text-[#F97316]">Nook</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Google logo used by the social sign-in button                        */
/* ------------------------------------------------------------------ */
function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.62-.21-2.39H12v4.52h6.46c-.28 1.5-1.13 2.77-2.41 3.62v3h3.89c2.28-2.1 3.58-5.2 3.58-8.75z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.93l-3.89-3.01c-1.08.72-2.45 1.15-4.05 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.11C3.23 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.26c-.24-.72-.38-1.49-.38-2.26s.14-1.54.38-2.26V6.63H1.26C.45 8.24 0 10.06 0 12s.45 3.76 1.26 5.37l4.01-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.23 2.7 1.26 6.63l4.01 3.11C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Sign-in form                                                         */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return; // guard against double-submit

    setError(null);

    // Lightweight client-side validation before hitting the server.
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !password) {
      setError("Please fill in both your email and password.");
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await authClient.signIn.email({
        email: trimmedEmail,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password. Please try again.");
        return;
      }

      // Refresh the cached server components so the Navbar picks up the
      // freshly-created session, then land on the homepage.
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong while signing you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (socialLoading) return;
    setError(null);
    setSocialLoading(true);
    try {
      const { error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (socialError) {
        setError(socialError.message || "Could not start Google sign-in. Please try again.");
        setSocialLoading(false);
      }
      // On success the client redirects to Google automatically, so we
      // intentionally leave the spinner running.
    } catch {
      setError("Something went wrong while starting Google sign-in. Please try again.");
      setSocialLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-[#F1F6F9] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-[#E2EEF6] bg-white p-6 shadow-sm sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <BrandMark />

            <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Sign in to keep borrowing and discovering new reads.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Email + password form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#1E293B]"
              >
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0F172A] shadow-xs transition-all placeholder:text-slate-400 focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#1E293B]"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-12 pl-4 text-sm text-[#0F172A] shadow-xs transition-all placeholder:text-slate-400 focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3.5 text-slate-400 transition-colors hover:text-[#0F4A6B]"
                >
                  {showPassword ? (
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.056 10.056 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F4A6B] px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0C3B56] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Social login — only rendered when the server has Google enabled. */}
          {isGoogleAuthEnabled && (
            <>
              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium tracking-wide text-[#94A3B8] uppercase">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={socialLoading}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#1E293B] shadow-xs transition-colors hover:border-[#0F4A6B]/40 hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {socialLoading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin text-[#0F4A6B]"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Redirecting…</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-[#64748B]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#F97316] transition-colors hover:text-[#EA580C] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
