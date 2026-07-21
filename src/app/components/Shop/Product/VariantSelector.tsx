"use client";

import { AnimatePresence, motion } from "framer-motion";
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
                toast.error(data.message || "Something went wrong");
                return;
            }

            toast.success("Added to cart!");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="px-7">

            <div className="flex flex-col gap-4">

                {
                    attributes.map(attr => (

                        <button
                            key={attr.attributeName}
                            onClick={() => setOpenOption(attr.attributeName)}
                            className="w-full py-3 border border-black text-xs tracking-widest hover:bg-black hover:text-white transition"
                        >
                            SELECT {attr.attributeName.toUpperCase()}
                        </button>


                    ))
                }


                {
                    selectedVariant && (
                        <>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <p className="text-sm font-medium">
                                    {selectedVariant.stock > 0 ? "In Stock" : "Out of Stock"}
                                </p>

                                {selectedVariant.stock > 0 && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        {selectedVariant.stock} available
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                                <span className="text-sm font-medium">
                                    Quantity
                                </span>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg"
                                    >
                                        −
                                    </button>

                                    <span className="min-w-6 text-center text-sm font-medium">
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.min(selectedVariant.stock, q + 1)
                                            )
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={selectedVariant.stock === 0 || loading}
                                className={`w-full py-3 text-xs tracking-widest transition ${selectedVariant.stock > 0
                                    ? "bg-black text-white hover:opacity-90"
                                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                                    }`}
                            >
                                {loading
                                    ? "ADDING..."
                                    : selectedVariant.stock > 0
                                        ? "ADD TO CART"
                                        : "OUT OF STOCK"}
                            </button>
                        </>
                    )
                }


            </div>

            <AnimatePresence>

                {
                    openOption && (
                        <>
                            <motion.div
                                className="fixed inset-0 z-40 backdrop-blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setOpenOption(null)}
                            />

                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ duration: 0.5 }}
                                className="fixed top-0 right-0 z-50 h-full w-full max-w-137.5 bg-white p-6 md:p-8 shadow-xl overflow-y-auto"

                            >
                                <button
                                    onClick={() => setOpenOption(null)}
                                    className=" self-end block ml-auto text-gray-500    
                                ">
                                    ✕
                                </button>

                                <h3
                                    className=" text-xs tracking-widest font-semibold mt-8 mb-6 "
                                >
                                    {openOption.toUpperCase()}

                                </h3>

                                <>
                                    <div
                                        onClick={() => {
                                            setSelectedOptions((prev) => {
                                                const updated = { ...prev };
                                                delete updated[openOption!];
                                                return updated;
                                            });

                                            setOpenOption(null);
                                        }}
                                        className="px-4 py-5 border-b cursor-pointer text-sm hover:bg-gray-100"
                                    >
                                        None
                                    </div>

                                    {[...new Set(
                                        filteredVariants
                                            .map((variant) => variant.attributes[openOption!])
                                            .filter(Boolean)
                                    )].map((value) => (

                                        <div
                                            key={value}
                                            onClick={() => { selectValue(openOption!, value) }}

                                            className={` px-4 py-5 border-b  cursor-pointer text-sm ${selectedOptions[openOption] === value
                                                ?
                                                "bg-black text-white"
                                                :
                                                "hover:bg-gray-100"
                                                }`}
                                        >

                                            {value}

                                        </div>
                                    ))
                                    }
                                </>

                            </motion.div>

                        </>
                    )
                }


            </AnimatePresence>


        </div>

    );
}