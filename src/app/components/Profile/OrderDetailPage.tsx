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
    }, [id]);

    if (loading) {
        return (
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="mx-auto max-w-2xl border border-neutral-200 bg-white px-12 py-20 text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />

                    <p className="mt-8 text-xs uppercase tracking-[0.35em] text-neutral-500">
                        Loading Order
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em]">
                        Please Wait
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm text-neutral-500">
                        We're retrieving your order details.
                    </p>

                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="mx-auto max-w-7xl px-6 py-20">
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

                    <Link
                        href="/profile/orders"
                        className="mt-10 inline-flex border border-black px-8 py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-black hover:text-white"
                    >
                        Back to Orders
                    </Link>

                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-6 py-14">

            <Link
                href="/profile/orders"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
                ← Back to Orders
            </Link>

            <div className="mt-8 flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">

                <div>

                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                        Order
                    </p>

                    <h1 className="mt-3 font-medium tracking-[0.12em]">
                        {order.orderNumber}
                    </h1>

                    <p className="mt-1 text-xs text-neutral-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>

                </div>

                <div className="flex gap-3">

                    <span className="border border-black px-5 py-2 text-xs uppercase tracking-[0.12em]">
                        {order.status}
                    </span>

                    <span className="border border-green-600 bg-green-50 px-5 py-2 text-xs uppercase tracking-[0.12em] text-green-700">
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

                </div>

            </div>

        </section>
    );
}