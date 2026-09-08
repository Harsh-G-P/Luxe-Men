"use client";

import { ShoppingBag } from "lucide-react";
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
    return (
        <div className="w-full border border-gray-200 bg-white p-4">
            <Link
                href={`/product/${product.slug}`}
                className="
                    group
                    relative
                    block
                    aspect-[0.72]
                    w-full
                    bg-[#faf9f6]
                "
            >
                {/* =========================================
                    PRODUCT IMAGE
                ========================================== */}
                <div
                    className="
                        absolute
                        left-0
                        top-1/2
                        z-0
                        h-[calc(100%-15px)]
                        w-full
                        -translate-y-1/2
                        overflow-hidden
                    "
                >
                    {/* Normal image */}
                    <Image
                        src={product.images[1] || product.images[0]}
                        alt={product.title}
                        fill
                        sizes="
                            (max-width: 640px) 72vw,
                            (max-width: 1280px) 45vw,
                            25vw
                        "
                        className="
                            object-cover
                            transition-opacity
                            duration-700
                            ease-in-out
                            group-hover:opacity-0
                        "
                    />

                    {/* Hover image */}
                    <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="
                            (max-width: 640px) 72vw,
                            (max-width: 1280px) 45vw,
                            25vw
                        "
                        className="
                            object-cover
                            opacity-0
                            transition-opacity
                            duration-700
                            ease-in-out
                            group-hover:opacity-100
                        "
                    />
                </div>

                {/* =========================================
                    DESKTOP DECORATIVE BORDER
                    XL and above
                ========================================== */}
                <div className="pointer-events-none absolute inset-0 z-10 hidden xl:block">
                    {/* Outer border */}
                    <div className="absolute inset-0 border border-black/20" />

                    {/* Inner border */}
                    <div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            h-[calc(100%-15px)]
                            w-[calc(100%+14px)]
                            -translate-x-1/2
                            -translate-y-1/2
                            border
                            border-black/20
                        "
                    />
                </div>

                {/* =========================================
                    MOBILE + TABLET DECORATIVE BORDER
                    BELOW XL
                ========================================== */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        z-20
                        xl:hidden
                    "
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 1000 720"
                        preserveAspectRatio="none"
                        fill="none"
                        aria-hidden="true"
                    >
                        {/* TOP LINE */}
                        <path
                            d="
                                M 60 20
                                H 940
                            "
                            stroke="#000"
                            strokeOpacity="0.25"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* TOP LEFT STEP + LEFT VERTICAL */}
                        <path
                            d="
                                M 60 20
                                V 45
                                H 20
                                V 665
                            "
                            stroke="#000"
                            strokeOpacity="0.25"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* TOP RIGHT STEP + RIGHT VERTICAL */}
                        <path
                            d="
                                M 940 20
                                V 45
                                H 980
                                V 665
                            "
                            stroke="#000"
                            strokeOpacity="0.25"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* BOTTOM LEFT CURVE */}
                        <path
                            d="
                                M 20 665
                                C 55 665 80 680 80 705
                            "
                            stroke="#000"
                            strokeOpacity="0.25"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* BOTTOM LINE */}
                        <path
                            d="
                                M 80 705
                                H 920
                            "
                            stroke="#000"
                            strokeOpacity="0.25"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* BOTTOM RIGHT CURVE */}
                        <path
                            d="
                                M 920 705
                                C 920 680 945 665 980 665
                            "
                            stroke="#000"
                            strokeOpacity="0.25"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>

                {/* =========================================
                    TOP NOTCH
                    DESKTOP ONLY
                ========================================== */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        z-20
                        hidden
                        h-3
                        w-7
                        -translate-x-1/2
                        rounded-b-full
                        border-x
                        border-b
                        border-black/10
                        bg-[#faf9f6]
                        xl:block
                    "
                />

                {/* =========================================
                    TOP DECORATIVE ICON
                    DESKTOP ONLY
                ========================================== */}
                <div
                    className="
                        absolute
                        left-1/2
                        top-12
                        z-20
                        hidden
                        h-13
                        w-13
                        -translate-x-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-[repeating-conic-gradient(from_0deg,rgba(0,0,0,0.4)_0deg_3deg,transparent_3deg_10deg)]
                        p-px
                        opacity-100
                        transition-all
                        duration-500
                        group-hover:scale-75
                        group-hover:opacity-0
                        xl:flex
                    "
                >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#faf9f6]">
                        <span className="relative h-5 w-4">
                            {/* Circle */}
                            <span
                                className="
                                    absolute
                                    left-1/2
                                    top-0
                                    h-3
                                    w-3
                                    -translate-x-1/2
                                    rounded-full
                                    border
                                    border-black
                                "
                            />

                            {/* Stem */}
                            <span
                                className="
                                    absolute
                                    left-1/2
                                    top-3
                                    h-2
                                    w-px
                                    -translate-x-1/2
                                    bg-black
                                "
                            />
                        </span>
                    </div>
                </div>

                {/* =========================================
                    PRODUCT INFORMATION
                ========================================== */}
                <div
                    className="
                        absolute
                        bottom-7
                        left-5
                        right-5
                        z-20
                        text-center
                        opacity-100
                        transition-all
                        duration-500
                        group-hover:-translate-y-17.5
                        group-hover:opacity-0
                        xl:bottom-9
                    "
                >
                    <h3
                        className="
                            mx-auto
                            max-w-[85%]
                            text-sm
                            font-medium
                            leading-snug
                            tracking-[-0.01em]
                            text-black
                        "
                    >
                        {product.title}
                    </h3>

                    <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="h-px w-5 bg-black/20" />

                        <p className="text-sm font-medium tracking-wide text-black/70 ">
                            ${product.price.toFixed(2)}
                        </p>

                        <span className="h-px w-5 bg-black/20" />
                    </div>
                </div>

                {/* =========================================
                    HOVER ACTIONS
                ========================================== */}
                <div
                    className="
                        absolute
                        bottom-7
                        left-5
                        right-5
                        z-30
                        flex
                        items-center
                        gap-3
                        translate-y-4
                        opacity-0
                        transition-all
                        duration-500
                        group-hover:translate-y-0
                        group-hover:opacity-100
                        xl:bottom-9
                        xl:gap-5
                    "
                >
                    {/* VIEW DETAILS */}
                    <div
                        className="
                            group/view
                            relative
                            flex
                            h-11
                            flex-1
                            items-center
                            justify-center
                        "
                    >
                        <div className="absolute inset-0 z-0 bg-[#faf9f6]" />

                        <div className="pointer-events-none absolute inset-0 z-10">
                            {/* Background */}
                            <div className="absolute inset-0 bg-[#faf9f6]" />

                            {/* Inner border */}
                            <div
                                className="
                                    absolute
                                    left-1/2
                                    top-1/2
                                    z-10
                                    h-[calc(100%-10px)]
                                    w-[calc(100%+10px)]
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    border
                                    border-black/20
                                    bg-[#faf9f6]
                                    transition-[width,height]
                                    duration-500
                                    ease-in-out
                                    group-hover/view:h-full
                                    group-hover/view:w-full
                                "
                            />

                            {/* Outer border */}
                            <div className="absolute inset-0 z-30 border border-black/20" />
                        </div>

                        <span
                            className=" relative z-40 text-[10px] font-medium uppercase tracking-[0.18em] text-[#302923] "
                        >
                            VIEW DETAILS
                        </span>


                        <span
                            className="
                                absolute
                                right-4
                                z-40
                                text-xl
                                font-light
                                text-black
                                xl:right-6
                            "
                        >
                            +
                        </span>
                    </div>

                    {/* SHOPPING BAG */}
                    <div
                        className="
                            relative
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                        "
                    >
                        <div className="absolute inset-0 z-0 bg-[#faf9f6]" />

                        <div className="pointer-events-none absolute inset-0 z-10">
                            <div className="absolute inset-0 border border-black/20" />
                        </div>

                        <ShoppingBag
                            className="
                                relative
                                z-20
                                h-5
                                w-5
                                text-black
                                xl:h-6
                                xl:w-6
                            "
                            strokeWidth={1.2}
                        />
                    </div>
                </div>
            </Link>
        </div>
    );
}