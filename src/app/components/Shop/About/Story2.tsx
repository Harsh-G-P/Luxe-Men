"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Story2() {
    return (
        <section className="relative overflow-hidden bg-[#f5f3ee] text-[#25231f]">

            <div className="relative z-10 p-4 md:p-6 lg:p-8">

                <div className="grid min-h-[90vh] grid-cols-1 lg:grid-cols-2">

                    {/* LEFT — CONTENT */}
                    <div
                        className="
                            relative
                            flex
                            items-center
                            px-8
                            py-24
                            sm:px-12
                            md:px-14
                            lg:px-16
                            xl:px-24
                        "
                    >

                        {/* EDITORIAL BORDER */}
                        <div className="pointer-events-none absolute inset-0">

                            <svg
                                className="absolute inset-0 h-full w-full"
                                viewBox="0 0 1000 720"
                                preserveAspectRatio="none"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M 20 20 H 980"
                                    stroke="#9b8d78"
                                    strokeOpacity="0.35"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                <path
                                    d="
                                        M 20 20
                                        V 40
                                        H 0
                                        V 690
                                    "
                                    stroke="#9b8d78"
                                    strokeOpacity="0.35"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                <path
                                    d="
                                        M 980 20
                                        V 40
                                        H 1000
                                        V 690
                                    "
                                    stroke="#9b8d78"
                                    strokeOpacity="0.35"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                <path
                                    d="
                                        M 0 690
                                        C 18 690 30 700 30 715
                                    "
                                    stroke="#9b8d78"
                                    strokeOpacity="0.35"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                <path
                                    d="M 30 715 H 970"
                                    stroke="#9b8d78"
                                    strokeOpacity="0.35"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />

                                <path
                                    d="
                                        M 970 715
                                        C 970 700 982 690 1000 690
                                    "
                                    stroke="#9b8d78"
                                    strokeOpacity="0.35"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>

                            {/* ABOUT LABEL */}

                            <div
                                className="
                                    absolute
                                    left-1/2
                                    top-6
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    bg-[#f5f3ee]
                                    px-5
                                "
                            >
                                <span
                                    className="
                                        whitespace-nowrap
                                        text-[8px]
                                        font-medium
                                        uppercase
                                        tracking-[0.4em]
                                        text-[#817562]
                                    "
                                >
                                    About Luxe Men
                                </span>
                            </div>

                        </div>


                        {/* CONTENT */}
                        <div
                            className="
                                relative
                                z-10
                                w-full
                                max-w-xl
                                md:max-w-155
                                lg:max-w-xl
                            "
                        >

                            {/* PART 01 */}
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="pb-12"
                            >
                                <span
                                    className="
                                        mb-5
                                        block
                                        text-[8px]
                                        uppercase
                                        tracking-[0.4em]
                                        text-[#9b8d78]
                                    "
                                >
                                    01 — The Beginning
                                </span>

                                <h3
                                    className="
                                        max-w-xl
                                        font-serif
                                        text-3xl
                                        font-normal
                                        leading-[1.05]
                                        tracking-[-0.035em]
                                        text-[#302e29]

                                        sm:text-4xl

                                        md:max-w-140
                                        md:text-[2.8rem]

                                        lg:max-w-xl
                                    "
                                >
                                    Menswear with
                                    <br />

                                    <span className="text-[#8b795f]">
                                        quiet character.
                                    </span>
                                </h3>

                                <p
                                    className="
                                        mt-6
                                        max-w-lg
                                        text-[13px]
                                        leading-7
                                        text-[#6f6a62]

                                        md:max-w-140
                                        md:text-sm

                                        lg:max-w-lg
                                    "
                                >
                                    Luxe Men began with a simple belief:
                                    great clothing does not need to demand
                                    attention. It should speak through its
                                    cut, fabric, proportion, and detail.
                                </p>
                            </motion.div>

                            {/* PART 02 */}
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.08,
                                    duration: 0.8,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="
                                    border-t
                                    border-[#8b795f]/20
                                    py-10
                                "
                            >
                                <div className="flex gap-8">

                                    <span
                                        className="
                                            pt-1
                                            text-[8px]
                                            uppercase
                                            tracking-[0.35em]
                                            text-[#9b8d78]
                                        "
                                    >
                                        02
                                    </span>

                                    <div className="min-w-0 flex-1">

                                        <span
                                            className="
                                                block
                                                text-[8px]
                                                uppercase
                                                tracking-[0.4em]
                                                text-[#817b72]
                                            "
                                        >
                                            The Craft
                                        </span>

                                        <h3
                                            className="
                                                mt-4
                                                font-serif
                                                text-2xl
                                                leading-tight
                                                tracking-[-0.02em]
                                                text-[#302e29]
                                                md:text-3xl
                                            "
                                        >
                                            Made with intention.
                                        </h3>

                                        <p
                                            className="
                                                mt-4
                                                max-w-lg
                                                text-[13px]
                                                leading-7
                                                text-[#6f6a62]

                                                md:max-w-130
                                                md:text-sm

                                                lg:max-w-lg
                                            "
                                        >
                                            From the structure of a jacket
                                            to the weight of a fabric,
                                            every element is considered.
                                            Refined construction and subtle
                                            finishing create pieces that
                                            reveal their quality over time.
                                        </p>

                                    </div>

                                </div>
                            </motion.div>

                            {/* PART 03 */}
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.16,
                                    duration: 0.8,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="
                                    border-t
                                    border-[#8b795f]/20
                                    py-10
                                "
                            >
                                <div className="flex gap-8">

                                    <span
                                        className="
                                            pt-1
                                            text-[8px]
                                            uppercase
                                            tracking-[0.35em]
                                            text-[#9b8d78]
                                        "
                                    >
                                        03
                                    </span>

                                    <div className="min-w-0 flex-1">

                                        <span
                                            className="
                                                block
                                                text-[8px]
                                                uppercase
                                                tracking-[0.4em]
                                                text-[#817b72]
                                            "
                                        >
                                            The Philosophy
                                        </span>

                                        <h3
                                            className="
                                                mt-4
                                                font-serif
                                                text-2xl
                                                leading-tight
                                                tracking-[-0.02em]
                                                text-[#302e29]
                                                md:text-3xl
                                            "
                                        >
                                            Less, but considered.
                                        </h3>

                                        <p
                                            className="
                                                mt-4
                                                max-w-lg
                                                text-[13px]
                                                leading-7
                                                text-[#6f6a62]

                                                md:max-w-130
                                                md:text-sm

                                                lg:max-w-lg
                                            "
                                        >
                                            We believe modern luxury lives
                                            in restraint. Clean silhouettes,
                                            timeless tones, and thoughtful
                                            details create clothing that
                                            feels effortless rather than
                                            excessive.
                                        </p>

                                    </div>

                                </div>
                            </motion.div>

                            {/* PART 04 */}
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.24,
                                    duration: 0.8,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="
                                    border-t
                                    border-[#8b795f]/20
                                    pt-10
                                "
                            >
                                <div className="flex gap-8">

                                    <span
                                        className="
                                            pt-1
                                            text-[8px]
                                            uppercase
                                            tracking-[0.35em]
                                            text-[#9b8d78]
                                        "
                                    >
                                        04
                                    </span>

                                    <div className="min-w-0 flex-1">

                                        <span
                                            className="
                                                block
                                                text-[8px]
                                                uppercase
                                                tracking-[0.4em]
                                                text-[#817b72]
                                            "
                                        >
                                            The Man
                                        </span>

                                        <h3
                                            className="
                                                mt-4
                                                font-serif
                                                text-2xl
                                                leading-tight
                                                tracking-[-0.02em]
                                                text-[#302e29]
                                                md:text-3xl
                                            "
                                        >
                                            Designed to become yours.
                                        </h3>

                                        <p
                                            className="
                                                mt-4
                                                max-w-lg
                                                text-[13px]
                                                leading-7
                                                text-[#6f6a62]

                                                md:max-w-130
                                                md:text-sm

                                                lg:max-w-lg
                                            "
                                        >
                                            Luxe Men is for the man who
                                            knows what he likes, values
                                            quality, and understands that
                                            personal style is built through
                                            the pieces he chooses to keep.
                                        </p>

                                    </div>

                                </div>
                            </motion.div>

                        </div>
                    </div>


                    {/* RIGHT IMAGE — DESKTOP ONLY */}
                    <div className="relative hidden min-h-[90vh] overflow-hidden lg:block">

                        <Image
                            src="/images/about1.jpg"
                            alt="Luxe Men collection"
                            fill
                            priority
                            className="object-cover p-10"
                            sizes="50vw"
                        />

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-10
                                bg-linear-to-t
                                from-[#181714]/20
                                via-transparent
                                to-[#f5f3ee]/5
                            "
                        />

                    </div>


                    {/* MOBILE + TABLET IMAGE */}
                    <div
                        className="
                            relative
                            h-[55vh]
                            min-h-105
                            overflow-hidden
                            lg:hidden
                        "
                    >

                        <Image
                            src="/images/about1.jpg"
                            alt="Luxe Men collection"
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />

                        <div className="absolute inset-0 bg-[#171714]/10" />

                    </div>

                </div>

            </div>

        </section>
    );
}