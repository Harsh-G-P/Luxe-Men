"use client";

import { useEffect, useState, useTransition } from "react";

import ProductCard from "./ProductCard";

type Product = {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];

    brand: {
        title: string;
    };

};

type Props = {
    products: Product[];
    totalProducts: number;
    initialLimit: number;

    search?: string;
    category?: string;
    brand?: string;
    sort?: string;


};

export default function ProductGrid({
    products: initialProducts,
    totalProducts,
    initialLimit,
    search,
    category,
    brand,
    sort,
}: Props) {
    const [products, setProducts] =
        useState<Product[]>(initialProducts);

    const [isPending, startTransition] =
        useTransition();

    const [page, setPage] = useState(1);

    useEffect(() => {
        setProducts(initialProducts);
        setPage(1);
    }, [
        initialProducts,
        search,
        category,
        brand,
        sort,
    ]);

    const hasMore =
        products.length < totalProducts;

    const viewedPercentage =
        totalProducts > 0
            ? Math.min(
                Math.round(
                    (products.length /
                        totalProducts) *
                    100
                ),
                100
            )
            : 0;

    const handleLoadMore = () => {
        if (isPending || !hasMore) {
            return;
        }

        const nextPage = page + 1;

        startTransition(async () => {
            try {
                const params =
                    new URLSearchParams();

                params.set(
                    "page",
                    nextPage.toString()
                );

                params.set(
                    "limit",
                    initialLimit.toString()
                );

                if (search) {
                    params.set(
                        "search",
                        search
                    );
                }

                if (category) {
                    params.set(
                        "category",
                        category
                    );
                }

                if (brand) {
                    params.set(
                        "brand",
                        brand
                    );
                }

                if (sort) {
                    params.set(
                        "sort",
                        sort
                    );
                }

                const response =
                    await fetch(
                        `/api/shop/products?${params.toString()}`,
                        {
                            method: "GET",
                            cache: "no-store",
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Failed to load products"
                    );
                }

                const newProducts =
                    data.data?.products;

                if (
                    !Array.isArray(
                        newProducts
                    )
                ) {
                    throw new Error(
                        "Invalid products response"
                    );
                }

                setProducts(
                    (current) => [
                        ...current,
                        ...newProducts,
                    ]
                );

                setPage(nextPage);
            } catch (error) {
                console.error(
                    "Load more failed:",
                    error
                );
            }
        });
    };

    if (isPending) {
        return (
            <section className="flex min-h-140 items-center justify-center bg-[#f1eee6]">
                <div className="flex flex-col items-center text-center">

                    {/* Small Label */}
                    <span className="text-[9px] font-medium uppercase tracking-[0.5em] text-black/40">
                        Please Wait
                    </span>

                    {/* Luxury Spinner */}
                    <div className="relative mt-8 flex h-14 w-14 items-center justify-center">
                        {/* Outer Ring */}
                        <span className="absolute inset-0 animate-spin rounded-full border border-black/10 border-t-black" />

                        {/* Inner Ring */}
                        <span
                            className="absolute inset-2 animate-spin rounded-full border border-black/5 border-b-black/50"
                            style={{
                                animationDirection: "reverse",
                                animationDuration: "1.5s",
                            }}
                        />

                        {/* Center */}
                        <span className="h-1 w-1 rounded-full bg-black" />
                    </div>

                    {/* Main Text */}
                    <h2 className="mt-8 font-serif text-xl font-light tracking-wide text-[#171717]">
                        Preparing Your Selection
                    </h2>

                    {/* Sub Text */}
                    <p className="mt-2 text-[9px] uppercase tracking-[0.35em] text-black/35">
                        Your experience is almost ready
                    </p>

                    {/* Animated Line */}
                    <div className="mt-7 h-px w-32 overflow-hidden bg-black/10">
                        <div className="h-full w-1/2 animate-[luxuryLoading_1.4s_ease-in-out_infinite] bg-black/50" />
                    </div>
                </div>

                {/* Animation */}
                <style jsx>{`
                @keyframes luxuryLoading {
                    0% {
                        transform: translateX(-100%);
                    }

                    50% {
                        transform: translateX(100%);
                    }

                    100% {
                        transform: translateX(200%);
                    }
                }
            `}</style>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return (
            <section className="bg-[#f1eee6] py-24 md:py-32">
                <div className="mx-auto max-w-375 px-5 md:px-8">
                    <div className="mx-auto max-w-xl text-center">

                        <span className="text-[9px] font-medium uppercase tracking-[0.45em] text-black/35">
                            The Collection
                        </span>

                        <div className="mx-auto mt-7 flex items-center justify-center gap-3">
                            <span className="h-px w-8 bg-black/15" />
                            <span className="h-1 w-1 rounded-full bg-black/30" />
                            <span className="h-px w-8 bg-black/15" />
                        </div>

                        <h2 className="mt-8 font-serif text-4xl font-light tracking-tight text-[#171717] md:text-5xl">
                            No Products Found
                        </h2>

                        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-black/45">
                            We couldn't find any
                            products matching your
                            selection. Try adjusting
                            your filters to discover
                            something exceptional.
                        </p>

                        <div className="mt-9">
                            <a
                                href="/collections"
                                className="group inline-flex items-center gap-5 border-b border-black pb-2 text-[9px] font-medium uppercase tracking-[0.3em] text-black transition-all duration-300 hover:border-black/30 hover:text-black/50"
                            >
                                <span>
                                    View Collection
                                </span>

                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f1eee6] py-14 md:py-20">
            <div className="mx-auto max-w-375 px-5 md:px-8">

                {/* Header */}
                <div className="mb-10 border-b border-black/8 pb-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                        <div> <div className="flex items-center gap-3"> <span className="h-px w-9 bg-black/20" />
                            <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-black/40">
                                The Collection
                            </span>
                        </div>

                            <h2 className="mt-3 font-serif text-3xl font-light leading-none tracking-[-0.02em] text-[#171717] md:text-[42px]">
                                All Products
                            </h2>

                            <div className="mt-4 h-px w-12 bg-black/10" />

                        </div>

                        <div className="flex items-center gap-3"> <span className="h-1 w-1 rounded-full bg-black/25" />
                            <span className="text-[9px] uppercase tracking-[0.4em] text-black/35">
                                Discover Our Selection
                            </span>

                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-2 xl:grid-cols-3 lg:gap-y-16">

                    {products.map(
                        (product) => (
                            <ProductCard
                                key={
                                    product.id
                                }
                                product={
                                    product
                                }
                            />
                        )
                    )}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div className=" border-black/8 pt-12">

                        <div className="flex flex-col items-center">

                            {/* Text Button */}
                            <button
                                type="button"
                                onClick={
                                    handleLoadMore
                                }
                                disabled={
                                    isPending
                                }
                                className="group mt-7 flex items-center gap-4 border-b border-black/40 pb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-black transition-all duration-300 hover:border-black hover:text-black/55 disabled:cursor-not-allowed disabled:border-black/15 disabled:text-black/30"
                            >
                                {isPending ? (
                                    <>
                                        <span className="h-3 w-3 animate-spin rounded-full border border-black/15 border-t-black/70" />

                                        <span>
                                            Loading
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            Load More
                                        </span>

                                        <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
                                            <span className="absolute transition-transform duration-300 group-hover:translate-y-5">
                                                ↓
                                            </span>

                                            <span className="absolute -translate-y-5 transition-transform duration-300 group-hover:translate-y-0">
                                                ↓
                                            </span>
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* Progress */}
                            <div className="mt-8 flex w-full max-w-60 flex-col items-center gap-3">

                                <div className="h-px w-full overflow-hidden bg-black/[0.07]">
                                    <div
                                        className="h-full bg-black/35 transition-all duration-700"
                                        style={{
                                            width: `${viewedPercentage}%`,
                                        }}
                                    />
                                </div>

                                <span className="text-[8px] uppercase tracking-[0.3em] text-black/25">
                                    {viewedPercentage}%
                                    {" "}
                                    Viewed
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* End */}
                {!hasMore && (
                    <div className="mt-20 border-t border-black/8 pt-12 md:mt-24">
                        <div className="flex flex-col items-center">

                            <div className="flex items-center gap-4">
                                <span className="h-px w-8 bg-black/10" />

                                <span className="h-1 w-1 rounded-full bg-black/30" />

                                <span className="h-px w-8 bg-black/10" />
                            </div>

                            <p className="mt-5 text-[8px] uppercase tracking-[0.4em] text-black/30">
                                End of the Collection
                            </p>

                            <p className="mt-2 font-serif text-sm font-light italic text-black/40">
                                You've discovered
                                everything.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );

}