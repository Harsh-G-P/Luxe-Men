"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
}

type CartItem = {
    id: string;
    quantity: number;
    total: number;
    product: {
        title: string;
        slug: string;
        images: string[];
    };
    variant: {
        sku: string | null;
        attributes: Record<string, string>;
    } | null;
};

export default function MiniCart({ open, onClose }: Props) {

    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const cartRef = useRef<HTMLDivElement>(null);

    const fetchCart = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/cart");

            const data = await res.json();

            if (res.ok && data.success) {
                setItems(data.data.items);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchCart();
        }
    }, [open]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            const cartButtons = [
                document.getElementById("shopping-bag-btn-desktop"),
                document.getElementById("shopping-bag-btn-mobile"),
            ];

            if (
                cartRef.current &&
                !cartRef.current.contains(target) &&
                !cartButtons.some((btn) => btn?.contains(target))
            ) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);

    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/30"
                />
            )}

            {/* Mini Cart */}
            <div
                ref={cartRef}
                onClick={(e) => e.stopPropagation()}
                className={`fixed right-0 top-16 z-50 w-full md:w-105 bg-white md:right-22 shadow-2xl border transition-all duration-300 ${open
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0 pointer-events-none"
                    }`}
            >
                {/* Header */}
                <div className="relative flex items-center justify-between border-b border-gray-200 px-8 py-5">
                    <p className="absolute left-1/2 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.25em]">
                        ADDED TO SHOPPING BAG
                    </p>

                    <button
                        onClick={onClose}
                        className="ml-auto text-2xl font-light text-gray-500 transition hover:text-black"
                    >
                        ×
                    </button>
                </div>

                {/* Items */}
                <div className="h-46 overflow-y-auto divide-y divide-gray-300 scrollbar-thin">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-xs tracking-[0.25em] text-gray-500 uppercase">
                                Loading...
                            </p>
                        </div>
                    ) : (
                        <>
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-7 h-46">
                                    <div className="relative w-32 h-32">
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.title}
                                            fill
                                            sizes="(max-width:768px) 100vw,112px"
                                            className="object-contain"
                                        />
                                    </div>

                                    <div className="flex-1 text-sm">
                                        <p className="text-md font-bold">{item.product.title}</p>
                                        <p className="mt-2 text-sm font-light">${(item.total / item.quantity).toFixed(2)}</p>
                                        <p className="mt-4 text-[11px] text-gray-500">
                                            Style: {item.variant?.sku}
                                        </p>
                                        <p className="mt-1 text-[11px] font-light">
                                            Quantity: {item.quantity}
                                        </p>
                                        {item.variant?.attributes &&
                                            Object.entries(item.variant.attributes).map(([key, value]) => (
                                                <p
                                                    key={key}
                                                    className="mt-1 text-[10px]  text-gray-500"
                                                >
                                                    {key}: {value}
                                                </p>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))}

                            {!items.length && (
                                <p className="px-8 py-16 text-center text-sm tracking-wide text-gray-500">
                                    Your shopping bag is empty
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="space-y-4 border-t border-gray-200 px-8 py-6">
                    <Link href="/checkout" onClick={onClose}>
                        <button className="w-full bg-black py-3.5 text-[11px] tracking-[0.3em] mt-3 text-white transition hover:bg-gray-800">
                            CHECKOUT
                        </button>
                    </Link>

                    <Link href="/cart" onClick={onClose}>
                        <button className="w-full border border-black py-3 text-[11px] tracking-[0.3em] mt-3 transition hover:bg-black hover:text-white">
                            VIEW SHOPPING BAG
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}