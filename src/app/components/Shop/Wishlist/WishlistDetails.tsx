
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";
import { toast } from "sonner";

const LIMIT = 10;

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

type WishlistItem = {
    id: string;
    product: Product;
};

type WishlistResponse = {
    success?: boolean;
    message?: string;
    data?: {
        wishlistItems?: WishlistItem[];
        pagination?: {
            page?: number;
            limit?: number;
            totalItems?: number;
            totalWishlistItems?: number;
            totalPages: number;
        };
    };
};

function ProductCard({
    item,
    onRemove,
    removing,
}: {
    item: WishlistItem;
    onRemove: (productId: string) => void;
    removing: boolean;
}) {
    const product = item.product;
    const primaryImage = product.images?.[1] || product.images?.[0];
    const hoverImage = product.images?.[0];

    return (
        <article className="group min-w-0">
            {/* PRODUCT IMAGE */}
            <div className="relative aspect-[0.76] w-full overflow-hidden bg-[#e9e6df]">
                <Link
                    href={`/product/${product.slug}`}
                    aria-label={`View ${product.title}`}
                    className="absolute inset-0"
                >
                    {primaryImage ? (
                        <>
                            <Image
                                src={primaryImage}
                                alt={product.title}
                                fill
                                sizes="(max-width: 639px) 85vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 25vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                            />

                            {hoverImage && hoverImage !== primaryImage && (
                                <Image
                                    src={hoverImage}
                                    alt={`${product.title} alternate view`}
                                    fill
                                    sizes="(max-width: 639px) 85vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 25vw"
                                    className="object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center text-[#a49a8c]">
                            <span className="font-serif text-sm tracking-[0.2em]">
                                LUXE MEN
                            </span>
                        </div>
                    )}

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

                {/* REMOVE FROM WISHLIST */}
                <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    disabled={removing}
                    aria-label={`Remove ${product.title} from wishlist`}
                    title="Remove from wishlist"
                    className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center border border-[#b49a6c] bg-[#f8f6f0] text-[#9b8150] transition-all duration-300 hover:border-[#956d60] hover:text-[#956d60] active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 sm:right-4 sm:top-4"
                >
                    <Heart
                        size={18}
                        strokeWidth={1.4}
                        className="fill-[#b49a6c] transition-colors duration-300"
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

                    <p className="shrink-0 pt-5 text-[11px] font-medium tracking-wide text-[#302923] sm:text-xs">
                        ${Number(product.price).toFixed(2)}
                    </p>
                </div>

                {/* BOTTOM DETAIL */}
                <div className="mt-4 mb-10 flex items-center justify-between border-t border-[#302923]/10 pt-3">
                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#8b8074]">
                        Saved to Wishlist
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

function WishlistHeader({
    loading,
    totalItems,
}: {
    loading?: boolean;
    totalItems?: number;
}) {
    return (
        <header className="mb-10 sm:mb-12 md:mb-14">
            <div className="mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-6 bg-[#b7a895]/50 sm:w-10" />

                <span className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#9b8d7d] sm:text-[9px]">
                    Your Collection
                </span>

                <span className="h-px w-6 bg-[#b7a895]/50 sm:w-10" />
            </div>

            <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-[32px] font-light leading-[1.1] tracking-tight text-[#302923] sm:text-4xl md:text-5xl lg:text-[52px]">
                    Your{" "}
                    <span className="text-[#b9a17e]">Wishlist</span>
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-[12px] font-light leading-5 tracking-[0.02em] text-[#71685f] sm:mt-5 sm:text-sm sm:leading-6">
                    A considered selection of pieces worth keeping
                    close. Discover your favourites whenever you wish.
                </p>
            </div>

            <div className="mt-7 hidden items-center justify-between border-y border-[#302923]/10 py-3.5 sm:flex lg:mt-8">
                <div className="flex items-center gap-3">
                    <span className="h-px w-6 bg-[#302923]/25" />

                    <span className="text-[8px] font-medium uppercase tracking-[0.28em] text-[#81776d]">
                        Saved Pieces
                    </span>
                </div>

                {!loading && totalItems !== undefined && (
                    <span className="text-[9px] uppercase tracking-[0.18em] text-[#81776d]">
                        {totalItems} {totalItems === 1 ? "Piece" : "Pieces"}
                    </span>
                )}
            </div>
        </header>
    );
}

export default function WishlistDetails() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [reload, setReload] = useState(0);

    const [isPending, startTransition] = useTransition();

    const hasMore = totalItems > 0 && items.length < totalItems;

    const viewedPercentage =
        totalItems > 0
            ? Math.min(Math.round((items.length / totalItems) * 100), 100)
            : 0;

    // FETCH INITIAL PAGE
    const fetchWishlist = useCallback(async (signal: AbortSignal) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `/api/wishlist?page=1&limit=${LIMIT}`,
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        Accept: "application/json",
                    },
                    signal,
                }
            );

            const result: WishlistResponse = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message || "Unable to load your wishlist."
                );
            }

            const wishlistItems = result.data?.wishlistItems ?? [];
            const pagination = result.data?.pagination;

            setItems(wishlistItems);
            setPage(1);
            setTotalItems(
                pagination?.totalItems ??
                pagination?.totalWishlistItems ??
                wishlistItems.length
            );
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
                return;
            }

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        void fetchWishlist(controller.signal);

        return () => controller.abort();
    }, [fetchWishlist, reload]);

    // LOAD NEXT PAGE AND APPEND ITEMS
    const handleLoadMore = () => {
        if (isPending || loading || !hasMore) return;

        const nextPage = page + 1;

        startTransition(async () => {
            try {
                const response = await fetch(
                    `/api/wishlist?page=${nextPage}&limit=${LIMIT}`,
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                const result: WishlistResponse = await response.json();

                if (!response.ok || result.success === false) {
                    throw new Error(
                        result.message || "Unable to load more wishlist items."
                    );
                }

                const newItems = result.data?.wishlistItems;

                if (!Array.isArray(newItems)) {
                    throw new Error("Invalid wishlist response.");
                }

                // Prevent duplicates and preserve already loaded items.
                setItems((current) => {
                    const existingIds = new Set(
                        current.map((item) => item.id)
                    );

                    const uniqueNewItems = newItems.filter(
                        (item) => !existingIds.has(item.id)
                    );

                    return [...current, ...uniqueNewItems];
                });

                setPage(nextPage);

                const pagination = result.data?.pagination;

                if (pagination) {
                    setTotalItems(
                        pagination.totalItems ??
                        pagination.totalWishlistItems ??
                        totalItems
                    );
                }
            } catch (err) {
                toast.error(
                    err instanceof Error
                        ? err.message
                        : "Unable to load more wishlist items."
                );
            }
        });
    };

    // REMOVE ITEM
    const handleRemove = async (productId: string) => {
        if (removingId) return;

        setRemovingId(productId);

        try {
            const response = await fetch(`/api/wishlist/${productId}`, {
                method: "DELETE",
            });

            const result: {
                success?: boolean;
                message?: string;
            } = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message || "Unable to remove this product."
                );
            }

            toast.success(result.message || "Removed from your wishlist.");

            // Reload from page one to avoid gaps after removing an item.
            setReload((current) => current + 1);
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setRemovingId(null);
        }
    };


    // LOADING STATE
    if (loading) {
        return (
            <main className="min-h-screen bg-[#f1eee6] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-440">
                    <WishlistHeader loading />

                    <section className="flex min-h-140 items-center justify-center px-4">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[9px] font-medium uppercase tracking-[0.5em] text-black/40">
                                LUXE MEN
                            </span>

                            <div className="relative mt-8 flex h-14 w-14 items-center justify-center">
                                <span className="absolute inset-0 animate-spin rounded-full border border-black/10 border-t-black" />

                                <span
                                    className="absolute inset-2 animate-spin rounded-full border border-black/5 border-b-black/50"
                                    style={{
                                        animationDirection: "reverse",
                                        animationDuration: "1.5s",
                                    }}
                                />

                                <span className="h-1 w-1 rounded-full bg-black" />
                            </div>

                            <h2 className="mt-8 font-serif text-xl font-light tracking-wide text-[#171717]">
                                Curating Your Collection
                            </h2>

                            <p className="mt-2 text-[9px] uppercase tracking-[0.35em] text-black/35">
                                Retrieving your saved pieces
                            </p>

                            <div className="mt-7 h-px w-32 overflow-hidden bg-black/10">
                                <div className="h-full w-1/2 animate-[luxuryLoading_1.4s_ease-in-out_infinite] bg-black/50" />
                            </div>
                        </div>
                    </section>

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
                </div>
            </main>
        );
    }

    // ERROR STATE
    if (error) {
        return (
            <main className="min-h-screen bg-[#f1eee6] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-440">
                    <WishlistHeader />

                    <div className="mx-auto max-w-xl border-y border-[#302923]/10 py-20 text-center">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#9b8150]">
                            LUXE MEN
                        </p>

                        <h1 className="mt-5 font-serif text-3xl font-light text-[#302923]">
                            Your collection is unavailable
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[#81776d]">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setReload((current) => current + 1)
                            }
                            className="mt-7 border border-[#302923] bg-[#302923] px-7 py-3.5 text-[9px] uppercase tracking-[0.2em] text-[#f8f6f0] transition-colors duration-300 hover:bg-[#6f604e]"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // EMPTY STATE
    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-[#f1eee6] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-440">
                    <WishlistHeader totalItems={0} />

                    <div className="mx-auto max-w-xl border-y border-[#302923]/10 py-16 text-center sm:py-24">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#c8bba7]/60 bg-[#f8f6f0]">
                            <Heart
                                size={25}
                                strokeWidth={1.1}
                                className="text-[#9b8d7d]"
                            />
                        </div>

                        <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#9b8150]">
                            Waiting to Be Discovered
                        </p>

                        <h1 className="mt-3 font-serif text-3xl font-normal text-[#302923]">
                            Your wishlist is waiting.
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#81776d]">
                            Save the pieces that catch your eye and return
                            to them whenever inspiration strikes.
                        </p>

                        <Link
                            href="/collections"
                            className="mt-8 inline-flex items-center gap-3 border border-[#302923] bg-[#302923] px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-[#f8f6f0] transition-colors duration-300 hover:bg-[#6f604e]"
                        >
                            Discover the Collection
                            <ArrowUpRight size={14} strokeWidth={1.2} />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f1eee6] py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="mx-auto max-w-440 px-4 sm:px-6 lg:px-8">
                {/* HEADER */}
                <header className="mb-10 sm:mb-12 md:mb-14">
                    <div className="mb-4 flex items-center justify-center gap-3">
                        <span className="h-px w-6 bg-[#b7a895]/50 sm:w-10" />

                        <span className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#9b8d7d] sm:text-[9px]">
                            Your Collection
                        </span>

                        <span className="h-px w-6 bg-[#b7a895]/50 sm:w-10" />
                    </div>

                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-[32px] font-light leading-[1.1] tracking-tight text-[#302923] sm:text-4xl md:text-5xl lg:text-[52px]">
                            Your{" "}
                            <span className="text-[#b9a17e]">Wishlist</span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-[12px] font-light leading-5 tracking-[0.02em] text-[#71685f] sm:mt-5 sm:text-sm sm:leading-6">
                            A considered selection of pieces worth keeping
                            close. Discover your favourites whenever you wish.
                        </p>
                    </div>

                    <div className="mt-7 hidden items-center justify-between border-y border-[#302923]/10 py-3.5 sm:flex lg:mt-8">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-6 bg-[#302923]/25" />

                            <span className="text-[8px] font-medium uppercase tracking-[0.28em] text-[#81776d]">
                                Saved Pieces
                            </span>
                        </div>

                        {!loading && !error && (
                            <span className="text-[9px] uppercase tracking-[0.18em] text-[#81776d]">
                                {totalItems} {totalItems === 1 ? "Piece" : "Pieces"}
                            </span>
                        )}
                    </div>
                </header>

                {/* PRODUCT GRID */}
                <>
                    <div className="mb-5 flex items-center justify-between sm:hidden">
                        <span className="text-[8px] uppercase tracking-[0.25em] text-[#81776d]">
                            Saved Pieces
                        </span>

                        <span className="text-[9px] text-[#81776d]">
                            {totalItems} {totalItems === 1 ? "Piece" : "Pieces"}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((item) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                onRemove={handleRemove}
                                removing={removingId === item.product.id}
                            />
                        ))}
                    </div>

                    {/* LOAD MORE */}
                    {hasMore && (
                        <div className="border-t border-[#302923]/10 pt-12">
                            <div className="flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={handleLoadMore}
                                    disabled={isPending || loading}
                                    className="group mt-7 flex items-center gap-4 border-b border-[#302923]/40 pb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#302923] transition-all duration-300 hover:border-[#302923] hover:text-[#81776d] disabled:cursor-not-allowed disabled:border-[#302923]/15 disabled:text-[#302923]/30"
                                >
                                    {isPending ? (
                                        <>
                                            <span className="h-3 w-3 animate-spin rounded-full border border-[#302923]/15 border-t-[#302923]/70" />
                                            <span>Loading</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Load More</span>

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

                                {/* PROGRESS */}
                                <div className="mt-8 flex w-full max-w-60 flex-col items-center gap-3">
                                    <div className="h-px w-full overflow-hidden bg-[#302923]/[0.07]">
                                        <div
                                            className="h-full bg-[#302923]/35 transition-all duration-700"
                                            style={{
                                                width: `${viewedPercentage}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="text-[8px] uppercase tracking-[0.3em] text-[#81776d]">
                                        {viewedPercentage}% Viewed
                                    </span>

                                    <span className="text-[9px] text-[#81776d]">
                                        {items.length} of {totalItems} pieces
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* END OF WISHLIST */}
                    {!hasMore && (
                        <div className="-mt-2.5 border-t border-[#302923]/10 pt-12">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-4">
                                    <span className="h-px w-8 bg-[#302923]/10" />
                                    <span className="h-1 w-1 rounded-full bg-[#302923]/30" />
                                    <span className="h-px w-8 bg-[#302923]/10" />
                                </div>

                                <p className="mt-5 text-[8px] uppercase tracking-[0.4em] text-[#81776d]">
                                    End of Your Wishlist
                                </p>

                                <p className="mt-2 font-serif text-sm font-light italic text-[#81776d]">
                                    You&apos;ve discovered everything.
                                </p>
                            </div>
                        </div>
                    )}
                </>

            </div>
        </main>
    );
}
