import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { brandSchema } from "@/app/lib/validations/brand";
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

        const result = brandSchema.safeParse(body)

        if (!result.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(result.error.issues))
        }

        const validated = result.data

        const existingBrand = await prisma.brand.findUnique({
            where: {
                title: validated.title
            }
        })

        if (existingBrand) {
            return errorResponse("Brand already exists", 409)
        }

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const brand = await prisma.brand.create({
            data: {
                ...validated
            }
        })

        return successResponse("Brand created successfully", brand, 201)

    } catch (error) {

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            // Unique constraint error
            if (error.code === "P2002") {
                return errorResponse(
                    "Brand already exists",
                    409
                )
            }

        }

        console.log("Brand POST API", error)
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

        const brand = await prisma.brand.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return successResponse("Brand fetch successfully", brand, 200)

    } catch (error) {

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            // Unique constraint error
            if (error.code === "P2025") {
                return errorResponse(
                    "Brand not found",
                    404
                )
            }
        }

        console.log("Brand GET API", error)
        return errorResponse("Internal Server Error")
    }
}