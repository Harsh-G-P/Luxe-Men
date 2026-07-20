"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CategoryProps = {
    categories: {
        id: string;
        title: string;
        createdAt: Date;
    }[];
};

const videos = [
    "/videos/c1.mp4",
    "/videos/c4.mp4",
    "/videos/c2.mp4",
    "/videos/c3.mp4",
];

export default function FeaturedCollections({
    categories,
}: CategoryProps) {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-375 px-5 md:px-6">
                {/* Heading */}
                <div className="mb-12 text-center md:mb-16">
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gray-500 sm:text-sm md:tracking-[0.35em]">
                        Collections
                    </p>

                    <h2 className="text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                        Shop by Collection
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-500 sm:text-lg md:mt-5 md:max-w-2xl">
                        Explore premium collections crafted for every occasion.
                    </p>
                </div>


                {/* Mobile - 2 Categories */}
                <div className="grid grid-cols-1 gap-5 sm:hidden">
                    {categories.slice(0, 2).map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/collections?category=${category.id}`}
                            className="group relative h-80 overflow-hidden rounded-3xl"
                        >
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            >
                                <source src={videos[index]} type="video/mp4" />
                            </video>

                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent transition-all duration-500 group-hover:from-black group-hover:via-black/45" />

                            <div className="absolute inset-0 rounded-3xl border border-white/10 transition-all duration-300 group-hover:border-white/30" />

                            <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                                <p className="text-[11px] uppercase tracking-[0.3em] text-gray-300">
                                    Collection
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                    <h3 className="text-base font-bold text-white">
                                        {category.title}
                                    </h3>

                                    <ArrowRight
                                        size={22}
                                        className="transition-transform duration-300 group-hover:translate-x-2"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Desktop - 4 Categories */}
                <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                    {categories.slice(0, 4).map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/collections?category=${category.id}`}
                            className="group relative h-96 overflow-hidden rounded-3xl lg:h-112.5"
                        >
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            >
                                <source src={videos[index]} type="video/mp4" />
                            </video>

                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent transition-all duration-500 group-hover:from-black group-hover:via-black/45" />

                            <div className="absolute inset-0 rounded-3xl border border-white/10 transition-all duration-300 group-hover:border-white/30" />

                            <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                                <p className="text-xs uppercase tracking-[0.35em] text-gray-300">
                                    Collection
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white">
                                        {category.title}
                                    </h3>

                                    <ArrowRight
                                        size={24}
                                        className="transition-transform duration-300 group-hover:translate-x-2"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All */}
                <div className="mt-10 flex justify-center md:mt-14">
                    <Link
                        href="/collections"
                        className="rounded-full border border-black px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-black hover:text-white md:px-8 md:text-base"
                    >
                        View All Collections
                    </Link>
                </div>
            </div>
        </section>
    );
}