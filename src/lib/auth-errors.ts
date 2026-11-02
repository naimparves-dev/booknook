/**
 * Turn an unknown thrown value from a Better Auth client call into a message
 * that is safe and useful to show a user.
 *
 * Network failures (server down, wrong origin, CORS) throw a bare
 * `TypeError: Failed to fetch` with no context, which would otherwise be
 * swallowed by a generic "something went wrong" message.
 */
export function describeAuthError(error: unknown, fallback: string): string {
  if (error instanceof TypeError) {
    // `fetch` rejects with a TypeError when it cannot reach the server at all.
    return "Could not reach the server. Please check your connection and try again.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
