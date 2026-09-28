"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const faqs = [
    {
        question: "How long does shipping take?",
        answer:
            "Orders are carefully prepared within 1-2 business days. Once dispatched, delivery typically takes 3-7 business days depending on your destination.",
    },
    {
        question: "Do you offer international delivery?",
        answer:
            "Yes. We offer international delivery to selected destinations. Available shipping options and rates are presented during checkout.",
    },
    {
        question: "How may I contact your Client Advisors?",
        answer:
            "Our Client Advisors are available to assist with orders, product information, styling inquiries, and any other questions through our dedicated contact channels.",
    },
    {
        question: "How should I care for my purchase?",
        answer:
            "Every piece is accompanied by individual care recommendations. Following these guidelines will help preserve its texture, finish, and character for years to come.",
    },
];

export default function ContactFAQ() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="bg-[#f7f5f1] px-5 py-24 md:px-10 md:py-32">

            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-20 text-center">

                    <div className="mb-6 flex items-center justify-center gap-4">
                        <span className="h-px w-10 bg-[#b49a68]/50" />

                        <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]" />

                        <span className="h-px w-10 bg-[#b49a68]/50" />
                    </div>

                    <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.5em] text-[#9b8a6a]">
                        Client Services
                    </p>

                    <h2 className="font-serif text-4xl font-light tracking-[-0.03em] text-[#191816] md:text-6xl">
                        Frequently Asked
                        <br />
                        <span className="italic text-[#77736b]">
                            Questions.
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-md text-[11px] leading-7 tracking-[0.04em] text-[#8a8780]">
                        Everything you need to know about your experience
                        with Luxe Men.
                    </p>

                </div>

                {/* FAQ */}
                <div className="border-t border-[#d8d4cc]">

                    {faqs.map((faq, index) => {
                        const isOpen = open === index;

                        return (
                            <div
                                key={faq.question}
                                className="border-b border-[#d8d4cc]"
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(isOpen ? null : index)
                                    }
                                    className="group flex w-full items-center justify-between py-7 text-left md:py-8"
                                    aria-expanded={isOpen}
                                >

                                    <div className="flex items-center gap-5">

                                        <span className="text-[9px] tracking-[0.25em] text-[#b49a68]">
                                            0{index + 1}
                                        </span>

                                        <span
                                            className={`font-serif text-lg font-light tracking-[-0.01em] transition-colors duration-300 md:text-xl ${isOpen
                                                    ? "text-[#9b8050]"
                                                    : "text-[#25231f] group-hover:text-[#9b8050]"
                                                }`}
                                        >
                                            {faq.question}
                                        </span>

                                    </div>

                                    {/* Luxury plus icon */}
                                    <span
                                        className={`relative ml-6 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${isOpen
                                                ? "rotate-45 border-[#b49a68] bg-[#b49a68]"
                                                : "border-[#cfcac0] group-hover:border-[#b49a68]"
                                            }`}
                                    >
                                        <span
                                            className={`absolute h-px w-2.5 ${isOpen
                                                    ? "bg-white"
                                                    : "bg-[#77736b]"
                                                }`}
                                        />

                                        <span
                                            className={`absolute h-2.5 w-px ${isOpen
                                                    ? "bg-white"
                                                    : "bg-[#77736b]"
                                                }`}
                                        />
                                    </span>

                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            transition={{
                                                height: {
                                                    duration: 0.4,
                                                    ease: [0.22, 1, 0.36, 1],
                                                },
                                                opacity: {
                                                    duration: 0.25,
                                                },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-8 pl-9 pr-12 md:pl-14 md:pr-20">

                                                <div className="mb-5 h-px w-8 bg-[#b49a68]/40" />

                                                <p className="max-w-2xl text-[12px] leading-7 tracking-wide text-[#77736f]">
                                                    {faq.answer}
                                                </p>

                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        );
                    })}

                </div>

                {/* Bottom Closing */}
                <div className="mt-20 flex items-center justify-center gap-4">

                    <span className="h-px w-16 bg-[#d8d4cc]" />

                    <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]" />

                    <span className="text-[8px] uppercase tracking-[0.5em] text-[#aaa59c]">
                        Luxe Men
                    </span>

                    <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]" />

                    <span className="h-px w-16 bg-[#d8d4cc]" />

                </div>


            </div>

        </section>
    );
}
