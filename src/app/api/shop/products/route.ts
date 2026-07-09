import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import prisma from "@/app/lib/prisma";


export async function GET() {
    try {

        const products = await prisma.product.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                title: true,
                price: true,
                images: true,
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
                        stock: true,
                        price: true,
                        attributes: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },

        })

        const response = products.map((product) => ({
            ...product,
            price: product.price.toString(),
            images: product!.images as string[],
            variants: product.variants.map((variant) => ({
                ...variant,
                price: variant.price?.toString() ?? null,
            })),
        }));

        return successResponse("Products fetch successfully", response)
    } catch (error) {
        console.log("Shop Product GET API", error)
        return errorResponse("Internal Server Error")
    }
}
