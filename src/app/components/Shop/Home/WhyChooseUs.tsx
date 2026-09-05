"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const whychoose = [
    {
        image: "/images/ch3.jpg",
        number: "01",
        title: "Considered Delivery",
        description:
            "Reliable shipping, carefully handled from our door to yours.",
    },
    {
        image: "/images/ch5.jpg",
        number: "02",
        title: "Trusted Payments",
        description:
            "Secure transactions through reliable and protected payment methods.",
    },
    {
        image: "/images/ch2.jpg",
        number: "03",
        title: "Private & Secure",
        description:
            "Your information remains protected throughout every step of your purchase.",
    },
];

export default function WhyChoose() {
    return (
        <section className="relative overflow-hidden bg-[#f3eee5] px-4 py-20 text-[#2b2521] md:px-6 md:py-28 lg:px-8">

            {/* Outer Frame */}
            <div className="pointer-events-none absolute inset-4 md:inset-6 lg:inset-8">
                <div className="absolute -inset-0.5 border border-[#8c8172]/15 blur-[2px]" />
                <div className="absolute inset-0 border border-[#8c8172]/10" />

                <div className="absolute left-0 top-0 h-5 w-5 border-l border-t border-[#8c8172]/40" />
                <div className="absolute right-0 top-0 h-5 w-5 border-r border-t border-[#8c8172]/40" />
                <div className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-[#8c8172]/40" />
                <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-[#8c8172]/40" />
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
                        <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.5em] text-[#81776d]">
                            Why Choose Us
                        </p>

                        <h2 className="max-w-2xl text-4xl font-light leading-[0.95] tracking-[-0.045em] text-[#302923] sm:text-5xl lg:text-7xl">
                            Details that
                            <br />
                            <span className="text-[#8c8172]">
                                make the difference..
                            </span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.7 }}
                        className="max-w-xs"
                    >
                        <p className="mb-5 text-sm leading-6 text-[#81776d]">
                            Thoughtful design, dependable service, and quality
                            that stays with you beyond the first impression.
                        </p>

                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.35em] text-[#302923]"
                        >
                            Discover More

                            <span className="flex h-8 w-8 items-center justify-center border border-[#8c8172]/30 transition-colors duration-300 group-hover:border-[#8c8172]/70">
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
                    {whychoose.map((item, index) => (
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
                            <Link href="/contact" className="block">

                                <div className="relative aspect-3/4 overflow-hidden bg-[#e8e0d5]">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                    />

                                    <div className="absolute inset-0 bg-[#2b2521]/0 transition-colors duration-500 group-hover:bg-[#2b2521]/10" />

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

                                <div className="flex items-center justify-between border-b border-[#8c8172]/15 py-4">
                                    <div>
                                        <p className="text-xs tracking-wide text-[#3a332d]">
                                            {item.title}
                                        </p>

                                        <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-[#8b8075]">
                                            {item.number}
                                        </p>

                                        <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-[#81776d]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 flex items-center justify-between border-t border-[#8c8172]/15 pt-5 text-[8px] uppercase tracking-[0.35em] text-[#8b8075]">
                    <span>The Art of Refinement</span>

                    <Link
                        href="/contact"
                        className="transition-colors hover:text-[#8c8172]"
                    >
                        Explore All
                    </Link>
                </div>

            </div>
        </section>
    );
}