import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return errorResponse("Unauthrozied", 401)
    }
    let body
    try {
        const routeParams = await params
        const id_result = idSchema.safeParse(routeParams)

        if (!id_result.success) {
            console.log(
                id_result.error.flatten()
            );
            return errorResponse("Invalid ID", 400)
        }

        const { id } = id_result.data

        const exisitingProduct = await prisma.product.findFirst({
            where: {
                id,
                isActive: true
            },
            select: {
                id: true,
                title: true,
            }
        })

        if (!exisitingProduct) {
            return errorResponse("Product not found ", 404)
        }

        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                userId: session.user.id,
                productId: id
            },
            select: {
                id: true,
                createdAt: true,
                product: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        price: true,
                        images: true,
                    },
                },
            }
        })

        return successResponse("Product added to wishlist successfully",wishlistItem, 201);

    } catch (error) {

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return errorResponse(
                "Product is already in your wishlist",
                409
            );
        }

        console.log("Wishlist POST API:", error)
        return errorResponse("Internal Server Error");
    }
}
