import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { categorySchema } from "@/app/lib/validations/category";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { Prisma } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";


type Params = {
    params: Promise<{
        id: string;
    }>;
};


export async function DELETE(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("unauthorized", 401)
    }

    try {

        const routeParams = await params
        const result = idSchema.safeParse(routeParams)

        if (!result.success) {
            console.log(
                result.error.flatten()
            );
            return errorResponse("Invalid ID", 400)
        }

        const { id } = result.data

        const exisitingCategory = await prisma.category.findUnique({
            where: {
                id
            }
        })

        if (!exisitingCategory) {
            return errorResponse("Category not found ", 404)
        }

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const del = await prisma.category.delete({
            where: {
                id
            }
        })

        return successResponse("Category deleted successfully", 200)

    } catch (error) {
        console.log("Category Delete API:", error)

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === "P2025") {
                return errorResponse(
                    "Category not found",
                    404
                )
            }
        }

        return errorResponse("Internal Server Error");
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("unauthorized", 401)
    }

    let body
    try {

        const routeParams = await params
        const result = idSchema.safeParse(routeParams)

        if (!result.success) {
            console.log(
                result.error.flatten()
            );
            return errorResponse("Invalid ID", 400)
        }

        const { id } = result.data

        body = await req.json()

        const bodyResult = categorySchema.safeParse(body)

        if (!bodyResult.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(bodyResult.error.issues))
        }

        const validate = bodyResult.data

        const existingCategory = await prisma.category.findUnique({
            where: {
                id
            }
        })

        if (!existingCategory) {
            return errorResponse("Category not found ", 404)
        }

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const update = await prisma.category.update({
            where: {
                id
            },
            data: validate
        })

        return successResponse("Category updated successfully", 200)

    } catch (error) {
        console.log("Category Update API:", error)

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === "P2025") {
                return errorResponse(
                    "Category not found",
                    404
                )
            }
        }

        return errorResponse("Internal Server Error");
    }
}