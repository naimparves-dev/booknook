import { createAuthClient } from "better-auth/react";

/**
 * Single Better Auth client instance shared by the whole app.
 * `baseURL` points at the server that hosts `src/app/api/auth/[...all]`.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

// Convenience re-exports so callers can import just the piece they need.
export const { signIn, signUp, signOut, useSession } = authClient;

/**
 * Client-side mirror of the server's Google OAuth configuration.
 *
 * `src/lib/auth.ts` only registers the `google` social provider when
 * `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are set. This public flag lets
 * the login page render the "Continue with Google" button only when that is
 * actually true, so users never see a button that is guaranteed to fail.
 */
export const isGoogleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
