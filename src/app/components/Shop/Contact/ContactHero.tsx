"use client";

import {
    Phone,
    MapPin,
    Truck,
    Ruler,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const contactMethods = [
    {
        title: "Phone",
        description:
            "Speak directly with one of our Client Advisors for product information, sizing guidance, and order assistance.",
        action: "Contact Client Services",
        icon: Phone,
    },
    {
        title: "Store Locator",
        description:
            "Find your nearest boutique and explore our latest collections in person.",
        action: "Browse Boutiques",
        icon: MapPin,
    },
    {
        title: "Shipping",
        description:
            "Learn more about delivery options, estimated shipping times, and order tracking.",
        action: "Shipping Information",
        icon: Truck,
    },
    {
        title: "Size Guide",
        description:
            "Find the perfect fit with our detailed size guide for every category and collection.",
        action: "View Size Guide",
        icon: Ruler,
    },
];

const drawerContent = {
    Phone: [
        "United States — +1 (800) 555-0187",
        "United Kingdom — +44 20 7946 0832",
        "France — +33 1 84 88 45 60",
        "Italy — +39 02 9475 2140",
        "Japan — +81 3 4578 9210",
        "United Arab Emirates — +971 4 556 7821",
        "Singapore — +65 6922 4180",
        "Australia — +61 2 9056 7140",
        "Email — clientservices@yourbrand.com",
    ],

    "Store Locator": [
        "New York — Fifth Avenue",
        "London — Bond Street",
        "Paris — Avenue Montaigne",
        "Milan — Via Montenapoleone",
        "Tokyo — Ginza",
        "Dubai — Dubai Mall",
        "Singapore — Marina Bay Sands",
        "Hong Kong — Canton Road",
        "Sydney — Martin Place",
    ],

    Shipping: [
        "Complimentary Standard Shipping",
        "Express Delivery Available",
        "Worldwide Shipping",
        "Order Tracking Included",
        "Easy Returns Within 30 Days",
        "Customs & Duties Calculated at Checkout",
    ],

    "Size Guide": [
        "XS — Chest 34\" • Waist 28\"",
        "S — Chest 36\" • Waist 30\"",
        "M — Chest 38\" • Waist 32\"",
        "L — Chest 40\" • Waist 34\"",
        "XL — Chest 42\" • Waist 36\"",
        "XXL — Chest 44\" • Waist 38\"",
    ],
};

export default function ContactHero() {
    const [openItem, setOpenItem] = useState<
        (typeof contactMethods)[number] | null
    >(null);

    return (
        <section className=" px-5 py-10 md:px-20">

            {/* Heading */}
            <div className="relative -mx-5 md:-mx-20 mb-24 h-100 overflow-hidden md:h-130">
                {/* Background Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                >
                    <source src="/videos/contact1.mp4" type="video/mp4" />
                </video>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-300">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <span className="font-medium text-white">Contact</span>
                    </div>
                    <p className="mb-4 text-xs uppercase tracking-[0.35em]">
                        Client Services
                    </p>

                    <h1 className="font-serif text-3xl uppercase tracking-wide md:text-5xl">
                        Exceptional Service For
                        <br />
                         Every Journey
                    </h1>

                    <p className="mt-5 max-w-xl text-xs uppercase tracking-[0.25em] text-white/90">
                        Our Client Advisors are available to assist you with personalized
                        support, product guidance, and worldwide services.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-5 md:px-20">

                {/* Contact Methods */}
                <div className="mt-24 grid gap-y-20 gap-x-16 md:grid-cols-2">

                    {contactMethods.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="text-center"
                            >

                                <h3 className="text-sm font-semibold uppercase tracking-wide">
                                    {item.title}
                                </h3>

                                <p className="mx-auto mt-6 max-w-xs text-xs text-gray-600">
                                    {item.description}
                                </p>

                                <button
                                    onClick={() => setOpenItem(item)}
                                    className="mx-auto mt-8 flex items-center gap-3 border-b border-black pb-1 text-xs font-medium transition hover:opacity-60">
                                    <Icon size={18} />
                                    {item.action}
                                </button>

                            </div>
                        );
                    })}

                </div>

            </div>

            <AnimatePresence>
                {openItem && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenItem(null)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                            className="fixed top-0 right-0 z-50 h-full w-137.5 bg-white p-8 shadow-xl"
                        >
                            <button
                                onClick={() => setOpenItem(null)}
                                className="ml-auto block text-gray-500"
                            >
                                ✕
                            </button>

                            <h2 className="mt-8 text-xs font-semibold tracking-[0.3em] uppercase">
                                {openItem.title}
                            </h2>

                            <p className="mt-8 text-sm leading-7 text-gray-600">
                                {openItem.description}
                            </p>

                            <div className="mt-10 border-t">
                                {drawerContent[
                                    openItem.title as keyof typeof drawerContent
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="border-b px-4 py-5 text-sm cursor-pointer transition-colors hover:bg-black hover:text-white"
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