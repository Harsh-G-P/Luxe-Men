"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const faqs = [
    {
        question: "How long does shipping take?",
        answer:
            "Orders are typically processed within 1–2 business days and delivered within 3–7 business days depending on your location.",
    },
    {
        question: "Do you ship internationally?",
        answer:
            "Yes. International shipping is available for selected countries. Shipping costs are calculated during checkout.",
    },
    {
        question: "How can I contact customer service?",
        answer:
            "Our Client Advisors are available to assist with product information, orders, and general inquiries through phone and email support.",
    },
    {
        question: "How should I care for my products?",
        answer:
            "Each item includes care recommendations to help maintain the quality, appearance, and longevity of your purchase.",
    },
];

export default function ContactFAQ() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="px-5 py-20 md:px-20">

            <div className="mx-auto max-w-4xl">

                <div className="mb-16 text-center">

                    <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gray-400">
                        FAQ
                    </p>

                    <h2 className="font-serif text-4xl md:text-5xl">
                        Frequently Asked Questions
                    </h2>

                </div>

                <div className="border-t border-gray-200">

                    {faqs.map((faq, index) => (
                        <div
                            key={faq.question}
                            className="border-b border-gray-200"
                        >
                            <button
                                onClick={() =>
                                    setOpen(open === index ? null : index)
                                }
                                className="flex w-full items-center justify-between py-7 text-left"
                            >
                                <span className="text-base font-medium">
                                    {faq.question}
                                </span>

                                <span className="text-2xl">
                                    {open === index ? "−" : "+"}
                                </span>
                            </button>

                            <AnimatePresence>

                                {open === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{
                                            height: 0,
                                            opacity: 0,
                                        }}
                                        transition={{ duration: 0.35 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-7 pr-10 text-sm leading-8 text-gray-600">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}

                            </AnimatePresence>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}