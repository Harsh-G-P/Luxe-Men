
export const SECURITY_CONFIG = {
    LOGIN: {
        MAX_ATTEMPTS :5, //5 attempts
        BLOCK_TIME_MS: 15 * 60 * 1000, //15 minutes
        COOLDOWN_MS: 1 * 1000, //1 sec
        RATE_LIMIT_WINDOW: 60 * 1000,//1 minute
        RATE_LIMIT_MAX_LOGIN:15, //15 attempts
        RATE_LIMIT_MAX_SIGNUP:7, //7 attempts
    }
}