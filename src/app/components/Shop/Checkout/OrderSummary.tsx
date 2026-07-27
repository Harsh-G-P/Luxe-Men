"use client";

import Image from "next/image";
import { ShoppingBag, LoaderCircle } from "lucide-react";
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
            <aside className="self-start border border-[#e5e5e5] bg-white p-12">
                <div className="flex items-center justify-center">
                    <LoaderCircle className="h-8 w-8 animate-spin text-neutral-500" />
                </div>
            </aside>
        );
    }

    if (!cart) {
        return null;
    }

    return (
        <aside className="self-start border border-[#e5e5e5] bg-white">

            {/* Header */}
            <div className="px-8 py-5">
                <h2 className="text-center text-[12px] font-semibold uppercase tracking-[0.12em]">
                    Order Summary
                </h2>

                <div className="mt-1 flex items-center justify-center gap-2">
                    <ShoppingBag className="h-4 w-4" />

                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em]">
                        {cart?.items.length ?? 0} Item{(cart?.items.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                </div>
                <div className="mt-7 border-b border-[#e5e5e5]" />
            </div>

            {/* Product */}
            <div className="max-h-70 overflow-y-auto px-4 py-7 pt-2 space-y-5 no-scrollbar">
                {cart.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4 rounded-sm border-b h-44 border-[#e5e5e5] p-4 mb-4 last:mb-0"
                    >

                        <div className="relative h-12 w-12 bg-[#fafafa]">
                            <Image
                                src={item.product.images[0]}
                                alt={item.product.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1">

                            <div className="flex items-start justify-between ">

                                <h4 className="flex-1 text-[10px] font-bold uppercase leading-5">
                                    {item.product.title}
                                </h4>

                                <span className="whitespace-nowrap text-[12px] text-[#555] font-medium">
                                    QTY: {item.quantity}
                                </span>

                            </div>

                            <p className="mt-2 text-[11px] text-[#6f6f6f]">
                                Style: {item.variant?.sku}
                            </p>

                            {item.variant &&
                                Object.entries(item.variant.attributes).map(([key, value]) => (
                                    <p
                                        key={key}
                                        className="text-[11px] text-[#6f6f6f]"
                                    >
                                        {key}: {value}
                                    </p>
                                ))}


                            <div className="mt-5 flex justify-between gap-3 pb-1">
                                <p className="text-[11px] leading-4 text-[#555]">
                                    Enjoy complimentary delivery or Collect In Store.
                                </p>

                                <span className="whitespace-nowrap text-[12px] font-medium">
                                    ${item.total.toFixed(2)}
                                </span>
                            </div>

                        </div>

                    </div>
                ))}

            </div>

            {/* Price */}
            <div className="border-t border-[#e5e5e5] px-5 py-6">

                <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-medium">${cart?.subtotal.toFixed(2) ?? "0.00"}</span>
                </div>

                <div className="mt-4 flex items-center justify-between text-[12px]">
                    <span className="font-medium">Shipping</span>
                    <span className="font-medium">Free (Standard Delivery)</span>
                </div>

                <div className="mt-4 flex items-center justify-between text-[12px]">
                    <span className="font-medium">Estimated Tax</span>
                    <span className="font-medium">$0</span>
                </div>

                <div className="flex mt-4 items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                        Estimated Total
                    </span>

                    <span className="text-[13px] font-semibold">
                        ${cart?.subtotal.toFixed(2) ?? "0.00"}
                    </span>
                </div>

            </div>

            {/* View Details */}
            <details className="border-t border-[#e5e5e5] group">

                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">

                    <span className="relative inline-block">
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
                    bg-black
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-x-100
                "
                        />
                    </span>

                    <span className="relative h-5 w-5">

                        {/* Plus */}
                        <span
                            className=" absolute inset-0 flex items-center justify-center text-[20px] font-light transition-opacity duration-200 group-open:opacity-0"
                        >
                            +
                        </span>

                        {/* Minus */}
                        <span
                            className=" absolute inset-0 flex items-center justify-center text-[20px] font-light opacity-0 transition-opacity duration-200 group-open:opacity-100"
                        >
                            −
                        </span>

                    </span>

                </summary>

                <p className="px-8 pb-5 text-[11px] leading-5 text-[#666]">
                    You will be charged at the time of shipment. If this is a personalized
                    or made-to-order purchase, you will be charged at the time of purchase.
                </p>

            </details>

        </aside>
    );
}