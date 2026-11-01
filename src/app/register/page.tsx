"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";

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
/* Field wrapper shared by every input on this screen.                  */
/* ------------------------------------------------------------------ */
interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

function Field({ id, label, required = false, children, hint }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-[#1E293B]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#94A3B8]">{hint}</p>}
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0F172A] shadow-xs transition-all placeholder:text-slate-400 focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 focus:outline-none";

/* ------------------------------------------------------------------ */
/* Sign-up form                                                         */
/* ------------------------------------------------------------------ */
function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return; // guard against double-submit

    setError(null);

    // Client-side validation before hitting the server.
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedAvatar = avatarUrl.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail || !password) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Your name must be at least 2 characters long.");
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    // Better Auth rejects passwords shorter than 8 characters by default,
    // so we surface the same rule here for instant feedback.
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (trimmedAvatar) {
      try {
        const parsed = new URL(trimmedAvatar);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error("unsupported protocol");
        }
      } catch {
        setError("Please enter a valid avatar URL (including http/https).");
        return;
      }
    }

    setLoading(true);
    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
        // Better Auth stores this as the user's avatar; only send it when
        // the field was actually filled in.
        ...(trimmedAvatar ? { image: trimmedAvatar } : {}),
      });

      if (signUpError) {
        setError(signUpError.message || "Could not create your account. Please try again.");
        return;
      }

      // The session cookie is set by the server, so refresh the cached
      // server components (Navbar) and land on the homepage.
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong while creating your account. Please try again.");
    } finally {
      setLoading(false);
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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Join BookNook and start borrowing from our community library.
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

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Field id="name" label="Full Name" required>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g., Arif Hossain"
                className={inputClassName}
              />
            </Field>

            <Field id="email" label="Email address" required>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={inputClassName}
              />
            </Field>

            <Field
              id="password"
              label="Password"
              required
              hint="Must be at least 8 characters long."
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className={`${inputClassName} pr-12`}
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
            </Field>

            <Field
              id="avatarUrl"
              label="Avatar URL"
              hint="Optional — paste an image link to personalize your profile."
            >
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className={inputClassName}
              />
            </Field>

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
                  <span>Creating account…</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-[#64748B]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#F97316] transition-colors hover:text-[#EA580C] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function RegisterPage() {
  return <SignUpForm />;
}
