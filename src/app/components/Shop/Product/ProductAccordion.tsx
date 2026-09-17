"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type SectionKey = "details" | "material" | "commitment";

export default function ProductAccordion() {
    const [openSections, setOpenSections] = useState({
        details: false,
        material: false,
        commitment: false,
    });

    const toggle = (key: SectionKey) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const contentVariants = {
        hidden: {
            height: 0,
            opacity: 0,
        },
        visible: {
            height: "auto",
            opacity: 1,
        },
        exit: {
            height: 0,
            opacity: 0,
        },
    };

    return (
        <div
            className="
                w-full
                max-w-2xl
                space-y-7

                sm:space-y-8

                md:space-y-9

                lg:space-y-10
            "
        >
            {/* PRODUCT DETAILS */}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => toggle("details")}
                    className="
                        flex
                        w-full
                        px-3
                        items-center
                        justify-between
                        text-left
                        text-[9px]
                        font-semibold
                        tracking-[0.22em]
                        sm:text-[10px]
                        sm:tracking-widest
                    "
                >
                    <span>PRODUCT DETAILS</span>

                    <span
                        className="
                            ml-4
                            text-2xl
                            font-light
                            leading-none
                            sm:text-3xl
                        "
                    >
                        {openSections.details ? "˰" : "˯"}
                    </span>
                </button>

                {/* LINE */}
                <span
                    className={`
                        absolute
                        -bottom-4
                        left-0
                        h-px
                        bg-black
                        transition-all
                        duration-500
                        ease-in-out

                        sm:-bottom-5

                        ${openSections.details
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }
                    `}
                />

                <AnimatePresence initial={false}>
                    {openSections.details && (
                        <motion.ul
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{
                                duration: 0.45,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className="
                                mt-6
                                ml-4
                                list-disc
                                space-y-1.5
                                overflow-hidden
                                text-[9px]
                                leading-5
                                text-gray-600
                                sm:mt-7
                                sm:text-[10px]
                                sm:leading-6
                            "
                        >
                            <li>Refined tailored silhouette</li>

                            <li>Premium Italian wool blend</li>

                            <li>Structured shoulders and notch lapel</li>

                            <li>Concealed button fastening</li>

                            <li>Fully lined interior</li>

                            <li>Timeless charcoal finish</li>

                            <li>Designed for sophisticated everyday wear</li>
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            {/* MATERIAL & CARE */}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => toggle("material")}
                    className="
                        flex
                        w-full
                        px-3
                        items-center
                        justify-between
                        text-left
                        text-[9px]
                        font-semibold
                        tracking-[0.22em]
                        sm:text-[10px]
                        sm:tracking-widest
                    "
                >
                    <span>MATERIAL & CARE</span>

                    <span
                        className="
                            ml-4
                            text-2xl
                            font-light
                            leading-none
                            sm:text-3xl
                        "
                    >
                        {openSections.material ? "˰" : "˯"}
                    </span>
                </button>

                {/* LINE */}
                <span
                    className={`
                        absolute
                        -bottom-4
                        left-0
                        h-px
                        bg-black
                        transition-all
                        duration-500

                        sm:-bottom-5

                        ${openSections.material
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }
                    `}
                />

                <AnimatePresence initial={false}>
                    {openSections.material && (
                        <motion.p
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{
                                duration: 0.45,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className="
                                mt-6
                                ml-4
                                list-disc
                                space-y-1.5
                                overflow-hidden
                                text-[9px]
                                leading-5
                                text-gray-600
                                sm:mt-7
                                sm:text-[10px]
                                sm:leading-6
                            "
                        >
                            Crafted from a premium Italian wool blend selected for its softness, warmth, and refined drape. The fabric is designed to retain its structure while providing comfortable movement. Professional dry cleaning is recommended. Store on a quality hanger in a cool, dry place.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* OUR COMMITMENT */}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => toggle("commitment")}
                    className="
                        flex
                        w-full
                        px-3
                        items-center
                        justify-between
                        text-left
                        text-[9px]
                        font-semibold
                        tracking-[0.22em]
                        sm:text-[10px]
                        sm:tracking-widest
                    "
                >
                    <span>OUR COMMITMENT</span>

                    <span
                        className="
                            ml-4
                            text-2xl
                            font-light
                            leading-none
                            sm:text-3xl
                        "
                    >
                        {openSections.commitment ? "˰" : "˯"}
                    </span>
                </button>

                {/* LINE */}
                <span
                    className={`
                        absolute
                        -bottom-4
                        left-0
                        h-px
                        bg-black
                        transition-all
                        duration-500

                        sm:-bottom-5

                        ${openSections.commitment
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }
                    `}
                />

                <AnimatePresence initial={false}>
                    {openSections.commitment && (
                        <motion.p
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{
                                duration: 0.45,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className="
                                mt-6
                                ml-4
                                list-disc
                                space-y-1.5
                                overflow-hidden
                                text-[9px]
                                leading-5
                                text-gray-600
                                sm:mt-7
                                sm:text-[10px]
                                sm:leading-6
                            "
                        >
                            We believe luxury is defined by lasting quality, thoughtful design, and responsible craftsmanship. Each piece is created with careful attention to materials, construction, and timeless appeal—made to be worn beautifully season after season.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
