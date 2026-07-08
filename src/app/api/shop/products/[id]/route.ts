import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { NextRequest } from "next/server";


type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(req: NextRequest, { params }: Params) {

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

        const product = await prisma.product.findFirst({
            where: {
                id,
                isActive: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                images: true,

                isActive: true,
                isFeatured: true,
                bestseller: true,

                createdAt: true,

                brand: {
                    select: {
                        id: true,
                        title: true,
                    },
                },

                category: {
                    select: {
                        id: true,
                        title: true,
                    },
                },

                variants: {
                    select: {
                        id: true,
                        sku: true,
                        attributes: true,
                        price: true,
                        stock: true,
                    },
                },
            },
        })

        if (!product) {
            return errorResponse("Product not found", 404);
        }

        const response = {
            ...product,
            price: product.price.toString(),
            images: product.images as string[],
            variants: product.variants.map((variant) => ({
                ...variant,
                price: variant.price?.toString() ?? null,
            })),
        };

        return successResponse("Product fetched successfully", response, 200)

    } catch (error) {
        console.log("Shop Product GET API:", error)

        return errorResponse("Internal Server Error");
    }
}