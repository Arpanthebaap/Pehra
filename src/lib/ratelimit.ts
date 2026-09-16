/**
 * A small fixed-window rate limiter held in process memory.
 *
 * Gemini calls cost money and the endpoint is unauthenticated, so an open
 * /api/analyze is an invitation to run up someone else's bill. This is not a
 * distributed limiter - on multi-instance hosting it limits per instance - but
 * it closes the naive-abuse case, and the interface is small enough to swap for
 * Redis without touching the route.
 */

interface Window {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 6;
/** Bounds memory so a flood of unique IPs cannot grow the map without limit. */
const MAX_TRACKED_KEYS = 10_000;

const windows = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, now: number = Date.now()): RateLimitResult {
  const existing = windows.get(key);

  if (!existing || now >= existing.resetAt) {
    if (windows.size >= MAX_TRACKED_KEYS) evictExpired(now);
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - existing.count,
    retryAfterSeconds: 0,
  };
}

function evictExpired(now: number): void {
  for (const [key, window] of windows) {
    if (now >= window.resetAt) windows.delete(key);
  }
}

/** Test seam. */
export function resetRateLimiter(): void {
  windows.clear();
}

/**
 * Derives a limiter key from proxy headers. Falls back to a shared bucket
 * rather than to a per-request random value, so a missing header degrades
 * towards stricter limiting rather than towards none.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "anonymous";
}
