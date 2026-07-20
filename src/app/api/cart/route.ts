import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { cartSchema } from "@/app/lib/validations/cart";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return errorResponse("Unauthorized", 401);
    }

    try {
        const body = await req.json();

        const result = cartSchema.safeParse(body);

        if (!result.success) {
            return errorResponse(
                "Validation Error",
                400,
                formatZodErrors(result.error.issues)
            );
        }

        const validate = result.data;

        const product = await prisma.product.findUnique({
            where: {
                id: validate.productId,
            },
        });

        if (!product) {
            return errorResponse("Product not found", 404);
        }

        if (!product.isActive) {
            return errorResponse("Product is unavailable", 400);
        }

        const variant = await prisma.productVariant.findUnique({
            where: {
                id: validate.variantId,
            },
        });

        if (!variant) {
            return errorResponse("Variant not found", 404);
        }

        if (variant.productId !== product.id) {
            return errorResponse(
                "Variant does not belong to this product",
                400
            );
        }

        if (variant.stock < validate.quantity) {
            return errorResponse("Insufficient stock", 400);
        }

        let cart = await prisma.cart.findUnique({
            where: {
                userId: session.user.id,
            },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: session.user.id,
                },
            });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: validate.productId,
                variantId: validate.variantId ?? null,
            },
        });

        if (cartItem) {
            const newQuantity = cartItem.quantity + validate.quantity;

            if (variant && newQuantity > variant.stock) {
                return errorResponse("Insufficient stock", 400);
            }

            await prisma.cartItem.update({
                where: {
                    id: cartItem.id,
                },
                data: {
                    quantity: newQuantity,
                },
            });

            return successResponse("Cart updated successfully.");
        }

        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: validate.productId,
                variantId: validate.variantId,
                quantity: validate.quantity,
            },
        });

        return successResponse("Product added to cart.");
    } catch (error) {
        console.error("Cart POST API:", error);
        return errorResponse("Internal Server Error");
    }
}

