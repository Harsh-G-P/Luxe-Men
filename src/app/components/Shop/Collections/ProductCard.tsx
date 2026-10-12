"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function ProductCard({ product }: ProductProps) {
    const primaryImage = product.images[1] || product.images[0];
    const hoverImage = product.images[0];

    return (
        <article className="group w-full">
            {/* PRODUCT IMAGE */}
            <Link
                href={`/product/${product.slug}`}
                aria-label={`View ${product.title}`}
                className="
                    relative block aspect-[0.76] w-full
                    overflow-hidden bg-[#e9e6df]
                "
            >
                <Image
                    src={primaryImage}
                    alt={product.title}
                    fill
                    sizes="
                        (max-width: 639px) 72vw,
                        (max-width: 1279px) 45vw,
                        25vw
                    "
                    className="
                        object-cover
                        transition-transform duration-700 ease-out
                        group-hover:scale-[1.035]
                    "
                />

                {/* ALTERNATE IMAGE */}
                {hoverImage && hoverImage !== primaryImage && (
                    <Image
                        src={hoverImage}
                        alt={`${product.title} alternate view`}
                        fill
                        sizes="
                            (max-width: 639px) 72vw,
                            (max-width: 1279px) 45vw,
                            25vw
                        "
                        className="
                            object-cover opacity-0
                            transition-opacity duration-500
                            ease-in-out
                            group-hover:opacity-100
                        "
                    />
                )}

                {/* SUBTLE IMAGE BORDER */}
                <div className="pointer-events-none absolute inset-0 border border-black/[0.07]" />

                {/* BRAND LABEL */}
                <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
                    <span
                        className="
                            inline-block bg-[#f8f6f0]/90
                            px-2.5 py-1.5
                            text-[8px] font-medium uppercase
                            tracking-[0.18em] text-[#39332c]
                            sm:text-[9px]
                        "
                    >
                        {product.brand.title}
                    </span>
                </div>

                {/* DESKTOP HOVER ACTION */}
                <div
                    className="
                        absolute inset-x-3 bottom-3 z-10
                        hidden translate-y-3 opacity-0
                        transition-all duration-500
                        group-hover:translate-y-0
                        group-hover:opacity-100
                        sm:block sm:inset-x-4 sm:bottom-4
                    "
                >
                    <div
                        className="
                            flex h-11 items-center justify-between
                            border border-black/10
                            bg-[#f8f6f0]/95 px-4
                        "
                    >
                        <span
                            className="
                                text-[9px] font-medium uppercase
                                tracking-[0.2em] text-[#302923]
                            "
                        >
                            Discover Piece
                        </span>

                        <ArrowUpRight
                            size={15}
                            strokeWidth={1.2}
                            className="
                                transition-transform duration-300
                                group-hover:translate-x-0.5
                                group-hover:-translate-y-0.5
                            "
                        />
                    </div>
                </div>
            </Link>

            {/* PRODUCT INFORMATION */}
            <div className="pt-4 sm:pt-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <p
                            className="
                                mb-1.5 text-[8px] font-medium
                                uppercase tracking-[0.22em]
                                text-[#958879] sm:text-[9px]
                            "
                        >
                            {product.brand.title}
                        </p>

                        <Link
                            href={`/product/${product.slug}`}
                            className="
                                inline-block text-[13px] font-normal
                                leading-snug tracking-[-0.02em]
                                text-[#302923]
                                transition-colors duration-300
                                hover:text-[#927b5d] sm:text-sm
                            "
                        >
                            {product.title}
                        </Link>
                    </div>

                    <p
                        className="
                            shrink-0 pt-5 text-[11px] font-medium
                            tracking-wide text-[#302923] sm:text-xs
                        "
                    >
                        ${product.price.toFixed(2)}
                    </p>
                </div>

                {/* EDITORIAL FOOTER */}
                <div
                    className="
                        mt-4 flex items-center justify-between
                        border-t border-[#302923]/10 pt-3
                    "
                >
                    <span
                        className="
                            text-[8px] uppercase tracking-[0.18em]
                            text-[#8b8074]
                        "
                    >
                        Refined Essentials
                    </span>

                    <Link
                        href={`/product/${product.slug}`}
                        aria-label={`Explore ${product.title}`}
                        className="
                            flex h-7 w-7 items-center justify-center
                            border border-[#302923]/15
                            text-[#302923]
                            transition-colors duration-300
                            hover:border-[#302923]
                            hover:bg-[#302923]
                            hover:text-[#f8f6f0]
                        "
                    >
                        <ArrowUpRight size={13} strokeWidth={1.2} />
                    </Link>
                </div>
            </div>
        </article>
    );
}