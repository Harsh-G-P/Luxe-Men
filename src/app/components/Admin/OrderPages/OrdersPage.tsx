"use client";

import Link from "next/link";
import OrderFilter from "./OrderFilter";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
    cancellationStatus: "NONE" | "REQUESTED" | "REJECTED"
    refundStatus: "NONE" | "REQUESTED" | "REJECTED" | "REFUNDED"
    refundReason: string | null
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

    const notificationRef = useRef<HTMLDivElement>(null);

    const [showNotifications, setShowNotifications] = useState(false);

    const cancellationRequests = orders.filter(
        (order) => order.cancellationStatus === "REQUESTED"
    );

    const refundRequests = orders.filter(
        (order) => order.refundStatus === "REQUESTED"
    );

    const totalNotifications =
        cancellationRequests.length + refundRequests.length;

    const notifications = [
        ...cancellationRequests.map((order) => ({
            ...order,
            type: "CANCELLATION",
        })),

        ...refundRequests.map((order) => ({
            ...order,
            type: "REFUND",
        })),
    ];

    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6">

            {/* Header */}

            <div className="mb-8 flex items-start justify-between gap-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Orders
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage customer orders and fulfillment.
                    </p>
                </div>

                <div ref={notificationRef} className="relative">

                    <button
                        type="button"
                        onClick={() => { router.refresh(); setShowNotifications((prev) => !prev) }}
                        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
                        aria-label="Cancellation requests"
                        aria-expanded={showNotifications}
                    >
                        <Bell className="h-5 w-5" />

                        {totalNotifications > 0 && (
                            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blue-600" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                            {/* Notification Header */}

                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Notifications
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Cancellation & refund requests
                                    </p>
                                </div>

                                {totalNotifications > 0 && (
                                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                                        {totalNotifications} Pending
                                    </span>
                                )}


                            </div>


                            {/* Notifications */}

                            {totalNotifications === 0 ? (

                                <div className="px-5 py-10 text-center">

                                    <Bell className="mx-auto h-6 w-6 text-slate-300" />

                                    <p className="mt-3 text-sm font-medium text-slate-700">
                                        No pending requests
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Customer cancellation and refund requests will appear here.
                                    </p>

                                </div>

                            ) : (
                                <div>
                                    <div className="max-h-72 overflow-y-auto">

                                        {notifications.map((notification) => (

                                            <Link
                                                key={`${notification.type}-${notification.id}`}
                                                href={`/admin/orders/${notification.id}`}
                                                onClick={() => setShowNotifications(false)}
                                                className="block border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50"
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="min-w-0">

                                                        <div className="flex items-center gap-2">

                                                            <span
                                                                className={`h-2 w-2 shrink-0 rounded-full ${notification.type === "REFUND"
                                                                    ? "bg-amber-500"
                                                                    : "bg-red-500"
                                                                    }`}
                                                            />

                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {notification.type === "REFUND"
                                                                    ? "Refund requested"
                                                                    : "Cancellation requested"}
                                                            </p>

                                                        </div>

                                                        <p className="mt-2 text-xs text-slate-600">
                                                            {notification.user.name || "Customer"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {notification.user.email}
                                                        </p>

                                                    </div>

                                                    <span className="shrink-0 text-xs font-semibold text-slate-700">
                                                        {notification.orderNumber}
                                                    </span>

                                                </div>

                                                <div className="mt-3 flex items-center justify-between">

                                                    <span
                                                        className={`text-[10px] uppercase tracking-[0.12em] ${notification.type === "REFUND"
                                                            ? "text-amber-600"
                                                            : "text-red-600"
                                                            }`}
                                                    >
                                                        Needs Review
                                                    </span>

                                                    <span className="text-xs text-slate-400">
                                                        View →
                                                    </span>

                                                </div>

                                            </Link>

                                        ))}

                                    </div>
                                    {notifications.length > 2 && (
                                        <div className="border-t border-slate-100 px-5 py-3 text-center text-[10px] uppercase tracking-widest text-slate-400">
                                            Scroll to view more requests
                                        </div>
                                    )}
                                </div>

                            )}


                        </div>
                    )}

                </div>

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