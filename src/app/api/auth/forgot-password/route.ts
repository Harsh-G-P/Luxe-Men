import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import prisma from "@/app/lib/prisma";
import { forgotPasswordLimiter } from "@/app/lib/redis/limiters";
import { sendPasswordResetEmail } from "@/app/lib/sendPasswordResetEmail";
import { generateVerificationToken } from "@/app/lib/tokens";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    try {
         //rate-limit
                const limiter = await forgotPasswordLimiter(req)
                console.log("rate limit", limiter)
        
                if (!limiter.allowed) {
                    return Response.json(
                {
                    success: false,
                    type:"RateLimit",
                    message: "Too many forgot password attempts",
                    retryAfter: limiter.retryAfter,
                    remaining: limiter.remaining,
                },
                { status: 429 }
            )
                }
                
        const { email } = await req.json()

        if (!email || typeof email !== "string") {
            return errorResponse("Please enter a valid email address", 400)
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return errorResponse("If the email exists,a reset link has been sent.", 400)
        }

        //delete old tokens
        const del = await prisma.passwordResetToken.deleteMany({
            where:{
                userId:user.id
            }
        }) 

        //create token
        const { token,tokenHash }= generateVerificationToken()

        const create = await prisma.passwordResetToken.create({
            data:{
                userId:user.id,
                tokenHash,
                expiresAt: new Date(Date.now() + 1000 * 60 * 30), //30min
            }
        })

        //Create link
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

        const send = await sendPasswordResetEmail(
            user.email,
            user.name,
            resetLink
        )

        return successResponse("If the account exists, a verification email has been sent.")

    } catch (error) {
        console.error("Forget Password API Error:", error)
        return errorResponse("Internal Server Error")
    }
}