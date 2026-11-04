import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Authenticated access to the BookNook API (`NEXT_PUBLIC_SERVER_URL`) for
 * **Server Components**.
 *
 * Same `Authorization: Bearer <jwt>` contract as `@/lib/api`, but the JWT is
 * signed in-process from the request's session cookie instead of round-
 * tripping through `/api/auth/token`.
 *
 * ⚠️ Never import this from a Client Component: it pulls in `@/lib/auth`,
 * which opens a MongoDB connection at module load. Client Components should
 * use `apiFetch` from `@/lib/api`.
 *
 * ⚠️ `headers()` reads the request, so this must run inside a `<Suspense>`
 * boundary when `cacheComponents` is enabled.
 */
export async function getServerApiToken(): Promise<string | null> {
  try {
    const { token } = await auth.api.getToken({ headers: await headers() });
    return token ?? null;
  } catch {
    // No session (or the token endpoint refused) — callers send no header.
    return null;
  }
}

/** `fetch` against the BookNook API with the bearer token attached. */
export async function serverApiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
  const url = `${base}${path}`;

  const token = await getServerApiToken();
  const requestInit: RequestInit = { ...init };

  if (token) {
    const requestHeaders = new Headers(init?.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);
    requestInit.headers = requestHeaders;
  }

  return fetch(url, requestInit);
}
