"use client";

import { useState } from "react";
import ProductInfo from "./ProductInfo";
import VariantSelector from "./VariantSelector";
import ProductActions from "./ProductActions";
import ProductAccordion from "./ProductAccordion";

type Variant = {
    id: string;
    price: number | null;
    productId: string;
    stock: number;
    attributes: Record<string, string>;
};

type Product = {
    id: string;
    title: string;
    price: number;
    description: string | null;
    brand: {
        title: string;
    };
    variants: Variant[];
};

type Props = {
    product: Product;
    totalStock: number;
};

export default function ProductDetails({
    product,
}: Props) {
    const [selectedVariant, setSelectedVariant] = useState<
        typeof product.variants[number] | null
    >(null);

    const [descriptionOpen, setDescriptionOpen] = useState(false);


    return (
        <section className="relative w-full text-[#302923] sm:mt-20">
            <div
                className="
                    relative
                    mx-4
                    my-6
                    overflow-hidden
                    sm:mx-6
                    md:mx-8
                    lg:mx-10
                "
            >
                {/* OUTER BORDER */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-3
                        border
                        border-[#a99d8e]/35
                        sm:inset-4
                        md:inset-5
                    "
                />

                {/* INNER BORDER */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-1.75
                        border
                        border-[#a99d8e]/10
                        sm:inset-2.25
                        md:inset-2.75
                    "
                />

                {/* CORNER DETAILS */}
                <div className="pointer-events-none absolute inset-0 z-10">
                    <span
                        className="
                            absolute left-3 top-3 h-5 w-5
                            border-l border-t border-[#a99d8e]/55
                            sm:left-4 sm:top-4 sm:h-6 sm:w-6
                            md:left-5 md:top-5
                        "
                    />

                    <span
                        className="
                            absolute right-3 top-3 h-5 w-5
                            border-r border-t border-[#a99d8e]/55
                            sm:right-4 sm:top-4 sm:h-6 sm:w-6
                            md:right-5 md:top-5
                        "
                    />

                    <span
                        className="
                            absolute bottom-3 left-3 h-5 w-5
                            rounded-bl-xl
                            border-b border-l border-[#a99d8e]/55
                            sm:bottom-4 sm:left-4 sm:h-6 sm:w-6
                            md:bottom-5 md:left-5
                        "
                    />

                    <span
                        className="
                            absolute bottom-3 right-3 h-5 w-5
                            rounded-br-xl
                            border-b border-r border-[#a99d8e]/55
                            sm:bottom-4 sm:right-4 sm:h-6 sm:w-6
                            md:bottom-5 md:right-5
                        "
                    />
                </div>

                {/* CONTENT */}
                <div
                    className=" relative z-20 px-4 pb-10 pt-14 sm:px-7 sm:pb-14 sm:pt-16 md:px-10 md:pb-20 md:pt-20 lg:px-10 lg:pb-28 lg:pt-32"
                >

                    {/* CENTERED PRODUCT TILE */}
                    <div className="mx-auto w-full max-w-2xl">
                        {/* PRODUCT INFO */}
                        <div
                            className="
                                text-center
                            "
                        >
                            <ProductInfo
                                brand={product.brand.title}
                                title={product.title}
                                price={
                                    selectedVariant?.price ??
                                    product.price
                                }
                            />
                        </div>

                        {/* SELECT OPTIONS */}
                        <div className="mt-12">


                            {/* VARIANTS */}
                            <div
                                className="
                                    border-y
                                    border-[#302923]/10
                                    py-7
                                "
                            >
                                <VariantSelector
                                    productId={product.id}
                                    variants={product.variants}
                                    onVariantChange={setSelectedVariant}
                                />
                            </div>
                        </div>

                        <div className="relative border-b border-[#302923]/10 px-7 py-5">
                            <p
                                className={` max-w-xl text-xs font-light leading-6 text-gray-600 transition-all duration-300 ${descriptionOpen
                                        ? ""
                                        : "line-clamp-1"
                                    }
                                `}
                            >
                                {product.description ?? ""}
                            </p>

                            {product.description && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDescriptionOpen((prev) => !prev)
                                    }
                                    className=" mt-2 text-[8px] font-medium uppercase tracking-[0.25em] text-[#302923] transition-opacity duration-300 hover:opacity-50"
                                >
                                    {descriptionOpen
                                        ? "Read Less ↑"
                                        : "Read More ↓"
                                    }
                                </button>
                            )}
                        </div>

                        {/* ACTION */}
                        <ProductActions />

                        {/* PRODUCT DETAILS */}
                        <div
                            className="
                                mt-4
                                border-t
                                border-[#302923]/10
                                pt-4
                            "
                        >
                            <ProductAccordion />
                        </div>

                        {/* TRUST */}
                        <div
                            className="
                                mt-10
                                flex
                                justify-center
                                border-t
                                border-[#302923]/10
                                pt-7
                            "
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] text-[#9b8d7d]">
                                    ✦
                                </span>

                                <p
                                    className="
                                        text-center
                                        text-[8px]
                                        font-medium
                                        uppercase
                                        tracking-[0.22em]
                                        text-[#81776d]
                                    "
                                >
                                    Considered design · Timeless quality
                                </p>

                                <span className="text-[9px] text-[#9b8d7d]">
                                    ✦
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
