"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const cards = [
    {
        title: "Order Tracking",
        description:
            "Track your order from dispatch to delivery and stay updated with shipping progress every step of the way.",
        video: "/videos/contact4.mp4",
        href: "#",
    },
    {
        title: "Complimentary Shipping",
        description:
            "Enjoy premium delivery with secure packaging and reliable shipping designed for a seamless shopping experience.",
        video: "/videos/contact5.mp4",
        href: "#",
    },
    {
        title: "Product Care",
        description:
            "Discover practical care recommendations to help preserve the quality, appearance, and longevity of your garments.",
        video: "/videos/contact3.mp4",
        href: "#",
    },
];

const drawerContent = {
    "Order Tracking": [
        "Track your order from dispatch to delivery.",
        "Receive updates throughout the shipping journey.",
        "International tracking available.",
        "Delivery confirmation after arrival.",
    ],

    "Complimentary Shipping": [
        "Complimentary worldwide shipping.",
        "Premium secure packaging.",
        "Express delivery options available.",
        "Estimated delivery times depend on destination.",
    ],

    "Product Care": [
        "Store garments in a cool and dry environment.",
        "Avoid direct exposure to sunlight.",
        "Follow recommended cleaning instructions.",
        "Professional care helps maintain quality.",
    ],
};

export default function ContactCards() {
    const [openCard, setOpenCard] = useState<
        keyof typeof drawerContent | null
    >(null);
    return (
        <section className="px-5 py-20 md:px-20">

            <div className="mb-20 text-center">

                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gray-400">
                    Support
                </p>

                <h2 className="font-serif text-4xl md:text-5xl">
                    How Can We Help?
                </h2>

            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 justify-items-center gap-12 md:grid-cols-2 md:max-w-4xl xl:max-w-7xl xl:grid-cols-3">

                {cards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.6,
                            delay: index * 0.15,
                        }}
                        className="w-full max-w-sm"
                    >
                        <div className="group block">

                            <div className="relative h-88 overflow-hidden">

                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                >
                                    <source src={card.video} type="video/mp4" />
                                </video>

                                <div className="absolute inset-0 bg-black/50 transition duration-500 group-hover:bg-black/60" />

                            </div>

                            <div className="pt-6 text-center">

                                <h3 className="font-serif text-md font-bold">
                                    {card.title}
                                </h3>

                                <p className="mx-auto mt-5 max-w-xs text-xs leading-5 text-gray-600">
                                    {card.description}
                                </p>

                                <button
                                    onClick={() => setOpenCard(card.title as keyof typeof drawerContent)}
                                    className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] transition"
                                >
                                    Discover
                                    <span className="transition duration-300 group-hover:translate-x-2">
                                        →
                                    </span>
                                </button>

                            </div>

                        </div>
                    </motion.div>
                ))}

            </div>

            <AnimatePresence>
                {openCard && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenCard(null)}
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                            className="fixed right-0 top-0 z-50 h-full w-137.5 bg-white p-8 shadow-xl"
                        >

                            <button
                                onClick={() => setOpenCard(null)}
                                className="ml-auto block text-gray-500"
                            >
                                ✕
                            </button>

                            <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.3em]">
                                {openCard}
                            </h2>

                            <div className="mt-10 border-t">
                                {drawerContent[openCard].map((item, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer border-b px-4 py-5 text-sm transition-colors hover:bg-black hover:text-white"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </section>
    );
}