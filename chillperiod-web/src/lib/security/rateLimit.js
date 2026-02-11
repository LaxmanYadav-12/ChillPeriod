/**
 * In-memory rate limiter for API routes.
 * 
 * Supports per-IP and per-user rate limiting with configurable tiers.
 * Uses a Map with automatic TTL cleanup to prevent memory leaks.
 * 
 * OWASP: Protects against brute-force, credential stuffing, and DDoS.
 */

// Rate limit tiers (requests per window)
const TIERS = {
  read:  { limit: 60, windowMs: 60_000 },   // 60 req/min — GET endpoints
  write: { limit: 20, windowMs: 60_000 },   // 20 req/min — POST/PATCH/DELETE
  auth:  { limit: 10, windowMs: 60_000 },   // 10 req/min — login/register paths
};

// Shared store across all route invocations (module-level singleton)
const store = new Map();

// Cleanup stale entries every 60s to prevent unbounded memory growth
let cleanupInterval = null;
function ensureCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now - entry.windowStart > entry.windowMs * 2) {
        store.delete(key);
      }
    }
  }, 60_000);
  // Don't hold the process open for cleanup
  if (cleanupInterval.unref) cleanupInterval.unref();
}

/**
 * Check rate limit for a given key.
 * 
 * @param {string} key   — unique identifier (IP, userId, or composite)
 * @param {string} tier  — one of 'read', 'write', 'auth'
 * @returns {{ allowed: boolean, retryAfter?: number, remaining: number }}
 */
export function checkRateLimit(key, tier = 'read') {
  ensureCleanup();

  const config = TIERS[tier] || TIERS.read;
  const now = Date.now();
  const storeKey = `${tier}:${key}`;

  let entry = store.get(storeKey);

  if (!entry || now - entry.windowStart > config.windowMs) {
    // New window
    entry = { count: 1, windowStart: now, windowMs: config.windowMs };
    store.set(storeKey, entry);
    return { allowed: true, remaining: config.limit - 1 };
  }

  entry.count++;

  if (entry.count > config.limit) {
    const retryAfter = Math.ceil((entry.windowStart + config.windowMs - now) / 1000);
    return { allowed: false, retryAfter, remaining: 0 };
  }

  return { allowed: true, remaining: config.limit - entry.count };
}

/**
 * Build a composite rate limit key from the request.
 * Uses user ID if authenticated, otherwise falls back to IP.
 */
export function getRateLimitKey(req, session = null) {
  if (session?.user?.id) return `user:${session.user.id}`;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  return `ip:${ip}`;
}
