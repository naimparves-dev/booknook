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

/**
 * BookNook sign-up form. `googleEnabled` is supplied by the server page so
 * the Google button only ever appears when the server registered the
 * provider.
 */
export default function RegisterForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /**
   * Surfaces a message in the inline alert (existing behaviour) *and* as a
   * toast. The fixed id keeps repeated failures from stacking up.
   */
  const showError = (message: string) => {
    setError(message);
    toast.error(message, { id: "signup" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || googleLoading) return; // guard against double-submit

    setError(null);

    // Client-side validation before hitting the server.
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedAvatar = avatarUrl.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail || !password) {
      showError("Please fill in your name, email, and password.");
      return;
    }
    if (trimmedName.length < 2) {
      showError("Your name must be at least 2 characters long.");
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      showError("Please enter a valid email address.");
      return;
    }
    // Better Auth rejects passwords shorter than 8 characters by default,
    // so we surface the same rule here for instant feedback — the form
    // never reaches the API with an invalid password.
    if (password.length < 8) {
      showError("Password must be at least 8 characters long.");
      return;
    }
    if (trimmedAvatar) {
      try {
        const parsed = new URL(trimmedAvatar);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error("unsupported protocol");
        }
      } catch {
        showError("Please enter a valid avatar URL (including http/https).");
        return;
      }
    }

    setSubmitting(true);
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
        showError(describeAuthError(signUpError, "Could not create your account. Please try again."));
        return;
      }

      toast.success("Account created! Welcome to BookNook.", { id: "signup" });

      // The session cookie is set by the server, so refresh the cached
      // server components (Navbar) and head back to the page the proxy
      // bounced the user from (or home when there is none).
      router.push(getPostLoginRedirect());
      router.refresh();
    } catch (err) {
      showError(describeAuthError(err, "Could not create your account. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Google has a single social endpoint: it signs the user in and creates
   * the account on first visit, so sign-in and sign-up share this handler.
   */
  const handleGoogleSignUp = async () => {
    if (submitting || googleLoading) return;
    setGoogleLoading(true);
    setError(null);

    try {
      const { error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: getPostLoginRedirect(),
      });

      // Better Auth reports OAuth problems on the result instead of throwing.
      if (socialError) {
        showError(describeAuthError(socialError, "Could not start Google sign-up. Please try again."));
        setGoogleLoading(false);
        return;
      }

      // The client is redirected to Google, so nothing else runs here.
    } catch {
      showError("Could not start Google sign-up. Please try again.");
      setGoogleLoading(false);
    }
  };

  const loading = submitting || googleLoading;

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
          {error && <AuthErrorAlert message={error} />}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Field id="name" label="Full Name" required>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                disabled={loading}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g., Arif Hossain"
                className={authInputClassName}
              />
            </Field>

            <Field id="email" label="Email address" required>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={authInputClassName}
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
                  disabled={loading}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className={`${authInputClassName} pr-12`}
                />
                <PasswordVisibilityToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                />
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
                disabled={loading}
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className={authInputClassName}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F4A6B] px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0C3B56] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <AuthSpinner className="h-5 w-5" />
                  <span>Creating account…</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Social sign-up */}
          {googleEnabled && (
            <>
              <SocialDivider />
              <button
                type="button"
                onClick={handleGoogleSignUp}
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
                    Sign up with Google
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-[#64748B]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#F97316] transition-colors hover:text-[#EA580C] hover:underline"
            onClick={(event) => {
              // Keep the proxy's destination alive across the detour back
              // to the sign-in screen.
              const target = readRedirectParam();
              if (!target) return;
              event.preventDefault();
              router.push(`/login?redirect=${encodeURIComponent(target)}`);
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
