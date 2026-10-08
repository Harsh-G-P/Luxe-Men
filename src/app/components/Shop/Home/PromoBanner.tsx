"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

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

type Props = {
    product?: Product;
};

export default function PromoBanner({ product }: Props) {
    if (!product || !product.images?.length) return null;

    const mainImage = product.images[0];
    const secondImage = product.images[1] || product.images[0];

    return (
        <main className="min-h-screen bg-[#f3eee5] text-[#171717]">

            {/* =========================================
                MAIN EDITORIAL SECTION
            ========================================== */}
            <section className="relative flex min-h-screen items-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-12 lg:px-16">

                {/* =========================================
                    LOOKBOOK STYLE OUTER FRAME
                ========================================== */}
                <div className="pointer-events-none absolute inset-4 sm:inset-6 md:inset-8">

                    {/* Soft outer line */}
                    <div className="absolute -inset-0.5 border border-black/5 blur-[2px]" />

                    {/* Main frame */}
                    <div className="absolute inset-0 border border-black/10" />

                    {/* Top left */}
                    <div className="absolute left-0 top-0 h-5 w-5 border-l border-t border-black/20" />

                    {/* Top right */}
                    <div className="absolute right-0 top-0 h-5 w-5 border-r border-t border-black/20" />

                    {/* Bottom left */}
                    <div className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-black/20" />

                    {/* Bottom right */}
                    <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-black/20" />

                </div>


                <div className="w-full max-w-350">

                    <div
                        className=" relative grid items-center min-[1024px]:grid-cols-[1.15fr_0.75fr] min-[1400px]:grid-cols-[1.15fr_0.75fr_0.9fr]"
                    >

                        {/* LEFT IMAGE */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut",
                            }}
                            className="relative z-0 h-107.5 w-full overflow-hidden sm:h-130 lg:h-175 lg:w-187.5"
                        >

                            <Image
                                src={mainImage}
                                alt={product.title}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 850px"
                                className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.02]"
                            />

                            <div className="absolute inset-0 bg-black/10" />

                        </motion.div>


                        {/* CENTER PRODUCT CARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.15,
                                duration: 0.8,
                            }}
                            className="relative z-20 mx-auto -mt-16 w-82.5 sm:w-92.5 lg:-ml-40 lg:mt-0 lg:w-92.5"
                        >
                            <div className="border border-gray-200 bg-[#f5f4ef] p-4">

                                <Link
                                    href={`/product/${product.slug}`}
                                    className="group relative block h-97.5 bg-[#f5f4ef] sm:h-105"
                                >

                                    {/* PRODUCT IMAGE - UNCHANGED */}


                                    <div
                                        className=" absolute left-0 top-1/2 z-0 h-[calc(100%-15px)] w-full -translate-y-1/2 overflow-hidden"
                                    >

                                        {/* Normal image */}
                                        <Image
                                            src={secondImage}
                                            alt={product.title}
                                            fill
                                            sizes="310px"
                                            className=" object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                                        />

                                        {/* Hover image */}
                                        <Image
                                            src={mainImage}
                                            alt={product.title}
                                            fill
                                            sizes="310px"
                                            className=" object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                                        />

                                    </div>


                                    {/* DESKTOP BORDERS */}

                                    <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">

                                        <div className="absolute inset-0 border border-black/20" />

                                        <div
                                            className=" absolute left-1/2 top-1/2 h-[calc(100%-15px)] w-[calc(100%+14px)] -translate-x-1/2 -translate-y-1/2 border border-black/20"
                                        />

                                    </div>


                                    {/* MOBILE BORDER */}

                                    <div
                                        className=" pointer-events-none absolute inset-0 z-20 md:hidden"
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
                                                d=" M 60 20 H 940"
                                                stroke="#000"
                                                strokeOpacity="0.25"
                                                strokeWidth="1"
                                                vectorEffect="non-scaling-stroke"
                                            />

                                            {/* TOP LEFT STEP */}
                                            <path
                                                d=" M 60 20 V 45 H 20 V 665"
                                                stroke="#000"
                                                strokeOpacity="0.25"
                                                strokeWidth="1"
                                                vectorEffect="non-scaling-stroke"
                                            />

                                            {/* TOP RIGHT STEP + RIGHT VERTICAL */}
                                            <path
                                                d=" M 940 20 V 45 H 980 V 665"
                                                stroke="#000"
                                                strokeOpacity="0.25"
                                                strokeWidth="1"
                                                vectorEffect="non-scaling-stroke"
                                            />

                                            {/* BOTTOM LEFT CURVE */}
                                            <path
                                                d=" M 20 665 C 55 665 80 680 80 705"
                                                stroke="#000"
                                                strokeOpacity="0.25"
                                                strokeWidth="1"
                                                vectorEffect="non-scaling-stroke"
                                            />

                                            {/* BOTTOM LINE */}
                                            <path
                                                d=" M 80 705 H 920"
                                                stroke="#000"
                                                strokeOpacity="0.25"
                                                strokeWidth="1"
                                                vectorEffect="non-scaling-stroke"
                                            />

                                            {/* BOTTOM RIGHT CURVE */}
                                            <path
                                                d=" M 920 705 C 920 680 945 665 980 665"
                                                stroke="#000"
                                                strokeOpacity="0.25"
                                                strokeWidth="1"
                                                vectorEffect="non-scaling-stroke"
                                            />

                                        </svg>
                                    </div>

                                    {/* TOP NOTCH - DESKTOP ONLY */}

                                    <div
                                        className=" pointer-events-none absolute left-1/2 top-0 z-20 hidden h-3 w-7 -translate-x-1/2 rounded-b-full border-x border-b border-black/10 bg-[#faf9f6] md:block"
                                    />


                                    {/* TOP DECORATIVE ICON - DESKTOP ONLY */}

                                    <div
                                        className=" absolute left-1/2 top-10 z-20 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(0,0,0,0.4)_0deg_3d transparent_3deg_10deg)] p-px transition-all duration-500 group-hover:scale-75 group-hover:opacity-0 md:flex"
                                    >
                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#faf9f6]">
                                            <span className="relative h-5 w-4">
                                                <span
                                                    className=" absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full border border-black"
                                                />

                                                <span
                                                    className=" absolute left-1/2 top-3 h-2 w-px -translate-x-1/2 bg-black"
                                                />
                                            </span>
                                        </div>
                                    </div>

                                    {/* PRODUCT INFORMATION */}
                                    <div
                                        className=" absolute bottom-6 left-5 right-5 z-20 text-center transition-all duration-500 group-hover:-translate-y-16 group-hover:opacity-0"
                                    >

                                        <h3
                                            className=" mx-auto max-w-[85%] text-[14px] font-medium leading-snug tracking-[-0.01em] text-black sm:text-md"
                                        >
                                            {product.title}
                                        </h3>

                                        <div className="mt-2 flex items-center justify-center gap-2">

                                            <span className="h-px w-5 bg-black/20" />

                                            <p className="text-xs font-medium tracking-wide text-black/70 sm:text-sm">
                                                ${product.price.toFixed(2)}
                                            </p>

                                            <span className="h-px w-5 bg-black/20" />

                                        </div>

                                    </div>

                                    {/* HOVER ACTIONS */}
                                    <div
                                        className=" absolute bottom-6 left-5 right-5 z-30 flex items-center gap-3 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                                    >

                                        {/* VIEW DETAILS */}
                                        <div className="group/view relative flex h-11 flex-1 items-center justify-center">

                                            <div className="absolute inset-0 bg-[#faf9f6]" />

                                            <div className="pointer-events-none absolute inset-0 z-30 border border-black/20" />

                                            <div
                                                className=" absolute left-1/2 top-1/2 z-10 h-[calc(100%-8px)] w-[calc(100%+8px)] -translate-x-1/2 -translate-y-1/2 border border-black/20 bg-[#faf9f6] transition-all duration-500 group-hover/view:h-full group-hover/view:w-full"
                                            />

                                            <span className="relative z-40 text-[11px] tracking-wide text-black">
                                                VIEW DETAILS
                                            </span>

                                        </div>


                                        {/* BAG */}
                                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">

                                            <div className="absolute inset-0 bg-[#faf9f6]" />

                                            <div className="pointer-events-none absolute inset-0 z-10 border border-black/20" />

                                            <ShoppingBag
                                                className="relative z-20 h-5 w-5 text-black"
                                                strokeWidth={1.2}
                                            />

                                        </div>

                                    </div>

                                </Link>

                            </div>
                        </motion.div>

                        {/* RIGHT CONTENT */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.3,
                                duration: 0.8,
                            }}
                            className=" relative z-10 px-3 pt-12 min-[1024px]:col-span-2 min-[1400px]:col-span-1 min-[1400px]:pl-28 min-[1400px]:pt-0"
                        >


                            <p className="mb-5 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.25em] text-[#827b72]">

                                <span className="text-[#aa8d38]">
                                    ✦
                                </span>

                                The New Collection

                            </p>


                            <h1 className="font-serif text-[42px] font-normal leading-[0.95] tracking-[-0.03em] sm:text-[50px] lg:text-[58px]">
                                Timeless
                            </h1>


                            <div className="mt-1 space-y-0">

                                <p className="font-serif text-[34px] font-normal leading-[1.05] text-[#77736e] sm:text-[40px] lg:text-[43px]">
                                    Essentials
                                </p>

                                <p className="font-serif text-[34px] font-normal leading-[1.05] text-[#77736e] sm:text-[40px] lg:text-[43px]">
                                    Refined Details
                                </p>

                                <p className="font-serif text-[34px] font-normal leading-[1.05] text-[#77736e] sm:text-[40px] lg:text-[43px]">
                                    Modern Classics
                                </p>

                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.55,
                                    duration: 0.7,
                                }}
                                className="mt-10"
                            >

                                <Link
                                    href="/collections"
                                    className="
                                        group/shop
                                        relative
                                        flex
                                        h-13
                                        w-fit
                                        min-w-48
                                        items-center
                                        justify-center
                                        gap-3
                                        px-7
                                    "
                                >

                                    {/* Transparent background */}
                                    <div className="absolute inset-0 bg-transparent" />


                                    {/* BUTTON BORDERS */}
                                    <div className="pointer-events-none absolute inset-0">

                                        {/* Inner border */}
                                        <div
                                            className="
                                                absolute
                                                left-1/2
                                                top-1/2
                                                h-[calc(100%-10px)]
                                                w-[calc(100%+10px)]
                                                -translate-x-1/2
                                                -translate-y-1/2
                                                border
                                                border-black/25
                                                transition-[width,height,border-color]
                                                duration-500
                                                ease-in-out
                                                group-hover/shop:h-full
                                                group-hover/shop:w-full
                                                group-hover/shop:border-black/50
                                            "
                                        />

                                        {/* Outer border */}
                                        <div className="absolute inset-0 border border-black/20" />

                                    </div>


                                    {/* Text */}
                                    <span
                                        className="
                                            relative
                                            z-40
                                            text-[12px]
                                            font-medium
                                            uppercase
                                            text-[#696767]
                                            transition-colors
                                            duration-300
                                            group-hover/shop:text-gray-500
                                        "
                                    >
                                        Explore Collection
                                    </span>


                                    {/* Arrow */}
                                    <span
                                        className="
                                            relative
                                            z-40
                                            text-[#77736e]
                                            transition-all
                                            duration-300
                                            group-hover/shop:rotate-180
                                            group-hover/shop:text-black
                                        "
                                    >
                                        ❀
                                    </span>

                                </Link>

                            </motion.div>

                        </motion.div>

                    </div>
                </div>
            </section>
        </main>
    );
}
