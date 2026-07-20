"use client";

import {
    Clock3,
    ShieldCheck,
    Lock,
    BadgeCheck,
} from "lucide-react";

const features = [
    {
        icon: Clock3,
        title: "Fast Delivery",
        description:
            "Quick and reliable shipping to get your order to you as soon as possible.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Payments",
        description:
            "Your transactions are protected with trusted payment methods.",
    },
    {
        icon: Lock,
        title: "Secure Checkout",
        description:
            "Shop confidently with encrypted and trusted payment methods.",
    },
    {
        icon: BadgeCheck,
        title: "Premium Quality",
        description:
            "Crafted with high-quality materials for lasting comfort.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="bg-neutral-50 py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-5 md:px-6">
                {/* Heading */}
                <div className="mb-12 text-center md:mb-16">
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gray-500 md:text-sm md:tracking-[0.35em]">
                        Why Choose Us
                    </p>

                    <h2 className="text-3xl font-bold text-black md:text-5xl">
                        Premium Shopping Experience
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-500 md:max-w-2xl md:text-lg">
                        We combine premium quality, secure shopping, and
                        exceptional service to deliver the best experience.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="group rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-black hover:shadow-xl md:p-8"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
                                    <Icon size={26} className="md:hidden" />
                                    <Icon size={30} className="hidden md:block" />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-black md:mt-6 md:text-xl">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500 md:text-base md:leading-7">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}