"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

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

export default function CartDetails() {
    const [openId, setOpenId] = useState<string | null>(null);
    const qtyRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [removeId, setRemoveId] = useState<string | null>(null);

    const [items, setItems] = useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cartId, setCartId] = useState("");

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const hasUnavailableItems = items.some(
        (item) => item.isOutOfStock || item.exceedsStock
    );


    const fetchCart = async (notify = false) => {
        try {
            const res = await fetch("/api/cart");
            const data = await res.json();

            if (!res.ok) return;

            if (data.success) {
                setCartId(data.data.cartId);
                setItems(data.data.items);
                setSubtotal(data.data.subtotal);

                if (notify) {
                    window.dispatchEvent(new Event("cartUpdated"));
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const clickedOutside =
                openId &&
                qtyRefs.current[openId] &&
                !qtyRefs.current[openId]!.contains(e.target as Node);

            if (clickedOutside) {
                setOpenId(null);
            }
        };

        document.addEventListener("click", handler);

        return () => {
            document.removeEventListener("click", handler);
        };
    }, [openId]);

    const handleQtyChange = async (id: string, qty: number) => {
        try {
            const res = await fetch(`/api/cart/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quantity: qty,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors && typeof data.errors === "object") {
                    const firstError = Object.values(data.errors)[0] as string;
                    toast.error(firstError);
                    return;
                }

                toast.error(data.message || "Failed to update cart.");
                return;
            }

            toast.success(data.message);

            await fetchCart(true);
            setOpenId(null);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);

        try {
            const res = await fetch(`/api/cart/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to remove item.");
                return;
            }

            toast.success(data.message);

            await fetchCart(true);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally {
            setDeletingId(null);
        }
    };

    const formatPrice = (price: number) =>
        price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-[#f6f4ef] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="relative h-10 w-10">
                        <div className="absolute inset-0 rounded-full border border-[#d7d2c7]" />
                        <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-[#9b8150]" />
                    </div>

                    <p className="mt-7 text-[10px] uppercase tracking-[0.45em] text-[#817b70]">
                        Preparing Your Collection
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f6f4ef] text-[#171614]">

            {/* HEADER */}
            <section className="border-b border-[#e5e1d8]">
                <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="mb-2 text-[9px] uppercase tracking-[0.38em] text-[#a1875b]">
                                Private Collection
                            </p>

                            <h1 className="text-3xl font-normal uppercase tracking-[0.38em] text-[#a1875b] md:text-4xl">
                                Shopping Bag
                            </h1>
                        </div>

                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#9b8150]">
                            {items.length.toString().padStart(2, "0")} Items
                        </span>

                    </div>
                </div>
            </section>

            {hasUnavailableItems && (
                <div className="mb-8 border-y border-[#d8b5ad]/70 bg-[#f4e8e5]/60 px-5 py-5">
                    <div className="flex flex-col items-center text-center">
                        <span className="mb-3 h-1.5 w-1.5 rounded-full bg-[#a65d52]" />

                        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8f5047]">
                            Attention
                        </p>

                        <p className="mt-2 max-w-xl text-[10px] leading-5 text-[#8f625b]">
                            A selection in your bag requires attention. Please adjust the
                            quantity or remove the unavailable piece before continuing.
                        </p>
                    </div>
                </div>
            )}

            {/* EMPTY CART */}
            {items.length === 0 ? (
                <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">

                    <div className="mx-auto max-w-3xl text-center">

                        <div className="mx-auto mb-10 flex items-center justify-center gap-5">
                            <span className="h-px w-20 bg-[#d7d2c7]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#9b8150]" />
                            <span className="h-px w-20 bg-[#d7d2c7]" />
                        </div>

                        <p className="text-[10px] uppercase tracking-[0.45em] text-[#9b8150]">
                            The Collection Awaits
                        </p>

                        <h2 className="mt-7 font-serif text-4xl md:text-6xl">
                            Your Bag Is Empty
                        </h2>

                        <p className="mx-auto mt-7 max-w-lg text-sm leading-8 text-[#77736b]">
                            Discover timeless silhouettes, refined tailoring and elevated
                            essentials designed with enduring craftsmanship.
                        </p>

                        <Link href="/collections">
                            <button className="group relative mt-10 overflow-hidden bg-[#171614] px-12 py-4 text-[10px] uppercase tracking-[0.35em] text-white transition-colors duration-500 hover:bg-[#292722]">
                                <span className="relative z-10">
                                    Explore The Collection
                                </span>

                                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-500 group-hover:scale-x-100" />
                            </button>
                        </Link>

                        <div className="mt-20 grid grid-cols-1 gap-8 border-t border-[#dedbd3] pt-8 text-left sm:grid-cols-3">

                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-[#9b8150]">
                                    Craftsmanship
                                </p>

                                <p className="mt-2 text-xs leading-6 text-[#77736b]">
                                    Considered materials and exceptional construction.
                                </p>
                            </div>

                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-[#9b8150]">
                                    Delivery
                                </p>

                                <p className="mt-2 text-xs leading-6 text-[#77736b]">
                                    Complimentary premium express delivery.
                                </p>
                            </div>

                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-[#9b8150]">
                                    Presentation
                                </p>

                                <p className="mt-2 text-xs leading-6 text-[#77736b]">
                                    Every order arrives in signature packaging.
                                </p>
                            </div>

                        </div>

                    </div>

                </section>
            ) : (
                <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">

                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-20">

                        {/* PRODUCTS */}
                        <div>
                            <div className="mb-6 flex items-center justify-between border-b border-[#d9d5cc] pb-4">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#272522]"> Your Selections </p>
                                <p className="text-[9px] uppercase tracking-[0.25em] text-[#969188]">
                                    {items.length} {items.length === 1 ? "Piece" : "Pieces"}
                                </p>
                            </div>

                            <div>
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{
                                            opacity: 0,
                                            y: 12,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.06,
                                        }}
                                        className="group border-b border-[#ddd9d0] py-5 first:pt-2 md:py-6"
                                    >
                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[130px_minmax(0,1fr)] md:grid-cols-[155px_minmax(0,1fr)_120px] md:gap-7">

                                            {/* PRODUCT IMAGE */}
                                            <Link
                                                href={`/products/${item.product.slug}`}
                                                className="relative flex h-40 items-center justify-center overflow-hidden bg-[#eeece6] sm:h-40 md:h-44"
                                            >
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 155px"
                                                    className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                                                />

                                                <div className="pointer-events-none absolute inset-0 border border-black/4" />

                                                <span className="absolute left-3 top-3 text-[7px] uppercase tracking-[0.25em] text-[#77736b]">
                                                    LM
                                                </span>
                                            </Link>

                                            {/* PRODUCT DETAILS */}
                                            <div className="flex min-w-0 flex-col justify-between">
                                                <div>
                                                    <p className="mb-1.5 text-[8px] uppercase tracking-[0.28em] text-[#9b8150]">
                                                        Selected Piece
                                                    </p>

                                                    <Link
                                                        href={`/products/${item.product.slug}`}
                                                        className="font-serif text-xl leading-tight text-[#272522] transition-colors duration-300 hover:text-[#9b8150] md:text-[22px]"
                                                    >
                                                        {item.product.title}
                                                    </Link>

                                                    {item.variant?.sku && (
                                                        <p className="mt-2 text-[8px] uppercase tracking-[0.22em] text-[#9a968d]">
                                                            Style: {item.variant.sku}
                                                        </p>
                                                    )}

                                                    <div className="mt-3 space-y-1">
                                                        {Object.entries(
                                                            item.variant?.attributes ?? {}
                                                        ).map(([key, value]) => (
                                                            <p
                                                                key={key}
                                                                className="text-[9px] uppercase tracking-[0.15em] text-[#77736b]"
                                                            >
                                                                {key}:{" "}
                                                                <span className="text-[#272522]">
                                                                    {value}
                                                                </span>
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-4">

                                                    {item.isOutOfStock ? (
                                                        <>
                                                            <div className="flex items-center gap-2">
                                                                <span className="h-1 w-1 rounded-full bg-[#a65d52]" />

                                                                <span className="text-[8px] uppercase tracking-[0.2em] text-[#a65d52]">
                                                                    Out of Stock
                                                                </span>
                                                            </div>

                                                            <p className="mt-1.5 text-[9px] leading-4 text-[#a65d52]/80">
                                                                This piece is currently unavailable.
                                                                Please remove it from your bag to continue.
                                                            </p>
                                                        </>
                                                    ) : item.exceedsStock ? (
                                                        <>
                                                            <div className="flex items-center gap-2">
                                                                <span className="h-1 w-1 rounded-full bg-[#9b8150]" />

                                                                <span className="text-[8px] uppercase tracking-[0.2em] text-[#9b8150]">
                                                                    Limited Availability
                                                                </span>
                                                            </div>

                                                            <p className="mt-1.5 text-[9px] leading-4 text-[#9b8150]">
                                                                Only {item.stock}{" "}
                                                                {item.stock === 1 ? "piece" : "pieces"} remain.
                                                                Please adjust your quantity.
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-center gap-2">
                                                                <span className="h-1 w-1 rounded-full bg-[#75836c]" />

                                                                <span className="text-[8px] uppercase tracking-[0.2em] text-[#68645c]">
                                                                    Available
                                                                </span>
                                                            </div>

                                                            <p className="mt-1.5 text-[9px] leading-4 text-[#99948a]">
                                                                Complimentary delivery or collection in store.
                                                            </p>
                                                        </>
                                                    )}

                                                    <button
                                                        onClick={() => setRemoveId(item.id)}
                                                        className="group/remove relative mt-3 text-[8px] uppercase tracking-[0.25em] text-[#5f5b54]"
                                                    >
                                                        {deletingId === item.id
                                                            ? "Removing..."
                                                            : "Remove"}

                                                        <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-[#171614] transition-transform duration-300 group-hover/remove:scale-x-0" />
                                                    </button>

                                                </div>

                                            </div>

                                            {/* QUANTITY + PRICE */}
                                            <div className="flex items-center justify-between border-t border-[#e0ddd5] pt-4 sm:col-span-2 md:col-span-1 md:flex-col md:items-end md:justify-between md:border-t-0 md:pt-0">

                                                {/* QUANTITY */}
                                                <div
                                                    ref={(el) => {
                                                        qtyRefs.current[item.id] = el;
                                                    }}
                                                    className="relative w-28"
                                                >
                                                    <button
                                                        disabled={item.isOutOfStock}
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            if (item.isOutOfStock) return;

                                                            setOpenId((prev) =>
                                                                prev === item.id ? null : item.id
                                                            );
                                                        }}
                                                        className={`flex w-full items-center justify-between border px-3 py-2.5 text-[8px] uppercase tracking-[0.18em] transition-all duration-300 ${item.isOutOfStock
                                                            ? "cursor-not-allowed border-[#ddd8cf] bg-[#e8e5de] text-[#aaa59b]"
                                                            : "border-[#d8d4ca] bg-[#faf9f6] hover:border-[#9b8150] hover:bg-[#f7f4ee]"
                                                            }`}
                                                    >

                                                        <span>Qty {item.quantity}</span>

                                                        <svg
                                                            className={`h-3 w-3 transition-transform duration-300 ${openId === item.id
                                                                ? "rotate-180"
                                                                : ""
                                                                }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={1.5}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </button>

                                                    <AnimatePresence>
                                                        {openId === item.id && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: -4,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    y: -4,
                                                                }}
                                                                className="absolute left-0 top-full z-50 mt-1 max-h-40 w-full overflow-y-auto border border-[#d8d4ca] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {Array.from(
                                                                    {
                                                                        length: item.stock,
                                                                    },
                                                                    (_, i) => i + 1
                                                                ).map((q) => (
                                                                    <button
                                                                        key={q}
                                                                        onClick={() =>
                                                                            handleQtyChange(
                                                                                item.id,
                                                                                q
                                                                            )
                                                                        }
                                                                        className={`block w-full px-3 py-2.5 text-center text-[8px] uppercase tracking-[0.18em] transition-colors hover:bg-[#f4f1ea] ${q === item.quantity
                                                                            ? "bg-[#f0ede6] font-semibold"
                                                                            : ""
                                                                            }`}
                                                                    >
                                                                        {q}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* PRICE */}
                                                <div className="text-right">
                                                    <p className="mb-0.5 text-[7px] uppercase tracking-[0.25em] text-[#9b968c]">
                                                        Price
                                                    </p>

                                                    <p className="font-serif text-lg tracking-tight text-[#272522]">
                                                        ${formatPrice(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        </div>

                        {/* ORDER SUMMARY */}
                        <aside className="lg:sticky lg:top-16 lg:self-start">
                            <div className="relative overflow-hidden border border-[#d7d2c8] bg-[#f1eee7] p-6 md:p-8">

                                {/* DECORATIVE CORNER */}
                                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 border-l border-b border-[#c8b78e]/40" />
                                <div className="pointer-events-none absolute right-5 top-5 h-10 w-10 border-r border-t border-[#c8b78e]/20" />

                                <div className="relative">

                                    {/* HEADER */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.4em] text-[#9b8150]">
                                                Your Order
                                            </p>

                                            <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#201f1c]">
                                                Summary
                                            </h2>
                                        </div>

                                        <span className="font-serif text-lg italic text-[#9b8150]">
                                            LM
                                        </span>
                                    </div>

                                    {/* ORDER REFERENCE */}
                                    <div className="mt-7 flex items-center justify-between border-y border-[#d3cfc5] py-4">
                                        <span className="text-[8px] uppercase tracking-[0.25em] text-[#99948b]">
                                            Order Reference
                                        </span>

                                        <span className="text-[9px] font-medium tracking-[0.18em] text-[#393732]">
                                            CART-{cartId.slice(-8).toUpperCase()}
                                        </span>
                                    </div>

                                    {/* PRICES */}
                                    <div className="mt-7 space-y-5">

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#77736b]">
                                                Subtotal
                                            </span>

                                            <span className="text-sm font-medium text-[#272622]">
                                                ${formatPrice(subtotal)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#77736b]">
                                                Delivery
                                            </span>

                                            <span className="text-[9px] uppercase tracking-[0.15em] text-[#5d6757]">
                                                Complimentary
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#77736b]">
                                                Taxes & Duties
                                            </span>

                                            <span className="text-[9px] uppercase tracking-[0.12em] text-[#99948b]">
                                                At Checkout
                                            </span>
                                        </div>

                                    </div>

                                    {/* DIVIDER */}
                                    <div className="my-7 h-px bg-[#cfcac0]" />

                                    {/* TOTAL */}
                                    <div className="flex items-end justify-between gap-4">

                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.3em] text-[#77736b]">
                                                Estimated Total
                                            </p>

                                            <p className="mt-1 text-[8px] tracking-[0.03em] text-[#aaa59c]">
                                                Including complimentary delivery
                                            </p>
                                        </div>

                                        <p className="font-serif text-2xl tracking-tight text-[#171614]">
                                            ${formatPrice(subtotal)}
                                        </p>

                                    </div>

                                    {/* VIEW DETAILS */}
                                    <button
                                        type="button"
                                        onClick={() => setShowDetails((prev) => !prev)}
                                        className="group mt-7 flex w-full items-center justify-between border-t border-[#d3cfc5] pt-5 text-left"
                                    >
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#77736b] transition-colors group-hover:text-[#9b8150]">
                                            {showDetails ? "Hide Details" : "View Details"}
                                        </span>

                                        <span
                                            className={`text-[#9b8150] transition-transform duration-300 ${showDetails ? "rotate-180" : ""
                                                }`}
                                        >
                                            ↓
                                        </span>
                                    </button>

                                    {/* DETAILS */}
                                    <AnimatePresence initial={false}>
                                        {showDetails && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-4 border-t border-[#d3cfc5] pt-5">

                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-[#88837a]">
                                                            Pieces
                                                        </span>
                                                        <span className="text-[#33312d]">
                                                            {items.length}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-[#88837a]">
                                                            Products Total
                                                        </span>
                                                        <span className="text-[#33312d]">
                                                            ${formatPrice(subtotal)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-[#88837a]">
                                                            Premium Express
                                                        </span>
                                                        <span className="uppercase tracking-widest text-[#5d6757]">
                                                            Free
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-[#88837a]">
                                                            Estimated Delivery
                                                        </span>
                                                        <span className="text-[#33312d]">
                                                            2–4 Business Days
                                                        </span>
                                                    </div>

                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* INFO */}
                                    <div className="mt-7 border border-[#d2cdc2] bg-[#f3f0e9]/70 p-4">
                                        <div className="flex gap-3">

                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9b8150]" />

                                            <p className="text-[9px] leading-5 tracking-[0.04em] text-[#77736b]">
                                                Every order is carefully prepared, securely packaged
                                                and dispatched with complimentary premium delivery.
                                            </p>

                                        </div>
                                    </div>

                                    {/* CHECKOUT */}
                                    <button
                                        type="button"
                                        disabled={items.length === 0 || hasUnavailableItems}
                                        onClick={() => {
                                            if (hasUnavailableItems) {
                                                toast.error(
                                                    "Please update or remove unavailable items before checkout."
                                                );
                                                return;
                                            }

                                            window.location.href = "/checkout";
                                        }}
                                        className="group relative mt-7 flex w-full items-center justify-center gap-3 overflow-hidden bg-[#171614] py-5 text-[10px] font-medium uppercase tracking-[0.35em] text-white transition-colors duration-700 hover:bg-[#24231f] disabled:cursor-not-allowed disabled:bg-[#bcb8b0]"
                                    >
                                        <span className="relative z-10">
                                            {hasUnavailableItems
                                                ? "Review Your Selection"
                                                : "Continue To Checkout"}
                                        </span>


                                        {!hasUnavailableItems && (
                                            <span className="relative z-10 translate-x-1 text-[#c4a66a] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                                                →
                                            </span>
                                        )}

                                        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-700 ease-out group-hover:scale-x-100" />
                                    </button>

                                    {/* BRAND */}
                                    <div className="mt-7 flex items-center justify-center gap-4">
                                        <span className="h-px w-8 bg-[#c9c3b8]" />

                                        <span className="text-[8px] uppercase tracking-[0.3em] text-[#9a958b]">
                                            Luxe Men
                                        </span>

                                        <span className="h-px w-8 bg-[#c9c3b8]" />
                                    </div>

                                </div>
                            </div>

                            {/* SERVICE FEATURES */}
                            <div className="mt-8 grid grid-cols-3 border-t border-[#d8d4cb] pt-6">

                                <div className="px-2 text-center">
                                    <p className="font-serif text-lg text-[#272622]">01</p>

                                    <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                                        Fast Delivery
                                    </p>

                                    <p className="mt-2 text-[8px] leading-4 text-[#99948b]">
                                        Delivered in<br />
                                        2-4 business days
                                    </p>
                                </div>

                                <div className="border-x border-[#d8d4cb] px-2 text-center">
                                    <p className="font-serif text-lg text-[#272622]">02</p>

                                    <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                                        Premium Pack
                                    </p>

                                    <p className="mt-2 text-[8px] leading-4 text-[#99948b]">
                                        Carefully packed<br />
                                        for your order
                                    </p>
                                </div>

                                <div className="px-2 text-center">
                                    <p className="font-serif text-lg text-[#272622]">03</p>

                                    <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                                        Easy Collection
                                    </p>

                                    <p className="mt-2 text-[8px] leading-4 text-[#99948b]">
                                        Simple & secure<br />
                                        order experience
                                    </p>
                                </div>

                            </div>

                        </aside>

                    </div>

                </section>
            )}

            {/* REMOVE MODAL */}
            <AnimatePresence>

                {removeId && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
                        onClick={() => setRemoveId(null)}
                    >

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                                scale: 0.97,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 20,
                                scale: 0.97,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md border border-[#ddd8ce] bg-[#f7f5ef] p-8 text-center md:p-10"
                        >

                            <div className="mx-auto mb-7 flex items-center justify-center gap-3">

                                <span className="h-px w-10 bg-[#d1ccc2]" />

                                <span>
                                    ⭒
                                </span>

                                <span className="h-px w-10 bg-[#d1ccc2]" />

                            </div>

                            <p className="text-[9px] uppercase tracking-[0.4em] text-[#9b8150]">
                                Your Selection
                            </p>

                            <h3 className="mt-4 font-serif text-3xl">
                                Remove Item?
                            </h3>

                            <p className="mx-auto mt-5 max-w-xs text-xs leading-6 text-[#77736b]">
                                Are you sure you would like to remove this piece
                                from your shopping bag?
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-3">

                                <button
                                    onClick={() => setRemoveId(null)}
                                    className="border border-[#d2cec5] py-4 text-[9px] uppercase tracking-[0.28em] transition-colors hover:bg-[#ece9e1]"
                                >
                                    Keep Item
                                </button>

                                <button
                                    onClick={() => {
                                        handleDelete(removeId);
                                        setRemoveId(null);
                                    }}
                                    className="bg-[#171614] py-4 text-[9px] uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#302e2a]"
                                >
                                    Remove
                                </button>

                            </div>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </main>
    );
}
