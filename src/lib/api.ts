/**
 * Authenticated access to the BookNook API (`NEXT_PUBLIC_SERVER_URL`).
 *
 * That API guards every personal route behind `verifyApi`, which expects
 * `Authorization: Bearer <jwt>`. The JWT is minted by Better Auth for the
 * signed-in session, so we ask `/api/auth/token` for one — the session
 * cookie rides along automatically because both live on this origin.
 *
 * Client Components only. Server Components cannot call `/api/auth/token`
 * (they have no browser), so they must use `serverApiFetch` from
 * `@/lib/server-api`, which signs the JWT in-process instead.
 */

/** How long a minted JWT is reused before being refreshed proactively. */
const TOKEN_MAX_AGE_MS = 5 * 60 * 1000;

let cached: { token: string; at: number } | null = null;
let inflight: Promise<string | null> | null = null;

async function requestToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/token", {
      credentials: "include",
      cache: "no-store",
    });

    // 401 simply means nobody is signed in — not an error worth throwing.
    if (!res.ok) return null;

    const data: unknown = await res.json();
    const token = (data as { token?: unknown })?.token;
    if (typeof token !== "string" || !token) return null;

    cached = { token, at: Date.now() };
    return token;
  } catch {
    return null;
  }
}

/** Resolve a JWT for the current session, or `null` when signed out. */
export function getApiToken(): Promise<string | null> {
  if (cached && Date.now() - cached.at < TOKEN_MAX_AGE_MS) {
    return Promise.resolve(cached.token);
  }

  // Concurrent callers (parallel `Promise.all` fetches) share one request.
  if (inflight) return inflight;

  inflight = requestToken().finally(() => {
    inflight = null;
  });
  return inflight;
}

/** Discard the cached JWT so the next call mints a fresh one. */
export function invalidateApiToken(): void {
  cached = null;
}

function withAuth(init: RequestInit | undefined, token: string | null): RequestInit {
  const next: RequestInit = { ...init };

  if (token) {
    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${token}`);
    next.headers = headers;
  }

  return next;
}

async function send(url: string, init: RequestInit | undefined, token: string | null) {
  return fetch(url, withAuth(init, token));
}

/**
 * `fetch` against the BookNook API with the bearer token attached.
 *
 * A 401 means the cached JWT went stale mid-session: it is dropped, a fresh
 * one is minted, and the request is retried exactly once.
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
  const url = `${base}${path}`;

  const token = await getApiToken();
  let res = await send(url, init, token);

  if (res.status === 401 && token) {
    invalidateApiToken();

    const refreshed = await getApiToken();
    if (refreshed && refreshed !== token) {
      res = await send(url, init, refreshed);
    }
  }

  return res;
}
