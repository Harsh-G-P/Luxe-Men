"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Ourstory() {
    return (
        <section className="relative min-h-180 overflow-hidden bg-[#090a0b] text-[#eeeae2] md:h-[90vh]">

            {/* MAIN */}   
            <div className="relative z-10 h-full p-4 md:p-6 lg:p-8">

                <div className="grid h-full grid-cols-1 md:grid-cols-2">
                    
                    {/* LEFT — CONTENT + BORDER */}    

                    <div className="relative flex items-center px-8 py-28 sm:px-12 md:px-12 lg:px-16 xl:px-24">

                        
                        {/* LEFT SECTION SVG BORDER */}
                       
                        <div className="pointer-events-none absolute inset-0 z-20">

                            <svg
                                className="absolute inset-0 h-full w-full"
                                viewBox="0 0 1000 720"
                                preserveAspectRatio="none"
                                fill="none"
                                aria-hidden="true"
                            >

                                {/* TOP EDGE */}
                                <path
                                    d="M 20 20 H 980"
                                    stroke="#a99d8e"
                                    strokeOpacity="0.55"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* TOP LEFT — STEP */}
                                <path
                                    d="
                                        M 20 20
                                        V 40
                                        H 0
                                        V 690
                                    "
                                    stroke="#a99d8e"
                                    strokeOpacity="0.55"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* TOP RIGHT — STEP */}
                                <path
                                    d="
                                        M 980 20
                                        V 40
                                        H 1000
                                        V 690
                                    "
                                    stroke="#a99d8e"
                                    strokeOpacity="0.55"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* BOTTOM LEFT — ROUND */}
                                <path
                                    d="
                                        M 0 690
                                        C 18 690 30 700 30 715
                                    "
                                    stroke="#a99d8e"
                                    strokeOpacity="0.55"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* BOTTOM EDGE */}
                                <path
                                    d="M 30 715 H 970"
                                    stroke="#a99d8e"
                                    strokeOpacity="0.55"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* BOTTOM RIGHT — ROUND */}
                                <path
                                    d="
                                        M 970 715
                                        C 970 700 982 690 1000 690
                                    "
                                    stroke="#a99d8e"
                                    strokeOpacity="0.55"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                            </svg>
                            
                            {/* OUR STORY LABEL — ON THE BORDER LINE */}

                            <div
                                className="
                                    absolute
                                    left-1/2
                                    top-6
                                    z-30
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    bg-[#090a0b]
                                    px-5
                                "
                            >
                                <span
                                    className="
                                        whitespace-nowrap
                                        font-sans
                                        text-[8px]
                                        font-medium
                                        uppercase
                                        tracking-[0.35em]
                                        text-[#a99d8e]
                                    "
                                >
                                    ✦ Our Story ✦
                                </span>
                            </div>

                        </div>
   
                        {/* CONTENT  */}

                        <div className="relative z-30 max-w-xl">

                             <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="mb-8 flex items-center gap-4"
                            >
                                <span className="text-[9px] tracking-[0.3em] text-[#6d706f]">
                                    ⨴⨵
                                </span>

                                <span className="h-px w-10 bg-[#a99d8e]/30" />

                                <span className="text-[9px] uppercase tracking-[0.35em] text-[#777a79]">
                                    The Beginning
                                </span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.9,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="
                                    max-w-155
                                    font-serif
                                    text-[2.7rem]
                                    font-light
                                    leading-[0.98]
                                    tracking-[-0.035em]
                                    text-[#e7e0d7]
                                    sm:text-5xl
                                    md:text-[3.4rem]
                                    lg:text-[4rem]
                                    xl:text-[4.5rem]
                                "
                            >
                                We believe
                                <br />

                                <span className="text-[#a99d8e]">
                                    less can say more.
                                </span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.15,
                                    duration: 0.7,
                                }}
                                className="
                                    mt-8
                                    max-w-md
                                    text-[13px]
                                    leading-7
                                    text-[#8e9190]
                                    md:text-sm
                                "
                            >
                                Born from a fascination with restraint, our
                                collection is shaped by quiet details, honest
                                materials, and pieces designed to remain
                                relevant beyond the moment.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                whileInView={{ opacity: 1, scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.25,
                                    duration: 0.7,
                                }}
                                className="
                                    mt-9
                                    origin-left
                                    border-t
                                    border-[#a99d8e]/15
                                "
                            />

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.7,
                                }}
                                className="
                                    mt-5
                                    max-w-sm
                                    font-serif
                                    text-sm
                                    italic
                                    leading-6
                                    text-[#6f716f]
                                "
                            >
                                “Every detail has a reason. Nothing exists
                                simply to fill the space.”
                            </motion.p>

                            {/* CTA */}
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
                                        h-11
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
                                        text-[8px]
                                        font-medium
                                        uppercase
                                        tracking-[0.2em]
                                        text-[#c9c0b5]
                                        transition-colors
                                        duration-300
                                        group-hover/story:text-white
                                        "
                                    >
                                       Read Our Story
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
                                        ❃
                                    </span>

                                </Link>
                            </motion.div>

                        </div>

                    </div>
                    
                    {/* RIGHT IMAGE */}
                    
                    <div className="relative hidden h-full overflow-hidden md:block">

                        <Image
                            src="/images/look1.jpg"
                            alt="Our story"
                            fill
                            priority
                            className="object-cover p-10"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />

                        {/* Cinematic dark layer */}
                        <div className="absolute inset-0 bg-black/20" />

                    </div>

                    {/* MOBILE IMAGE */}

                    <div className="relative h-[55vh] min-h-105 overflow-hidden md:hidden">

                        <Image
                            src="/images/look1.jpg"
                            alt="Our story"
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />

                        <div className="absolute inset-0 bg-black/20" />

                    </div>

                </div>

            </div>

        </section>
    );
}
