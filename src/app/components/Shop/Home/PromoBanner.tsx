"use client";

import Link from "next/link";

export default function PromoBanner() {
    return (
        <section className="relative h-[60vh] overflow-hidden md:h-[75vh]">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src="/videos/Banner.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-black/60" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 md:px-6">
                <div className="max-w-xl text-white md:max-w-2xl">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gray-300 md:text-sm md:tracking-[0.4em]">
                        Premium Collection
                    </p>

                    <h2 className="text-3xl font-bold leading-tight md:text-6xl">
                        Crafted for
                        <br />
                        Modern Men.
                    </h2>

                    <p className="mt-5 max-w-lg text-base leading-7 text-gray-300 md:mt-6 md:max-w-xl md:text-lg md:leading-8">
                        Discover premium essentials designed with timeless style,
                        superior comfort, and exceptional craftsmanship for every
                        occasion.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-10">
                        <Link
                            href="/collections"
                            className="rounded-full bg-white px-8 py-3 text-center font-semibold text-black transition duration-300 hover:scale-105"
                        >
                            Shop Collection
                        </Link>

                        <Link
                            href="/about"
                            className="rounded-full border border-white px-8 py-3 text-center font-semibold text-white transition duration-300 hover:bg-white hover:text-black"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 h-24 w-full bg-linear-to-t from-white to-transparent md:h-40" />
        </section>
    );
}