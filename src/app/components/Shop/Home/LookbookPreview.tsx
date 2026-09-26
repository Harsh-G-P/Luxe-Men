"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const lookbookItems = [
    {
        image: "/images/l10.jpg",
        title: "Form I",
        number: "Look 01",
    },
    {
        image: "/images/l_1.jpg",
        title: "Form II",
        number: "Look 02",
    },
    {
        image: "/images/l6.jpg",
        title: "Form III",
        number: "Look 03",
    },
];


export default function LookbookPreview() {
    return (
        <section className="relative overflow-hidden bg-[#090a0b] px-4 py-20 text-[#eeeae2] md:px-6 md:py-28 lg:px-8">

            {/* Outer Frame */}
            <div className="pointer-events-none absolute inset-4 md:inset-6 lg:inset-8">
                <div className="absolute -inset-0.5 border border-[#8fa6b8]/15 blur-[2px]" />
                <div className="absolute inset-0 border border-[#8fa6b8]/10" />

                <div className="absolute left-0 top-0 h-5 w-5 border-l border-t border-[#a99d8e]/40" />
                <div className="absolute right-0 top-0 h-5 w-5 border-r border-t border-[#a99d8e]/40" />
                <div className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-[#a99d8e]/40" />
                <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-[#a99d8e]/40" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">

                {/* Header */}
                <div className="mb-14 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.5em] text-[#9ca6ae]">
                            Lookbook
                        </p>

                        <h2 className="max-w-2xl text-4xl font-light leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                            Designed with
                            <br />
                            <span className="text-[#a99d8e]">intention.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.7 }}
                        className="max-w-xs"
                    >
                        <p className="mb-5 text-sm leading-6 text-[#858989]">
                            A considered collection shaped by clean lines,
                            refined details, and timeless form.
                        </p>

                        <Link
                            href="/lookbook"
                            className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.35em] text-[#eeeae2]"
                        >
                            View Lookbook

                            <span className="flex h-8 w-8 items-center justify-center border border-[#a99d8e]/30 transition-colors duration-300 group-hover:border-[#a99d8e]/70">
                                <ArrowUpRight
                                    size={14}
                                    strokeWidth={1}
                                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </span>
                        </Link>
                    </motion.div>
                </div>

                {/* Lookbook Images */}
                <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                    {lookbookItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.12,
                                duration: 0.7,
                            }}
                            className="group"
                        >
                            <Link href="/lookbook" className="block">

                                <div className="relative aspect-3/4 overflow-hidden bg-[#111314]">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                    />

                                    <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

                                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-white">
                                            Explore
                                        </span>

                                        <span className="flex h-8 w-8 items-center justify-center border border-white/40 text-white">
                                            <ArrowUpRight
                                                size={14}
                                                strokeWidth={1}
                                            />
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-b border-[#a99d8e]/10 py-4">
                                    <div>
                                        <p className="text-xs tracking-wide text-[#eeeae2]">
                                            {item.title}
                                        </p>

                                        <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-[#5f6262]">
                                            {item.number}
                                        </p>
                                    </div>

                                    <span className="text-[9px] text-[#5f6262]">
                                        0{index + 1}
                                    </span>
                                </div>

                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 flex items-center justify-between border-t border-[#a99d8e]/10 pt-5 text-[8px] uppercase tracking-[0.35em] text-[#555959]">
                    <span>The Art of Refinement</span>

                    <Link
                        href="/lookbook"
                        className="transition-colors hover:text-[#a99d8e]"
                    >
                        Explore All
                    </Link>
                </div>

            </div>
        </section>
    );
}
