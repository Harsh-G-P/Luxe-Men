import prisma from "@/app/lib/prisma";
import Hero from "./Collections/Hero";
import FilterBar from "./Collections/FilterBar";
import ProductGrid from "./Collections/ProductGrid";

type Props = {
    search?: string;
    category?: string;
    brand?: string;
    sort?: string;
    limit: number;
};

export default async function CollectionsPage({
    search,
    category,
    brand,
    sort,
    limit,
}: Props) {
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

    const [
        products,
        totalProducts,
        categories,
        brands,
    ] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            take: limit,

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

        prisma.product.count({
            where,
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

    const formattedProducts = products.map(
        (product) => ({
            ...product,
            price: Number(product.price),
            images: product.images as string[],
        })
    );

    return (
        <div className="bg-[#faf9f7]">
           <Hero />

<div className="bg-[#faf9f7]">
    <div className="mx-auto w-full px-5 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)]">

            <FilterBar
                categories={categories}
                brands={brands}
            />

            <ProductGrid
                products={formattedProducts}
                totalProducts={totalProducts}
                initialLimit={limit}
                search={search}
                category={category}
                brand={brand}
                sort={sort}
            />

        </div>
    </div>
</div>

        </div>
    );
}
