/**
 * Post-login destination handling for `src/proxy.ts`.
 *
 * The proxy sends signed-out users to `/login?redirect=<path>` so they land
 * back on the page they originally asked for. These helpers read that value
 * and guarantee it is a local path only — never an absolute URL — so a
 * crafted link cannot bounce a freshly authenticated session off-site.
 */

/** Returns `raw` when it is safe to redirect to, otherwise `null`. */
export function safeLocalPath(raw: string | null | undefined): string | null {
  if (!raw) return null;

  // Require a single leading slash. This rejects absolute URLs
  // ("https://evil.com"), protocol-relative hosts ("//evil.com") and the
  // backslash trick ("/\evil.com").
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return null;
  }

  return raw;
}

/**
 * Read `?redirect=` from the current URL, validated.
 *
 * Returns `null` when the parameter is absent or not a safe local path.
 * Only call this from an event handler — never during render. It reads
 * `window`, so it must never run on the server.
 */
export function readRedirectParam(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  return safeLocalPath(params.get("redirect"));
}

/** `readRedirectParam()` with a `/` fallback — what sign-in/sign-up target. */
export function getPostLoginRedirect(): string {
  return readRedirectParam() ?? "/";
}
