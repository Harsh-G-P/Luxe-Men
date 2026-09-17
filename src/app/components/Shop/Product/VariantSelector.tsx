"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Variant = {
    id: string;
    productId: string;
    price: number | null;
    attributes: Record<string, string>;
    stock: number;
};

type Props = {
    productId: string;
    variants: Variant[];
    onVariantChange: (variant: Variant | null) => void;
};


export default function VariantSelector({ productId, variants, onVariantChange }: Props) {

    const attributes = Object.entries(
        variants.reduce<Record<string, Set<string>>>((acc, variant) => {
            Object.entries(variant.attributes).forEach(([key, value]) => {
                if (!acc[key]) {
                    acc[key] = new Set();
                }

                acc[key].add(String(value));
            });

            return acc;
        }, {})
    ).map(([attributeName, values]) => ({
        attributeName,
        values: [...values],
    }));

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [openOption, setOpenOption] = useState<string | null>(null);

    const [quantity, setQuantity] = useState(1);

    const filteredVariants = variants.filter((variant) =>
        Object.entries(selectedOptions).every(
            ([key, value]) =>
                key === openOption || variant.attributes[key] === value
        )
    );

    const selectValue = (attribute: string, value: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [attribute]: value,
        }));

        setQuantity(1);
        setOpenOption(null);
    };

    const isSelected = attributes.every(attr => selectedOptions[attr.attributeName]);

    const selectedVariant = isSelected
        ? variants.find((variant) =>
            Object.entries(selectedOptions).every(
                ([key, value]) => variant.attributes[key] === value
            )
        )
        : null;

    useEffect(() => {
        onVariantChange(selectedVariant ?? null);
    }, [selectedVariant, onVariantChange]);

    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        try {
            setLoading(true);

            const res = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    variantId: selectedVariant.id,
                    quantity,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors && typeof data.errors === "object") {
                    const firstError = Object.values(data.errors)[0] as string;
                    toast.error(firstError);
                    return;
                }

                toast.error(data.message || "Something went wrong");
                return;
            }

            toast.success("Added to cart!");
            window.dispatchEvent(new Event("cartUpdated"));
            window.dispatchEvent(new Event("openMiniCart"));
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    return (

        <div className="px-7">

            <div className="flex flex-col gap-8">
                {/* OPTIONS */}
                <div className="space-y-3">
                    {attributes.map((attr) => {
                        const selectedValue =
                            selectedOptions[attr.attributeName];

                        return (
                            <button
                                key={attr.attributeName}
                                type="button"
                                onClick={() =>
                                    setOpenOption(attr.attributeName)
                                }
                                className=" group flex w-full items-center justify-between border-b border-[#302923]/15 py-5 text-left transition-colors duration-300 hover:border-[#302923]/50"
                            >
                                <div>
                                    <span
                                        className=" block text-[8px] font-medium uppercase tracking-[0.28em] text-[#9b8d7d]"
                                    >
                                        {attr.attributeName}
                                    </span>

                                    <span
                                        className=" mt-2 block text-xs font-light tracking-wide text-[#302923]"
                                    >
                                        {selectedValue || "Select"}
                                    </span>
                                </div>

                                <span
                                    className=" text-lg font-light text-[#9b8d7d] transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    →
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* SELECTED VARIANT */}
                {selectedVariant && (
                    <>
                        {/* STOCK */}
                        <div
                            className=" flex items-center justify-between border-y border-[#302923]/10 py-5"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={` h-1.5 w-1.5 rounded-full ${selectedVariant.stock > 0
                                            ? "bg-[#75856d]"
                                            : "bg-[#a36f6f]"
                                        }
                                    `}
                                />

                                <span
                                    className=" text-[9px] font-medium uppercase tracking-[0.22em] text-[#71685f]"
                                >
                                    {selectedVariant.stock > 0
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </span>
                            </div>

                            {selectedVariant.stock > 0 && (
                                <span
                                    className=" text-[9px] tracking-wide text-[#9b8d7d]"
                                >
                                    {selectedVariant.stock} available
                                </span>
                            )}
                        </div>

                        {/* QUANTITY */}
                        <div
                            className=" flex items-center justify-between border-b border-[#302923]/10 pb-6"
                        >
                            <span
                                className=" text-[9px] font-medium uppercase tracking-[0.22em] text-[#71685f]"
                            >
                                Quantity
                            </span>

                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((q) =>
                                            Math.max(1, q - 1)
                                        )
                                    }
                                    disabled={quantity <= 1}
                                    className=" flex h-9 w-9 items-center justify-center border border-[#302923]/15 text-sm font-light transition hover:border-[#302923] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    −
                                </button>

                                <span
                                    className=" flex h-9 w-12 items-center justify-center text-xs font-medium"
                                >
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((q) =>
                                            Math.min(
                                                selectedVariant.stock,
                                                q + 1
                                            )
                                        )
                                    }
                                    disabled={
                                        quantity >= selectedVariant.stock
                                    }
                                    className=" flex h-9 w-9 items-center justify-center border border-[#302923]/15 text-sm font-light transition hover:border-[#302923] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* ADD TO CART */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={
                                selectedVariant.stock === 0 || loading
                            }
                            className={` relative w-full overflow-hidden py-5 text-[9px] font-medium uppercase tracking-[0.3em] transition-all duration-500 ${selectedVariant.stock > 0
                                    ? "bg-[#302923] text-white hover:bg-black"
                                    : "cursor-not-allowed bg-[#ddd8d1] text-[#9b938a]"
                                }
                            `}
                        >
                            <span className="relative z-10">
                                {loading
                                    ? "Adding..."
                                    : selectedVariant.stock > 0
                                        ? "Add to Cart"
                                        : "Out of Stock"}
                            </span>
                        </button>
                    </>
                )}
            </div>


            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {openOption && (
                            <>
                                <motion.div
                                    className=" fixed inset-0 z-99998 bg-[#302923]/25 backdrop-blur-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => setOpenOption(null)}
                                />

                                <motion.aside
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{
                                        duration: 0.55,
                                        ease: [0.4, 0, 0.2, 1],
                                    }}
                                    className=" fixed right-0 top-0 z-99999 h-dvh w-full overflow-y-auto border-l border-[#a99d8e]/25 bg-[#faf8f4] text-[#302923] md:w-1/2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* INNER FRAME */}

                                    <div
                                        className=" pointer-events-none absolute inset-3 border border-[#a99d8e]/15 sm:inset-4"
                                    />

                                    {/* CLOSE */}

                                    <button
                                        type="button"
                                        onClick={() => setOpenOption(null)}
                                        aria-label="Close"
                                        className=" group absolute right-7 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#a99d8e]/35 bg-[#faf8f4] text-[#6f655b] transition-all duration-300 hover:border-[#302923] hover:bg-[#302923] hover:text-white sm:right-10"
                                    >
                                        <span
                                            className=" text-sm font-light transition-transform duration-300 group-hover:rotate-90"
                                        >
                                            ×
                                        </span>
                                    </button>

                                    {/* CONTENT */}

                                    <div
                                        className=" relative z-10 px-8 pb-16 pt-20 sm:px-12 sm:pb-20 sm:pt-24"
                                    >
                                        {/* EYEBROW */}

                                        <div className="mb-5 flex items-center gap-3">
                                            <span className="text-[9px] text-[#9b8d7d]">
                                                ✦
                                            </span>

                                            <span
                                                className=" text-[8px] font-medium uppercase tracking-[0.35em] text-[#9b8d7d]"
                                            >
                                                Select your preference
                                            </span>
                                        </div>

                                        {/* TITLE */}

                                        <div className="mb-10">
                                            <h3
                                                className=" font-serif text-3xl font-light leading-tight tracking-[-0.02em] text-[#302923] sm:text-4xl"
                                            >
                                                {openOption}
                                            </h3>

                                            <div className="mt-5 h-px w-16 bg-[#a99d8e]/50" />
                                        </div>

                                        {/* NONE */}

                                        <div
                                            onClick={() => {
                                                setSelectedOptions((prev) => {
                                                    const updated = { ...prev };

                                                    delete updated[openOption];

                                                    return updated;
                                                });

                                                setQuantity(1);
                                                setOpenOption(null);
                                            }}
                                            className=" group flex cursor-pointer items-center justify-between border-y border-[#302923]/10 px-2 py-5 text-[10px] uppercase tracking-[0.22em] text-[#81776d] transition-colors hover:text-[#302923]"
                                        >
                                            <span>None</span>

                                            <span
                                                className=" text-xs opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                →
                                            </span>
                                        </div>

                                        {/* OPTIONS */}

                                        <div className="mt-1">
                                            {[
                                                ...new Set(
                                                    filteredVariants
                                                        .map(
                                                            (variant) =>
                                                                variant.attributes[
                                                                openOption
                                                                ]
                                                        )
                                                        .filter(Boolean)
                                                ),
                                            ].map((value) => {
                                                const selected =
                                                    selectedOptions[openOption] ===
                                                    value;

                                                return (
                                                    <div
                                                        key={value}
                                                        onClick={() =>
                                                            selectValue(
                                                                openOption,
                                                                value
                                                            )
                                                        }
                                                        className={` group flex cursor-pointer items-center justify-between border-b border-[#302923]/10 px-2 py-6 text-sm transition-all duration-300 ${selected
                                                                ? "bg-[#302923] text-white"
                                                                : "text-[#302923] hover:bg-[#f1eee8]"
                                                            }
                                                        `}
                                                    >
                                                        <span
                                                            className={` transition-transform duration-300 ${selected
                                                                    ? "translate-x-2"
                                                                    : "group-hover:translate-x-1"
                                                                }
                                                            `}
                                                        >
                                                            {value}
                                                        </span>

                                                        {selected && (
                                                            <span className="text-[10px]">
                                                                ✓
                                                            </span>
                                                        )}

                                                        {!selected && (
                                                            <span
                                                                className=" text-xs text-[#a99d8e] opacity-0 transition-opacity group-hover:opacity-100"
                                                            >
                                                                →
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* SIGNATURE */}
                                        <div
                                            className=" mt-16 flex items-center gap-4"
                                        >
                                            <span className="h-px flex-1 bg-[#a99d8e]/20" />

                                            <span
                                                className=" text-[7px] uppercase tracking-[0.3em] text-[#a99d8e]"
                                            >
                                                Timeless by design
                                            </span>

                                            <span className="h-px flex-1 bg-[#a99d8e]/20" />
                                        </div>

                                    </div>
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>,
                    document.body
                )}


        </div>

    );
}