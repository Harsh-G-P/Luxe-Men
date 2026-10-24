
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";
import { toast } from "sonner";

type Product = {
    id: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
    brand: {
        title: string;
    };
};

type WishlistResponse = {
    success?: boolean;
    message?: string;
    data?: {
        wishlistItems?: {
            id: string;
            product: {
                id: string;
            };
        }[];
        pagination?: {
            totalPages: number;
        };
    };
};

type Props = {
    title: string;
    subtitle: string;
    products: Product[];
    viewAllHref: string;
};

function ProductCard({ product }: { product: Product }) {
    const primaryImage = product.images[1] || product.images[0];
    const hoverImage = product.images[0];

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    // Load existing wishlist status.
    useEffect(() => {
        let cancelled = false;

        async function checkWishlist() {
            try {
                const response = await fetch("/api/wishlist?limit=100", {
                    method: "GET",
                    cache: "no-store",
                });

                // Allow visitors to browse without logging in.
                if (!response.ok) return;

                const data: WishlistResponse = await response.json();

                if (data.success === false) return;

                const items = data.data?.wishlistItems ?? [];
                const alreadyWishlisted = items.some(
                    (item) => item.product.id === product.id
                );

                if (!cancelled) {
                    setIsWishlisted(alreadyWishlisted);
                }
            } catch {
            }
        }

        void checkWishlist();

        return () => {
            cancelled = true;
        };
    }, [product.id]);


    const toggleWishlist = async () => {
        if (isWishlistLoading) return;

        setIsWishlistLoading(true);

        const wasWishlisted = isWishlisted;

        try {
            const response = await fetch(`/api/wishlist/${product.id}`, {
                method: wasWishlisted ? "DELETE" : "POST",
            });

            const data: {
                success?: boolean;
                message?: string;
            } = await response.json();

            // If the item already exists, keep the heart filled.
            if (!wasWishlisted && response.status === 409) {
                setIsWishlisted(true);
                toast.success("This item is already in your wishlist");
                return;
            }

            if (!response.ok || data.success === false) {
                throw new Error(
                    data.message ||
                    (wasWishlisted
                        ? "Unable to remove product from wishlist"
                        : "Unable to add product to wishlist")
                );
            }

            setIsWishlisted(!wasWishlisted);

            toast.success(
                data.message ||
                (wasWishlisted
                    ? "Removed from wishlist"
                    : "Added to wishlist")
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsWishlistLoading(false);
        }
    };

    return (
        <article className="group w-full">
            {/* PRODUCT IMAGE */}
            <div className="relative aspect-[0.76] w-full overflow-hidden bg-[#e9e6df]">
                <Link
                    href={`/product/${product.slug}`}
                    aria-label={`View ${product.title}`}
                    className="absolute inset-0"
                >
                    {/* Main image */}
                    <Image
                        src={primaryImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 639px) 72vw, (max-width: 1279px) 45vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />

                    {/* Hover image */}
                    {hoverImage && hoverImage !== primaryImage && (
                        <Image
                            src={hoverImage}
                            alt={`${product.title} alternate view`}
                            fill
                            sizes="(max-width: 639px) 72vw, (max-width: 1279px) 45vw, 25vw"
                            className="object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                        />
                    )}

                    {/* Image border */}
                    <div className="pointer-events-none absolute inset-0 border border-black/[0.07]" />

                    {/* Desktop hover action */}
                    <div className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-4 sm:bottom-4 sm:block">
                        <div className="flex h-11 items-center justify-between border border-black/10 bg-[#f8f6f0]/95 px-4">
                            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#302923]">
                                Discover Piece
                            </span>

                            <ArrowUpRight
                                size={15}
                                strokeWidth={1.2}
                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </div>
                    </div>
                </Link>

                {/* Brand label */}
                <div className="pointer-events-none absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
                    <span className="inline-block bg-[#f8f6f0]/90 px-2.5 py-1.5 text-[8px] font-medium uppercase tracking-[0.18em] text-[#39332c] sm:text-[9px]">
                        {product.brand.title}
                    </span>
                </div>


                {/* WISHLIST BUTTON */}
                <button
                    type="button"
                    onClick={() => void toggleWishlist()}
                    disabled={isWishlistLoading}
                    aria-label={
                        isWishlisted
                            ? `Remove ${product.title} from wishlist`
                            : `Add ${product.title} to wishlist`
                    }
                    aria-pressed={isWishlisted}
                    aria-busy={isWishlistLoading}
                    className={` absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center border transition-all duration-300 sm:right-4 sm:top-4 ${isWishlisted
                            ? "border-[#b49a6c] bg-[#f8f6f0] text-[#9b8150] opacity-100"
                            : "border-black/10 bg-[#f8f6f0]/95 text-[#39332c] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                        } hover:border-[#b49a6c] hover:bg-[#f8f6f0] hover:text-[#9b8150] active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b8150]`}
                >
                    <Heart
                        size={18}
                        strokeWidth={1.4}
                        className={
                            isWishlisted
                                ? "scale-110 fill-[#b49a6c] text-[#9b8150]"
                                : ""
                        }
                    />
                </button>
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="pt-4 sm:pt-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="mb-1.5 text-[8px] font-medium uppercase tracking-[0.22em] text-[#958879] sm:text-[9px]">
                            {product.brand.title}
                        </p>

                        <Link
                            href={`/product/${product.slug}`}
                            className="inline-block text-[13px] font-normal leading-snug tracking-[-0.02em] text-[#302923] transition-colors duration-300 hover:text-[#927b5d] sm:text-sm"
                        >
                            {product.title}
                        </Link>
                    </div>

                    {/* Price */}
                    <p className="shrink-0 pt-5 text-[11px] font-medium tracking-wide text-[#302923] sm:text-xs">
                        ${product.price.toFixed(2)}
                    </p>
                </div>

                {/* Bottom detail */}
                <div className="mt-4 flex items-center justify-between border-t border-[#302923]/10 pt-3">
                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#8b8074]">
                        Refined Essentials
                    </span>

                    <Link
                        href={`/product/${product.slug}`}
                        aria-label={`Explore ${product.title}`}
                        className="flex h-7 w-7 items-center justify-center border border-[#302923]/15 text-[#302923] transition-colors duration-300 hover:border-[#302923] hover:bg-[#302923] hover:text-[#f8f6f0]"
                    >
                        <ArrowUpRight size={13} strokeWidth={1.2} />
                    </Link>
                </div>
            </div>
        </article>
    );
}


export default function ProductSection({
    title,
    subtitle,
    products,
    viewAllHref,
}: Props) {
    const mobileScrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleMobileScroll = () => {
        const container = mobileScrollRef.current;

        if (!container) return;

        const maxScroll =
            container.scrollWidth - container.clientWidth;

        if (maxScroll <= 0) {
            setScrollProgress(0);
            return;
        }

        const progress =
            (container.scrollLeft / maxScroll) * 100;

        setScrollProgress(progress);
    };

    return (
        <section className=" bg-[#f1eee6] py-14 sm:py-16 md:py-20 lg:py-24">
            <div className="mx-auto max-w-440 px-4 sm:px-6 lg:px-8">
                {/* HEADER */}

                <div className="mb-10 sm:mb-12 md:mb-14">

                    {/* Small label */}
                    <div className="mb-4 flex items-center justify-center gap-3">
                        <span className="h-px w-6 bg-[#b7a895]/50 sm:w-10" />

                        <span className=" text-[8px] font-medium uppercase tracking-[0.3em] text-[#9b8d7d] sm:text-[9px]">
                            Collection
                        </span>

                        <span className="h-px w-6 bg-[#b7a895]/50 sm:w-10" />
                    </div>


                    {/* Title */}
                    <div className="mx-auto max-w-3xl text-center">

                        <h2 className=" mx-auto max-w-2xl text-[28px] font-light leading-[1.1] tracking-tight text-[#302923] sm:text-4xl md:text-5xl lg:text-[52px]">
                            {(() => {
                                const words = title.trim().split(" ");
                                const middle = Math.ceil(words.length / 2);

                                return (
                                    <>
                                        <span className="text-[#302923]">
                                            {words.slice(0, middle).join(" ")}{" "}
                                        </span>

                                        <span className="text-[#b9a17e]">
                                            {words.slice(middle).join(" ")}
                                        </span>
                                    </>
                                );
                            })()}
                        </h2>


                        {/* Subtitle */}
                        <p className=" mx-auto mt-4 max-w-xl text-[12px] font-light leading-5 tracking-[0.02em] text-[#71685f] sm:mt-5 sm:text-sm sm:leading-6">
                            {subtitle}
                        </p>

                    </div>


                    <div className=" mt-7 hidden items-center justify-between border-y border-[#302923]/10 py-3.5 md:flex lg:mt-8">

                        {/* Left */}
                        <div className="flex items-center gap-3">

                            <span className="h-px w-6 bg-[#302923]/25" />

                            <span className=" text-[8px] font-medium uppercase tracking-[0.28em] text-[#81776d]">
                                Selected Pieces
                            </span>

                        </div>


                        {/* Right */}
                        <Link
                            href={viewAllHref}
                            className=" group inline-flex items-center gap-2.5 text-[8px] font-medium uppercase tracking-[0.3em] text-[#302923]"
                        >

                            Shop All Products

                            <span className=" flex h-7 w-7 items-center justify-center border border-[#8c8172]/30 transition-all duration-300 group-hover:border-[#8c8172]/60">
                                <ArrowUpRight
                                    size={12}
                                    strokeWidth={1}
                                    className=" transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </span>

                        </Link>

                    </div>


                    <div className="mt-6 flex justify-center md:hidden">

                        <Link
                            href={viewAllHref}
                            className=" group inline-flex h-10 min-w-48 items-center justify-center gap-2.5 border border-[#302923]/15 px-5 text-[8px] font-medium uppercase tracking-[0.25em] text-[#302923] transition-all duration-300 active:bg-[#302923] active:text-white"
                        >

                            <span>
                                Shop All Products
                            </span>

                            <span className=" text-sm font-light transition-transform duration-300 group-active:translate-x-1">
                                ↗
                            </span>

                        </Link>

                    </div>

                </div>



                {/* MOBILE */}
                <div className="sm:hidden">
                    <div
                        ref={mobileScrollRef}
                        onScroll={handleMobileScroll}
                        className="
                        flex
                        gap-4
                        overflow-x-auto
                        scroll-smooth
                        snap-x
                        snap-mandatory
                        pb-4
                        [&::-webkit-scrollbar]:hidden
                        [-ms-overflow-style:none]
                        scrollbar-none
                    "
                    >
                        {products.slice(0, 4).map((product) => (
                            <div
                                key={product.id}
                                className="
                                w-[72vw]
                                min-w-[72vw]
                                shrink-0
                                snap-start
                            "
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* MOBILE SCROLL PROGRESS */}
                    <div className="mt-3 h-px w-full bg-black/10">
                        <div
                            className="
                            h-px
                            bg-black
                            transition-[width]
                            duration-150
                            ease-out
                        "
                            style={{
                                width: `${Math.max(
                                    scrollProgress,
                                    2
                                )}%`,
                            }}
                        />
                    </div>
                </div>

                {/* TABLET + DESKTOP */}
                <div
                    className="
                    hidden
                    grid-cols-2
                    gap-5
                    sm:grid
                    xl:grid-cols-4
                "
                >
                    {products.slice(0, 4).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );


}
