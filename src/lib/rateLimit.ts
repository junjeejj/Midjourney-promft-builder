export type RateLimitResult = {
  success: boolean;
  reset: number;
  remaining?: number;
};

type RateLimiter = {
  limit: (key: string) => Promise<RateLimitResult>;
};

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const LIMIT = Number(process.env.RATE_LIMIT_LIMIT || 30);

type RateLimiterCache = {
  memory?: RateLimiter;
  upstash?: RateLimiter;
};

const globalAny = globalThis as typeof globalThis & {
  __rl_instance?: RateLimiterCache;
};

if (!globalAny.__rl_instance) {
  globalAny.__rl_instance = {};
}

const cache = globalAny.__rl_instance;

export async function getRateLimiter(): Promise<RateLimiter> {
  const backend = (process.env.RATE_LIMIT_BACKEND || "memory").toLowerCase();

  if (backend !== "upstash") {
    if (!cache.memory) {
      const buckets = new Map<string, { count: number; resetAt: number }>();
      cache.memory = {
        limit: async (key: string) => {
          const now = Date.now();
          const bucket = buckets.get(key);
          if (!bucket || now > bucket.resetAt) {
            const resetAt = now + WINDOW_MS;
            buckets.set(key, { count: 1, resetAt });
            return { success: true, reset: resetAt, remaining: LIMIT - 1 };
          }
          if (bucket.count >= LIMIT) {
            return { success: false, reset: bucket.resetAt, remaining: 0 };
          }
          bucket.count += 1;
          return { success: true, reset: bucket.resetAt, remaining: LIMIT - bucket.count };
        },
      };
    }
    return cache.memory;
  }

  if (!cache.upstash) {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("Missing Upstash envs");
    }

    const redis = new Redis({ url, token });
    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(LIMIT, "1 m"),
    });

    cache.upstash = {
      limit: async (key: string) => {
        const { success, reset, remaining } = await rl.limit(key);
        return { success, reset, remaining };
      },
    };
  }

  return cache.upstash;
}


