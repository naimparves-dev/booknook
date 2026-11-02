import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client shared by the whole app.
 *
 * IMPORTANT: `baseURL` is intentionally left unset. Better Auth's route
 * handler lives in THIS Next.js app at `src/app/api/auth/[...all]`, so the
 * client must call the current origin (it resolves to `/api/auth` by
 * default).
 *
 * Do NOT point this at `NEXT_PUBLIC_SERVER_URL`: that value targets the
 * separate books/borrows API on port 5000, which has no auth routes and
 * answers `/api/auth/*` with a 404 — sign-in/sign-up silently fail there.
 */

export const authClient = createAuthClient({
  plugins: [
    jwtClient() 
  ]
})
// Convenience re-exports so callers can import just the piece they need.
export const { signIn, signUp, signOut, useSession } = authClient;

// NOTE: Google availability is decided server-side only. Pages read
// `isGoogleAuthEnabled()` from `@/lib/google-auth` and pass it into the
// forms as a prop — there is no `NEXT_PUBLIC_*` flag to keep in sync.
