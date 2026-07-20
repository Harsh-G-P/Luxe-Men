"use client";

import Link from "next/link";

export default function Newsletter() {
    return (
        <section className="bg-neutral-950 py-16 md:py-28">
            <div className="mx-auto max-w-5xl px-5 text-center md:px-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gray-400 md:text-sm md:tracking-[0.4em]">
                    Elevate Your Style
                </p>

                <h2 className="text-3xl font-bold leading-tight text-white md:text-6xl">
                    Find Your Perfect
                    <br />
                    Everyday Look.
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-400 md:mt-8 md:max-w-3xl md:text-lg md:leading-8">
                    Explore premium men's fashion designed for confidence,
                    comfort, and timeless style. Discover collections crafted
                    to fit every occasion.
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5 md:mt-12">
                    <Link
                        href="/collections"
                        className="w-full max-w-xs rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition-all duration-300 hover:scale-105 sm:w-auto"
                    >
                        Shop Collection
                    </Link>

                    <Link
                        href="/collections"
                        className="w-full max-w-xs rounded-full border border-white/20 px-8 py-4 text-center font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black sm:w-auto"
                    >
                        Explore Products
                    </Link>
                </div>

                <div className="mx-auto mt-12 h-px w-24 bg-linear-to-r-transparent via-white/40 to-transparent md:mt-16 md:w-32" />
            </div>
        </section>
    );
}