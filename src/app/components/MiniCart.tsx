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
    price: number;
    total: number;

    stock: number;
    isOutOfStock: boolean;
    exceedsStock: boolean;
    isAvailable: boolean;

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

    // Refresh MiniCart when cart changes elsewhere
    useEffect(() => {
        const handleCartUpdated = () => {
            if (open) {
                fetchCart();
            }
        };

        window.addEventListener("cartUpdated", handleCartUpdated);

        return () => {
            window.removeEventListener(
                "cartUpdated",
                handleCartUpdated
            );
        };
    }, [open]);

    // Close when clicking outside
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

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [open, onClose]);

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = items.reduce(
        (total, item) => total + item.total,
        0
    );

    // Same validation logic as CartDetails
    const hasUnavailableItems = items.some(
        (item) => item.isOutOfStock || item.exceedsStock
    );

    const formatPrice = (price: number) =>
        price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    return (
        <>
            {/* Luxury Backdrop */}
            <div
                onClick={onClose}
                className={` fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-all duration-500 ${open
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                    }
                `}
            />

            {/* MINI CART */}
            <div
                ref={cartRef}
                onClick={(e) => e.stopPropagation()}
                className={` fixed right-4 top-19 z-50 w-[calc(100%-32px)] max-w-110 overflow-hidden border border-[#d8d3c8] bg-[#f5f4ef] shadow-[0_25px_70px_rgba(35,32,26,0.16)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:right-8 lg:right-14 ${open
                        ? "translate-y-0 scale-100 opacity-100"
                        : "-translate-y-3 scale-[0.98] pointer-events-none opacity-0"
                    }
                `}
            >
                {/* Decorative top line */}
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-linear-to-r from-transparent via-[#a1875b] to-transparent" />

                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-[#ddd9d0] px-6 py-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="h-px w-7 bg-[#c9c1b2]" />

                            <p className="text-[8px] uppercase tracking-[0.38em] text-[#9b8150]">
                                Luxe Men
                            </p>

                            <span className="h-px w-7 bg-[#c9c1b2]" />
                        </div>

                        <h3 className="mt-2 font-serif text-[22px] tracking-tight text-[#201f1c]">
                            Shopping Bag
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close shopping bag"
                        className=" flex h-8 w-8 items-center justify-center border border-[#d5d0c6] text-[18px] font-light text-[#5d5951] transition-all duration-300 hover:border-[#171614] hover:bg-[#171614] hover:text-white"
                    >
                        ×
                    </button>
                </div>

                {/* UNAVAILABLE WARNING */}
                {!loading && hasUnavailableItems && (
                    <div className="border-b border-[#d8b5ad]/70 bg-[#f4e8e5]/70 px-6 py-4">
                        <div className="flex gap-3">
                            <span className="mt-1.25 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a65d52]" />

                            <div>
                                <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-[#8f5047]">
                                    Attention Required
                                </p>

                                <p className="mt-1.5 text-[9px] leading-5 text-[#8f625b]">
                                    One or more pieces in your bag are
                                    unavailable or exceed current stock.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ITEM COUNT */}
                {!loading && items.length > 0 && (
                    <div className="flex items-center justify-between border-b border-[#e1ddd5] px-6 py-3">
                        <p className="text-[8px] uppercase tracking-[0.28em] text-[#8c877e]">
                            Your Selection
                        </p>

                        <p className="text-[8px] uppercase tracking-[0.25em] text-[#9b8150]">
                            {totalItems.toString().padStart(2, "0")}{" "}
                            {totalItems === 1 ? "Piece" : "Pieces"}
                        </p>
                    </div>
                )}

                {/* ITEMS */}
                <div
                    className={`
                        overflow-y-auto
                        scrollbar-thin
                        scrollbar-track-transparent
                        scrollbar-thumb-[#c8c1b5]
                        ${items.length > 2
                            ? "max-h-70"
                            : "max-h-77.5"
                        }
                    `}
                >
                    {loading ? (
                        <div className="flex h-70 items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center gap-2">
                                    <span className="h-px w-8 bg-[#d0c9bc]" />

                                    <span className="h-1.5 w-1.5 rounded-full bg-[#a1875b]" />

                                    <span className="h-px w-8 bg-[#d0c9bc]" />
                                </div>

                                <p className="mt-5 text-[8px] uppercase tracking-[0.4em] text-[#817b70]">
                                    Preparing Your Collection
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {items.map((item) => {
                                const isUnavailable =
                                    item.isOutOfStock ||
                                    item.exceedsStock;

                                return (
                                    <div
                                        key={item.id}
                                        className={` group border-b border-[#e0dcd4] px-6 py-4 ${isUnavailable
                                                ? "bg-[#f5eeeb]/60"
                                                : ""
                                            }
                                        `}
                                    >
                                        <div className="flex gap-4">

                                            {/* IMAGE */}
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                onClick={onClose}
                                                className={` relative h-26.25 w-22 shrink-0 overflow-hidden bg-[#eeece6] ${isUnavailable
                                                        ? "opacity-55"
                                                        : ""
                                                    }
                                                `}
                                            >
                                                <Image
                                                    src={
                                                        item.product.images[0]
                                                    }
                                                    alt={
                                                        item.product.title
                                                    }
                                                    fill
                                                    sizes="88px"
                                                    className=" object-contain p-2 transition-transform duration-700 group-hover:scale-[1.04]
                                                    "
                                                />

                                                <span className="absolute left-2 top-2 text-[6px] uppercase tracking-[0.2em] text-[#858078]">
                                                    LM
                                                </span>
                                            </Link>

                                            {/* DETAILS */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="mb-1 text-[7px] uppercase tracking-[0.24em] text-[#9b8150]">
                                                            Selected Piece
                                                        </p>

                                                        <Link
                                                            href={`/product/${item.product.slug}`}
                                                            onClick={onClose}
                                                            className={` block truncate font-serif text-[17px] leading-tight transition-colors ${isUnavailable
                                                                    ? "text-[#77736b]"
                                                                    : "text-[#272522] hover:text-[#9b8150]"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                item.product
                                                                    .title
                                                            }
                                                        </Link>
                                                    </div>

                                                    <p className="shrink-0 text-[13px] text-[#272522]">
                                                        $
                                                        {formatPrice(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>

                                                {item.variant?.sku && (
                                                    <p className="mt-2 text-[7px] uppercase tracking-[0.2em] text-[#9a958b]">
                                                        Style:{" "}
                                                        {
                                                            item.variant
                                                                .sku
                                                        }
                                                    </p>
                                                )}

                                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                                                    <p className="text-[8px] uppercase tracking-[0.14em] text-[#77736b]">
                                                        Qty{" "}
                                                        <span className="text-[#272522]">
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>
                                                    </p>

                                                    {Object.entries(
                                                        item.variant
                                                            ?.attributes ?? {}
                                                    )
                                                        .slice(0, 2)
                                                        .map(
                                                            (
                                                                [
                                                                    key,
                                                                    value,
                                                                ]
                                                            ) => (
                                                                <p
                                                                    key={key}
                                                                    className="text-[8px] uppercase tracking-[0.12em] text-[#77736b]"
                                                                >
                                                                    {key}:{" "}
                                                                    <span className="text-[#272522]">
                                                                        {
                                                                            value
                                                                        }
                                                                    </span>
                                                                </p>
                                                            )
                                                        )}
                                                </div>

                                                {/* AVAILABILITY */}
                                                {item.isOutOfStock ? (
                                                    <div className="mt-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="h-1 w-1 rounded-full bg-[#a65d52]" />

                                                            <span className="text-[7px] uppercase tracking-[0.2em] text-[#a65d52]">
                                                                Out of Stock
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 text-[8px] leading-4 text-[#a65d52]/80">
                                                            This piece is
                                                            currently
                                                            unavailable.
                                                        </p>
                                                    </div>
                                                ) : item.exceedsStock ? (
                                                    <div className="mt-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="h-1 w-1 rounded-full bg-[#9b8150]" />

                                                            <span className="text-[7px] uppercase tracking-[0.2em] text-[#9b8150]">
                                                                Limited
                                                                Availability
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 text-[8px] leading-4 text-[#9b8150]">
                                                            Only{" "}
                                                            {item.stock}{" "}
                                                            {item.stock === 1
                                                                ? "piece"
                                                                : "pieces"}{" "}
                                                            remain.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <span className="h-1 w-1 rounded-full bg-[#75836c]" />

                                                        <span className="text-[7px] uppercase tracking-[0.2em] text-[#77736b]">
                                                            Available
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* EMPTY */}
                            {!items.length && (
                                <div className="flex min-h-65 flex-col items-center justify-center px-8 text-center">
                                    <div className="mb-6 flex items-center gap-3">
                                        <span className="h-px w-9 bg-[#d0cbc1]" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#9b8150]" />
                                        <span className="h-px w-9 bg-[#d0cbc1]" />
                                    </div>

                                    <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                                        The Collection Awaits
                                    </p>

                                    <h4 className="mt-3 font-serif text-2xl text-[#272522]">
                                        Your Bag Is Empty
                                    </h4>

                                    <p className="mt-3 max-w-65 text-[9px] leading-5 text-[#817c73]">
                                        Discover refined pieces designed for
                                        an enduring wardrobe.
                                    </p>

                                    <Link
                                        href="/collections"
                                        onClick={onClose}
                                        className=" mt-6 border-b border-[#171614] pb-1 text-[8px] uppercase tracking-[0.3em] text-[#272522] transition-colors hover:border-[#9b8150] hover:text-[#9b8150]
                                        "
                                    >
                                        Explore Collection
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* FOOTER */}
                {!loading && items.length > 0 && (
                    <div className="border-t border-[#d5d0c6] bg-[#f5f4ef] px-6 py-5">

                        {/* SUBTOTAL */}
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.28em] text-[#77736b]">
                                    Estimated Total
                                </p>

                                <p className="mt-1 text-[7px] text-[#a19b91]">
                                    Complimentary delivery
                                </p>
                            </div>

                            <p className="font-serif text-[22px] tracking-tight text-[#171614]">
                                ${formatPrice(subtotal)}
                            </p>
                        </div>

                        {hasUnavailableItems ? (
                            <>
                                {/* OUT OF STOCK ACTION */}
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className=" group relative mt-5 flex w-full items-center justify-center overflow-hidden bg-[#171614] py-3.5 text-[8px] font-medium uppercase tracking-[0.35em] text-white transition-colors duration-500 hover:bg-[#3e3534]"
                                >

                                    <span className="relative z-10">
                                        Review Your Selection
                                    </span>

                                    <span className=" relative z-10 ml-2 translate-x-1 text-[#c4a66a] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                                        →
                                    </span>

                                    <span className=" absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-500 group-hover:scale-x-100" />
                                </Link>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="h-1 w-1 shrink-0 rounded-full bg-[#a65d52]" />

                                    <p className="text-[8px] leading-4 text-[#8f625b]">
                                        Checkout is unavailable until all stock issues
                                        are resolved.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* CHECKOUT */}
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className=" group relative mt-5 flex w-full items-center justify-center overflow-hidden bg-[#171614] py-3.5 text-[8px] font-medium uppercase tracking-[0.35em] text-white transition-colors duration-500 hover:bg-[#464035]"
                                >
                                    <span className="relative z-10">
                                        Continue To Checkout
                                    </span>

                                    <span className=" relative z-10 ml-2 translate-x-1 text-[#c4a66a] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                                        →
                                    </span>

                                    <span className=" absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-500 group-hover:scale-x-100" />
                                </Link>

                                {/* VIEW BAG */}
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className=" mt-2.5 flex w-full items-center justify-center border border-[#272522] py-3 text-[8px] uppercase tracking-[0.3em] text-[#272522] transition-all duration-300 hover:bg-[#272522] hover:text-white"
                                >
                                    View Shopping Bag
                                </Link>
                            </>
                        )}

                        {/* BRAND */}
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <span className="h-px w-6 bg-[#c9c3b8]" />

                            <span className="text-[7px] uppercase tracking-[0.3em] text-[#9a958b]">
                                Luxe Men
                            </span>

                            <span className="h-px w-6 bg-[#c9c3b8]" />
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
