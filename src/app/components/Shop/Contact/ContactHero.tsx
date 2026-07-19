"use client";

import {
    Phone,
    MapPin,
    Truck,
    Ruler,
    Shirt,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
    {
        title: "Care Guide",
        description:
            "Learn how to properly wash, store, and care for your garments to preserve their quality.",
        action: "Garment Care",
        icon: Shirt,
    },
];

const drawerContent = {
    Phone: [
        "Monday–Saturday • 09:00–20:00 (Business Hours)",
        "Sunday • Closed (Business Hours)",

        "+1 (800) 555-0187 (United States)",
        "+44 20 7946 0832 (United Kingdom)",
        "+33 1 84 88 4560 (France)",
        "+39 02 9475 2140 (Italy)",
        "+81 3 4578 9210 (Japan)",

        "clientservices@luxemen.com (Email)",

        "Personal Shopping Assistance (Services)",
        "Order Support (Services)",
        "Product Recommendations (Services)",
        "Size Consultation (Services)",
        "Returns & Exchanges (Services)",
        "Gift Services (Services)",
    ],

    "Store Locator": [
        "New York • Fifth Avenue (United States)",
        "London • Bond Street (United Kingdom)",
        "Paris • Avenue Montaigne (France)",
        "Milan • Via Montenapoleone (Italy)",
        "Tokyo • Ginza (Japan)",
        "Dubai • Dubai Mall (UAE)",

        "Private Shopping Appointments (Services)",
        "Personal Styling Consultations (Services)",
        "Luxury Gift Wrapping (Services)",
        "Exclusive Collection Preview (Services)",

        "Find Your Nearest Boutique (Store Locator)",
        "Boutique Opening Hours Vary by Location (Store Locator)",
    ],

    Shipping: [
        "Complimentary Standard Delivery (Standard)",
        "Express Delivery • 1–3 Business Days (Express)",
        "Worldwide Shipping Available (International)",

        "Real-Time Order Tracking (Tracking)",
        "Signature Required on Delivery (Tracking)",

        "Luxury Gift Packaging Available (Packaging)",
        "Premium Protective Packaging (Packaging)",

        "Customs & Duties Calculated at Checkout (International)",
        "Import Fees May Apply by Region (International)",

        "Orders Processed Monday–Friday (Processing)",
        "Delivery Times May Vary During Holidays (Processing)",
    ],

    "Size Guide": [
        "XS • Chest 34\" (Tops)",
        "S • Chest 36\" (Tops)",
        "M • Chest 38\" (Tops)",
        "L • Chest 40\" (Tops)",
        "XL • Chest 42\" (Tops)",
        "XXL • Chest 44\" (Tops)",

        "28 • Waist 28\" (Bottoms)",
        "30 • Waist 30\" (Bottoms)",
        "32 • Waist 32\" (Bottoms)",
        "34 • Waist 34\" (Bottoms)",
        "36 • Waist 36\" (Bottoms)",
        "38 • Waist 38\" (Bottoms)",

        "UK 6 (Footwear)",
        "UK 7 (Footwear)",
        "UK 8 (Footwear)",
        "UK 9 (Footwear)",
        "UK 10 (Footwear)",
        "UK 11 (Footwear)",

        "Slim Fit",
        "Regular Fit",
        "Relaxed Fit",
        "Oversized Fit",
    ],

    "Care Guide": [
        "Read care label before washing (General)",
        "Wash similar colours together (General)",
        "Turn garments inside out (General)",

        "Machine wash cold 30°C (Washing)",
        "Use mild detergent (Washing)",
        "Do not bleach (Washing)",
        "Avoid fabric softener (Washing)",

        "Hang dry whenever possible (Drying)",
        "Do not tumble dry (Drying)",
        "Dry away from direct sunlight (Drying)",

        "Iron on low heat (Ironing)",
        "Steam when necessary (Ironing)",
        "Do not iron over prints (Ironing)",

        "Store in a cool, dry place (Storage)",
        "Use quality hangers (Storage)",
        "Fold knitwear to maintain shape (Storage)",
    ],
};

export default function ContactHero() {
    const [openItem, setOpenItem] = useState<
        (typeof contactMethods)[number] | null
    >(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get("tab");

        if (!tab) return;

        const mapping = {
            phone: "Phone",
            shipping: "Shipping",
            "size-guide": "Size Guide",
            "care-guide": "Care Guide",
            store: "Store Locator",
        };

        const title = mapping[tab as keyof typeof mapping];

        if (!title) return;

        const item = contactMethods.find((method) => method.title === title);

        if (item) {
            setOpenItem(item);
        }
    }, [searchParams]);

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

                            <div
                                className={`mt-10 border-t ${openItem.title === "Size Guide" || openItem.title === "Care Guide"
                                    ? "max-h-197.5 overflow-y-auto no-scrollbar"
                                    : ""
                                    }`}
                            >
                                {drawerContent[
                                    openItem.title as keyof typeof drawerContent
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="border-b px-4 py-5 text-sm transition-colors hover:bg-black hover:text-white"
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