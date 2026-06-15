import { SECURITY_CONFIG } from "./security-config";
import redis from "./redis";

export async function requestCooldown(
  key: string | null
) {
  const redisKey = `cooldown:${key ?? "unknown"}`;

  const exists = await redis.get(redisKey);

  if (exists) {
    const ttl = await redis.ttl(redisKey);

    return {
      allowed: false,
      retryAfter: ttl > 0 ? ttl : 0,
    };
  }

  await redis.set(redisKey, "1");

  await redis.expire(
    redisKey,
    Math.ceil(
      SECURITY_CONFIG.LOGIN.COOLDOWN_MS / 1000
    )
  );

  return {
    allowed: true,
    retryAfter: 0,
  };
}