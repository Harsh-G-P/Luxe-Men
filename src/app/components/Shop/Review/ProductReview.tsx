"use client";

import { useState } from "react";
import { toast } from "sonner";

type ProductReviewProps = {
    productId: string;
};

type FieldErrors = Record<string, string>;

export default function ProductReview({ productId }: ProductReviewProps) {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setFieldErrors({});
        setRating(0);
        setHoverRating(0);
        setReview("");
        setIsOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFieldErrors({})

        if (rating < 1 || rating > 5) {
            setFieldErrors({
                rating: "Please select a rating from 1 to 5.",
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    rating,
                    comment: review
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.errors && typeof data.errors === "object") {
                    const errors: FieldErrors = {}

                    Object.entries(data.errors).forEach(([key, message]) => {
                        errors[key as keyof FieldErrors] = message as string
                    })

                    setFieldErrors(errors)
                    return
                }
                toast.error("❌ " + (data.message || "Something went wrong"))
                return
            }
            if (data.success) {
                toast.success(data.message)
                resetForm()
            }


        } catch (error) {
            console.log(error)
            toast.error("❌ Network error. Try again.")
        } finally {
            setLoading(false)
        }
    };

    const activeRating = hoverRating || rating;

    return (
        <section className="w-full bg-[#f5f4ef] py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-5 md:px-10">
                {/* Header */}
                <div className="flex flex-col justify-between gap-6 border-b border-[#dedbd4] pb-8 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b8150]">
                            Customer Experience
                        </p>

                        <h2 className="mt-3 font-serif text-3xl font-normal text-[#1b1a18] md:text-4xl">
                            Product Reviews
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-[#817d75]">
                            Share your thoughts on the quality, fit, and
                            craftsmanship of this product.
                        </p>
                    </div>

                    {/* Toggle Form */}
                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-expanded={isOpen}
                        className="flex shrink-0 items-center justify-center gap-4 border border-[#1b1a18] bg-[#1b1a18] px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-[#faf9f6] transition-colors duration-300 hover:border-[#6f604e] hover:bg-[#6f604e]"
                    >
                        {isOpen ? "Close Review" : "Write a Review"}

                        <span className="text-base leading-none">
                            {isOpen ? "−" : "+"}
                        </span>
                    </button>
                </div>

                {/* Review Form */}
                {isOpen && (
                    <div className="mx-auto mt-8 max-w-3xl border border-[#e2ded4] bg-[#faf9f6] p-5 sm:mt-10 sm:p-8">
                        <div className="mb-7">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-[#9b8150]">
                                Your Opinion Matters
                            </p>

                            <h3 className="mt-2 font-serif text-2xl font-normal text-[#1b1a18]">
                                Share Your Experience
                            </h3>

                            <div className="mt-4 h-px w-12 bg-[#b49a6c]" />
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Rating */}
                            <div className="border-b border-[#e8e4dc] pb-7">
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#57534c]">
                                    Overall Rating
                                </label>

                                <div className="mt-4 flex flex-wrap items-center gap-1">
                                    {Array.from({ length: 5 }, (_, index) => {
                                        const star = index + 1;

                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() =>
                                                    setHoverRating(star)
                                                }
                                                onMouseLeave={() =>
                                                    setHoverRating(0)
                                                }
                                                aria-label={`${star} out of 5 stars`}
                                                aria-pressed={rating === star}
                                                className="p-1 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b8150]"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className={`h-8 w-8 transition-colors duration-200 ${star <= activeRating
                                                        ? "fill-[#b49a6c] text-[#b49a6c]"
                                                        : "fill-transparent text-[#cfc9bd]"
                                                        }`}
                                                    stroke="currentColor"
                                                    strokeWidth="1.3"
                                                >
                                                    <path d="m12 2.8 2.85 5.78 6.38.93-4.62 4.5 1.09 6.36L12 17.36l-5.7 3 1.09-6.36-4.62-4.5 6.38-.93L12 2.8Z" />
                                                </svg>
                                            </button>
                                        );
                                    })}

                                    <span className="ml-3 text-xs text-[#817d75]">
                                        {rating === 0
                                            ? "Select a rating"
                                            : `${rating} out of 5`}
                                    </span>


                                </div>
                                {fieldErrors.rating && (
                                    <span className="mt-2 text-[10px] text-[#e7734d]">
                                        {fieldErrors.rating}
                                    </span>
                                )}
                            </div>

                            {/* Comment */}
                            <div className="mt-7">
                                <label
                                    htmlFor="review-comment"
                                    className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#57534c]"
                                >
                                    Your Review
                                </label>

                                <textarea
                                    id="review-comment"
                                    value={review}
                                    onChange={(e) =>
                                        setReview(e.target.value)
                                    }
                                    maxLength={1000}
                                    rows={5}
                                    placeholder="Tell us about the fit, material, quality, and your overall experience..."
                                    className="w-full resize-y border border-[#d4cfc5] bg-[#fdfcf9] px-4 py-3.5 text-sm leading-6 text-[#34312c] outline-none transition-colors placeholder:text-[#aaa49b] focus:border-[#9b8150]"
                                />

                                <p className="mt-1.5 text-right text-[10px] text-[#aaa49b]">
                                    {review.length}/1000
                                </p>
                                {fieldErrors.comment && (
                                    <span className="mt-2 text-[10px] text-[#e7734d]">
                                        {fieldErrors.comment}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center gap-3 border border-[#1b1a18] bg-[#1b1a18] px-7 py-4 text-[10px] uppercase tracking-[0.18em] text-[#faf9f6] transition-colors duration-300 hover:border-[#6f604e] hover:bg-[#6f604e] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Submitting..."
                                        : "Submit Review"}

                                    {!loading && <span>↗</span>}
                                </button>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={loading}
                                    className="border border-[#dedbd4] bg-[#fdfcf9] px-7 py-4 text-[10px] uppercase tracking-[0.18em] text-[#57534c] transition-colors duration-300 hover:border-[#9b8150] hover:text-[#6f604e] disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
}
