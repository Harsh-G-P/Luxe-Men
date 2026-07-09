import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { productSchema } from "@/app/lib/validations/product";
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

export async function GET(req: NextRequest, { params }: Params) {

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

        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const product = await prisma.product.findUnique({
            where: {
                id
            },
            include: {
                brand: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                variants: true
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
        console.log("Product GET API:", error)

        return errorResponse("Internal Server Error");
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return errorResponse("Unauthorized", 401);
    }

    if (session.user.role !== "ADMIN") {
        return errorResponse("Forbidden", 403);
    }
    let body
    try {
        const routeParams = await params;

        const result = idSchema.safeParse(routeParams);

        if (!result.success) {
            return errorResponse("Invalid ID", 400);
        }

        const { id } = result.data;

        body = await req.json()

        const bodyResult = productSchema.safeParse(body)

        if (!bodyResult.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(bodyResult.error.issues))
        }

        const validate = bodyResult.data

        const existingProduct = await prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!existingProduct) {
            return errorResponse("Product not found", 404);
        }

        await prisma.$transaction(async (tx) => {
            await tx.product.update({
                where: {
                    id,
                },
                data: {
                    title: validate.title,
                    description: validate.description,
                    price: validate.price,

                    brandId: validate.brandId,
                    categoryId: validate.categoryId,

                    images: validate.images,

                    isActive: validate.isActive,
                    isFeatured: validate.isFeatured,
                    bestseller: validate.bestseller,
                },
            });

            // Remove old variants
            await tx.productVariant.deleteMany({
                where: {
                    productId: id,
                },
            });

            // Create new variants
            await tx.productVariant.createMany({
                data: validate.variants.map((variant) => ({
                    productId: id,

                    attributes: variant.attributes,

                    sku: variant.sku,
                    price: variant.price,
                    stock: variant.stock,
                })),
            });
        });

        return successResponse(
            "Product updated successfully",
            null,
            200
        );

    } catch (error) {
        console.log("Product PUT API:", error)

        return errorResponse("Internal Server Error");
    }
}