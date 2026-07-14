"use client";

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
        <Link
            href={`/product/${product.slug}`}
            className="group relative block h-80 overflow-hidden rounded-3xl md:h-112.5"
        >
            {/* Image */}
            <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent transition-all duration-500" />

            {/* Border */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 transition group-hover:border-white/30" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-6">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gray-300 md:text-xs">
                    {product.brand.title}
                </p>

                <h3 className="mt-2 line-clamp-2 text-base font-bold text-white md:text-lg">
                    {product.title}
                </h3>

                <p className="mt-3 text-lg font-semibold text-white">
                    ${product.price}
                </p>
            </div>
        </Link>
    );
}