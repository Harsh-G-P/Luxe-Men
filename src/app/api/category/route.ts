import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { categorySchema } from "@/app/lib/validations/category";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { Prisma } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    let body
    try {
        body = await req.json()

        const result = categorySchema.safeParse(body)

        if (!result.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(result.error.issues))
        }

        const validated = result.data

        const existingCategory = await prisma.category.findUnique({
            where: {
                title: validated.title
            }
        })

        if (existingCategory) {
            return errorResponse("category already exists", 409)
        }

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const category = await prisma.category.create({
            data: {
                ...validated
            }
        })

        return successResponse("Category created successfully", category, 201)

    } catch (error) {

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            // Unique constraint error
            if (error.code === "P2002") {
                return errorResponse(
                    "Category already exists",
                    409
                )
            }

        }

        console.log("Category POST API", error)
        return errorResponse("Internal Server Error")
    }

}


export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    try {

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const category = await prisma.category.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return successResponse("Category fetch successfully", category, 200)

    } catch (error) {
        console.log("Category GET API", error)
        return errorResponse("Internal Server Error")
    }
}