"use client";

import Link from "next/link";
import Image from "next/image";

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
    label: string;
    subtitle: string;
    products: Product[];
    viewAllHref: string;
};

export default function ProductSection({
    title,
    label,
    subtitle,
    products,
    viewAllHref,
}: Props) {
    return (
        <section className="bg-white py-16 md:py-4">
            <div className="mx-auto max-w-375 px-5 md:px-6">
                <div className="mb-10 text-center md:mb-12">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500 md:text-sm md:tracking-[0.35em]">
                        {label}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                        {title}
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-500 md:max-w-2xl md:text-lg">
                        {subtitle}
                    </p>
                </div>



                {/* Mobile */}
                <div className="grid grid-cols-1 gap-5 sm:hidden">
                    {products.slice(0, 2).map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group relative block h-80 overflow-hidden rounded-3xl sm:h-96 lg:h-112.5"
                        >
                            <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 100vw,
                                       (max-width: 1024px) 50vw,
                                       25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent transition-all duration-500" />

                            <div className="absolute inset-0 rounded-3xl border border-white/10 transition group-hover:border-white/30" />

                            <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-6">
                                <p className="text-[11px] uppercase tracking-[0.3em] text-gray-300 md:text-xs md:tracking-[0.35em]">
                                    {product.brand.title}
                                </p>

                                <h3 className="mt-2 line-clamp-2 text-base font-bold text-white md:text-sm">
                                    {product.title}
                                </h3>

                                <p className="mt-3 text-sm font-semibold text-white">
                                    ${product.price}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Tablet/Desktop */}
                <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                    {products.slice(0, 4).map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group relative block h-80 overflow-hidden rounded-3xl sm:h-96 lg:h-112.5"
                        >
                            <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 100vw,
                                       (max-width: 1024px) 50vw,
                                       25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent transition-all duration-500" />

                            <div className="absolute inset-0 rounded-3xl border border-white/10 transition group-hover:border-white/30" />

                            <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-6">
                                <p className="text-[11px] uppercase tracking-[0.3em] text-gray-300 md:text-xs md:tracking-[0.35em]">
                                    {product.brand.title}
                                </p>

                                <h3 className="mt-2 line-clamp-2 text-base font-bold text-white md:text-sm">
                                    {product.title}
                                </h3>

                                <p className="mt-3 text-sm font-semibold text-white">
                                    ${product.price}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>


                <div className="mt-10 flex justify-center md:mt-12">
                    <Link
                        href={viewAllHref}
                        className="rounded-full border border-black px-6 py-3 text-sm transition hover:bg-black hover:text-white md:px-8 md:text-base"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
}