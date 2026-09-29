"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-[62vh] min-h-155 overflow-hidden bg-[#171613] text-[#f4f0e8] sm:h-[88vh] md:h-[95vh] md:min-h-170">

            {/* Editorial Image */}
            <Image
                src="/images/hero1.jpg"
                alt="Luxe Men — The Collection"
                fill
                priority
                sizes="100vw"
                className="
                    object-cover
                    object-[62%_center]
                    sm:object-[center_65%]
                    md:object-[center_70%]
                "
            />

            {/* Cinematic overlays */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Mobile: stronger bottom readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/10" />

            {/* Desktop side gradient */}
            <div className="absolute inset-0 hidden bg-linear-to-r from-black/60 via-black/15 to-transparent md:block" />

            {/* Fine frame */}
            <div className="pointer-events-none absolute inset-3 border border-white/15 sm:inset-5 md:inset-7 lg:inset-9" />

            {/* Content */}
            <div className="relative z-10 flex h-full items-end px-6 pb-16 text-center sm:px-10 sm:pb-20 md:items-end md:px-20 md:pb-24 md:text-left lg:px-28">

                <div className="w-full max-w-2xl mx-auto md:mx-0">

                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="mb-5 flex items-center justify-center gap-3 sm:mb-7 sm:gap-4 md:justify-start"
                    >
                        <span className="hidden h-px w-10 bg-[#c4aa79] md:block" />


                        <span className="text-[7px] uppercase tracking-[0.45em] text-white/65 sm:text-[8px] sm:tracking-[0.55em]">
                            The New Collection
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.1,
                            duration: 0.9,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className=" mx-auto max-w-82.5 font-serif text-[48px] font-light leading-[0.9] tracking-[-0.045em] sm:max-w-lg sm:text-[62px] md:mx-0 md:text-[82px] lg:text-[96px]"
                    >
                        Quietly
                        <br />
                        <span className="italic text-white/65">
                            Exceptional.
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.25,
                            duration: 0.8,
                        }}
                        className=" mx-auto mt-5 max-w-72.5 text-[10px] leading-[1.8] tracking-[0.035em] text-white/60 sm:mt-7 sm:max-w-md sm:text-xs md:mx-0"
                    >
                        Refined essentials designed with intention.
                        Exceptional materials, considered silhouettes,
                        and a timeless approach to modern menswear.
                    </motion.p>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{
                            delay: 0.4,
                            duration: 0.8,
                        }}
                        className=" mx-auto mt-6 h-px w-14 origin-center bg-white/25 sm:mt-8 sm:w-20 md:mx-0 md:origin-left"
                    />

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.5,
                            duration: 0.7,
                        }}
                        className="mt-7 flex justify-center sm:mt-10 md:justify-start"
                    >
                        <Link
                            href="/collections"
                            className="group/shop relative flex h-12 w-fit min-w-43 items-center justify-center gap-3 px-6 sm:h-14 sm:min-w-48 sm:px-7"
                        >
                            <span className="absolute inset-0 border border-white/20 transition-all duration-500 group-hover/shop:border-white/45" />

                            <span
                                className=" absolute left-1/2 top-1/2 h-[calc(100%-8px)] w-[calc(100%+8px)] -translate-x-1/2 -translate-y-1/2 border border-white/20 transition-all duration-500 group-hover/shop:h-full group-hover/shop:w-full group-hover/shop:border-white/40"
                            />

                            <span className="relative text-[9px] font-medium uppercase tracking-[0.18em] text-[#d5cec4] transition-colors duration-300 group-hover/shop:text-white sm:text-[10px]">
                                Explore Collection
                            </span>

                            <span className="relative text-[#b9aa96] transition-transform duration-500 group-hover/shop:translate-x-1">
                                →
                            </span>
                        </Link>
                    </motion.div>

                </div>
            </div>


            {/* Bottom metadata */}
            <div className="absolute bottom-5 right-6 z-20 hidden items-center gap-4 md:flex lg:right-12">
                <span className="text-[7px] uppercase tracking-[0.45em] text-white/35">
                    LUXE MEN
                </span>

                <span className="h-px w-7 bg-white/20" />

                <span className="text-[7px] uppercase tracking-[0.45em] text-white/35">
                    EST. 2026
                </span>
            </div>

            {/* Mobile brand mark */}
            <div className="absolute right-6 top-6 z-20 sm:right-8 sm:top-8 md:hidden">
                <span className="text-[7px] uppercase tracking-[0.45em] text-white/45">
                    LUXE MEN
                </span>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
                <span className="text-[7px] uppercase tracking-[0.5em] text-white/40">
                    Discover
                </span>

                <span className="relative h-7 w-px overflow-hidden bg-white/10">
                    <span className="absolute left-0 top-0 h-2.5 w-px animate-[scrollLine_2.8s_ease-in-out_infinite] bg-white/60" />
                </span>
            </div>

        </section>
    );
}
