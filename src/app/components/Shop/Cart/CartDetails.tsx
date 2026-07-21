"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
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
        attributes: Record<string, string>;
        stock: number;
    } | null;
};

export default function CartDetails() {
    const [openId, setOpenId] = useState<string | null>(null);
    const qtyRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [removeId, setRemoveId] = useState<string | null>(null);

    const [items, setItems] = useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch("/api/cart");

                const data = await res.json();

                if (!res.ok) {
                    return;
                }

                if (data.success) {
                    setItems(data.data.items);
                    setSubtotal(data.data.subtotal);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const clickedOutside =
                openId &&
                qtyRefs.current[openId] &&
                !qtyRefs.current[openId]!.contains(e.target as Node);

            if (clickedOutside) setOpenId(null);
        };

        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [openId]);

    const handleQtyChange = (id: string, qty: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: qty } : item
            )
        );
        setOpenId(null);
    };

    const handleDelete = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    if (loading) {
    return (
        <div className="w-full bg-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="flex flex-col items-center justify-center py-40">

                    <div className="w-10 h-10 border border-gray-300 border-t-black rounded-full animate-spin"></div>

                    <p className="mt-8 text-xs uppercase tracking-[0.35em] text-gray-500">
                        Loading Your Shopping Bag
                    </p>

                </div>

            </div>
        </div>
    );
}

    return (
        <div className="w-full bg-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-20">

                {items.length === 0 ? (
                    <div className="lg:col-span-2 py-28">

                        <div className="max-w-5xl mx-auto flex items-center justify-between">

                            {/* Left */}
                            <div className="hidden lg:flex flex-col items-end w-60">
                                <div className="w-32 h-px bg-gray-300 mb-6"></div>
                                <p className="text-[11px] uppercase tracking-[0.35em] text-gray-400">
                                    Curated
                                </p>
                                <p className="mt-2 text-xs text-gray-500 text-right leading-6">
                                    Exceptional craftsmanship.<br />
                                    Timeless elegance.
                                </p>
                            </div>

                            {/* Center */}
                            <div className="text-center max-w-xl px-8">

                                <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                                    Shopping Bag
                                </p>

                                <h2 className="mt-6 font-serif text-4xl md:text-6xl">
                                    Your Bag Is Empty
                                </h2>

                                <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-gray-500">
                                    Your shopping bag is waiting to be filled with timeless pieces,
                                    refined tailoring, and elevated essentials crafted for every
                                    occasion.
                                </p>

                                <Link href="/collections">
                                    <button className="mt-10 bg-black text-white px-12 py-4 text-xs tracking-[0.3em] uppercase hover:bg-neutral-800 transition">
                                        Continue Shopping
                                    </button>
                                </Link>

                            </div>

                            {/* Right */}
                            <div className="hidden lg:flex flex-col w-60">
                                <div className="w-32 h-px bg-gray-300 mb-6"></div>
                                <p className="text-[11px] uppercase tracking-[0.35em] text-gray-400">
                                    Maison
                                </p>
                                <p className="mt-2 text-xs text-gray-500 leading-6">
                                    Complimentary delivery.<br />
                                    Signature packaging.
                                </p>
                            </div>

                        </div>

                    </div>
                ) : (
                    <>
                        {/* LEFT */}
                        <div>
                            <h2 className="text-xs font-bold tracking-widest mb-3">YOUR SELECTIONS</h2>

                            <div className="space-y-12">
                                {items.map(item => {

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex flex-col md:flex-row gap-6 md:gap-10 border-b border-gray-200 py-6 md:py-8 first:border-t"
                                        >

                                            {/* IMAGE */}
                                            <div className="relative w-full md:w-44 h-36 shrink-0">
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 176px, 176px"
                                                    className="object-contain"
                                                />
                                            </div>

                                            {/* DETAILS */}
                                            <div className="flex-1 space-y-2 text-sm mt-4 md:mt-0">
                                                <p className="text-base font-medium">{item.product.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    Style #{item.product.slug}
                                                </p>

                                                <div className="text-xs text-gray-500 space-y-1">
                                                    {Object.entries(
                                                        (item.variant?.attributes as Record<string, string>) ?? {}
                                                    ).map(([key, value]) => (
                                                        <p key={key}>
                                                            {key}: {value}
                                                        </p>
                                                    ))}
                                                </div>

                                                <p className="text-xs text-gray-600 mt-2">
                                                    Available for delivery or collect in store
                                                </p>

                                                <button
                                                    onClick={() => setRemoveId(item.id!)}
                                                    className="relative text-xs mt-3 tracking-widest text-black after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-px after:bg-black after:origin-left after:scale-x-100 after:transition-transform after:duration-300 hover:after:scale-x-0 after:transform hover:font-bold"
                                                >
                                                    REMOVE
                                                </button>


                                                {removeId && (
                                                    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                                        <div className="bg-white w-[90%] max-w-105 p-6 sm:p-10 text-center shadow-2xl animate-fadeIn">
                                                            <h3 className="text-sm tracking-widest font-semibold uppercase mb-4">
                                                                Remove Item
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mb-8">
                                                                Are you sure you want to remove this item from your shopping bag?
                                                            </p>
                                                            <div className="flex flex-col sm:flex-row gap-4">
                                                                <button
                                                                    onClick={() => setRemoveId(null)}
                                                                    className="flex-1 border border-gray-300 py-3 text-xs tracking-widest hover:bg-gray-100 transition"
                                                                >
                                                                    CANCEL
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        handleDelete(removeId!);
                                                                        setRemoveId(null);
                                                                    }}
                                                                    className="flex-1 bg-black text-white py-3 text-xs tracking-widest hover:bg-gray-900 transition"
                                                                >
                                                                    REMOVE
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* RIGHT: QTY & PRICE (unchanged for all screens) */}
                                            <div className="flex items-center justify-between w-60 gap-4 text-sm mt-4 md:mt-0">
                                                {/* QTY */}
                                                <div
                                                    ref={(el: HTMLDivElement | null) => {
                                                        qtyRefs.current[item.id!] = el;
                                                    }}
                                                    className="relative w-28 h- text-xs"
                                                >
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenId(prev => prev === item.id ? null : item.id!);
                                                        }}
                                                        className="flex items-center gap-2 p-3 border border-gray-200 cursor-pointer bg-white"
                                                    >
                                                        <span className="text-gray-500 flex-1 font-semibold text-center">
                                                            QTY: {item.quantity}
                                                        </span>
                                                        <svg
                                                            className={`w-3 h-3 transition-transform text-black ${openId === item.id ? "rotate-180" : ""
                                                                }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={3}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </div>

                                                    {openId === item.id && (
                                                        <div
                                                            className="absolute w-full bg-white border shadow border-gray-200 z-50 max-h-40 overflow-y-auto"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {Array.from({ length: 99 }, (_, i) => i + 1).map(q => (
                                                                <div
                                                                    key={q}
                                                                    onClick={() => handleQtyChange(item.id!, q)}
                                                                    className={`p-3 text-center cursor-pointer hover:bg-gray-100 ${q === item.quantity ? "bg-gray-200 font-semibold" : ""
                                                                        }`}
                                                                >
                                                                    {q}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* PRICE */}
                                                <p className="whitespace-nowrap">
                                                    ${item.total.toLocaleString()}
                                                </p>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT SUMMARY */}
                        <div className="border border-gray-200 p-10 h-125 bg-white max-w-md mx-auto">
                            {/* Header */}
                            <h3 className="text-xs tracking-widest mb-2 font-semibold text-gray-800 uppercase">
                                ORDER SUMMARY
                            </h3>
                            <p className="text-[10px] font-semibold text-gray-400 mb-6 tracking-wide">
                                USCART420125655
                            </p>
                            <div className="h-px w-full bg-gray-300 mb-4"></div>
                            {/* Subtotal */}
                            <div className="flex justify-between mb-3">
                                <span className="text-gray-500 uppercase tracking-wide text-xs">Subtotal</span>
                                <span className="text-gray-900 text-xs font-medium">${subtotal.toLocaleString()}</span>
                            </div>

                            {/* Shipping */}
                            <div className="flex justify-between mb-3">
                                <span className="text-gray-500 uppercase tracking-wide text-xs">Shipping</span>
                                <span className="text-gray-700 text-xs">Free (Premium Express)</span>
                            </div>

                            {/* Estimated Tax */}
                            <div className="flex justify-between mb-3">
                                <span className="text-gray-500 uppercase tracking-wide text-xs">Estimated Tax</span>
                                <button className="text-gray-700 text-xs underline">Calculate</button>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-300 pt-4 flex justify-between items-center mb-3">
                                <span className="uppercase tracking-widest font-bold text-gray-800 text-xs">Estimated Total</span>
                                <span className="text-xs font-bold text-gray-900">${subtotal.toLocaleString()}</span>
                            </div>

                            {/* View Details */}
                            <button className="text-gray-700 text-xs underline mb-4">
                                VIEW DETAILS
                            </button>

                            {/* Info note */}
                            <p className="text-[10px] text-gray-400 tracking-wide">
                                You will be charged at the time of shipment. If this is a personalized or made-to-order purchase, you will be charged at the time of purchase.
                            </p>

                            {/* Checkout Button */}
                            <Link href="/checkout">
                                <button className="mt-8 w-full bg-black text-white py-4 text-sm tracking-widest uppercase shadow-lg hover:bg-gray-900 transition-all duration-300">
                                    CHECKOUT
                                </button>
                            </Link>

                            {/* Optional Gold Accent Line */}
                            <div className="mt-6 h-0.5 w-full bg-linear-to-r from-transparent via-yellow-500 to-transparent"></div>
                        </div>

                    </>
                )}

            </div>
        </div>
    );
}