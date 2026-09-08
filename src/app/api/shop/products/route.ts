import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import prisma from "@/app/lib/prisma";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(searchParams.get("limit")) || 10,
                1
            ),
            100
        );

        const skip = (page - 1) * limit;

        const [products, totalProducts] =
            await Promise.all([
                prisma.product.findMany({
                    where: {
                        isActive: true,
                    },

                    skip,
                    take: limit,

                    include: {
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

                        variants: true,
                    },

                    orderBy: {
                        createdAt: "desc",
                    },
                }),

                prisma.product.count({
                    where: {
                        isActive: true,
                    },
                }),
            ]);

        const totalPages = Math.ceil(
            totalProducts / limit
        );

        const response = products.map((product) => ({
            ...product,

            // IMPORTANT: Keep price as number
            price: Number(product.price),

            images:
                product.images as string[],

            variants: product.variants.map(
                (variant) => ({
                    ...variant,

                    price:
                        variant.price !== null
                            ? Number(variant.price)
                            : null,
                })
            ),
        }));

        return successResponse(
            "Products fetch successfully",
            {
                products: response,

                pagination: {
                    page,
                    limit,
                    totalProducts,
                    totalPages,

                    hasNextPage:
                        page < totalPages,

                    hasPreviousPage:
                        page > 1,
                },
            }
        );
    } catch (error) {
        console.log(
            "Product GET API",
            error
        );

        return errorResponse(
            "Internal Server Error"
        );
    }
}
