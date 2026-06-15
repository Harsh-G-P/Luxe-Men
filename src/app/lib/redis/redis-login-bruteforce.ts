import { SECURITY_CONFIG } from "./security-config";
import redis from "./redis"

export async function isLoginBlocked(email:string){
    const blockKey = `login-block:${email}`

    const exists = await redis.exists(blockKey)

    return exists === 1
}

export async function recordFailedLogin(
  email: string
) {
  const attemptsKey = `login-attempts:${email}`;
  const blockKey = `login-block:${email}`;

  const attempts = await redis.incr(attemptsKey);

  if (attempts === 1) {
    await redis.expire(
      attemptsKey,
      SECURITY_CONFIG.LOGIN.BLOCK_TIME_MS / 1000
    );
  }

  if (
    attempts >
    SECURITY_CONFIG.LOGIN.MAX_ATTEMPTS
  ) {
    await redis.set(
      blockKey,
      "blocked",
      {
        ex:
          SECURITY_CONFIG.LOGIN.BLOCK_TIME_MS /
          1000,
      }
    );
  }

  return attempts;
}

export async function resetFailedLogin(
  email: string
) {
  const attemptsKey = `login-attempts:${email}`;
  const blockKey = `login-block:${email}`;

  await redis.del(attemptsKey);
  await redis.del(blockKey);
}

export async function getLoginCooldown(
  email: string
) {
  const blockKey = `login-block:${email}`;

  const ttl = await redis.ttl(blockKey);

  return ttl > 0 ? ttl : 0;
}