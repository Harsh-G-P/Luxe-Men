import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { formatZodErrors, profileSchema } from "@/app/lib/validations/userSchema";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";



export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    let body
    try {
        body = await req.json()

        const result = profileSchema.safeParse(body)

        if (!result.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(result.error.issues))
        }

        const { name, username, image } = result.data

        const exisitingUser = await prisma.user.findFirst({
            where: {
                id: session.user.id
            }
        })

        if (!exisitingUser) {
            return errorResponse("This username is unavailable", 400)
        }

        const user = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name,
                username,
                image
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
            }
        })

        return successResponse("Profile Updated successfully")

    } catch (error) {
        console.error("Profile Update API:", error);
        return errorResponse("Internal Server Error");
    }

}