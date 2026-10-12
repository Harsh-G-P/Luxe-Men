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
            <section className="w-full px-6 py-20">
                <div className="mx-auto max-w-2xl border border-slate-200 bg-white px-12 py-20 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
                    </div>

                    <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Order
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em] text-slate-900">
                        Please Wait
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
                        We're processing your request.
                        Please wait while We're retrieving your order details.
                    </p>

                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="w-full px-6 py-20">
                <div className="mx-auto max-w-2xl border border-neutral-200 bg-white px-12 py-20 text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neutral-200 text-3xl">
                        !
                    </div>

                    <p className="mt-8 text-xs uppercase tracking-[0.35em] text-neutral-500">
                        Order
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em]">
                        Order Not Found
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm text-neutral-500">
                        The order you're looking for doesn't exist or you don't have
                        permission to view it.
                    </p>

                    <div className="mt-9 flex items-center justify-center">

                        <Link
                            href="/admin/orders"
                            className="group inline-flex h-11 items-center justify-center gap-3 border border-black bg-black px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-white hover:text-black"
                        >
                            <span className="text-lg font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                                +
                            </span>

                            Back to Orders

                        </Link>

                    </div>

                </div>
            </section>
        );
    }

    return (
        <section className="w-full px-6">

            <Link
                href="/admin/orders"
                className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition group-hover:-translate-x-0.5 group-hover:border-slate-300">
                    ←
                </span>

                Back to Orders
            </Link>

            <div className="mb-10 flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">

                <div className="min-w-0">

                    <div className="mb-3 flex items-center gap-3">
                        <span className="h-px w-8 bg-slate-950" />

                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                            Store / Orders
                        </p>
                    </div>

                    <h1 className="text-2xl font-light uppercase tracking-[0.08em] text-slate-950 sm:text-3xl">
                        {order.orderNumber}
                    </h1>

                    <p className="mt-2 text-xs text-slate-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleString("en-US", {
                            dateStyle: "long",
                            timeStyle: "short",
                        })}
                    </p>

                    <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-slate-200 pt-6 sm:grid-cols-3">

                        {/* Order ID */}

                        <div className="min-w-0">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Order ID
                            </p>

                            <p className="mt-2 break-all text-xs text-slate-700">
                                {order.id}
                            </p>

                        </div>


                        {/* Items */}

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Items
                            </p>

                            <p className="mt-2 text-xs text-slate-700">
                                {order.items.length} Products
                            </p>

                        </div>


                        {/* Payment */}

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Payment
                            </p>

                            <p className="mt-2 text-xs font-medium text-slate-700">
                                {order.paymentMethod}
                            </p>

                        </div>

                    </div>

                </div>

                <div className="flex gap-3">

                    <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${statusStyles[order.status as keyof typeof statusStyles]
                            }`}
                    >
                        {order.status}
                    </span>

                    <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${paymentStyles[
                            order.paymentStatus as keyof typeof paymentStyles
                        ]
                            }`}
                    >
                        {order.paymentStatus}
                    </span>

                </div>

            </div>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_0.9fr]">

                <div>

                    <OrderProducts items={order.items} />

                    <div className="mt-8">
                        <OrderTimeline status={order.status} />
                    </div>

                </div>

                <div className="space-y-8">

                    <CustomerInformation customer={order.user} />

                    <ShippingAddress address={order.address} />

                    <OrderPreferences
                        packagingOption={order.packagingOption}
                        giftMessage={order.giftMessage}
                        notes={order.notes}
                        removeInvoice={order.removeInvoice}
                    />

                    <OrderSummary order={order} />

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

        </section>
    );
}
