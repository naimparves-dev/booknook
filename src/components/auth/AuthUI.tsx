import React from "react";

/**
 * Shared presentational building blocks for the BookNook sign-in and
 * sign-up screens. Everything here is pure — no state, no side effects.
 */

/** BookNook open-book mark + wordmark. */
export function BrandMark() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F97316]/25 bg-[#FFF4ED] shadow-sm">
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

/** Google "G" glyph. */
export function GoogleIcon() {
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

/** Indeterminate spinner sized for inline button use. */
export function AuthSpinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

/** Inline error banner shown above the form. */
export function AuthErrorAlert({ message }: { message: string }) {
  return (
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
      <span>{message}</span>
    </div>
  );
}

/** The show/hide password toggle used on both forms. */
export function PasswordVisibilityToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3.5 text-slate-400 transition-colors hover:text-[#0F4A6B]"
    >
      {visible ? (
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.056 10.056 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      )}
    </button>
  );
}

/** "or continue with" hairline divider above the social button. */
export function SocialDivider() {
  return (
    <div className="my-6 flex items-center gap-4">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-medium tracking-wide text-[#94A3B8] uppercase">
        or continue with
      </span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

/** Shared input styling for the auth forms. */
export const authInputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0F172A] shadow-xs transition-all placeholder:text-slate-400 focus:border-[#0F4A6B] focus:ring-2 focus:ring-[#0F4A6B]/15 focus:outline-none";
