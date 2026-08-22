import ProductPage from "@/app/components/Admin/ProductPages/ProductsPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
    searchParams: Promise<{
        page?: string;
        limit?: string;

        search?: string;
        brand?: string;
        category?: string;
        status?: string;
        featured?: string;
        bestseller?: string;
        stock?: string;
        sort?: string;
        date?: string;
    }>;
};

export default async function Products({
    searchParams,
}: Props) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const {
        page: pageParam,
        limit: limitParam,
        search,
        brand,
        category,
        featured,
        bestseller,
        status,
        stock,
        sort,
        date,
    } = await searchParams;

    const page = Math.max(Number(pageParam) || 1, 1);
    const limit = Math.min(Math.max(Number(limitParam) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
        ...(search && {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    slug: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    brand: {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    category: {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        }),


        ...(brand &&
            brand !== "ALL" && {
            brandId: brand,
        }),

        ...(category &&
            category !== "ALL" && {
            categoryId: category,
        }),

        ...(status === "ACTIVE" && {
            isActive: true,
        }),

        ...(status === "INACTIVE" && {
            isActive: false,
        }),

        ...(featured === "NOT_FEATURED" && {
            isFeatured: false,
        }),

        ...(bestseller === "BESTSELLER" && {
            bestseller: true,
        }),

        ...(bestseller === "NOT_BESTSELLER" && {
            bestseller: false,
        }),

        ...(date === "today" && {
            createdAt: {
                gte: new Date(
                    new Date().setHours(
                        0,
                        0,
                        0,
                        0
                    )
                ),
            },
        }),

        ...(date === "week" && {
            createdAt: {
                gte: new Date(
                    Date.now() -
                    7 *
                    24 *
                    60 *
                    60 *
                    1000
                ),
            },
        }),

        ...(date === "month" && {
            createdAt: {
                gte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                ),
            },
        }),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = {
        createdAt: "desc",
    };

    switch (sort) {
        case "OLDEST":
            orderBy = {
                createdAt: "asc",
            };
            break;

        case "HIGH":
            orderBy = {
                price: "desc",
            };
            break;

        case "LOW":
            orderBy = {
                price: "asc",
            };
            break;

        case "NAME_AZ":
            orderBy = {
                title: "asc",
            };
            break;

        case "NAME_ZA":
            orderBy = {
                title: "desc",
            };
            break;

        default:
            orderBy = {
                createdAt: "desc",
            };
    }

    const allProducts = await prisma.product.findMany({
        where,
        orderBy,

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

            variants: {
                select: {
                    stock: true,
                    price: true,
                },
            },
        },
    });

    const stockFilteredProducts =
        stock && stock !== "ALL"
            ? allProducts.filter((product) => {
                const totalStock =
                    product.variants.reduce(
                        (total, variant) =>
                            total + variant.stock,
                        0
                    );

                switch (stock) {
                    case "IN_STOCK":
                        return totalStock > 10;

                    case "LOW_STOCK":
                        return (
                            totalStock > 0 &&
                            totalStock <= 10
                        );

                    case "OUT_OF_STOCK":
                        return totalStock === 0;

                    default:
                        return true;
                }
            })
            : allProducts;

    const totalProducts = stockFilteredProducts.length;

    const totalPages = Math.ceil(
        totalProducts / limit
    );

    const paginatedProducts =
        stockFilteredProducts.slice(
            skip,
            skip + limit
        );


    const serializedProducts =
        paginatedProducts.map((product) => ({
            ...product,

            price: product.price.toString(),

            images: product.images as string[],

            variants: product.variants.map(
                (variant) => ({
                    ...variant,

                    price:
                        variant.price?.toString() ??
                        null,
                })
            ),
        }));

    return (
        <div>
            <ProductPage
                products={serializedProducts}
                pagination={{
                    page,
                    limit,
                    totalProducts,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                }}
            />
        </div>
    );
}