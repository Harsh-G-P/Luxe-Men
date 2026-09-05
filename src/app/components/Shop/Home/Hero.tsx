"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative min-h-180 overflow-hidden bg-[#090a0b] text-[#eeeae2] md:h-[90vh]">

            <div className="pointer-events-none absolute inset-4 z-30 md:inset-6 lg:inset-8">

                {/* OUTSIDE — soft blue/gray transparent border */}
                <div
                    className=" absolute -inset-0.5 border border-[#8fa6b8]/20 blur-[2px]"
                />

                {/* OUTSIDE — very subtle sharp edge */}
                <div
                    className=" absolute inset-0 border border-[#8fa6b8]/10"
                />


                {/* CENTER VERTICAL */}
                <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[#91a0ad]/20 md:block" />


                {/* TOP CENTER NOTCH */}
                <div className="absolute left-1/2 top-0 h-5 w-10 -translate-x-1/2 bg-[#090a0b]" />

                <div className="absolute left-1/2 top-0 h-5 w-10 -translate-x-1/2 border-x border-[#91a0ad]/25" />

                <div className="absolute left-1/2 top-5 h-px w-10 -translate-x-1/2 bg-[#91a0ad]/25" />


                {/* BOTTOM CENTER NOTCH */}
                <div className="absolute bottom-0 left-1/2 h-5 w-10 -translate-x-1/2 bg-[#090a0b]" />

                <div className="absolute bottom-0 left-1/2 h-5 w-10 -translate-x-1/2 border-x border-[#91a0ad]/25" />

                <div className="absolute bottom-5 left-1/2 h-px w-10 -translate-x-1/2 bg-[#91a0ad]/25" />


                {/* CORNERS */}
                <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-[#aeb9c3]/40" />

                <div className="absolute right-0 top-0 h-6 w-6 border-r border-t border-[#aeb9c3]/40" />

                <div className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-[#aeb9c3]/40" />

                <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-[#aeb9c3]/40" />

            </div>


            {/* MAIN */}
            <div className="relative z-10 h-full p-4 md:p-6 lg:p-8">

                <div className="grid h-full grid-cols-1 md:grid-cols-2">

                    {/* LEFT — CONTENT */}
                    <div className="relative flex items-center px-8 py-28 sm:px-12 md:px-12 lg:px-16 xl:px-24">

                        <div className="relative z-30 max-w-xl">

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-8 flex items-center gap-4"
                            >
                                <span className="text-[15px] tracking-[0.3em] text-[#6d706f]">
                                    ★
                                </span>

                                <span className="h-px w-10 bg-[#a99d8e]/30" />

                                <span className="text-[9px] uppercase tracking-[0.35em] text-[#777a79]">
                                    The Collection
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.1,
                                    duration: 0.9,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className=" max-w-155 font-serif text-[2.8rem] font-light leading-[0.96] tracking-[-0.035em] text-[#e7e0d7] sm:text-5xl md:text-[3.5rem] lg:text-[4.1rem] xl:text-[4.6rem]"
                            >
                                Defined by
                                <br />

                                <span className="text-[#a99d8e]">
                                    simplicity.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.2,
                                    duration: 0.7,
                                }}
                                className=" mt-8 max-w-md text-[13px] leading-7 text-[#8e9190] md:text-sm"
                            >
                                A considered collection shaped by precision, quality,
                                and an uncompromising eye for detail.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.7,
                                }}
                                className=" mt-9 origin-left border-t border-[#a99d8e]/15"
                            />

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.35,
                                    duration: 0.7,
                                }}
                                className=" mt-5 max-w-sm font-serif text-sm italic leading-6 text-[#6f716f]"
                            >
                                “Nothing unnecessary. Nothing overlooked.”
                            </motion.p>

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
                                        h-16
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
                                                border-white/25
                                                transition-[width,height,border-color]
                                                duration-500
                                                ease-in-out
                                                group-hover/shop:h-full
                                                group-hover/shop:w-full
                                                group-hover/shop:border-white/50
                                            "
                                        />

                                        {/* Outer border */}
                                        <div className="absolute inset-0 border border-white/20" />

                                    </div>

                                    {/* Text */}
                                    <span
                                        className="
                                            relative
                                        text-[12px]
                                        font-medium
                                        uppercase
                                        tracking-[0.2em]
                                        text-[#c9c0b5]
                                        transition-colors
                                        duration-300
                                        group-hover/story:text-white
                                        "
                                    >
                                        Explore Collection
                                    </span>

                                    {/* Arrow */}
                                    <span
                                        className="
                                            relative
                                            z-40
                                            text-[#aeb9c3]
                                            transition-all
                                            duration-300
                                            group-hover/shop:rotate-180
                                            group-hover/shop:text-[#eeeae2]
                                        "
                                    >
                                        ❀
                                    </span>

                                </Link>
                            </motion.div>

                        </div>

                    </div>


                    <div className="relative hidden h-full overflow-hidden md:block">

                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                        >
                            <source
                                src="/videos/hero.mp4"
                                type="video/mp4"
                            />
                        </video>

                        {/* Cinematic dark layer */}
                        <div className="absolute inset-0 bg-black/20" />

                    </div>

                    <div className="relative h-[55vh] min-h-105 overflow-hidden md:hidden">

                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                        >
                            <source
                                src="/videos/hero.mp4"
                                type="video/mp4"
                            />
                        </video>

                        <div className="absolute inset-0 bg-black/20" />

                    </div>

                </div>

            </div>

        </section>
    );
}