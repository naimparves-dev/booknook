/**
 * Shared helpers for turning a backend response — or a thrown `fetch` — into
 * a message that is safe and useful to show in a toast.
 *
 * The BookNook API usually answers with a bare Mongo result, so every helper
 * takes a caller-supplied fallback rather than assuming a shape.
 */

/**
 * Pull a human-readable message out of a response body.
 *
 * Used for non-OK responses so the backend's own wording wins when it sends
 * one; otherwise the caller's fallback is returned.
 */
export async function readApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const text = await response.text();
    if (!text.trim()) return fallback;

    try {
      const data: unknown = JSON.parse(text);
      if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        for (const key of ["message", "error", "msg", "detail"]) {
          const value = record[key];
          if (typeof value === "string" && value.trim()) {
            return value.trim();
          }
        }
      }
    } catch {
      // Not JSON — fall through and consider the raw body instead.
    }

    const trimmed = text.trim();
    // HTML error pages and oversized dumps are useless in a toast.
    if (trimmed.startsWith("<") || trimmed.length > 200) return fallback;
    return trimmed;
  } catch {
    return fallback;
  }
}

/**
 * Turn a value thrown from `fetch` into a toast-friendly message.
 *
 * Network failures reject with a bare `TypeError: Failed to fetch`, which
 * carries no context — without this it would be swallowed by the fallback.
 */
export function describeApiError(error: unknown, fallback: string): string {
  if (error instanceof TypeError) {
    return "Could not reach the server. Please check your connection and try again.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
