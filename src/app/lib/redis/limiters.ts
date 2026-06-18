import { NextRequest } from "next/server";
import { rateLimit } from "./redis-rate-limit";
import { SECURITY_CONFIG } from "./security-config"


async function applyRateLimit(req: NextRequest, limit: number, windowMs: number) {
    //Get IP
    const forwardedFor = req.headers.get("x-forwarded-for")

    const ip = forwardedFor?.split(",")[0] ?? "unknown"

    return await rateLimit(ip,limit,windowMs)
}


//signup
export async function signupLimiter(req: NextRequest) {
    return applyRateLimit(
        req,
        SECURITY_CONFIG.LOGIN.RATE_LIMIT_MAX_SIGNUP,
        SECURITY_CONFIG.LOGIN.RATE_LIMIT_WINDOW)
}

//forget password
export async function forgotPasswordLimiter(req:NextRequest){
    return applyRateLimit(
        req,
        SECURITY_CONFIG.LOGIN.RATE_LIMIT_MAX_FORGOT_PASSWORD,
        SECURITY_CONFIG.LOGIN.RATE_LIMIT_WINDOW)
}
