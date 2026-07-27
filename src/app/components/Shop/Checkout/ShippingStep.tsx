"use client"

import Link from "next/link";
import { useEffect, useState } from "react";



type AddressProps = {
    id: string
    fullname: string
    countryCode: string
    phone: string
    addressLine: string
    city: string
    state: string
    country: string
    postalCode: string
    isDefault: boolean

}

type Props = {
    selected: string;
    setSelected: (value: string) => void;
    setCurrentStep: (value: number) => void;
    setShippingData: (address: AddressProps) => void
};

export default function ShippingStep({
    selected,
    setSelected,
    setCurrentStep,
    setShippingData,
}: Props) {

    const [addresses, setAddresses] = useState<AddressProps[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/address", {
                method: "GET"
            })
            const data = await res.json()
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
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    if (loading) {
        return (
            <section>
                <div className="flex h-125 items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
                </div>
            </section>
        );
    }

    return (
        <section>
            <form>
                <div className="mb-8 flex items-center gap-5">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-[15px] font-bold">
                        1
                    </div>

                    <h2 className="text-2xl tracking-[0.19em] uppercase">
                        Shipping
                    </h2>

                </div>

                {/* Delivery Type */}
                <div className="mb-8 flex gap-10">
                    <label className="flex items-center gap-3 text-[14px]">
                        <input
                            type="radio"
                            defaultChecked
                            className="h-4 w-4 accent-black"
                        />
                        Home Delivery
                    </label>
                </div>

                {/* SAVED ADDRESSES */}
                <div>
                    <h3 className="mb-6 text-[14px] font-medium uppercase tracking-[0.18em] text-black">
                        Select Address
                    </h3>

                    {/* Addresses */}
                    {addresses.length === 0 ? (
                        <div className="rounded-sm border border-dashed border-neutral-300 px-6 py-12 text-center">
                            <p className="text-sm text-neutral-500">
                                No saved addresses found.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <label
                                    key={address.id}
                                    onClick={() => setSelected(address.id)}
                                    className={`relative flex cursor-pointer gap-5 rounded-sm border px-6 py-6 transition-all duration-300 ease-out ${selected === address.id
                                        ? "border-black bg-neutral-950 text-white shadow-lg"
                                        : "border-neutral-200 bg-white text-neutral-700 hover:-translate-y-0.5 hover:border-black hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        checked={selected === address.id}
                                        onChange={() => setSelected(address.id)}
                                        className="mt-1 h-4 w-4 accent-white"
                                    />

                                    <div className="flex-1 text-[13px] leading-7">
                                        <p
                                            className={`mb-1 text-[12px] font-semibold uppercase tracking-[0.18em] ${selected === address.id ? "text-white" : "text-black"}`}
                                        >
                                            {address.fullname}
                                        </p>

                                        <p
                                            className={
                                                selected === address.id ? "text-neutral-300" : "text-neutral-600"
                                            }
                                        >
                                            {address.addressLine}
                                        </p>

                                        <p
                                            className={
                                                selected === address.id ? "text-neutral-300" : "text-neutral-600"
                                            }
                                        >
                                            {address.city}, {address.state}, {address.postalCode}

                                        </p>

                                        <p
                                            className={
                                                selected === address.id ? "text-neutral-300" : "text-neutral-600"
                                            }
                                        >
                                            {address.country}
                                        </p>

                                        <p
                                            className={`mt-3 text-[12px] tracking-wide ${selected === address.id ? "text-neutral-400" : "text-neutral-500"
                                                }`}
                                        >
                                            {address.countryCode} {address.phone}
                                        </p>
                                    </div>

                                    {selected === address.id && (
                                        <span className="absolute right-5 top-5 text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                                            Selected
                                        </span>
                                    )}
                                </label>

                            ))}
                        </div>
                    )}

                    {/* Add New Address */}
                    <Link href={'/profile/addresses'}
                        className=" group mt-8 flex w-fit cursor-pointer items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
                    >
                        <span className="relative inline-block">
                            Add New Address

                            <span
                                className=" absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-500 ease-out group-hover:scale-x-100"
                            />
                        </span>

                        <span className="flex h-5 w-5 items-center justify-center text-[20px] font-light transition-transform duration-300 group-hover:rotate-90">
                            +
                        </span>
                    </Link>
                </div>

                {/* DELIVERY */}
                <div className="mt-12">

                    <h3 className="mb-4 text-[14px] font-medium uppercase tracking-[0.08em]">
                        Delivery Method
                    </h3>

                    <div className="flex items-center border border-neutral-300 px-10 py-6 max-md:flex-col max-md:items-start max-md:px-5 max-md:py-5">

                        {/* LEFT */}
                        <div className="flex items-center max-md:w-full max-md:justify-between">

                            <p className="text-[11px] whitespace-nowrap">
                                Standard Delivery
                            </p>

                            <span className="mx-4 ms-32 text-[11px] font-bold max-md:mx-0 max-md:ms-0">
                                -
                            </span>

                            <p className="text-[11px] font-bold whitespace-nowrap">
                                Free
                            </p>

                        </div>


                        {/* RIGHT */}
                        <p className="ml-20 text-[10px] leading-4 max-md:ml-0 max-md:mt-5">
                            Estimated delivery within 1–5 days.
                            Delivery between 8 am and 8 pm,
                            Monday to Saturday.
                            A signature will be required upon delivery.
                        </p>


                    </div>

                </div>

                {/* BUTTON */}
                <button
                    type="button"
                    onClick={() => {
                        const address = addresses.find((a) => a.id === selected);

                        if (!address) return;

                        setShippingData(address);
                        setCurrentStep(2);
                    }}
                    className="mt-10 h-13 bg-black px-10 text-[13px] uppercase tracking-[0.08em] text-white transition hover:bg-neutral-800">
                    Continue to Packaging
                </button>

            </form>

            {/* STEP 2 */}
            <div className="mt-14 border border-neutral-200 bg-neutral-200 px-6 py-7">

                <div className="flex items-center gap-5">

                    <div className="mb-4 flex items-center gap-5">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-[15px] font-bold">
                            2
                        </div>

                    </div>

                    <div>
                        <h3 className="text-2xl uppercase tracking-wide text-gray-500 max-md:text-lg">
                            Packaging & Gifting
                        </h3>

                        <p className="mt-1 text-[13px] text-neutral-500 max-md:text-[11px]">
                            Signature Box, Boutique Shopping Bag
                        </p>

                    </div>

                </div>

            </div>


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