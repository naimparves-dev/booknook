/**
 * Server-only Google OAuth configuration.
 *
 * This is the single source of truth for whether Google sign-in is
 * available. Both the Better Auth server config (`src/lib/auth.ts`) and the
 * auth pages import it, so the registered provider and the rendered button
 * can never disagree — there is no `NEXT_PUBLIC_*` flag to forget.
 *
 * Do not import this from a client component.
 */

interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
}

/** The Google credentials, or `null` when they are not configured. */
export function getGoogleAuthConfig(): GoogleAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  return { clientId, clientSecret };
}

/** Whether Google sign-in should be offered. */
export function isGoogleAuthEnabled(): boolean {
  return getGoogleAuthConfig() !== null;
}
