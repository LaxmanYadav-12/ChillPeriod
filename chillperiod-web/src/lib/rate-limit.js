import { LRUCache } from 'lru-cache';

const tokenCache = new LRUCache({
  max: 500, // Maximum number of tokens (IPs) to store
  ttl: 60 * 1000, // Time to live in milliseconds (1 minute)
});

export default function rateLimit(options) {
  return {
    check: (res, limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
        } else {
          tokenCount[0] += 1;
          tokenCache.set(token, tokenCount);
        }
        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        res.headers.set('X-RateLimit-Limit', limit);
        res.headers.set('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage);

        return isRateLimited ? reject() : resolve();
      }),
  };
}
