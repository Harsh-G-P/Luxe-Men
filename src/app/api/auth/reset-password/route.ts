import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import prisma from "@/app/lib/prisma";
import { hashToken } from "@/app/lib/tokens";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {

    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return errorResponse("Invalid request", 400)
        }


        const tokenHash = hashToken(token)

        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                tokenHash,
                expiresAt: {
                    gt: new Date()
                }
            }
        })

        if (!resetToken) {
            return errorResponse("Invalid or expired token", 400)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const pass = await prisma.user.update({
            where: {
                id: resetToken.userId
            },
            data: {
                password: hashedPassword
            }
        })
        
        //delete tokens
        const del = await prisma.passwordResetToken.deleteMany({
            where: {
                userId: resetToken.userId,
            },
        });

        return successResponse("Password updated successfully")

    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error)

        return Response.json(
            {
                success: false,
                message: String(error)
            },
            { status: 500 }
        )
    }
}