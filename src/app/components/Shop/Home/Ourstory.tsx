"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Ourstory() {
    return (
        <section
            className=" relative min-h-screen overflow-hidden bg-[#090a0b] text-[#eeeae2] lg:h-[90vh]"
        >
            {/* MAIN */}
            <div
                className=" relative z-10 h-full p-4 sm:p-6 lg:p-8"
            >
                <div className="grid h-full grid-cols-1 lg:grid-cols-2">

                    {/* CONTENT */}
                    <div
                        className=" relative flex items-center justify-center px-5 py-24 sm:px-8 sm:py-28 md:px-10 md:py-32 lg:justify-start lg:px-16 lg:py-24 xl:px-24"
                    >

                        {/* SVG BORDER */}
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
                                    stroke="#85827D"
                                    strokeOpacity="0.42"
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
                                    stroke="#85827D"
                                    strokeOpacity="0.42"
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
                                    stroke="#85827D"
                                    strokeOpacity="0.42"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* BOTTOM LEFT — ROUND */}
                                <path
                                    d="
                                        M 0 690
                                        C 18 690 30 700 30 715
                                    "
                                    stroke="#85827D"
                                    strokeOpacity="0.42"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* BOTTOM EDGE */}
                                <path
                                    d="M 30 715 H 970"
                                    stroke="#85827D"
                                    strokeOpacity="0.42"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* BOTTOM RIGHT — ROUND */}
                                <path
                                    d="
                                        M 970 715
                                        C 970 700 982 690 1000 690
                                    "
                                    stroke="#85827D"
                                    strokeOpacity="0.42"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                            </svg>

                            {/* BORDER LABEL */}
                            <div
                                className=" absolute left-1/2 top-6 z-30 -translate-x-1/2 -translate-y-1/2 bg-[#090a0b] px-5"
                            >
                                <span
                                    className=" whitespace-nowrap font-sans text-[8px] font-medium uppercase tracking-[0.35em] text-[#777875]"
                                >
                                    ✦ Our Story ✦
                                </span>
                            </div>

                        </div>


                        {/* CONTENT INNER */}
                        <div
                            className=" relative z-30 flex w-full max-w-140 flex-col items-center text-center lg:max-w-xl lg:items-start lg:text-left"
                        >

                            {/* EYEBROW */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="
                                    mb-8
                                    flex
                                    items-center
                                    justify-center
                                    gap-4
                                "
                            >
                                <span className="text-[9px] tracking-[0.3em] text-[#666865]">
                                    ⨴⨵
                                </span>

                                <span className="h-px w-10 bg-[#85827D]/30" />

                                <span
                                    className="
                                        text-[9px]
                                        uppercase
                                        tracking-[0.35em]
                                        text-[#777875]
                                    "
                                >
                                    The Art of Less
                                </span>
                            </motion.div>


                            {/* HEADING */}
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.9,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className=" mx-auto max-w-85 font-serif text-[2.5rem] font-light leading-none tracking-[-0.035em] text-[#D0CDC6] sm:max-w-100 sm:text-[2.8rem] md:max-w-125 md:text-[3.1rem] lg:mx-0 lg:max-w-155 lg:text-[3.6rem] xl:text-[4rem]"
                            >
                                Crafted with
                                <br />

                                <span className="text-[#AAA59D]">
                                    intention, not excess.
                                </span>
                            </motion.h2>


                            {/* DESCRIPTION */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.15,
                                    duration: 0.7,
                                }}
                                className=" mx-auto mt-8 max-w-[320px] text-[13px] leading-7 text-[#858581] sm:max-w-95 md:max-w-115 md:text-sm lg:mx-0 lg:max-w-md"
                            >
                                A study in quiet refinement. Every piece is
                                considered with precision, shaped by exceptional
                                materials, subtle form, and a timeless
                                appreciation for detail.
                            </motion.p>

                            {/* DIVIDER */}
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                whileInView={{ opacity: 1, scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.25,
                                    duration: 0.7,
                                }}
                                className=" mx-auto mt-9 h-px w-full max-w-[320px] origin-center bg-[#77746F]/20 sm:max-w-95 md:max-w-115 lg:mx-0 lg:max-w-md lg:origin-left"
                            />

                            {/* QUOTE */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.7,
                                }}
                                className=" mx-auto mt-5 max-w-75 font-serif text-sm italic leading-6 text-[#706F6B] sm:max-w-90 lg:mx-0 lg:max-w-sm"
                            >
                                “True luxury is not what is added,
                                <br />
                                but what is carefully left behind.”
                            </motion.p>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.55,
                                    duration: 0.7,
                                }}
                                className=" mt-10 flex w-full justify-center lg:w-auto lg:justify-start "
                            >
                                <Link
                                    href="/about"
                                    className=" group/luxury relative flex h-12 w-fit min-w-48 items-center justify-center gap-3 px-7"
                                >

                                    {/* SUBTLE BACKGROUND */}
                                    <div
                                        className=" pointer-events-none absolute inset-0 bg-[#D6D2CB]/1.5 opacity-0 transition-opacity duration-500 group-hover/luxury:opacity-100"
                                    />

                                    {/* BUTTON BORDERS */}
                                    <div className="pointer-events-none absolute inset-0">

                                        {/* INNER BORDER */}
                                        <div
                                            className=" absolute left-1/2 top-1/2 h-[calc(100%-10px)] w-[calc(100%+10px)] -translate-x-1/2 -translate-y-1/2 border border-[#85827D]/25 transition-[width,height,border-color] duration-500 ease-in-out group-hover/luxury:h-full group-hover/luxury:w-full group-hover/luxury:border-[#A6A29B]/50 "
                                        />

                                        {/* OUTER BORDER */}
                                        <div
                                            className=" absolute inset-0 border border-[#85827D]/15 transition-colors duration-500 group-hover/luxury:border-[#A6A29B]/30 "
                                        />

                                    </div>


                                    {/* BUTTON TEXT */}
                                    <span
                                        className=" relative text-[8px] font-medium uppercase tracking-[0.25em] text-[#A6A29B] transition-colors duration-300 group-hover/luxury:text-[#D6D2CB]"
                                    >
                                        Discover Our Story
                                    </span>


                                    {/* ARROW */}
                                    <span
                                        className=" relative z-40 text-[#8E8B85] transition-all duration-500 group-hover/luxury:translate-x-1 group-hover/luxury:text-[#C0BBB3]"
                                    >
                                        →
                                    </span>

                                </Link>
                            </motion.div>

                        </div>

                    </div>


                    {/* DESKTOP IMAGE */}
                    <div className="relative hidden h-full overflow-hidden lg:block">

                        <Image
                            src="/images/ourstory1.jpg"
                            alt="Our story"
                            fill
                            priority
                            className="object-cover object-[center_25%] p-10"
                            sizes="50vw"
                        />

                        <div className="absolute inset-0 bg-black/20" />

                    </div>

                    {/* MOBILE + TABLET IMAGE */}
                    <div
                        className=" relative mt-2 h-[52vh] min-h-95 overflow-hidden sm:h-[56vh] md:h-[60vh] lg:hidden"
                    >

                        <Image
                            src="/images/ourstory1.jpg"
                            alt="Our story"
                            fill
                            priority
                            className="object-cover object-center"
                            sizes="100vw"
                        />

                        <div className="absolute inset-0 bg-black/20" />

                    </div>

                </div>
            </div>

        </section>
    );
}
