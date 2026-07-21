import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { updateCartSchema } from "@/app/lib/validations/cart";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
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

export async function PUT(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
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

        const bodyResult = updateCartSchema.safeParse(body)

        if (!bodyResult.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(bodyResult.error.issues))
        }

        const validate = bodyResult.data

        const cartItem = await prisma.cartItem.findUnique({
            where: {
                id
            },
            include: {
                cart: true,
                variant: true
            }
        })

        if (!cartItem) {
            return errorResponse("Cart item not found", 404)
        }

        if (cartItem.cart.userId !== session.user.id) {
            return errorResponse("Forbidden", 403)
        }

        if (!cartItem.variant) {
            return errorResponse("Variant not found", 404)
        }

        if (validate.quantity > cartItem.variant.stock) {
            return errorResponse("Insufficient stock", 400);
        }

        await prisma.cartItem.update({
            where: {
                id,
            },
            data: {
                quantity: validate.quantity,
            },
        });

        return successResponse("Cart updated successfully.");

    } catch (error) {
        console.log("Cart Put API:", error)
        return errorResponse("Internal Server Error");
    }
}
