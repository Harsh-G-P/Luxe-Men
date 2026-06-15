import redis from "./redis";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const redisKey = `rate:${key}`;

  const count = await redis.incr(redisKey);

  if (count === 1) {
    await redis.expire(redisKey, Math.ceil(windowMs / 1000));
  }

  if (count > limit) {
    const ttl = await redis.ttl(redisKey);

    return {
      allowed: false,
      remaining: 0,
      retryAfter: ttl > 0 ? ttl : 0,
    };
  }

  return {
    allowed: true,
    remaining: limit - count,
    retryAfter: 0,
  };
}