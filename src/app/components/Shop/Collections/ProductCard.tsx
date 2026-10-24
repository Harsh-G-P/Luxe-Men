
"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

type ProductProps = {
    product: {
        id: string;
        title: string;
        slug: string;
        price: number;
        images: string[];
        brand: {
            title: string;
        };
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
    };
};

export default function ProductCard({ product }: ProductProps) {
    const primaryImage = product.images[1] || product.images[0];
    const hoverImage = product.images[0];

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    // Check whether this product is already wishlisted.
    useEffect(() => {
        let cancelled = false;

        async function checkWishlist() {
            try {
                const response = await fetch("/api/wishlist?limit=100", {
                    cache: "no-store",
                });

                // Allow visitors to browse without logging in.
                if (!response.ok) return;

                const data: WishlistResponse = await response.json();

                if (data.success === false) return;

                const items = data.data?.wishlistItems ?? [];
                const found = items.some(
                    (item) => item.product.id === product.id
                );

                if (!cancelled) {
                    setIsWishlisted(found);
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
                    <Image
                        src={primaryImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 639px) 72vw, (max-width: 1279px) 45vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />

                    {/* ALTERNATE IMAGE */}
                    {hoverImage && hoverImage !== primaryImage && (
                        <Image
                            src={hoverImage}
                            alt={`${product.title} alternate view`}
                            fill
                            sizes="(max-width: 639px) 72vw, (max-width: 1279px) 45vw, 25vw"
                            className="object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                        />
                    )}

                    {/* SUBTLE IMAGE BORDER */}
                    <div className="pointer-events-none absolute inset-0 border border-black/[0.07]" />

                    {/* DESKTOP HOVER ACTION */}
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

                {/* BRAND LABEL */}
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

                    {/* PRICE */}
                    <p className="shrink-0 pt-5 text-[11px] font-medium tracking-wide text-[#302923] sm:text-xs">
                        ${product.price.toFixed(2)}
                    </p>
                </div>

                {/* EDITORIAL FOOTER */}
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