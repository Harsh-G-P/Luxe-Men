
import { rateLimit } from "./redis-rate-limit";
import { SECURITY_CONFIG } from "./security-config";


//login
export function loginLimiter(email:string){
    return rateLimit(`login-${email}`,
        SECURITY_CONFIG.LOGIN.RATE_LIMIT_MAX_LOGIN,
        SECURITY_CONFIG.LOGIN.RATE_LIMIT_WINDOW
    )
}


