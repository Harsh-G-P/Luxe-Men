"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useRef, useState } from "react";

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
    title: string;
    subtitle: string;
    products: Product[];
    viewAllHref: string;
};

function ProductCard({ product }: { product: Product }) {
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
                {/* Main image */}
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
                        transition-transform duration-700
                        ease-out
                        group-hover:scale-[1.035]
                    "
                />

                {/* Hover image */}
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

                {/* Image border */}
                <div
                    className="
                        pointer-events-none absolute inset-0
                        border border-black/[0.07]
                    "
                />

                {/* Brand label */}
                <div
                    className="
                        absolute left-3 top-3 z-10
                        sm:left-4 sm:top-4
                    "
                >
                    <span
                        className="
                            inline-block bg-[#f8f6f0]/90
                            px-2.5 py-1.5
                            text-[8px] font-medium
                            uppercase tracking-[0.18em]
                            text-[#39332c]
                            sm:text-[9px]
                        "
                    >
                        {product.brand.title}
                    </span>
                </div>

                {/* Desktop hover action */}
                <div
                    className="
                        absolute inset-x-3 bottom-3 z-10
                        hidden translate-y-3
                        opacity-0 transition-all duration-500
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
                                text-[9px] font-medium
                                uppercase tracking-[0.2em]
                                text-[#302923]
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
                        {/* Brand */}
                        <p
                            className="
                                mb-1.5 text-[8px] font-medium
                                uppercase tracking-[0.22em]
                                text-[#958879]
                                sm:text-[9px]
                            "
                        >
                            {product.brand.title}
                        </p>

                        {/* Product name */}
                        <Link
                            href={`/product/${product.slug}`}
                            className="
                                inline-block text-[13px]
                                font-normal leading-snug
                                tracking-[-0.02em]
                                text-[#302923]
                                transition-colors duration-300
                                hover:text-[#927b5d]
                                sm:text-sm
                            "
                        >
                            {product.title}
                        </Link>
                    </div>

                    {/* Price */}
                    <p
                        className="
                            shrink-0 pt-5 text-[11px]
                            font-medium tracking-wide
                            text-[#302923]
                            sm:text-xs
                        "
                    >
                        ${product.price.toFixed(2)}
                    </p>
                </div>

                {/* Bottom detail */}
                <div
                    className="
                        mt-4 flex items-center justify-between
                        border-t border-[#302923]/10 pt-3
                    "
                >
                    <span
                        className="
                            text-[8px] uppercase
                            tracking-[0.18em]
                            text-[#8b8074]
                        "
                    >
                        Refined Essentials
                    </span>

                    <Link
                        href={`/product/${product.slug}`}
                        aria-label={`Explore ${product.title}`}
                        className="
                            flex h-7 w-7 items-center
                            justify-center border
                            border-[#302923]/15
                            text-[#302923]
                            transition-colors duration-300
                            hover:border-[#302923]
                            hover:bg-[#302923]
                            hover:text-[#f8f6f0]
                        "
                    >
                        <ArrowUpRight
                            size={13}
                            strokeWidth={1.2}
                        />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default function ProductSection({
    title,
    subtitle,
    products,
    viewAllHref,
}: Props) {
    const mobileScrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleMobileScroll = () => {
        const container = mobileScrollRef.current;

        if (!container) return;

        const maxScroll =
            container.scrollWidth - container.clientWidth;

        if (maxScroll <= 0) {
            setScrollProgress(0);
            return;
        }

        const progress =
            (container.scrollLeft / maxScroll) * 100;

        setScrollProgress(progress);
    };

    return (
        <section className=" bg-[#f1eee6] py-14 sm:py-16 md:py-20 lg:py-24">
            <div className="mx-auto max-w-440 px-4 sm:px-6 lg:px-8">
                {/* HEADER */}

                <div className="mb-10 sm:mb-12 md:mb-14">

                    {/* Small label */}
                    <div className="mb-4 flex items-center justify-center gap-3">
                        <span className="h-px w-6 bg-[#b7a895]/50 sm:w-10" />

                        <span className=" text-[8px] font-medium uppercase tracking-[0.3em] text-[#9b8d7d] sm:text-[9px]">
                            Collection
                        </span>

                        <span className="h-px w-6 bg-[#b7a895]/50 sm:w-10" />
                    </div>


                    {/* Title */}
                    <div className="mx-auto max-w-3xl text-center">

                        <h2 className=" mx-auto max-w-2xl text-[28px] font-light leading-[1.1] tracking-tight text-[#302923] sm:text-4xl md:text-5xl lg:text-[52px]">
                            {(() => {
                                const words = title.trim().split(" ");
                                const middle = Math.ceil(words.length / 2);

                                return (
                                    <>
                                        <span className="text-[#302923]">
                                            {words.slice(0, middle).join(" ")}{" "}
                                        </span>

                                        <span className="text-[#b9a17e]">
                                            {words.slice(middle).join(" ")}
                                        </span>
                                    </>
                                );
                            })()}
                        </h2>


                        {/* Subtitle */}
                        <p className=" mx-auto mt-4 max-w-xl text-[12px] font-light leading-5 tracking-[0.02em] text-[#71685f] sm:mt-5 sm:text-sm sm:leading-6">
                            {subtitle}
                        </p>

                    </div>


                    <div className=" mt-7 hidden items-center justify-between border-y border-[#302923]/10 py-3.5 md:flex lg:mt-8">

                        {/* Left */}
                        <div className="flex items-center gap-3">

                            <span className="h-px w-6 bg-[#302923]/25" />

                            <span className=" text-[8px] font-medium uppercase tracking-[0.28em] text-[#81776d]">
                                Selected Pieces
                            </span>

                        </div>


                        {/* Right */}
                        <Link
                            href={viewAllHref}
                            className=" group inline-flex items-center gap-2.5 text-[8px] font-medium uppercase tracking-[0.3em] text-[#302923]"
                        >

                            Shop All Products

                            <span className=" flex h-7 w-7 items-center justify-center border border-[#8c8172]/30 transition-all duration-300 group-hover:border-[#8c8172]/60">
                                <ArrowUpRight
                                    size={12}
                                    strokeWidth={1}
                                    className=" transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </span>

                        </Link>

                    </div>


                    <div className="mt-6 flex justify-center md:hidden">

                        <Link
                            href={viewAllHref}
                            className=" group inline-flex h-10 min-w-48 items-center justify-center gap-2.5 border border-[#302923]/15 px-5 text-[8px] font-medium uppercase tracking-[0.25em] text-[#302923] transition-all duration-300 active:bg-[#302923] active:text-white"
                        >

                            <span>
                                Shop All Products
                            </span>

                            <span className=" text-sm font-light transition-transform duration-300 group-active:translate-x-1">
                                ↗
                            </span>

                        </Link>

                    </div>

                </div>



                {/* MOBILE */}
                <div className="sm:hidden">
                    <div
                        ref={mobileScrollRef}
                        onScroll={handleMobileScroll}
                        className="
                        flex
                        gap-4
                        overflow-x-auto
                        scroll-smooth
                        snap-x
                        snap-mandatory
                        pb-4
                        [&::-webkit-scrollbar]:hidden
                        [-ms-overflow-style:none]
                        scrollbar-none
                    "
                    >
                        {products.slice(0, 4).map((product) => (
                            <div
                                key={product.id}
                                className="
                                w-[72vw]
                                min-w-[72vw]
                                shrink-0
                                snap-start
                            "
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* MOBILE SCROLL PROGRESS */}
                    <div className="mt-3 h-px w-full bg-black/10">
                        <div
                            className="
                            h-px
                            bg-black
                            transition-[width]
                            duration-150
                            ease-out
                        "
                            style={{
                                width: `${Math.max(
                                    scrollProgress,
                                    2
                                )}%`,
                            }}
                        />
                    </div>
                </div>

                {/* TABLET + DESKTOP */}
                <div
                    className="
                    hidden
                    grid-cols-2
                    gap-5
                    sm:grid
                    xl:grid-cols-4
                "
                >
                    {products.slice(0, 4).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );


}
