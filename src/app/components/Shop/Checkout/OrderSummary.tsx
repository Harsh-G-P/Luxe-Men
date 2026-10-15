"use client";

import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Cart = {
    cartId: string;
    subtotal: number;
    items: {
        id: string;
        quantity: number;
        price: number;
        total: number;
        product: {
            id: string;
            title: string;
            slug: string;
            images: string[];
        };
        variant: {
            id: string;
            sku: string | null;
            attributes: Record<string, string>;
            stock: number;
        } | null;
    }[];
};


export default function OrderSummary() {

    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true)

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart", {
                method: "GET"
            })
            const data = await res.json()

            if (!res.ok) return

            if (data.success) {
                setCart(data.data)
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);



    if (loading) {
        return (
            <aside className="self-start border border-[#d8d3c9] bg-[#faf9f6] p-10">
                <div className="flex min-h-45 flex-col items-center justify-center">

                    <div className="flex items-center gap-3">
                        <span className="h-px w-6 bg-[#d1cbc1]" />

                        <span className="text-[7px] uppercase tracking-[0.45em] text-[#9b8150]">
                            LUXE MEN
                        </span>

                        <span className="h-px w-6 bg-[#d1cbc1]" />
                    </div>

                    <div className="mt-5 h-px w-16 overflow-hidden bg-[#ded9d0]">
                        <div className="h-full w-1/2 animate-[luxuryLoading_1.5s_ease-in-out_infinite] bg-[#9b8150]" />
                    </div>

                    <p className="mt-3 text-[7px] uppercase tracking-[0.3em] text-[#aaa49b]">
                        Preparing Summary
                    </p>

                </div>
            </aside>
        );
    }


    if (!cart) {
        return null;
    }

    return (
        <aside className="self-start lg:sticky lg:top-16">

            <div className="relative overflow-hidden border border-[#d7d2c8] bg-[#f1eee7] text-[#111111]">

                {/* Decorative Architecture */}
                <div className="pointer-events-none absolute right-0 top-0 h-27 w-28 border-b border-l border-[#b99a62]/30" />

                <div className="pointer-events-none absolute right-5 top-5 h-12 w-12 border-r border-t border-[#b99a62]/20" />

                <div className="relative">

                    {/* HEADER */}
                    <div className="px-7 pb-7 pt-7">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-[8px] uppercase tracking-[0.45em] text-[#9b8150]">
                                    Your Selection
                                </p>

                                <h2 className="mt-3 font-serif text-[29px] leading-none tracking-tight text-[#1c1b18]">
                                    Order Summary
                                </h2>
                            </div>

                            <span className="font-serif text-[19px] italic text-[#9b8150]">
                                LM
                            </span>

                        </div>

                        {/* Header Divider */}
                        <div className="mt-7 flex items-center gap-4">

                            <span className="h-px w-9 bg-[#bdb6a9]" />

                            <span className="text-[7px] uppercase tracking-[0.4em] text-[#99938a]">
                                LUXE MEN
                            </span>

                            <span className="h-px flex-1 bg-[#d0cbc1]" />

                        </div>

                    </div>


                    {/* PRODUCTS */}
                    <div className="max-h-86 overflow-y-auto px-7 no-scrollbar">

                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="border-t border-[#d3cec4] py-6 last:border-b"
                            >

                                <div className="flex gap-5">

                                    {/* PRODUCT IMAGE */}
                                    <div className="relative h-17 w-17 shrink-0 overflow-hidden bg-[#e6e2d9]">

                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.title}
                                            fill
                                            sizes="68px"
                                            className="object-cover"
                                        />

                                    </div>


                                    {/* PRODUCT INFORMATION */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-start justify-between gap-3">

                                            <h4 className="font-serif text-[14px] leading-[1.4] tracking-tight text-[#24231f]">
                                                {item.product.title}
                                            </h4>

                                            <span className="shrink-0 pt-1 text-[8px] uppercase tracking-[0.2em] text-[#8e897f]">
                                                × {item.quantity}
                                            </span>

                                        </div>


                                        {/* VARIANT */}
                                        {item.variant && (
                                            <div className="mt-3 space-y-1">

                                                <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                                                    {item.variant.sku}
                                                </p>

                                                {Object.entries(item.variant.attributes).map(
                                                    ([key, value]) => (
                                                        <p
                                                            key={key}
                                                            className="text-[9px] capitalize tracking-[0.03em] text-[#77736b]"
                                                        >
                                                            {key}: {value}
                                                        </p>
                                                    )
                                                )}

                                            </div>
                                        )}


                                        {/* PRODUCT FOOTER */}
                                        <div className="mt-5 flex items-end justify-between gap-3">

                                            <p className="text-[8px] leading-[1.7] text-[#918c83]">
                                                Complimentary delivery
                                                <br />
                                                or Collect In Store.
                                            </p>

                                            <span className="whitespace-nowrap text-[11px] font-medium text-[#25241f]">
                                                ${item.total.toFixed(2)}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>


                    {/* PRICE SUMMARY */}
                    <div className="border-t border-[#d0cbc1] px-7 py-7">

                        <div className="space-y-5">

                            {/* SUBTOTAL */}
                            <div className="flex items-center justify-between">

                                <span className="text-[8px] uppercase tracking-[0.3em] text-[#77736b]">
                                    Subtotal
                                </span>

                                <span className="text-[11px] font-medium text-[#282722]">
                                    ${cart?.subtotal.toFixed(2) ?? "0.00"}
                                </span>

                            </div>


                            {/* DELIVERY */}
                            <div className="flex items-center justify-between">

                                <span className="text-[8px] uppercase tracking-[0.3em] text-[#77736b]">
                                    Delivery
                                </span>

                                <span className="text-[8px] uppercase tracking-[0.2em] text-[#5f6959]">
                                    Complimentary
                                </span>

                            </div>


                            {/* TAX */}
                            <div className="flex items-center justify-between">

                                <span className="text-[8px] uppercase tracking-[0.3em] text-[#77736b]">
                                    Tax
                                </span>

                                <span className="text-[10px] text-[#858077]">
                                    $0.00
                                </span>

                            </div>

                        </div>


                        {/* LUXURY DIVIDER */}
                        <div className="my-7 flex items-center gap-4">

                            <span className="h-px flex-1 bg-[#cbc5ba]" />

                            <span className="text-[7px] uppercase tracking-[0.4em] text-[#a49e94]">
                                LUXE MEN
                            </span>

                            <span className="h-px flex-1 bg-[#cbc5ba]" />

                        </div>


                        {/* TOTAL */}
                        <div className="flex items-end justify-between gap-4">

                            <div>

                                <p className="text-[8px] uppercase tracking-[0.35em] text-[#77736b]">
                                    Total
                                </p>

                                <p className="mt-2 text-[8px] tracking-[0.03em] text-[#a09b92]">
                                    Final amount for your selection
                                </p>

                            </div>

                            <p className="font-serif text-[22px] tracking-tight text-[#171614]">
                                ${cart?.subtotal.toFixed(2) ?? "0.00"}
                            </p>

                        </div>

                    </div>


                    {/* VIEW DETAILS */}
                    <details className="group border-t border-[#d0cbc1]">

                        <summary className="flex cursor-pointer list-none items-center justify-between px-7 py-5">

                            <span className="relative text-[8px] uppercase tracking-[0.35em] text-[#77736b]">

                                View Details

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


                            {/* PLUS / MINUS */}
                            <span className="relative h-4 w-4">

                                <span
                                    className="
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                font-serif
                                text-[17px]
                                font-light
                                text-[#9b8150]
                                transition-opacity
                                duration-300
                                group-open:opacity-0
                            "
                                >
                                    +
                                </span>

                                <span
                                    className="
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                font-serif
                                text-[17px]
                                font-light
                                text-[#9b8150]
                                opacity-0
                                transition-opacity
                                duration-300
                                group-open:opacity-100
                            "
                                >
                                    −
                                </span>

                            </span>

                        </summary>


                        {/* DETAILS CONTENT */}
                        <div className="px-7 pb-6">

                            <div className="border-t border-[#d0cbc1] pt-5">

                                <div className="space-y-4">

                                    {/* PIECES */}
                                    <div className="flex justify-between text-[9px]">

                                        <span className="text-[#918c83]">
                                            Pieces
                                        </span>

                                        <span className="text-[#34322d]">
                                            {cart?.items.length ?? 0}
                                        </span>

                                    </div>


                                    {/* SUBTOTAL */}
                                    <div className="flex justify-between text-[9px]">

                                        <span className="text-[#918c83]">
                                            Subtotal
                                        </span>

                                        <span className="text-[#34322d]">
                                            ${cart?.subtotal.toFixed(2) ?? "0.00"}
                                        </span>

                                    </div>


                                    {/* DELIVERY */}
                                    <div className="flex justify-between text-[9px]">

                                        <span className="text-[#918c83]">
                                            Delivery
                                        </span>

                                        <span className="uppercase tracking-[0.18em] text-[#5f6957]">
                                            Complimentary
                                        </span>

                                    </div>


                                    {/* TAX */}
                                    <div className="flex justify-between text-[9px]">

                                        <span className="text-[#918c83]">
                                            Tax
                                        </span>

                                        <span className="text-[#34322d]">
                                            $0.00
                                        </span>

                                    </div>


                                    {/* ARRIVAL */}
                                    <div className="flex justify-between text-[9px]">

                                        <span className="text-[#918c83]">
                                            Expected Arrival
                                        </span>

                                        <span className="text-[#34322d]">
                                            2–4 Business Days
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </details>


                    {/* INFORMATION PANEL */}
                    <div className="mx-7 my-7 border border-[#d2cdc2] bg-[#f7f4ed]/70 p-4">

                        <div className="flex gap-3">

                            <span className="mt-1.25 h-1.5 w-1.5 shrink-0 bg-[#9b8150]" />

                            <p className="text-[8px] leading-[1.8] tracking-[0.04em] text-[#77736b]">
                                Your selection is prepared with care,
                                presented in signature packaging and
                                delivered with our compliments.
                            </p>

                        </div>

                    </div>


                    {/* BRAND */}
                    <div className="flex items-center justify-center gap-4 px-7 py-7">

                        <span className="h-px w-8 bg-[#c9c3b8]" />

                        <span className="text-[7px] uppercase tracking-[0.4em] text-[#9a958b]">
                            Luxe Men
                        </span>

                        <span className="h-px w-8 bg-[#c9c3b8]" />

                    </div>

                </div>

            </div>


            {/* SERVICE FEATURES */}
            <div className="mt-8 grid grid-cols-3 border-t border-[#d8d4cb] pt-6">

                {/* DELIVERY */}
                <div className="px-2 text-center">

                    <p className="font-serif text-lg text-[#272622]">
                        01
                    </p>

                    <p className="mt-2 text-[7px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                        Signature Delivery
                    </p>

                    <p className="mt-2 text-[8px] leading-4 text-[#99948b]">
                        Arrives within
                        <br />
                        2–4 business days
                    </p>

                </div>


                {/* PACKAGING */}
                <div className="border-x border-[#d8d4cb] px-2 text-center">

                    <p className="font-serif text-lg text-[#272622]">
                        02
                    </p>

                    <p className="mt-2 text-[7px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                        Signature Presentation
                    </p>

                    <p className="mt-2 text-[8px] leading-4 text-[#99948b]">
                        Presented with
                        <br />
                        considered detail
                    </p>

                </div>


                {/* COLLECTION */}
                <div className="px-2 text-center">

                    <p className="font-serif text-lg text-[#272622]">
                        03
                    </p>

                    <p className="mt-2 text-[7px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                        Private Collection
                    </p>

                    <p className="mt-2 text-[8px] leading-4 text-[#99948b]">
                        Collect with
                        <br />
                        complete ease
                    </p>

                </div>

            </div>

        </aside>

    );


}