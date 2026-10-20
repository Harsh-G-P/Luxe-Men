
"use client";

import { useCallback, useEffect, useState } from "react";

type ProductReviewProps = {
    productId: string;
    refreshKey: number;
};

type Review = {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
};

type ReviewData = {
    reviews: Review[];
    pagination: {
        page: number;
        limit: number;
        totalReviews: number;
        totalPages: number;
    };
    summary: {
        averageRating: number;
        totalReviews: number;
    };
};

type ApiResponse = {
    success?: boolean;
    message?: string;
    data?: ReviewData;
    reviews?: Review[];
    pagination?: ReviewData["pagination"];
    summary?: ReviewData["summary"];
};

const LIMIT = 5;

function StarRating({
    rating,
    size = "normal",
}: {
    rating: number;
    size?: "small" | "normal";
}) {
    return (
        <div
            className="flex items-center gap-0.5"
            aria-label={`${rating.toFixed(1)} out of 5 stars`}
        >
            {Array.from({ length: 5 }, (_, index) => {
                const filled = rating >= index + 1;
                const partial =
                    !filled && rating > index && rating < index + 1;

                return (
                    <svg
                        key={index}
                        viewBox="0 0 24 24"
                        className={`${size === "small" ? "h-3.5 w-3.5" : "h-5 w-5"
                            } ${filled || partial
                                ? "text-[#b49a6c]"
                                : "text-[#d8d2c7]"
                            }`}
                        fill={filled ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.3"
                    >
                        {partial && (
                            <defs>
                                <linearGradient id={`star-${index}-${rating}`}>
                                    <stop offset="50%" stopColor="currentColor" />
                                    <stop
                                        offset="50%"
                                        stopColor="transparent"
                                    />
                                </linearGradient>
                            </defs>
                        )}
                        <path
                            d="m12 2.8 2.85 5.78 6.38.93-4.62 4.5 1.09 6.36L12 17.36l-5.7 3 1.09-6.36-4.62-4.5 6.38-.93L12 2.8Z"
                            fill={
                                partial
                                    ? `url(#star-${index}-${rating})`
                                    : undefined
                            }
                        />
                    </svg>
                );
            })}
        </div>
    );
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function getInitials(name: string | null) {
    if (!name?.trim()) return "C";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

export default function ProductReviews({
    productId,
    refreshKey,
}: ProductReviewProps) {
    const [page, setPage] = useState(1);
    const [reload, setReload] = useState(0);
    const [data, setData] = useState<ReviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReviews = useCallback(async (signal: AbortSignal) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `/api/products/${encodeURIComponent(productId)}/reviews?page=${page}&limit=${LIMIT}`,
                {
                    method: "GET",
                    signal,
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const result: ApiResponse = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message || "Unable to load product reviews."
                );
            }

            const payload = result.data ?? result;

            if (
                !payload.reviews ||
                !payload.pagination ||
                !payload.summary
            ) {
                throw new Error("The reviews response has an invalid format.");
            }

            setData({
                reviews: payload.reviews,
                pagination: payload.pagination,
                summary: payload.summary,
            });
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
                return;
            }

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while loading reviews."
            );
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, [productId, page]);

    useEffect(() => {
        const controller = new AbortController();

        void fetchReviews(controller.signal);

        return () => controller.abort();
    }, [fetchReviews, reload, refreshKey]);

    const averageRating = data?.summary.averageRating ?? 0;
    const totalReviews = data?.summary.totalReviews ?? 0;
    const totalPages = data?.pagination.totalPages ?? 0;

    return (
        <section className="w-full bg-[#f5f4ef] py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-5 md:px-10">
                {/* Heading */}
                <div className="border-b border-[#dedbd4] pb-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b8150]">
                        Customer Experience
                    </p>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                        <h2 className="font-serif text-3xl font-normal text-[#1b1a18] md:text-4xl">
                            Customer Reviews
                        </h2>

                        {!loading && !error && (
                            <p className="text-[10px] uppercase tracking-[0.16em] text-[#817d75]">
                                {totalReviews}{" "}
                                {totalReviews === 1 ? "Review" : "Reviews"}
                            </p>
                        )}
                    </div>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#817d75]">
                        Genuine experiences from customers who chose LUXE MEN.
                    </p>
                </div>

                {/* Rating Summary */}
                {data && !error && (
                    <div className="mt-8 grid gap-6 border border-[#e2ded4] bg-[#faf9f6] p-6 sm:grid-cols-[180px_1fr] sm:items-center sm:p-8">
                        <div className="sm:border-r sm:border-[#e2ded4] sm:pr-8">
                            <p className="font-serif text-5xl font-normal text-[#1b1a18]">
                                {averageRating.toFixed(1)}
                                <span className="ml-1 text-xl text-[#9b8150]">
                                    /5
                                </span>
                            </p>

                            <div className="mt-3">
                                <StarRating rating={averageRating} />
                            </div>

                            <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-[#817d75]">
                                Based on {totalReviews}{" "}
                                {totalReviews === 1 ? "review" : "reviews"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] uppercase tracking-[0.22em] text-[#9b8150]">
                                Customer Feedback
                            </p>

                            <h3 className="mt-2 font-serif text-xl text-[#34312c]">
                                Quality speaks for itself.
                            </h3>

                            <p className="mt-2 max-w-lg text-xs leading-6 text-[#817d75]">
                                Every review helps others discover the
                                craftsmanship, fit, and quality behind
                                their next purchase.
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="mt-8 border border-[#e2ded4] bg-[#faf9f6] px-5 py-16 text-center">
                        <div className="mx-auto h-7 w-7 animate-spin border border-[#dedbd4] border-t-[#9b8150]" />

                        <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[#9b8150]">
                            LUXE MEN
                        </p>

                        <p className="mt-2 font-serif text-xl text-[#34312c]">
                            Loading customer reviews
                        </p>

                        <p className="mt-2 text-xs text-[#817d75]">
                            Gathering customer experiences...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="mt-8 border border-[#e2ded4] bg-[#faf9f6] px-5 py-14 text-center">
                        <p className="font-serif text-2xl text-[#34312c]">
                            Unable to load reviews
                        </p>

                        <p className="mt-3 text-sm text-[#817d75]">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => setReload((value) => value + 1)}
                            className="mt-6 border border-[#1b1a18] bg-[#1b1a18] px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-[#faf9f6] transition-colors hover:border-[#6f604e] hover:bg-[#6f604e]"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Review List */}
                {!loading && !error && data && (
                    <>
                        {data.reviews.length > 0 ? (
                            <div className="mt-8">
                                <div className="mb-5 flex items-center justify-between">
                                    <h3 className="font-serif text-xl text-[#34312c]">
                                        What Customers Say
                                    </h3>

                                    <span className="text-[9px] uppercase tracking-[0.15em] text-[#aaa49b]">
                                        Newest First
                                    </span>
                                </div>

                                <div className="divide-y divide-[#e2ded4] border-y border-[#e2ded4]">
                                    {data.reviews.map((item) => (
                                        <article
                                            key={item.id}
                                            className="bg-[#faf9f6] px-5 py-6 transition-colors duration-300 hover:bg-[#fdfcf9] sm:px-7 sm:py-8"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Customer Avatar */}
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c8bb94] bg-[#f0ece3] font-serif text-sm text-[#6f604e]">
                                                    {getInitials(item.user.name)}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-[#34312c]">
                                                                {item.user.name?.trim() ||
                                                                    "Verified Customer"}
                                                            </h4>

                                                            <p className="mt-1 text-[10px] text-[#aaa49b]">
                                                                {formatDate(
                                                                    item.createdAt
                                                                )}
                                                                {item.updatedAt !==
                                                                    item.createdAt &&
                                                                    " · Edited"}
                                                            </p>
                                                        </div>

                                                        <StarRating
                                                            rating={item.rating}
                                                            size="small"
                                                        />
                                                    </div>

                                                    <div className="mt-4">
                                                        {item.comment && (
                                                            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-[#57534c]">
                                                                {item.comment}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                                        <p className="text-xs text-[#817d75]">
                                            Page {page} of {totalPages}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                disabled={page <= 1 || loading}
                                                onClick={() =>
                                                    setPage((current) =>
                                                        Math.max(current - 1, 1)
                                                    )
                                                }
                                                className="border border-[#dedbd4] bg-[#faf9f6] px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-[#57534c] transition-colors hover:border-[#9b8150] hover:text-[#6f604e] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Previous
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    page >= totalPages ||
                                                    loading
                                                }
                                                onClick={() =>
                                                    setPage((current) =>
                                                        Math.min(
                                                            current + 1,
                                                            totalPages
                                                        )
                                                    )
                                                }
                                                className="border border-[#1b1a18] bg-[#1b1a18] px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-[#faf9f6] transition-colors hover:border-[#6f604e] hover:bg-[#6f604e] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="mt-8 border border-[#e2ded4] bg-[#faf9f6] px-5 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#ded5c4] bg-[#f0ece3]">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6 text-[#9b8150]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.3"
                                    >
                                        <path d="m12 2.8 2.85 5.78 6.38.93-4.62 4.5 1.09 6.36L12 17.36l-5.7 3 1.09-6.36-4.62-4.5 6.38-.93L12 2.8Z" />
                                    </svg>
                                </div>

                                <p className="mt-5 text-[9px] uppercase tracking-[0.25em] text-[#9b8150]">
                                    Be the First
                                </p>

                                <h3 className="mt-2 font-serif text-2xl text-[#34312c]">
                                    No reviews yet
                                </h3>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#817d75]">
                                    There are no reviews for this product yet.
                                    Customer feedback will appear here.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}