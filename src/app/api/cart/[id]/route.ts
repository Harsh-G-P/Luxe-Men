import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
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

        const cartItem = await prisma.cartItem.findUnique({
            where: {
                id
            },
            include: {
                cart: true
            }
        })

        if (!cartItem) {
            return errorResponse("Cart item not found ", 404)
        }

         if (cartItem.cart.userId !== session.user.id) {
            return errorResponse("Forbidden", 403);
        }

        if (cartItem.variantId) {
            await prisma.productVariant.update({
                where: {
                    id: cartItem.variantId,
                },
                data: {
                    stock: {
                        increment: cartItem.quantity,
                    },
                },
            });
        }

        await prisma.cartItem.delete({
            where: {
                id,
            },
        });

        return successResponse("Item removed from cart.")

    } catch (error) {
        console.log("Cart Delete API:", error)
        return errorResponse("Internal Server Error");
    }
}
