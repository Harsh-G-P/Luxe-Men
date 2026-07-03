import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { categoryAttributeSchema } from "@/app/lib/validations/categoryAttribute";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
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

        const result = categoryAttributeSchema.safeParse(body)

        if (!result.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(result.error.issues))
        }

        const validated = result.data

        const existingAttribute = await prisma.categoryAttribute.findFirst({
            where: {
                categoryId: validated.categoryId,
                title: validated.title
            }
        })
        if (existingAttribute) {
            return errorResponse("Attribute already exists for this category", 409)
        }

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const attribute = await prisma.categoryAttribute.create({
            data: {
                ...validated
            }
        })

        return successResponse("Attribute created successfully", attribute, 201)

    } catch (error) {

        console.log("CategoryAttribute POST API", error)
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

        const attribute = await prisma.categoryAttribute.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                category: true
            }
        })

        return successResponse("Attribute fetch successfully", attribute, 200)

    } catch (error) {

        console.log("CategoryAttribute GET API", error)
        return errorResponse("Internal Server Error")
    }
}