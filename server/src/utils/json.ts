/**
 * Safely parse JSON strings with a fallback to avoid unhandled runtime exceptions.
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString || typeof jsonString !== 'string') {
    return fallback;
  }
  try {
    return JSON.parse(jsonString) as T;
  } catch (err) {
    return fallback;
  }
}

/**
 * Sanitize and limit search query string length.
 */
export function sanitizeSearchQuery(query: any, maxLength = 100): string | null {
  if (!query || typeof query !== 'string') {
    return null;
  }
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return trimmed.slice(0, maxLength);
}
