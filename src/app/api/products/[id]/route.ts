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
    if (!session) {
        return errorResponse("Unauthrozied", 401)
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

        const exisitingProduct = await prisma.product.findUnique({
            where: {
                id
            }
        })

        if (!exisitingProduct) {
            return errorResponse("Product not found ", 404)
        }

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const del = await prisma.product.delete({
            where: {
                id
            }
        })

        return successResponse("Product deleted successfully", 200)

    } catch (error) {
        console.log("Product Delete API:", error)

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === "P2025") {
                return errorResponse(
                    "Product not found",
                    404
                )
            }
        }

        return errorResponse("Internal Server Error");
    }
}