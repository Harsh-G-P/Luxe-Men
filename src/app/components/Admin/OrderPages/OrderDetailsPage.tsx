"use client";

import Link from "next/link";
import CustomerInformation from "./CustomerInformation";
import AdminActions from "./AdminActions";
import OrderSummary from "./OrderSummary";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderTimeline from "./OrderTimeline";
import OrderProducts from "./OrderProducts";
import ShippingAddress from "./ShippingAddress";
import OrderPreferences from "./OrderPreferences";


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
    paymentId: string | null;

    cancellationStatus: "NONE" | "REQUESTED" | "REJECTED";
    cancellationReason: string | null;

    refundStatus: "NONE" | "REQUESTED" | "REJECTED" | "REFUNDED";
    refundReason: string | null;
    refundRequestedAt: string | null;
    refundedAt: string | null;

    notes: string | null;
    packagingOption: string | null;
    giftMessage: string | null;
    removeInvoice: boolean;

    createdAt: string;

    user: {
        id: string;
        name: string | null;
        email: string;
        role: string;
        createdAt: Date;
    };

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

const statusStyles = {
    r: "bg-slate-200 text-slate-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
} as const;

const paymentStyles = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-cyan-100 text-cyan-700",
} as const;

export default function AdminOrderDetail({ id }: Props) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetail = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);

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

    const handleOrderUpdate = (data: {
        status: string;
        paymentStatus: string;
        cancellationStatus: "NONE" | "REQUESTED" | "REJECTED";
    }) => {
        setOrder((prev) =>
            prev
                ? {
                    ...prev,
                    status: data.status,
                    paymentStatus: data.paymentStatus,
                    cancellationStatus: data.cancellationStatus,
                }
                : prev
        );
    };



    if (loading) {
        return (
            <section className="min-h-screen bg-[#f5f4ef]">
                <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
                    <div className="relative mx-auto max-w-2xl border border-[#e2ded4] bg-[#faf9f6] px-8 py-20 text-center md:px-12">

                        {/* Editorial accent */}
                        <div className="absolute left-1/2 top-0 h-px w-16 -translate-x-1/2 bg-[#9a8a74]" />

                        {/* Brand */}
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-8 bg-[#d1cbc1]" />

                            <span className="text-[7px] font-medium uppercase tracking-[0.45em] text-[#9a8a74]">
                                LUXE MEN
                            </span>

                            <span className="h-px w-8 bg-[#d1cbc1]" />
                        </div>

                        {/* Loading bar */}
                        <div className="mx-auto mt-7 h-px w-20 overflow-hidden bg-[#ded9d0]">
                            <div className="h-full w-1/2 animate-[luxuryLoading_1.5s_ease-in-out_infinite] bg-[#9a8a74]" />
                        </div>

                        {/* Status */}
                        <p className="mt-6 text-[8px] uppercase tracking-[0.4em] text-[#aaa49b]">
                            Administration
                        </p>

                        {/* Heading */}
                        <h2 className="mt-4 font-serif text-3xl font-normal tracking-[0.01em] text-[#1b1a18] md:text-4xl">
                            Please Wait
                        </h2>

                        {/* Description */}
                        <p className="mx-auto mt-5 max-w-sm text-[11px] leading-6 text-[#817d75]">
                            We're retrieving the requested administrative records.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="min-h-screen bg-[#f5f4ef]">
                <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
                    <div className="relative mx-auto max-w-2xl overflow-hidden border border-[#e2ded4] bg-[#faf9f6] px-8 py-24 text-center md:px-12 md:py-28">

                        {/* Editorial accent */}
                        <div className="absolute left-1/2 top-0 h-px w-20 -translate-x-1/2 bg-[#9a8a74]" />

                        {/* Admin Monogram */}
                        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#d4cfc5] bg-[#f5f4ef]">
                            <span className="font-serif text-[21px] font-normal tracking-[-0.08em] text-[#292824]">
                                LM
                            </span>
                        </div>

                        {/* Eyebrow */}
                        <p className="mt-8 text-[8px] font-medium uppercase tracking-[0.4em] text-[#9a8a74]">
                            Admin / Order Management
                        </p>

                        {/* Heading */}
                        <h2 className="mt-5 font-serif text-3xl font-normal tracking-[0.01em] text-[#1b1a18] md:text-4xl">
                            Order Not Found
                        </h2>

                        {/* Description */}
                        <p className="mx-auto mt-5 max-w-md text-[12px] leading-7 text-[#817d75]">
                            This order could not be found, or you may not have permission to access its administrative details.
                        </p>

                        {/* CTA */}
                        <Link
                            href="/admin/orders"
                            className="group relative mt-10 inline-flex items-center gap-5 border border-[#1b1a18] bg-[#1b1a18] px-9 py-4 text-[9px] font-medium uppercase tracking-[0.28em] text-[#faf9f6] transition-all duration-500 hover:border-[#6f604e] hover:bg-[#6f604e]"
                        >
                            <span>Back to Orders</span>

                            <span className="text-sm font-light transition-transform duration-500 ease-out group-hover:-translate-x-1">
                                ←
                            </span>
                        </Link>

                        {/* Bottom detail */}
                        <div className="mx-auto mt-12 flex items-center justify-center gap-4">
                            <span className="h-px w-8 bg-[#d6d2ca]" />

                            <span className="text-[7px] uppercase tracking-[0.32em] text-[#aaa69e]">
                                Administration Portal
                            </span>

                            <span className="h-px w-8 bg-[#d6d2ca]" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen w-full bg-[#f7f6f2]">
            <div>

                {/* Back */}
                <Link
                    href="/admin/orders"
                    className="group inline-flex items-center gap-2 border-b border-[#d9d5cd] pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#171512] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#6f604e]"
                >
                    <span className="text-[13px] leading-none transition-transform duration-300 group-hover:-translate-x-1">
                        ←
                    </span>

                    <span>Back to Orders</span>
                </Link>

                {/* Order Header */}
                <div className="mt-8 flex flex-col gap-6 border-b border-[#dedbd4] pb-8 lg:flex-row lg:items-end lg:justify-between">

                    <div className="min-w-0">
                        {/* Eyebrow */}
                        <div className="mb-3 flex items-center gap-3">
                            <span className="h-px w-7 bg-[#9a8a74]" />

                            <p className="text-[8px] uppercase tracking-[0.28em] text-[#aaa69e]">
                                Admin / Order Management
                            </p>
                        </div>

                        {/* Order Number */}
                        <h1 className="wrap-break-word font-serif text-2xl font-normal tracking-[0.02em] text-[#1b1a18] sm:text-3xl">
                            {order.orderNumber}
                        </h1>

                        {/* Date */}
                        <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-[#817d75]">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                        </p>

                        {/* Order Metadata */}
                        <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#dedbd4] pt-6 sm:grid-cols-3 sm:gap-x-8">

                            {/* Order ID */}
                            <div className="min-w-0">
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                    Order ID
                                </p>

                                <p className="mt-2 break-all text-[10px] leading-5 text-[#57534c]">
                                    {order.id}
                                </p>
                            </div>

                            {/* Items */}
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                    Items
                                </p>

                                <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-[#57534c]">
                                    {order.items.length}{" "}
                                    {order.items.length === 1
                                        ? "Product"
                                        : "Products"}
                                </p>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                    Payment Method
                                </p>

                                <p className="mt-2 wrap-break-word text-[10px] uppercase tracking-[0.08em] text-[#57534c]">
                                    {order.paymentMethod}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order & Payment Status */}
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                        <span
                            className={`border px-4 py-2 text-[8px] uppercase tracking-[0.16em] ${statusStyles[
                                order.status as keyof typeof statusStyles
                                ]
                                }`}
                        >
                            Order: {order.status}
                        </span>

                        <span
                            className={`border px-4 py-2 text-[8px] uppercase tracking-[0.16em] ${paymentStyles[
                                order.paymentStatus as keyof typeof paymentStyles
                                ]
                                }`}
                        >
                            Payment: {order.paymentStatus}
                        </span>
                    </div>
                </div>

                {/* Order Content */}
                <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_0.9fr] lg:gap-10">

                    {/* Main Column */}
                    <div className="min-w-0">
                        {/* Products */}
                        <OrderProducts items={order.items} />

                        {/* Timeline */}
                        <div className="mt-6">
                            <OrderTimeline status={order.status} />
                        </div>
                    </div>

                    {/* Admin Sidebar */}
                    <div className="min-w-0 space-y-6">

                        {/* Customer */}
                        <CustomerInformation customer={order.user} />

                        {/* Shipping */}
                        <ShippingAddress address={order.address} />

                        {/* Order Preferences */}
                        <OrderPreferences
                            packagingOption={order.packagingOption}
                            giftMessage={order.giftMessage}
                            notes={order.notes}
                            removeInvoice={order.removeInvoice}
                        />

                        {/* Order Summary */}
                        <OrderSummary order={order} />

                        {/* Admin Controls */}
                        <AdminActions
                            orderId={order.id}
                            status={order.status}
                            paymentStatus={order.paymentStatus}
                            cancellationStatus={order.cancellationStatus}
                            cancellationReason={order.cancellationReason}
                            refundStatus={order.refundStatus}
                            refundReason={order.refundReason}
                            refundRequestedAt={order.refundRequestedAt}
                            onUpdated={handleOrderUpdate}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
