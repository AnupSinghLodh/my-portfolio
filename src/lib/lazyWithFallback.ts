/** Wraps a dynamic import so a failed chunk load (404 after a redeploy, dropped connection) resolves to `fallback`. */
export function withFallback<T>(load: () => Promise<{ default: T }>, fallback: T): () => Promise<{ default: T }> {
  return () => load().catch(() => ({ default: fallback }));
}
