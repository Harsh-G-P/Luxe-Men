"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const cards = [
    {
        title: "Order Tracking",
        description:
            "Follow your order from our atelier to your door with complete visibility throughout its journey.",
        video: "/videos/contact4.mp4",
    },
    {
        title: "Complimentary Shipping",
        description:
            "Every order is presented with considered packaging and delivered with care to create a seamless experience.",
        video: "/videos/contact5.mp4",
    },
    {
        title: "Product Care",
        description:
            "Discover considered care guidance created to preserve the character, texture, and quality of your pieces.",
        video: "/videos/contact3.mp4",
    },
];

const drawerContent = {
    "Order Tracking": [
        "Track your order from dispatch to delivery.",
        "Receive updates throughout the shipping journey.",
        "International tracking is available.",
        "Delivery confirmation is provided after arrival.",
    ],

    "Complimentary Shipping": [
        "Complimentary shipping on eligible orders.",
        "Each piece is carefully and securely packaged.",
        "Express delivery options may be available.",
        "Delivery times vary according to destination.",
    ],

    "Product Care": [
        "Store garments in a cool, dry environment.",
        "Keep delicate fabrics away from direct sunlight.",
        "Follow the individual care label for each piece.",
        "Professional cleaning is recommended when appropriate.",
    ],
};

export default function ContactCards() {
    const [openCard, setOpenCard] = useState<
        keyof typeof drawerContent | null
    >(null);

    return (
        <section className="bg-[#f7f5f1] px-5 py-18">

            {/* Section Header */}
            <div className="mx-auto mb-20 max-w-2xl text-center">

                <div className="mb-7 flex items-center justify-center gap-4">
                    <span className="h-px w-10 bg-[#b49a68]/50" />

                    <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]" />

                    <span className="h-px w-10 bg-[#b49a68]/50" />
                </div>

                <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-[#9b8050]">
                    Client Services
                </p>

                <h2 className="mt-6  font-serif text-5xl font-light leading-[0.95] tracking-[-0.045em] text-[#191816] md:text-6xl">
                    Considered
                    <br />
                    <span className="italic text-[#77736b]">
                        With Care.
                    </span>
                </h2>


                <p className="mx-auto mt-7 max-w-md text-[11px] leading-7 tracking-[0.035em] text-[#858078]">
                    From the moment you place an order to the care of your
                    collection, every detail is considered.
                </p>

            </div>

            {/* Cards */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 md:grid-cols-2 xl:grid-cols-3">

                {cards.map((card, index) => (
                    <motion.article
                        key={card.title}
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{
                            duration: 0.8,
                            delay: index * 0.12,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group"
                    >

                        {/* Media */}
                        <div className="relative aspect-4/5 overflow-hidden bg-[#dedbd4]">

                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.035]"
                            >
                                <source src={card.video} type="video/mp4" />
                            </video>

                            {/* Soft luxury overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-black/5" />

                            {/* Number */}
                            <div className="absolute left-5 top-5">
                                <span className="text-[8px] tracking-[0.3em] text-white/75">
                                    0{index + 1}
                                </span>
                            </div>

                            {/* Bottom label */}
                            <div className="absolute bottom-5 left-5">
                                <span className="text-[8px] uppercase tracking-[0.4em] text-white/80">
                                    Luxe Men
                                </span>
                            </div>

                        </div>

                        {/* Content */}
                        <div className="pt-7 text-center">

                            <h3 className="font-serif text-xl font-light tracking-[-0.01em] text-[#25231f]">
                                {card.title}
                            </h3>

                            <p className="mx-auto mt-4 max-w-xs text-[11px] leading-6 tracking-[0.02em] text-[#858078]">
                                {card.description}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setOpenCard(
                                        card.title as keyof typeof drawerContent
                                    )
                                }
                                className="group/button mt-7 inline-flex items-center gap-4 text-[8px] uppercase tracking-[0.45em] text-[#403d37]"
                            >
                                <span className="border-b border-[#b49a68] pb-1 transition-colors group-hover/button:text-[#9b8050]">
                                    Discover More
                                </span>

                                <span className="text-sm transition-transform duration-300 group-hover/button:translate-x-1">
                                    →
                                </span>
                            </button>

                        </div>

                    </motion.article>
                ))}

            </div>

            {/* Side Drawer */}
            <AnimatePresence>
                {openCard && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[3px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            onClick={() => setOpenCard(null)}
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                duration: 0.55,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto bg-[#f7f5f1] px-7 py-8 shadow-2xl sm:px-12"
                        >

                            {/* Close */}
                            <button
                                type="button"
                                onClick={() => setOpenCard(null)}
                                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cfc5] text-[#77736b] transition hover:border-[#9b8050] hover:text-[#9b8050]"
                                aria-label="Close"
                            >
                                <span className="text-lg leading-none">
                                    ×
                                </span>
                            </button>

                            {/* Drawer Header */}
                            <div className="mt-16">

                                <p className="text-[8px] uppercase tracking-[0.5em] text-[#9b8050]">
                                    Client Services
                                </p>

                                <h2 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-[#191816]">
                                    {openCard}
                                </h2>

                                <div className="mt-7 h-px w-12 bg-[#b49a68]" />

                            </div>

                            {/* Information */}
                            <div className="mt-10 border-t border-[#d8d4cc]">

                                {drawerContent[openCard].map(
                                    (item, index) => (
                                        <motion.div
                                            key={item}
                                            initial={{
                                                opacity: 0,
                                                x: 15,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            transition={{
                                                delay:
                                                    0.15 + index * 0.08,
                                                duration: 0.4,
                                            }}
                                            className="flex gap-5 border-b border-[#d8d4cc] py-6"
                                        >
                                            <span className="pt-1 text-[8px] tracking-[0.2em] text-[#b49a68]">
                                                0{index + 1}
                                            </span>

                                            <p className="text-[12px] leading-6 tracking-[0.02em] text-[#68645d]">
                                                {item}
                                            </p>
                                        </motion.div>
                                    )
                                )}

                            </div>

                            {/* Drawer Footer */}
                            <div className="mt-16 flex items-center gap-4">

                                <span className="h-px w-10 bg-[#d0cbc1]" />

                                <span className="text-[7px] uppercase tracking-[0.5em] text-[#aaa59c]">
                                    Luxe Men
                                </span>

                            </div>

                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

        </section>
    );
}
