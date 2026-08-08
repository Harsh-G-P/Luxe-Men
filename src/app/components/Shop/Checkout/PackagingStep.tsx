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
            minHeight: 52,
            borderRadius: 0,
            borderColor: state.isFocused ? "#000" : "#d4d4d4",
            boxShadow: "none",
            backgroundColor: "#fff",
            cursor: "pointer",
            "&:hover": {
                borderColor: "#000",
            },
        }),

        valueContainer: (base: any) => ({
            ...base,
            padding: "0 16px",
        }),

        placeholder: (base: any) => ({
            ...base,
            color: "#737373",
            fontSize: "14px",
        }),

        singleValue: (base: any) => ({
            ...base,
            color: "#171717",
            fontSize: "14px",
        }),

        menu: (base: any) => ({
            ...base,
            borderRadius: 0,
            border: "1px solid #e5e5e5",
            boxShadow: "0 12px 24px rgba(0,0,0,.08)",
            overflow: "hidden",
        }),

        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#000"
                : state.isFocused
                    ? "#f5f5f5"
                    : "#fff",
            color: state.isSelected ? "#fff" : "#171717",
            cursor: "pointer",
            padding: "14px 16px",
            fontSize: "14px",
        }),

        indicatorSeparator: () => ({
            display: "none",
        }),

        dropdownIndicator: (base: any) => ({
            ...base,
            color: "#555",
            "&:hover": {
                color: "#000",
            },
        }),
        menuList: (base: any) => ({
            ...base,
            maxHeight: 200, // adjust (180-250px)
            padding: 0,

            "&::-webkit-scrollbar": {
                width: "6px",
            },

            "&::-webkit-scrollbar-thumb": {
                background: "#c5c5c5",
                borderRadius: "999px",
            },

            "&::-webkit-scrollbar-thumb:hover": {
                background: "#888",
            },
        }),
    };
    return (
        <section className="mt-14">

            <div className="mb-8 flex items-center gap-5">

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black">
                    2
                </div>

                <h2 className="text-2xl uppercase tracking-[0.18em]">
                    Packaging & Gifting
                </h2>

            </div>

            <div className="space-y-6">

                {/* Signature */}
                <label
                    className={`flex cursor-pointer items-start justify-between border p-8 transition max-md:flex-col max-md:gap-6 max-md:p-5 ${packagingData.option === "Signature Box"
                        ? "border-black"
                        : "border-neutral-300"
                        }`}
                >

                    {/* LEFT */}
                    <div className="flex items-start gap-5">

                        <input
                            type="radio"
                            checked={packagingData.option === "Signature Box"}
                            onChange={() =>
                                setPackagingData({
                                    ...packagingData,
                                    option: "Signature Box"
                                })
                            }
                            className="mt-1 h-4 w-4 accent-black"
                        />

                        <div>
                            <h3 className="text-sm">
                                Signature Box
                            </h3>

                            <p className="text-xs leading-7 text-neutral-500">
                                Your item comes in a box wrapped with a matching fabric ribbon.
                            </p>
                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="flex gap-2 max-md:w-full max-md:justify-center">

                        <div className="relative h-32 w-32 overflow-hidden border max-md:h-24 max-md:w-24">
                            <Image
                                src="/images/signature1.jpg"
                                alt="Signature Box"
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-cover"
                            />
                        </div>

                        <div className="relative h-32 w-32 overflow-hidden border max-md:h-24 max-md:w-24">
                            <Image
                                src="/images/signature2.jpg"
                                alt="Signature Box"
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-cover"
                            />
                        </div>

                    </div>

                </label>

                {/* Boutique */}
                <label
                    className={`flex cursor-pointer items-start justify-between border p-8 transition max-md:flex-col max-md:gap-6 max-md:p-5 ${packagingData.option === "Signature Box + Bag"
                        ? "border-black"
                        : "border-neutral-300"
                        }`}
                >

                    {/* LEFT */}
                    <div className="flex items-start gap-5">

                        <input
                            type="radio"
                            checked={packagingData.option === "Signature Box + Bag"}
                            onChange={() =>
                                setPackagingData({
                                    ...packagingData,
                                    option: "Signature Box + Bag"
                                })
                            }
                            className="mt-1 h-4 w-4 accent-black"
                        />

                        <div>
                            <h3 className="text-sm font-medium">
                                Signature Box and Boutique Shopping Bag
                            </h3>

                            <p className="text-xs leading-7 text-neutral-500">
                                Select this option to receive the shopping bag in addition to the signature box.
                            </p>
                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="flex gap-2 max-md:w-full max-md:justify-center">

                        <div className="relative h-32 w-32 overflow-hidden border max-md:h-24 max-md:w-24">
                            <Image
                                src="/images/signature3.jpg"
                                alt="Signature Box"
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-cover"
                            />
                        </div>

                        <div className="relative h-32 w-32 overflow-hidden border max-md:h-24 max-md:w-24">
                            <Image
                                src="/images/signature4.jpg"
                                alt="Signature Box"
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-cover"
                            />
                        </div>

                    </div>

                </label>

            </div>

            <div className="mt-5">

                <p className="text-xs mb-3 font-light">We will try to meet your preferences, but some options may not be suitable for all items. Product packaging may vary from the image(s) and include special protection or limited edition collection options.</p>

                <label className="flex items-center gap-3 text-xs">
                    <input
                        type="checkbox"
                        checked={removeInvoice}
                        onChange={(e) => setRemoveInvoice(e.target.checked)}
                        className=" h-4 w-4 accent-black cursor-pointer"
                    />

                    Remove price from invoice
                </label>


                <label className="mt-4 flex items-center gap-3 text-xs">
                    <input
                        type="checkbox"
                        checked={giftMessageEnabled}
                        onChange={(e) => setGiftMessageEnabled(e.target.checked)}
                        className="h-4 w-4 cursor-pointer accent-black"
                    />

                    Add Gift Message
                </label>

                <AnimatePresence>
                    {giftMessageEnabled && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35 }}
                            className="mt-8 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

                                {/* LEFT */}
                                <div>
                                    <h3 className="mb-5 text-xs tracking-[0.25em] uppercase">
                                        Gift Message
                                    </h3>

                                    <div className="relative max-w-md border border-gray-300">

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
                                            placeholder="Write your personal message here"
                                            className="h-62 w-full resize-none bg-white p-4 text-center text-base font-light placeholder:text-gray-300 focus:outline-none"
                                        />

                                        <div className="absolute bottom-3 left-0 w-full text-center text-xs text-gray-500">
                                            <div className="mx-auto mb-2 h-2 w-2 rotate-45 bg-gray-400"></div>
                                            {200 - giftMessage.length} Characters left
                                        </div>

                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="flex justify-center pt-8">
                                    <Image
                                        src="/images/gift.png"
                                        alt="Gift Message"
                                        width={650}
                                        height={500}
                                        className="w-full object-contain"
                                    />
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-8">
                    <h3 className="mb-3 text-xs uppercase tracking-[0.25em]">
                        Delivery Instructions
                    </h3>

                    <Select
                        instanceId="delivery-notes"
                        options={noteOptions}
                        styles={selectStyles}
                        isSearchable={false}
                        placeholder="Select delivery instructions"
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

                    <p className="mt-2 text-xs text-neutral-500">
                        Optional instructions for the courier.
                    </p>
                </div>

            </div>

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
                className="mt-10 h-13 bg-black px-10 text-[13px] uppercase tracking-[0.08em] text-white transition hover:bg-neutral-800">
                Continue to Payment
            </button>

            {/* STEP 3 */}
            <div className="mt-4 border border-neutral-200 bg-neutral-200 px-6 py-7">

                <div className="flex items-center gap-5">

                    <div className="mb-4 flex items-center gap-5">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-[15px] font-bold">
                            3
                        </div>

                    </div>

                    <div>

                        <h3 className="text-2xl uppercase tracking-wide text-gray-500 max-md:text-lg">
                            Payment
                        </h3>

                        <p className="mt-1 text-[13px] text-neutral-500 max-md:text-[11px]">
                            Cash on Delivery or Online Payment
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}