import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { brandSchema } from "@/app/lib/validations/brand";
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

        const exisitingBrand = await prisma.brand.findUnique({
            where: {
                id
            }
        })

        if (!exisitingBrand) {
            return errorResponse("Brand not found ", 404)
        }

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const del = await prisma.brand.delete({
            where: {
                id
            }
        })

        return successResponse("Brand deleted successfully", 200)

    } catch (error) {
        console.log("Brand Delete API:", error)

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === "P2025") {
                return errorResponse(
                    "Brand not found",
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

        const bodyResult = brandSchema.safeParse(body)

        if (!bodyResult.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(bodyResult.error.issues))
        }

        const validate = bodyResult.data

        const existingBrand = await prisma.brand.findUnique({
            where: {
                id
            }
        })

        if (!existingBrand) {
            return errorResponse("Brand not found ", 404)
        }

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const update = await prisma.brand.update({
            where: {
                id
            },
            data: validate
        })

        return successResponse("Brand updated successfully", 200)

    } catch (error) {
        console.log("Brand Update API:", error)

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === "P2025") {
                return errorResponse(
                    "Brand not found",
                    404
                )
            }
        }

        return errorResponse("Internal Server Error");
    }
}