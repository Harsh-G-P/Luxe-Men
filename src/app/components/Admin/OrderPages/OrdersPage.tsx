"use client";

import Link from "next/link";
import OrderFilter from "./OrderFilter";

const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
} as const;

const paymentStyles = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-slate-200 text-slate-700",
} as const;

type Order = {
    id: string
    orderNumber: string
    total: number
    status: string
    paymentStatus: string
    createdAt: Date

    user: {
        id: string
        name: string | null
        email: string

    },

    items: {
        id: string
        title: string
        quantity: number

    }[]

}

type OrdersProps = {
    orders: Order[]
}


export default function OrdersPage({ orders }: OrdersProps) {
    return (
        <div className="max-w-7xl mx-auto p-6">

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Orders
                </h1>

                <p className="mt-2 text-gray-500">
                    Manage customer orders and fulfillment.
                </p>

            </div>

            <div className="flex items-center mb-6">

                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                    ← Back to Dashboard
                </Link>

            </div>

            {/* Filters */}

            <OrderFilter />

            {/* Orders */}

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-l text-gray-900">
                        Orders List
                    </h2>

                    <h1 className="text-l text-gray-900">
                        Total Orders: {orders.length}
                    </h1>
                </div>

                {orders.map((order) => (

                    <div
                        key={order.id}
                        className="rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                    >

                        <div className="grid gap-8 p-6 lg:grid-cols-[2fr_1.2fr_0.9fr]">

                            {/* Left */}

                            <div>

                                <div className="flex items-center gap-3">

                                    <h2 className="font-semibold text-gray-900">
                                        {order.orderNumber}
                                    </h2>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusStyles[
                                            order.status as keyof typeof statusStyles
                                        ]}`}
                                    >
                                        {order.status}
                                    </span>

                                </div>

                                <div className="mt-5">

                                    <p className="font-medium">
                                        {order.user.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {order.user.email}
                                    </p>

                                </div>

                            </div>

                            {/* Middle */}

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                    Ordered Items
                                </p>

                                <div className="mt-3 space-y-2">

                                    {order.items.slice(0, 2).map((item) => (
                                        <p
                                            key={item.id}
                                            className="text-sm text-gray-700"
                                        >
                                            • {item.title}
                                        </p>
                                    ))}

                                    {order.items.length > 2 && (
                                        <p className="text-sm text-gray-500">
                                            +{order.items.length - 2} more
                                        </p>
                                    )}

                                </div>

                            </div>

                            {/* Right */}

                            <div className="flex flex-col items-end justify-between">

                                <div className="text-right">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${paymentStyles[
                                            order.paymentStatus as keyof typeof paymentStyles
                                        ]
                                            }`}
                                    >
                                        {order.paymentStatus}
                                    </span>

                                    <p className="mt-5 text-sm font-semibold">
                                        ${order.total}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>

                                </div>

                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="mt-6 rounded-xl border border-black px-5 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                                >
                                    View Details
                                </Link>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}