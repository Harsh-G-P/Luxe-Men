"use client";

import Link from "next/link";
import OrderProducts from "./Orders/OrderProducts";
import ShippingAddress from "./Orders/ShippingAddress";
import OrderSummary from "./Orders/OrderSummary";

const order = {
    orderNumber: "ORD-20260731-4AF2",
    date: "31 July 2026",
    status: "Confirmed",
    paymentStatus: "Paid",
};

export default function OrderDetailPage() {
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
                        Placed on {order.date}
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

                    <OrderProducts />

                </div>

                <div className="space-y-8">

                    <ShippingAddress />

                    <OrderSummary />

                </div>

            </div>

        </section>
    );
}