import prisma from "@/app/lib/prisma";
import Hero from "./Collections/Hero";
import FilterBar from "./Collections/FilterBar";
import ProductGrid from "./Collections/ProductGrid";

type Props = {
    search?: string
    category?: string
    brand?: string
    sort?: string
}

export default async function CollectionsPage({ search, category, brand, sort, }: Props) {

    let orderBy:
        | { createdAt: "desc" | "asc" }
        | { price: "asc" | "desc" };

    switch (sort) {
        case "price-low":
            orderBy = {
                price: "asc",
            };
            break;

        case "price-high":
            orderBy = {
                price: "desc",
            };
            break;

        default:
            orderBy = {
                createdAt: "desc",
            };
    }

    const where = {
        isActive: true,

        ...(search && {
            title: {
                contains: search,
                mode: "insensitive" as const,
            },
        }),

        ...(category && {
            categoryId: category,
        }),

        ...(brand && {
            brandId: brand,
        }),

        ...(sort === "bestseller" && {
            bestseller: true,
        }),

        ...(sort === "featured" && {
            isFeatured: true,
        }),
    };

    const [products, categories, brands] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                images: true,
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
            },
        }),

        prisma.category.findMany({
            orderBy: {
                title: "asc",
            },
        }),

        prisma.brand.findMany({
            orderBy: {
                title: "asc",
            },
        }),
    ]);

    const formattedProducts = products.map((product) => ({
        ...product,
        price: Number(product.price),
        images: product.images as string[],
    }));


    return (
        <div>
            <Hero />
            <FilterBar
                categories={categories}
                brands={brands}
            />
            <ProductGrid products={formattedProducts} />
        </div>
    );
}