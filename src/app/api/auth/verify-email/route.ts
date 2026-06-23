import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import prisma from "@/app/lib/prisma";
import { hashToken } from "@/app/lib/tokens";
import { NextRequest } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get("token")

        if (!token) {
            return errorResponse("Invalid verification link", 400)
        }

        const tokenHash = hashToken(token)

        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                tokenHash,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                user: true
            }
        })

        if (!verificationToken) {
            return errorResponse("Verification link is invalid or expired", 400)
        }

        await prisma.user.update({
            where: {
                id: verificationToken.userId,
            },
            data: {
                emailVerified: new Date()
            }
        })

        await prisma.verificationToken.deleteMany({
            where: {
                userId: verificationToken.userId
            }
        })

        return successResponse("Email verified successfully")

    } catch (error) {
        console.error("Verification API:",error)
        return errorResponse("Internal Server Error")
    }
}