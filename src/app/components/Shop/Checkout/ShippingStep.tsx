"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AddressProps = {
    id: string;
    fullname: string;
    countryCode: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
};

type Props = {
    selected: string;
    setSelected: (value: string) => void;
    setCurrentStep: (value: number) => void;
    setShippingData: (address: AddressProps) => void;
};

export default function ShippingStep({
    selected,
    setSelected,
    setCurrentStep,
    setShippingData,
}: Props) {
    const [addresses, setAddresses] = useState<AddressProps[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/address", {
                method: "GET",
            });

            const data = await res.json();

            if (data.success) {
                setAddresses(data.data);

                const defaultAddress = data.data.find(
                    (item: AddressProps) => item.isDefault
                );

                if (defaultAddress) {
                    setSelected(defaultAddress.id);
                    setShippingData(defaultAddress);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    if (loading) {
        return (
            <section className="text-[#1c1b18]">
                <div className="flex h-125 flex-col items-center justify-center">

                    <div className="flex items-center gap-4">
                        <span className="h-px w-8 bg-[#d1cbc1]" />

                        <span className="text-[7px] uppercase tracking-[0.45em] text-[#9b8150]">
                            LUXE MEN
                        </span>

                        <span className="h-px w-8 bg-[#d1cbc1]" />
                    </div>

                    <div className="mt-6 h-px w-20 overflow-hidden bg-[#ded9d0]">
                        <div className="h-full w-1/2 animate-[luxuryLoading_1.5s_ease-in-out_infinite] bg-[#9b8150]" />
                    </div>

                    <p className="mt-4 text-[7px] uppercase tracking-[0.35em] text-[#aaa49b]">
                        Preparing Your Address
                    </p>

                </div>
            </section>
        );
    }

    return (
        <section className="mt-14 text-[#1c1b18]">

            <form>

                {/* SECTION HEADER */}
                <div className="mb-9 flex items-start gap-5">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#9b8150] text-[12px] text-[#9b8150]">
                        01
                    </div>

                    <div>
                        <p className="text-[8px] uppercase tracking-[0.45em] text-[#9b8150]">
                            The Destination
                        </p>

                        <h2 className="mt-2 font-serif text-[28px] leading-none tracking-tight">
                            Shipping
                        </h2>

                        <p className="mt-3 max-w-lg text-[10px] leading-5 text-[#8b867d]">
                            Select where your order should be delivered. Every
                            detail is handled with care from our atelier to your
                            door.
                        </p>
                    </div>

                </div>

                {/* DELIVERY TYPE */}
                <div className="mb-8 border-y border-[#d8d3c9] py-5">

                    <label className="group flex cursor-pointer items-center gap-4">

                        <input
                            type="radio"
                            defaultChecked
                            className="h-4 w-4 cursor-pointer accent-[#9b8150]"
                        />

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4b44]">
                                Home Delivery
                            </p>

                            <p className="mt-1 text-[9px] text-[#99938a]">
                                Delivered directly to your selected address.
                            </p>
                        </div>

                    </label>

                </div>

                {/* SAVED ADDRESSES */}
                <div>

                    <div className="mb-5 flex items-center gap-4">

                        <span className="h-px w-7 bg-[#b99a62]" />

                        <h3 className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                            Your Addresses
                        </h3>

                    </div>


                    {addresses.length === 0 ? (

                        <div className="border border-dashed border-[#d4cfc5] bg-[#faf9f6] px-6 py-12 text-center">

                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#99938a]">
                                No saved addresses found
                            </p>

                            <Link
                                href="/profile/addresses"
                                className="group mt-5 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-[#4f4b44]"
                            >
                                <span className="relative">
                                    Add Address

                                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#9b8150] transition-transform duration-500 group-hover:scale-x-100" />
                                </span>

                                <span className="text-[16px] font-light transition-transform duration-300 group-hover:rotate-90">
                                    +
                                </span>
                            </Link>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {addresses.map((address) => {

                                const isSelected = selected === address.id;

                                return (
                                    <label
                                        key={address.id}
                                        onClick={() => setSelected(address.id)}
                                        className={`
                                            group
                                            relative
                                            flex
                                            cursor-pointer
                                            overflow-hidden
                                            border
                                            px-6
                                            py-6
                                            transition-all
                                            duration-500
                                            max-md:px-5
                                            ${isSelected
                                                ? "border-[#9b8150] bg-[#f4f1e9]"
                                                : "border-[#d8d3c9] bg-[#faf9f6] hover:border-[#b7aa91]"
                                            }
                                        `}
                                    >

                                        {/* GOLD ACTIVE ACCENT */}

                                        <span
                                            className={`
                                                absolute
                                                left-0
                                                top-0
                                                h-full
                                                w-0.5
                                                origin-top
                                                bg-[#9b8150]
                                                transition-transform
                                                duration-500
                                                ${isSelected
                                                    ? "scale-y-100"
                                                    : "scale-y-0"
                                                }
                                            `}
                                        />


                                        {/* RADIO */}

                                        <input
                                            type="radio"
                                            checked={isSelected}
                                            onChange={() =>
                                                setSelected(address.id)
                                            }
                                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#9b8150]"
                                        />


                                        {/* ADDRESS */}

                                        <div className="ml-5 min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-5">

                                                <div>

                                                    <p
                                                        className={`
                                                            text-[8px]
                                                            uppercase
                                                            tracking-[0.35em]
                                                            ${isSelected
                                                                ? "text-[#9b8150]"
                                                                : "text-[#9a917f]"
                                                            }
                                                        `}
                                                    >
                                                        {address.isDefault
                                                            ? "Preferred Address"
                                                            : "Delivery Address"}
                                                    </p>

                                                    <h4 className="mt-2 font-serif text-[18px] tracking-tight text-[#25231f]">
                                                        {address.fullname}
                                                    </h4>

                                                </div>


                                                {isSelected && (
                                                    <span className="shrink-0 text-[7px] uppercase tracking-[0.3em] text-[#9b8150]">
                                                        Selected
                                                    </span>
                                                )}

                                            </div>


                                            <div className="mt-4 space-y-1 text-[10px] leading-5 text-[#858077]">

                                                <p>
                                                    {address.addressLine}
                                                </p>

                                                <p>
                                                    {address.city},{" "}
                                                    {address.state},{" "}
                                                    {address.postalCode}
                                                </p>

                                                <p>
                                                    {address.country}
                                                </p>

                                            </div>


                                            <div className="mt-4 border-t border-[#ded9d0] pt-3">

                                                <p className="text-[8px] uppercase tracking-[0.18em] text-[#9a958c]">
                                                    {address.countryCode}{" "}
                                                    {address.phone}
                                                </p>

                                            </div>

                                        </div>

                                    </label>
                                );
                            })}

                        </div>
                    )}


                    {/* ADD NEW ADDRESS */}

                    {addresses.length > 0 && (
                        <Link
                            href="/profile/addresses"
                            className="
                                group
                                mt-7
                                flex
                                w-fit
                                items-center
                                gap-3
                                text-[8px]
                                uppercase
                                tracking-[0.3em]
                                text-[#4f4b44]
                            "
                        >

                            <span className="relative">

                                Add New Address

                                <span
                                    className="
                                        absolute
                                        -bottom-1
                                        left-0
                                        h-px
                                        w-full
                                        origin-left
                                        scale-x-0
                                        bg-[#9b8150]
                                        transition-transform
                                        duration-500
                                        group-hover:scale-x-100
                                    "
                                />

                            </span>

                            <span className="flex h-5 w-5 items-center justify-center text-[18px] font-light text-[#9b8150] transition-transform duration-300 group-hover:rotate-90">
                                +
                            </span>

                        </Link>
                    )}

                </div>

                {/* DELIVERY METHOD */}
                <div className="mt-10">

                    <div className="mb-5">

                        <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                            The Journey
                        </p>

                        <h3 className="mt-2 font-serif text-[19px] tracking-tight">
                            Delivery Method
                        </h3>

                        <p className="mt-2 text-[9px] leading-5 text-[#99938a]">
                            Carefully delivered according to our standard
                            service.
                        </p>

                    </div>


                    <div className="group relative overflow-hidden border border-[#d8d3c9] bg-[#faf9f6] px-7 py-6 transition-colors duration-500 hover:border-[#b7aa91]">

                        <span className="absolute left-0 top-0 h-full w-0.5 bg-[#9b8150] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />


                        <div className="flex items-start justify-between gap-8 max-md:flex-col max-md:gap-5">

                            <div className="shrink-0">

                                <p className="text-[8px] uppercase tracking-[0.35em] text-[#9b8150]">
                                    Standard Service
                                </p>

                                <h4 className="mt-2 font-serif text-[17px] tracking-tight text-[#25231f]">
                                    Standard Delivery
                                </h4>

                                <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-[#777168]">
                                    1-5 Days
                                </p>

                            </div>


                            <div className="flex items-center gap-6 max-md:w-full max-md:justify-between">

                                <div className="h-px w-10 bg-[#d4cfc5] max-md:hidden" />

                                <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b8150]">
                                    Complimentary
                                </p>

                            </div>


                            <p className="max-w-sm text-[9px] leading-5 text-[#858077]">
                                Estimated delivery within 1-5 days.
                                Delivery between 8 am and 8 pm, Monday to
                                Saturday. A signature will be required upon
                                delivery.
                            </p>

                        </div>

                    </div>

                </div>

                {/* CONTINUE */}
                <button
                    type="button"
                    onClick={() => {
                        const address = addresses.find(
                            (a) => a.id === selected
                        );

                        if (!address) return;

                        setShippingData(address);
                        setCurrentStep(2);
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
                        Continue to Packaging
                    </span>

                    <span className="relative z-10 ml-3 translate-x-1 text-[#c4a66a] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                        →
                    </span>

                    <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-700 group-hover:scale-x-100" />

                </button>

            </form>

            {/* STEP 02 — PACKAGING PREVIEW  */}
            <div className="mt-5 border border-[#d8d3c9] bg-[#efede7] px-7 py-6">

                <div className="flex items-center gap-5">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#bdb7ac] text-[10px] text-[#8f8980]">
                        02
                    </div>

                    <div>

                        <p className="text-[8px] uppercase tracking-[0.4em] text-[#aaa49b]">
                            Next Step
                        </p>

                        <h3 className="mt-2 font-serif text-[21px] tracking-tight text-[#77736b]">
                            Packaging & Gifting
                        </h3>

                        <p className="mt-1 text-[9px] text-[#aaa49b]">
                            Signature Box · Boutique Shopping Bag
                        </p>

                    </div>

                </div>

            </div>

            {/* STEP 03 — PAYMENT PREVIEW */}
            <div className="mt-4 border border-[#d8d3c9] bg-[#efede7] px-7 py-6">

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
                            Cash on Delivery · Online Payment
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
