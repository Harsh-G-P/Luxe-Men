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
            "Discover a boutique near you and experience the world of Luxe Men in person.",
        action: "Explore Boutiques",
        icon: MapPin,
    },
    {
        title: "Shipping",
        description:
            "Explore delivery options, estimated shipping times, order tracking, and packaging information.",
        action: "Shipping Information",
        icon: Truck,
    },
    {
        title: "Size Guide",
        description:
            "Find your ideal fit with considered sizing guidance across our collections.",
        action: "Discover Your Size",
        icon: Ruler,
    },
    {
        title: "Care Guide",
        description:
            "Learn how to preserve the texture, shape, and character of your Luxe Men pieces.",
        action: "Explore Garment Care",
        icon: Shirt,
    },
];

const drawerContent = {
    Phone: [
        "Monday–Saturday • 09:00–20:00",
        "Sunday • Closed",

        "+1 (800) 555-0187 • United States",
        "+44 20 7946 0832 • United Kingdom",
        "+33 1 84 88 4560 • France",
        "+39 02 9475 2140 • Italy",
        "+81 3 4578 9210 • Japan",

        "clientservices@luxemen.com",

        "Personal Shopping Assistance",
        "Order Support",
        "Product Recommendations",
        "Size Consultation",
        "Returns & Exchanges",
        "Gift Services",
    ],

    "Store Locator": [
        "New York • Fifth Avenue",
        "London • Bond Street",
        "Paris • Avenue Montaigne",
        "Milan • Via Montenapoleone",
        "Tokyo • Ginza",
        "Dubai • Dubai Mall",

        "Private Shopping Appointments",
        "Personal Styling Consultations",
        "Luxury Gift Wrapping",
        "Exclusive Collection Preview",

        "Boutique Opening Hours Vary by Location",
    ],

    Shipping: [
        "Complimentary Standard Delivery",
        "Express Delivery • 1–3 Business Days",
        "Worldwide Shipping Available",

        "Real-Time Order Tracking",
        "Signature Required on Delivery",

        "Luxury Gift Packaging Available",
        "Premium Protective Packaging",

        "Customs & Duties Calculated at Checkout",
        "Import Fees May Apply by Region",

        "Orders Processed Monday–Friday",
        "Delivery Times May Vary During Holidays",
    ],

    "Size Guide": [
        "XS • Chest 34″",
        "S • Chest 36″",
        "M • Chest 38″",
        "L • Chest 40″",
        "XL • Chest 42″",
        "XXL • Chest 44″",

        "28 • Waist 28″",
        "30 • Waist 30″",
        "32 • Waist 32″",
        "34 • Waist 34″",
        "36 • Waist 36″",
        "38 • Waist 38″",

        "UK 6 • Footwear",
        "UK 7 • Footwear",
        "UK 8 • Footwear",
        "UK 9 • Footwear",
        "UK 10 • Footwear",
        "UK 11 • Footwear",

        "Slim Fit",
        "Regular Fit",
        "Relaxed Fit",
        "Oversized Fit",
    ],

    "Care Guide": [
        "Read care label before washing",
        "Wash similar colours together",
        "Turn garments inside out",

        "Machine wash cold • 30°C",
        "Use mild detergent",
        "Do not bleach",
        "Avoid fabric softener",

        "Hang dry whenever possible",
        "Do not tumble dry",
        "Dry away from direct sunlight",

        "Iron on low heat",
        "Steam when necessary",
        "Do not iron over prints",

        "Store in a cool, dry place",
        "Use quality hangers",
        "Fold knitwear to maintain shape",
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

        const item = contactMethods.find(
            (method) => method.title === title
        );

        if (item) {
            setOpenItem(item);
        }
    }, [searchParams]);

    return (
        <section className="bg-[#f7f5f1] px-5 py-28">

            {/* Header */}
            <div className="mx-auto max-w-3xl text-center">

                <div className="mb-8 flex items-center justify-center gap-4">
                    <span className="h-px w-12 bg-[#b49a68]/50" />

                    <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]" />

                    <span className="h-px w-12 bg-[#b49a68]/50" />
                </div>

                <p className="text-[9px] font-medium uppercase tracking-[0.55em] text-[#9b8050]">
                    Client Services
                </p>

                <h2 className="mt-6 font-serif text-5xl font-light leading-[0.95] tracking-[-0.045em] text-[#191816] md:text-7xl">
                    Every Detail,
                    <br />
                    <span className="italic text-[#77736b]">
                        Considered.
                    </span>
                </h2>

                <p className="mx-auto mt-8 max-w-lg text-[11px] leading-7 tracking-[0.035em] text-[#858078]">
                    From finding your perfect fit to caring for your
                    collection, our Client Services are designed around
                    every detail of the Luxe Men experience.
                </p>

            </div>

            {/* Services */}
            <div className="mx-auto mt-24 grid max-w-6xl grid-cols-1 border-t border-[#d8d4cc] md:grid-cols-2">

                {contactMethods.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.title}
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                margin: "-80px",
                            }}
                            transition={{
                                duration: 0.7,
                                delay: index * 0.08,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className={`group border-b border-[#d8d4cc] py-12 md:px-10 md:py-14 ${index % 2 === 0
                                    ? "md:border-r"
                                    : ""
                                }`}
                        >

                            <div className="flex items-start justify-between">

                                <span className="text-[8px] tracking-[0.3em] text-[#b49a68]">
                                    0{index + 1}
                                </span>

                                <Icon
                                    size={17}
                                    strokeWidth={1}
                                    className="text-[#aaa59c] transition-colors duration-300 group-hover:text-[#9b8050]"
                                />

                            </div>

                            <h3 className="mt-8 font-serif text-2xl font-light tracking-[-0.02em] text-[#25231f]">
                                {item.title}
                            </h3>

                            <p className="mt-4 max-w-sm text-[11px] leading-6 tracking-[0.02em] text-[#858078]">
                                {item.description}
                            </p>

                            <button
                                type="button"
                                onClick={() => setOpenItem(item)}
                                className="group/button mt-7 inline-flex items-center gap-4 text-[8px] uppercase tracking-[0.45em] text-[#403d37]"
                            >
                                <span className="border-b border-[#b49a68] pb-1 transition-colors duration-300 group-hover/button:text-[#9b8050]">
                                    {item.action}
                                </span>

                                <span className="text-sm transition-transform duration-300 group-hover/button:translate-x-1">
                                    →
                                </span>
                            </button>

                        </motion.div>
                    );
                })}

            </div>

            {/* Closing Detail */}
            <div className="mt-20 flex items-center justify-center gap-4">

                <span className="h-px w-12 bg-[#d8d4cc]" />

                <span className="text-[8px] uppercase tracking-[0.5em] text-[#aaa59c]">
                    Luxe Men
                </span>

                <span className="h-px w-12 bg-[#d8d4cc]" />

            </div>

            {/* Drawer */}
            <AnimatePresence>
                {openItem && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[3px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            onClick={() => setOpenItem(null)}
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
                            className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-[#f7f5f1] px-7 py-8 shadow-2xl sm:px-12"
                        >

                            {/* Close */}
                            <button
                                type="button"
                                onClick={() => setOpenItem(null)}
                                aria-label="Close"
                                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cfc5] text-[#77736b] transition duration-300 hover:border-[#9b8050] hover:text-[#9b8050]"
                            >
                                <span className="text-lg leading-none">
                                    ×
                                </span>
                            </button>

                            {/* Drawer Header */}
                            <div className="mt-16">

                                <p className="text-[8px] uppercase tracking-[0.5em] text-[#9b8050]">
                                    Luxe Men
                                </p>

                                <h2 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-[#191816]">
                                    {openItem.title}
                                </h2>

                                <div className="mt-7 flex items-center gap-3">
                                    <span className="h-px w-10 bg-[#b49a68]" />

                                    <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]" />
                                </div>

                                <p className="mt-7 max-w-md text-[11px] leading-7 tracking-[0.02em] text-[#858078]">
                                    {openItem.description}
                                </p>

                            </div>

                            {/* Details */}
                            <div className="mt-10 border-t border-[#d8d4cc]">

                                {drawerContent[
                                    openItem.title as keyof typeof drawerContent
                                ].map((item, index) => (
                                    <motion.div
                                        key={`${item}-${index}`}
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
                                                0.12 + index * 0.035,
                                            duration: 0.35,
                                        }}
                                        className="group flex items-start gap-5 border-b border-[#d8d4cc] py-5"
                                    >

                                        <span className="pt-1 text-[8px] tracking-[0.2em] text-[#b49a68]">
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                        <p className="text-[11px] leading-6 tracking-[0.02em] text-[#68645d] transition-colors group-hover:text-[#25231f]">
                                            {item}
                                        </p>

                                    </motion.div>
                                ))}

                            </div>

                            {/* Drawer Footer */}
                            <div className="mt-16 flex items-center gap-4">

                                <span className="h-px w-10 bg-[#d0cbc1]" />

                                <span className="text-[7px] uppercase tracking-[0.5em] text-[#aaa59c]">
                                    Client Services
                                </span>

                            </div>

                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

        </section>
    );
}
