"use client";

import Link from "next/link";
import OrderProducts from "./Orders/OrderProducts";
import ShippingAddress from "./Orders/ShippingAddress";
import OrderSummary from "./Orders/OrderSummary";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderPreferences from "./Orders/OrderPreferences";
import OrderTimeline from "./Orders/OrderTimeline";
import RequestCancellation from "./Orders/RequestCancellation";
import RequestRefund from "./Orders/RequestRefund";

type Props = {
    id: string
}

type Order = {
    id: string;
    orderNumber: string;

    subtotal: number;
    shipping: number;
    total: number;

    status: string;
    paymentMethod: string;
    paymentStatus: string;

    cancellationStatus: string;
    cancellationReason: string | null;

    refundStatus: string;
    refundReason: string | null;
    refundRequestedAt: string | null;
    refundedAt: string | null;

    notes: string | null;
    packagingOption: string | null;
    giftMessage: string | null;
    removeInvoice: boolean;

    createdAt: string;

    address: {
        fullname: string;
        phone: string;
        addressLine: string;
        countryCode: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };

    items: {
        id: string;
        title: string;
        image: string | null;
        attributes: Record<string, string> | null;
        quantity: number;
        price: number;
        total: number;
    }[];
};

export default function OrderDetailPage({ id }: Props) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetail = async () => {
        try {
            const res = await fetch(`/api/order/${id}`);

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            setOrder(data.data);
        } catch {
            toast.error("Failed to load order");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
        const interval = setInterval(() => {
            fetchOrderDetail();
        }, 10000);

        return () => clearInterval(interval);
    }, [id]);

    if (loading) {
        return (
            <section className="min-h-screen bg-[#f7f6f2]">
                <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

                    <div
                        className=" relative mx-auto max-w-2xl border border-[#d8d3c9] bg-[#faf9f6] px-10 py-20 text-center md:px-12"
                    >
                        {/* Editorial accent */}
                        <div className="absolute left-1/2 top-0 h-px w-16 -translate-x-1/2 bg-[#9b8150]" />

                        {/* Brand */}
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-8 bg-[#d1cbc1]" />

                            <span className="text-[7px] font-medium uppercase tracking-[0.45em] text-[#9b8150]">
                                LUXE MEN
                            </span>

                            <span className="h-px w-8 bg-[#d1cbc1]" />
                        </div>

                        {/* Loading bar */}
                        <div className="mx-auto mt-7 h-px w-20 overflow-hidden bg-[#ded9d0]">
                            <div
                                className="
                                h-full
                                w-1/2
                                animate-[luxuryLoading_1.5s_ease-in-out_infinite]
                                bg-[#9b8150]
                            "
                            />
                        </div>

                        {/* Status */}
                        <p className="mt-6 text-[8px] uppercase tracking-[0.4em] text-[#aaa49b]">
                            Loading Order
                        </p>

                        {/* Heading */}
                        <h2 className="mt-4 font-serif text-3xl font-normal tracking-[0.01em] text-[#171614] md:text-4xl">
                            Please Wait
                        </h2>

                        {/* Description */}
                        <p className="mx-auto mt-5 max-w-sm text-[11px] leading-6 text-[#858077]">
                            We're carefully retrieving your order details.
                        </p>

                    </div>
                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="min-h-screen bg-[#f7f6f2]">
                <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
                    <div
                        className=" relative mx-auto max-w-2xl overflow-hidden border border-[#d9d6cf] bg-[#faf9f6] px-8 py-24 text-center md:px-12 md:py-28"
                    >
                        {/* Subtle editorial detail */}
                        <div className="absolute left-1/2 top-0 h-px w-20 -translate-x-1/2 bg-[#a18450]" />

                        {/* Luxe Men Monogram */}
                        <div
                            className=" mx-auto flex h-16 w-16 items-center justify-center border border-[#cfcac1] bg-[#f7f5f0]"
                        >
                            <span
                                className="
                                font-serif
                                text-[21px]
                                font-normal
                                tracking-[-0.12em]
                                text-[#292824]
                            "
                            >
                                LM
                            </span>
                        </div>

                        {/* Eyebrow */}
                        <p className="mt-8 text-[8px] font-medium uppercase tracking-[0.4em] text-[#a18450]">
                            Order Archive
                        </p>

                        {/* Heading */}
                        <h2 className="mt-5 font-serif text-3xl font-normal tracking-[0.01em] text-[#171614] md:text-4xl">
                            Order Not Found
                        </h2>

                        {/* Description */}
                        <p className="mx-auto mt-5 max-w-md text-[12px] leading-7 text-[#858077]">
                            The order you're looking for doesn't exist or you don't
                            have permission to view it.
                        </p>

                        {/* CTA */}
                        <Link
                            href="/profile/orders" className=" group relative mt-10 inline-flex items-center gap-5 border border-[#252421] bg-[#252421] px-9 py-4 text-[9px] font-medium uppercase tracking-[0.28em] text-[#faf9f6] transition-all duration-500 hover:bg-[#f4f3ef] hover:text-[#252421]"
                        >
                            <span>Back to Orders</span>

                            <span
                                className="
                                text-sm
                                font-light
                                transition-transform
                                duration-500
                                ease-out
                                group-hover:-translate-x-1
                            "
                            >
                                ←
                            </span>
                        </Link>

                        {/* Bottom detail */}
                        <div className="mx-auto mt-12 flex items-center justify-center gap-4">
                            <span className="h-px w-8 bg-[#d6d2ca]" />

                            <span className="text-[7px] uppercase tracking-[0.32em] text-[#aaa69e]">
                                Return to your collection
                            </span>

                            <span className="h-px w-8 bg-[#d6d2ca]" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#f7f6f2]">
            <div className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-14">

                {/* Back */}
                <Link
                    href="/profile/orders"
                    className=" group inline-flex items-center gap-2 border-b border-[#d9d5cd] pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#171512] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#1b1a18]"
                >
                    <span className="text-[13px] leading-none transition-transform duration-300 group-hover:-translate-x-1">
                        ←
                    </span>

                    <span>Back to Orders</span>
                </Link>

                {/* Order Header */}
                <div className="mt-8 flex flex-col gap-6 border-b border-[#dedbd4] pb-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[8px] uppercase tracking-[0.28em] text-[#aaa69e]">
                            Order
                        </p>

                        <h1 className="mt-2 font-serif text-2xl font-normal tracking-[0.02em] text-[#1b1a18]">
                            {order.orderNumber}
                        </h1>

                        <p className="mt-1.5 text-[9px] uppercase tracking-[0.14em] text-[#817d75]">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="flex flex-wrap gap-2">
                        <span className="border border-[#bdb8ae] bg-[#fdfcf9] px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-[#57534c]">
                            Order: {order.status}
                        </span>

                        <span className="border border-[#c9c0b2] bg-[#fdfcf9] px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-[#6f604e]">
                            Payment: {order.paymentStatus}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_0.9fr] lg:gap-10">
                    {/* Main */}
                    <div className="min-w-0">
                        <OrderProducts items={order.items} />

                        <div className="mt-6">
                            <OrderTimeline status={order.status} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <ShippingAddress address={order.address} />

                        <OrderPreferences
                            packagingOption={order.packagingOption}
                            giftMessage={order.giftMessage}
                            notes={order.notes}
                            removeInvoice={order.removeInvoice}
                        />

                        <OrderSummary order={order} />

                        <RequestCancellation
                            orderId={order.id}
                            status={order.status}
                            cancellationStatus={order.cancellationStatus}
                        />

                        <RequestRefund
                            orderId={order.id}
                            status={order.status}
                            paymentStatus={order.paymentStatus}
                            refundStatus={order.refundStatus}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}