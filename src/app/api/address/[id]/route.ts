import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
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

        const existingAddress = await prisma.address.findUnique({
            where: {
                id
            }
        })

        if (!existingAddress) {
            return errorResponse("Address not found ", 404)
        }

        if (existingAddress.userId !== session.user.id) {
            return errorResponse("Forbidden", 403)
        }

        const deleted = await prisma.address.delete({
            where: {
                id
            }
        })

        return successResponse("Address Deleted Successfully", 201)

    } catch (error) {
        console.log("Address Delete API:", error)

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === "P2025") {
                return errorResponse(
                    "Task not found",
                    404
                )
            }
        }

        return errorResponse("Internal Server Error");
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
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

        const existingAddress = await prisma.address.findUnique({
            where: {
                id
            }
        })

        if (!existingAddress) {
            return errorResponse("Address not found ", 404)
        }

        if (existingAddress.userId !== session.user.id) {
            return errorResponse("Forbidden", 403)
        }

        const updated = await prisma.$transaction([
            prisma.address.updateMany({
                where: {
                    userId: session.user.id,
                },
                data: {
                    isDefault: false,
                },
            }),

            prisma.address.update({
                where: {
                    id,
                },
                data: {
                    isDefault: true,
                },
            }),
        ]);

        return successResponse("Address Updated successfully", 201)
        
    } catch (error) {
        console.log("Address Delete API:", error)

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === "P2025") {
                return errorResponse(
                    "Task not found",
                    404
                )
            }
        }

        return errorResponse("Internal Server Error");
    }
}