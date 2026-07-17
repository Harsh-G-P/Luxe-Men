"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";


export default function ProductAccordion() {

    const [openSections, setOpenSections] =
        useState({
            details: false,
            material: false,
            commitment: false,
        });

    type SectionKey = "details" | "material" | "commitment";

    const toggle = (key: SectionKey) => {
        setOpenSections(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };



    const contentVariants = {

        hidden: {
            height: 0,
            opacity: 0
        },

        visible: {
            height: "auto",
            opacity: 1
        },

        exit: {
            height: 0,
            opacity: 0
        }

    };


    return (

        <div className=" mt-10 space-y-10 max-w-2xl">

            {/* PRODUCT DETAILS */}

            <div className=" relative group mb-10">

                <button
                    onClick={() => toggle("details")}
                    className=" w-full flex justify-between items-center text-xs tracking-widest font-semibold pb-3"
                >
                    PRODUCT DETAILS

                    <span className=" text-2xl font-medium">
                        {
                            openSections.details
                                ?
                                "˰"
                                :
                                "˯"
                        }
                    </span>

                </button>

                <span
                    className={` absolute -bottom-5 left-0 h-px bg-black transition-all duration-500 ease-in-out
                    ${openSections.details
                            ?
                            "w-full"
                            :
                            "w-0 group-hover:w-full"
                        }
                    `}

                />

                <AnimatePresence>

                    {
                        openSections.details && (

                            <motion.ul
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: .45, ease: [0.4, 0, 0.2, 1]}}
                                className=" overflow-hidden mt-4 list-disc ml-5 text-xs text-gray-700 space-y-1"
                            >

                                <li>
                                    Handcrafted luxury finish
                                </li>

                                <li>
                                    Elegant silhouette
                                </li>

                                <li>
                                    Premium quality fabric
                                </li>

                            </motion.ul>

                        )
                    }


                </AnimatePresence>

            </div>

            {/* MATERIAL & CARE */}

            <div className=" relative group mb-10">

                <button
                    onClick={() => toggle("material")}
                    className=" w-full flex justify-between items-center text-xs tracking-widest font-semibold pb-3"
                >
                    MATERIAL & CARE

                    <span className=" text-2xl font-medium">

                        {
                            openSections.material
                                ?
                                "˰"
                                :
                                "˯"
                        }

                    </span>

                </button>



                <span
                    className={` absolute -bottom-5 left-0 h-px bg-black transition-all duration-500

                    ${openSections.material
                            ?
                            "w-full"
                            :
                            "w-0 group-hover:w-full"
                        }
                    `}

                />

                <AnimatePresence>

                    {
                        openSections.material && (

                            <motion.p
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: .45}}

                                className=" overflow-hidden mt-4 text-xs text-gray-700"
                            >
                                Made with high-quality fabric.
                                Dry clean only. Store in a cool dry place.

                            </motion.p>

                        )
                    }

                </AnimatePresence>

            </div>

            {/* OUR COMMITMENT */}

            <div className=" relative group mb-10">

                <button
                    onClick={() => toggle("commitment")}
                    className=" w-full flex justify-between items-center text-xs tracking-widest font-semibold pb-3"
                >
                    OUR COMMITMENT

                    <span className=" text-2xl font-medium">
                        {
                            openSections.commitment
                                ?
                                "˰"
                                :
                                "˯"
                        }

                    </span>

                </button>

                <span
                    className={` absolute -bottom-5 left-0 h-px bg-black transition-all duration-500

                    ${openSections.commitment
                            ?
                            "w-full"
                            :
                            "w-0 group-hover:w-full"
                        }
                    `}
                />

                <AnimatePresence>

                    {
                        openSections.commitment && (

                            <motion.p
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: .45}}
                                className="overflow-hidden mt-4 text-xs text-gray-700"
                                >
                                We focus on sustainable craftsmanship
                                and responsible production.

                            </motion.p>

                        )
                    }

                </AnimatePresence>

            </div>

        </div>

    );
}