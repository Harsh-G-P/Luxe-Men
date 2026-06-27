import { errorResponse, successResponse } from "@/app/lib/apiResponse"
import prisma from "@/app/lib/prisma"
import { formatZodErrors, userSchema } from "@/app/lib/validations/user"
import bcrypt from "bcryptjs"
import { Prisma } from "@/generated/prisma/client";
import { NextRequest } from "next/server"
import { signupLimiter } from "@/app/lib/redis/limiters";
import { generateVerificationToken } from "@/app/lib/tokens";
import { sendVerificationEmail } from "@/app/lib/email";

export async function POST(req: NextRequest) {
    let body
    try {
        //rate-limit
        const limiter = await signupLimiter(req)
        console.log("rate limit", limiter)

        if (!limiter.allowed) {
            return Response.json(
        {
            success: false,
            message: "Too many registration attempts",
            retryAfter: limiter.retryAfter,
            remaining: limiter.remaining,
        },
        { status: 429 }
    )
        }

        body = await req.json()
        const result = userSchema.safeParse(body)

        if (!result.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(result.error.issues))
        }

        const validated = result.data

        //Hash password before saving to database
        const hashPassword = await bcrypt.hash(validated.password, 10)

        //Create new user in database
        const user = await prisma.user.create({
            data: {
                name: validated.name,
                username: validated.username,
                email: validated.email,
                password: hashPassword
            }
        })
        
        try{
        const {token,tokenHash}= generateVerificationToken()

        const verify = await prisma.verificationToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: new Date(
                    Date.now() + 1000 * 60 * 60
                )
            }
        })

        const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

        const send = await sendVerificationEmail(
            user.email,
            user.name,
            verificationLink
        )
    } catch(emailError){
        console.error(
            "Verification email failed:",
            emailError
        )
    }

        return successResponse("Account created successfully. Please verify your email.")

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {

            // Unique constraint error
            if (error.code === "P2002") {

                const message = error.message.toLowerCase();

                if (message.includes("email")) {
                    return errorResponse(
                        "Unable to create account. Please check your details or sign in if you already have an account.",
                        409
                    );
                }

                if (message.includes("username")) {
                    return errorResponse(
                        "Username is already taken.",
                        409
                    );
                }

                return errorResponse(
                    "We couldn't create your account. Please try again.",
                    409
                );
            }
        }
        console.log("Register API Error",error)
        return errorResponse("Internal Server Error")
    }
}