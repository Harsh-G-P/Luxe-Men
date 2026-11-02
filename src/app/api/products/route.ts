import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { generateUniqueSlug } from "@/app/lib/generateSlug";
import prisma from "@/app/lib/prisma";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { productSchema } from "@/app/lib/validations/product";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

import { revalidatePath } from "next/cache";


export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    let body
    try {
        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        body = await req.json()

        const result = productSchema.safeParse(body)

        if (!result.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(result.error.issues))
        }

        const validate = result.data

        const brand = await prisma.brand.findUnique({
            where: {
                id: validate.brandId,
            },
        });

        if (!brand) {
            return errorResponse("Brand not found", 404)
        }

        const category = await prisma.category.findUnique({
            where: {
                id: validate.categoryId,
            }
        })

        if (!category) {
            return errorResponse("Category not found", 404)
        }

        const categoryAttributes = await prisma.categoryAttribute.findMany({
            where: {
                categoryId: validate.categoryId,
            },
        });

        for (const variant of validate.variants) {
            for (const [attributeName, attributeValue] of Object.entries(variant.attributes)) {

                const categoryAttribute = categoryAttributes.find(
                    (item) => item.title === attributeName
                );

                if (!categoryAttribute) {
                    return errorResponse(
                        `Attribute '${attributeName}' does not exist for this category`,
                        400
                    );
                }

                const allowedValues = categoryAttribute.values as string[];

                if (!allowedValues.includes(attributeValue)) {
                    return errorResponse(
                        `'${attributeValue}' is not a valid value for '${attributeName}'`,
                        400
                    );
                }
            }

            // Ensure all required attributes are selected
            if (
                Object.keys(variant.attributes).length !==
                categoryAttributes.length
            ) {
                return errorResponse(
                    "Please select all required category attributes",
                    400
                );
            }
        }

        const seen = new Set<string>();

        for (const variant of validate.variants) {
            const key = JSON.stringify(
                Object.entries(variant.attributes).sort()
            );

            if (seen.has(key)) {
                return errorResponse(
                    "Duplicate product variants are not allowed",
                    400
                );
            }

            seen.add(key);
        }

        const slug = await generateUniqueSlug(validate.title)

        const skus = validate.variants
            .map((v) => v.sku)
            .filter((sku): sku is string => Boolean(sku));

        if (new Set(skus).size !== skus.length) {
            return errorResponse(
                "Duplicate SKU found in request",
                400
            );
        }

        if (skus.length > 0) {
            const existingSku = await prisma.productVariant.findFirst({
                where: {
                    sku: {
                        in: skus,
                    },
                },
            });

            if (existingSku) {
                return errorResponse(`SKU '${existingSku.sku}' already exists`, 409);
            }
        }

        const product = await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    title: validate.title,
                    slug,
                    description: validate.description,
                    price: validate.price,
                    images: validate.images,

                    isActive: validate.isActive ?? true,
                    isFeatured: validate.isFeatured ?? false,
                    bestseller: validate.bestseller ?? false,

                    brandId: validate.brandId,
                    categoryId: validate.categoryId,
                },
                include: {
                    brand: true,
                    category: true
                }
            })

            await tx.productVariant.createMany({
                data: validate.variants.map((variant) => ({
                    productId: product.id,
                    attributes: variant.attributes,
                    sku: variant.sku,
                    price: variant.price,
                    stock: variant.stock
                })),
            })

            const createdProduct = await tx.product.findUnique({
                where: {
                    id: product.id,
                },
                include: {
                    brand: true,
                    category: true,
                    variants: true,
                }
            })

            return createdProduct
        })

        const response = {
            ...product!,
            price: product!.price.toString(),
            images: product!.images as string[],
            variants: product!.variants.map((variant) => ({
                ...variant,
                price: variant.price?.toString() ?? null,
            })),
        };

        revalidatePath("/");

        return successResponse("Product created successfully", response, 201)

    } catch (error) {
        console.log("Product POST API", error)
        return errorResponse("Internal Server Error")
    }
}

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }
    try {
        const isAdmin = session.user.role === "ADMIN"

        if (!isAdmin) {
            return errorResponse("Forbidden", 403)
        }

        const products = await prisma.product.findMany({
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
        console.log("Product GET API", error)
        return errorResponse("Internal Server Error")
    }
}
