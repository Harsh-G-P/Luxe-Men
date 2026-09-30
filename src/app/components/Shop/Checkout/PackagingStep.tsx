"use client"

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Select from "react-select";

type Props = {
    packagingData: any;
    setPackagingData: any;
    removeInvoice: boolean;
    setRemoveInvoice: any;
    giftMessageEnabled: boolean;
    setGiftMessageEnabled: any;
    giftMessage: string;
    setGiftMessage: any;
    setCurrentStep: any;
};


const noteOptions = [
    { value: "", label: "No special instructions" },
    { value: "Leave at the front door", label: "Leave at the front door" },
    { value: "Leave with security", label: "Leave with security" },
    { value: "Call before delivery", label: "Call before delivery" },
    { value: "Ring the doorbell once", label: "Ring the doorbell once" },
    { value: "Deliver to reception", label: "Deliver to reception" },
    { value: "Handle as fragile", label: "Handle as fragile" },
    { value: "Do not leave unattended", label: "Do not leave unattended" },
];

export default function PackagingStep({ packagingData,
    setPackagingData,
    removeInvoice,
    setRemoveInvoice,
    giftMessageEnabled,
    setGiftMessageEnabled,
    giftMessage,
    setGiftMessage,
    setCurrentStep }: Props) {

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            minHeight: "54px",
            height: "54px",
            borderRadius: 0,
            border: state.isFocused
                ? "1px solid #9b8150"
                : "1px solid #d4cfc5",
            backgroundColor: "#faf9f6",
            boxShadow: "none",
            cursor: "pointer",
            paddingLeft: "8px",
            transition: "border-color 300ms ease",

            "&:hover": {
                borderColor: "#9b8150",
            },
        }),

        valueContainer: (base: any) => ({
            ...base,
            padding: "0 12px",
        }),

        placeholder: (base: any) => ({
            ...base,
            color: "#aaa49b",
            fontSize: "9px",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
        }),

        singleValue: (base: any) => ({
            ...base,
            color: "#34312c",
            fontSize: "10px",
            letterSpacing: "0.08em",
        }),

        indicatorSeparator: () => ({
            display: "none",
        }),

        dropdownIndicator: (base: any, state: any) => ({
            ...base,
            color: "#9b8150",
            paddingRight: "16px",
            transition: "transform 300ms ease",

            transform: state.selectProps.menuIsOpen
                ? "rotate(180deg)"
                : "rotate(0deg)",

            "&:hover": {
                color: "#9b8150",
            },
        }),

        menu: (base: any) => ({
            ...base,
            marginTop: "4px",
            borderRadius: 0,
            border: "1px solid #d4cfc5",
            backgroundColor: "#faf9f6",
            boxShadow: "0 15px 35px rgba(28, 27, 24, 0.08)",
            overflow: "hidden",
            zIndex: 50,
        }),

        menuList: (base: any) => ({
            ...base,

            /*
             * Four options visible.
             * Additional options scroll vertically.
             */
            maxHeight: "176px",
            overflowY: "auto",
            padding: "6px 0",

            /* Firefox */
            scrollbarWidth: "thin",
            scrollbarColor: "#c8b78e transparent",

            /* Chrome / Edge / Safari */
            "&::-webkit-scrollbar": {
                width: "4px",
            },

            "&::-webkit-scrollbar-track": {
                background: "transparent",
            },

            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c8b78e",
            },

            "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#9b8150",
            },
        }),

        option: (base: any, state: any) => ({
            ...base,

            minHeight: "41px",
            padding: "14px 18px",

            backgroundColor: state.isSelected
                ? "#f1eee7"
                : state.isFocused
                    ? "#f5f2eb"
                    : "#faf9f6",

            color: state.isSelected
                ? "#9b8150"
                : "#34312c",

            fontSize: "9px",
            lineHeight: "13px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",

            cursor: "pointer",
            transition: "all 200ms ease",

            "&:active": {
                backgroundColor: "#eee9df",
            },
        }),
    };

    return (
        <section className="mt-14 text-[#1c1b18]">

            {/* SECTION HEADER */}
            <div className="mb-9 flex items-start gap-5">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#9b8150] text-[12px] text-[#9b8150]">
                    02
                </div>

                <div>
                    <p className="text-[8px] uppercase tracking-[0.45em] text-[#9b8150]">
                        The Presentation
                    </p>

                    <h2 className="mt-2 font-serif text-[28px] leading-none tracking-tight">
                        Packaging & Gifting
                    </h2>

                    <p className="mt-3 max-w-lg text-[10px] leading-5 text-[#8b867d]">
                        Every piece is presented with the same attention to detail
                        as the garment itself.
                    </p>
                </div>

            </div>

            {/* PACKAGING OPTIONS */}
            <div className="space-y-5">

                {/* SIGNATURE BOX */}
                <label
                    className={`group relative flex cursor-pointer items-start justify-between overflow-hidden border p-7 transition-all duration-500 max-md:flex-col max-md:gap-7 max-md:p-5 ${packagingData.option === "Signature Box"
                            ? "border-[#9b8150] bg-[#f4f1e9]"
                            : "border-[#d8d3c9] bg-[#faf9f6] hover:border-[#b7aa91]"
                        }`}
                >

                    {/* ACTIVE ACCENT */}
                    <span
                        className={`absolute left-0 top-0 h-full w-0.5 bg-[#9b8150] transition-transform duration-500 ${packagingData.option === "Signature Box"
                                ? "scale-y-100"
                                : "scale-y-0"
                            }`}
                    />

                    {/* LEFT */}
                    <div className="flex min-w-0 items-start gap-5">

                        <input
                            type="radio"
                            checked={packagingData.option === "Signature Box"}
                            onChange={() =>
                                setPackagingData({
                                    ...packagingData,
                                    option: "Signature Box"
                                })
                            }
                            className="mt-1 h-4 w-4 cursor-pointer accent-[#9b8150]"
                        />

                        <div>

                            <div className="flex items-center gap-3">

                                <p className="text-[8px] uppercase tracking-[0.35em] text-[#9b8150]">
                                    Presentation I
                                </p>

                            </div>

                            <h3 className="mt-2 font-serif text-[18px] tracking-tight text-[#25231f]">
                                Signature Box
                            </h3>

                            <p className="mt-3 max-w-md text-[10px] leading-5 text-[#858077]">
                                Your purchase is presented in our signature box,
                                finished with a coordinating fabric ribbon and
                                prepared for an exceptional unboxing experience.
                            </p>

                        </div>

                    </div>


                    {/* IMAGES */}
                    <div className="flex shrink-0 gap-2 max-md:w-full max-md:justify-center">

                        <div className="relative h-32 w-32 overflow-hidden border border-[#d3cec3] bg-[#e9e5dc] max-md:h-24 max-md:w-24">
                            <Image
                                src="/images/signature1.jpg"
                                alt="Signature Box"
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        <div className="relative h-32 w-32 overflow-hidden border border-[#d3cec3] bg-[#e9e5dc] max-md:h-24 max-md:w-24">
                            <Image
                                src="/images/signature2.jpg"
                                alt="Signature Box"
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                    </div>

                </label>

                {/* SIGNATURE BOX + BAG */}
                <label
                    className={`group relative flex cursor-pointer items-start justify-between overflow-hidden border p-7 transition-all duration-500 max-md:flex-col max-md:gap-7 max-md:p-5 ${packagingData.option === "Signature Box + Bag"
                            ? "border-[#9b8150] bg-[#f4f1e9]"
                            : "border-[#d8d3c9] bg-[#faf9f6] hover:border-[#b7aa91]"
                        }`}
                >

                    {/* ACTIVE ACCENT */}
                    <span
                        className={`absolute left-0 top-0 h-full w-0.5 bg-[#9b8150] transition-transform duration-500 ${packagingData.option === "Signature Box + Bag"
                                ? "scale-y-100"
                                : "scale-y-0"
                            }`}
                    />

                    {/* LEFT */}
                    <div className="flex min-w-0 items-start gap-5">

                        <input
                            type="radio"
                            checked={packagingData.option === "Signature Box + Bag"}
                            onChange={() =>
                                setPackagingData({
                                    ...packagingData,
                                    option: "Signature Box + Bag"
                                })
                            }
                            className="mt-1 h-4 w-4 cursor-pointer accent-[#9b8150]"
                        />

                        <div>

                            <p className="text-[8px] uppercase tracking-[0.35em] text-[#9b8150]">
                                Presentation II
                            </p>

                            <h3 className="mt-2 font-serif text-[18px] leading-6 tracking-tight text-[#25231f]">
                                Signature Box & Boutique Bag
                            </h3>

                            <p className="mt-3 max-w-md text-[10px] leading-5 text-[#858077]">
                                Includes our signature presentation box together
                                with the LUXE MEN boutique shopping bag, prepared
                                for gifting or collection.
                            </p>

                        </div>

                    </div>


                    {/* IMAGES */}
                    <div className="flex shrink-0 gap-2 max-md:w-full max-md:justify-center">

                        <div className="relative h-32 w-32 overflow-hidden border border-[#d3cec3] bg-[#e9e5dc] max-md:h-24 max-md:w-24">
                            <Image
                                src="/images/signature3.jpg"
                                alt="Signature Box and Boutique Bag"
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        <div className="relative h-32 w-32 overflow-hidden border border-[#d3cec3] bg-[#e9e5dc] max-md:h-24 max-md:w-24">
                            <Image
                                src="/images/signature4.jpg"
                                alt="Signature Box and Boutique Bag"
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                    </div>

                </label>

            </div>

            {/* PACKAGING NOTE */}
            <div className="mt-6 border-t border-[#d8d3c9] pt-5">

                <div className="flex gap-3">

                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#9b8150]" />

                    <p className="max-w-2xl text-[9px] leading-5 tracking-[0.02em] text-[#8a857c]">
                        Presentation is carefully selected according to the nature
                        of your purchase. Packaging may vary slightly and may
                        include seasonal, limited-edition or protective elements
                        to ensure your order arrives impeccably presented.
                    </p>

                </div>

            </div>

            {/* PREFERENCES */}
            <div className="mt-8 space-y-5 border-y border-[#d8d3c9] py-7">

                {/* REMOVE PRICE */}
                <label className="group flex cursor-pointer items-center gap-4">

                    <input
                        type="checkbox"
                        checked={removeInvoice}
                        onChange={(e) => setRemoveInvoice(e.target.checked)}
                        className="h-4 w-4 cursor-pointer accent-[#9b8150]"
                    />

                    <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4b44]">
                            Conceal Pricing
                        </p>

                        <p className="mt-1 text-[9px] text-[#99938a]">
                            Remove pricing information from the enclosed invoice.
                        </p>
                    </div>

                </label>


                {/* GIFT MESSAGE */}
                <label className="group flex cursor-pointer items-center gap-4">

                    <input
                        type="checkbox"
                        checked={giftMessageEnabled}
                        onChange={(e) => setGiftMessageEnabled(e.target.checked)}
                        className="h-4 w-4 cursor-pointer accent-[#9b8150]"
                    />

                    <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4b44]">
                            Include a Personal Message
                        </p>

                        <p className="mt-1 text-[9px] text-[#99938a]">
                            Add a handwritten-style message to accompany your gift.
                        </p>
                    </div>

                </label>

            </div>

            {/* GIFT MESSAGE */}
            <AnimatePresence>
                {giftMessageEnabled && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                    >

                        <div className="grid grid-cols-1 gap-10 border-b border-[#d8d3c9] py-8 lg:grid-cols-2">

                            {/* MESSAGE */}
                            <div>

                                <div className="mb-5 flex items-center gap-4">

                                    <span className="h-px w-7 bg-[#b99a62]" />

                                    <h3 className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                                        A Note From You
                                    </h3>

                                </div>

                                <div className="relative max-w-md overflow-hidden border border-[#d4cfc5] bg-[#faf9f6]">

                                    <textarea
                                        maxLength={200}
                                        value={giftMessage}
                                        onChange={(e) => {
                                            setGiftMessage(e.target.value);

                                            setPackagingData({
                                                ...packagingData,
                                                giftMessage: e.target.value
                                            });
                                        }}
                                        placeholder="Write your personal message..."
                                        className="
                                        h-56
                                        w-full
                                        resize-none
                                        bg-transparent
                                        p-5
                                        text-[12px]
                                        leading-6
                                        text-[#33312d]
                                        outline-none
                                        placeholder:text-[#b0aba2]
                                    "
                                    />

                                    <div className="flex items-center justify-between border-t border-[#ded9d0] px-5 py-3">

                                        <span className="text-[7px] uppercase tracking-[0.25em] text-[#aaa49b]">
                                            LUXE MEN · PERSONAL NOTE
                                        </span>

                                        <span className="text-[8px] text-[#969087]">
                                            {200 - giftMessage.length} remaining
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* GIFT IMAGE */}
                            <div className="flex items-center justify-center p-5">

                                <Image
                                    src="/images/gift.png"
                                    alt="Gift presentation"
                                    width={650}
                                    height={500}
                                    className="h-full max-h-64 w-full object-contain mix-blend-multiply"
                                />

                            </div>

                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* DELIVERY INSTRUCTIONS */}
            <div className="mt-8">

                <div className="mb-4">

                    <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                        Final Arrangements
                    </p>

                    <h3 className="mt-2 font-serif text-[19px] tracking-tight">
                        Delivery Instructions
                    </h3>

                    <p className="mt-2 text-[9px] leading-5 text-[#99938a]">
                        Let us know if there are any particular considerations
                        for the arrival of your order.
                    </p>

                </div>

                <Select
                    instanceId="delivery-notes"
                    options={noteOptions}
                    styles={selectStyles}
                    isSearchable={false}
                    placeholder="Select delivery preference"
                    value={
                        noteOptions.find(
                            (option) => option.value === packagingData.notes
                        ) || null
                    }
                    onChange={(selected) =>
                        setPackagingData({
                            ...packagingData,
                            notes: selected?.value ?? "",
                        })
                    }
                />



            </div>

            {/* CONTINUE */}
            <button
                type="button"
                onClick={() => {
                    setPackagingData({
                        ...packagingData,
                        giftMessage: giftMessageEnabled ? giftMessage : "",
                        notes: packagingData.notes
                    });

                    setCurrentStep(3);
                }}
                className="
                group
                relative
                mt-10
                flex
                h-14
                w-full
                items-center
                justify-center
                overflow-hidden
                bg-[#181714]
                text-[9px]
                font-medium
                uppercase
                tracking-[0.35em]
                text-white
                transition-colors
                duration-500
                hover:bg-[#292721]
            "
            >

                <span className="relative z-10">
                    Continue to Payment
                </span>

                <span className="relative z-10 ml-3 translate-x-1 text-[#c4a66a] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                </span>

                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-700 group-hover:scale-x-100" />

            </button>

            {/* STEP 03 — PAYMENT PREVIEW */}
            <div className="mt-5 border border-[#d8d3c9] bg-[#efede7] px-7 py-6">

                <div className="flex items-center gap-5">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#bdb7ac] text-[10px] text-[#8f8980]">
                        03
                    </div>

                    <div>

                        <p className="text-[8px] uppercase tracking-[0.4em] text-[#aaa49b]">
                            Final Step
                        </p>

                        <h3 className="mt-2 font-serif text-[21px] tracking-tight text-[#77736b]">
                            Payment
                        </h3>

                        <p className="mt-1 text-[9px] text-[#aaa49b]">
                            Secure payment & order confirmation
                        </p>

                    </div>

                </div>

            </div>

            {/* FOOTER DETAIL */}
            <div className="mt-10 flex items-center justify-center gap-4">

                <span className="h-px w-10 bg-[#d1cbc1]" />

                <span className="text-[7px] uppercase tracking-[0.4em] text-[#aaa49a]">
                    LUXE MEN
                </span>

                <span className="h-px w-10 bg-[#d1cbc1]" />

            </div>

        </section>
    );

}