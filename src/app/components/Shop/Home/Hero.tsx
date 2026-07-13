"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-[90vh] overflow-hidden md:h-[95vh]">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 md:px-6">
                <div className="max-w-full text-white md:max-w-2xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gray-300 sm:text-sm md:mb-5 md:tracking-[0.4em]"
                    >
                        Premium Men's Wear
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl"
                    >
                        Elevate Your
                        <br />
                        Everyday Style.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mt-5 max-w-lg text-base leading-7 text-gray-300 sm:text-lg sm:leading-8 md:mt-6 md:max-w-xl"
                    >
                        Discover premium essentials designed for comfort,
                        confidence, and timeless style. Crafted for every
                        occasion—from everyday wear to standout moments.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.6 }}
                        className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-10"
                    >
                        <Link
                            href="/collections"
                            className="rounded-full bg-white px-8 py-3 text-center font-semibold text-black transition hover:scale-105"
                        >
                            Shop Collection
                        </Link>

                        <Link
                            href="/collections"
                            className="rounded-full border border-white px-8 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-black"
                        >
                            Explore
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white md:bottom-10">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gray-300 md:text-xs md:tracking-[0.3em]">
                        Scroll
                    </span>

                    <div className="h-9 w-5 rounded-full border border-white md:h-10 md:w-6">
                        <div className="mx-auto mt-2 h-2 w-2 animate-bounce rounded-full bg-white" />
                    </div>
                </div>
            </div>
        </section>
    );
}