"use client";

import Link from "next/link";
import OrderFilter from "./OrderFilter";
import { Bell } from "lucide-react";
import {
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

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

type Pagination = {
    page: number;
    limit: number;
    totalOrders: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type Order = {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentStatus: string;
    cancellationStatus:
    | "NONE"
    | "REQUESTED"
    | "REJECTED";
    refundStatus:
    | "NONE"
    | "REQUESTED"
    | "REJECTED"
    | "REFUNDED";
    refundReason: string | null;
    createdAt: Date;

    user: {
        id: string;
        name: string | null;
        email: string;
    };

    items: {
        id: string;
        title: string;
        quantity: number;
    }[];
};

type OrdersProps = {
    orders: Order[];
    pagination: Pagination;
};

export default function OrdersPage({
    orders,
    pagination,
}: OrdersProps) {
    const notificationRef =
        useRef<HTMLDivElement>(null);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [isPending, startTransition] =
        useTransition();

    const router = useRouter();
    const searchParams = useSearchParams();

    const cancellationRequests = orders.filter(
        (order) =>
            order.cancellationStatus === "REQUESTED"
    );

    const refundRequests = orders.filter(
        (order) =>
            order.refundStatus === "REQUESTED"
    );

    const totalNotifications =
        cancellationRequests.length +
        refundRequests.length;

    const notifications = [
        ...cancellationRequests.map((order) => ({
            ...order,
            type: "CANCELLATION" as const,
        })),

        ...refundRequests.map((order) => ({
            ...order,
            type: "REFUND" as const,
        })),
    ];

    useEffect(() => {
        const handleClickOutside = (
            event: MouseEvent
        ) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target as Node
                )
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

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.set("page", page.toString());

        startTransition(() => {
            router.push(
                `/admin/orders?${params.toString()}`
            );
        });
    };

    if (isPending) {
        return (
            <section className="w-full px-6 py-20">
                <div className="mx-auto max-w-2xl border border-slate-200 bg-white px-12 py-20 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
                    </div>

                    <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Orders
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em] text-slate-900">
                        Please Wait
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
                        We're processing your request.
                        Please wait while we update
                        your order list.
                    </p>

                </div>
            </section>
        );
    }

    const getPaginationPages = (
        currentPage: number,
        totalPages: number
    ): (number | "...")[] => {
        const maxVisiblePages = 4;

        if (totalPages <= maxVisiblePages) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        // First pages
        if (currentPage <= 2) {
            return [
                1,
                2,
                3,
                4,
                "...",
                totalPages,
            ];
        }

        // Last pages
        if (currentPage >= totalPages - 1) {
            return [
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        // Middle pages
        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    };

    return (
        <div className="w-full px-6">

            {/* Header */}

            <div className="mb-10 flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-start lg:justify-between">

                {/* Left */}

                <div className="min-w-0">

                    <div className="mb-4 flex items-center gap-3">

                        <span className="h-px w-8 bg-slate-950" />

                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                            Store / Orders
                        </p>

                    </div>

                    <h1 className="text-3xl font-light uppercase tracking-[0.08em] text-slate-950 sm:text-4xl">
                        Orders
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                        Manage customer orders and
                        fulfillment.
                    </p>

                </div>

                {/* Notification */}

                <div
                    ref={notificationRef}
                    className="relative"
                >

                    <button
                        type="button"
                        onClick={() => {
                            router.refresh();

                            setShowNotifications(
                                (prev) => !prev
                            );
                        }}
                        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        aria-label="Cancellation requests"
                        aria-expanded={
                            showNotifications
                        }
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
                                        Cancellation & refund
                                        requests
                                    </p>
                                </div>

                                {totalNotifications > 0 && (
                                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                                        {totalNotifications}{" "}
                                        Pending
                                    </span>
                                )}

                            </div>

                            {/* Notifications */}

                            {totalNotifications ===
                                0 ? (

                                <div className="px-5 py-10 text-center">

                                    <Bell className="mx-auto h-6 w-6 text-slate-300" />

                                    <p className="mt-3 text-sm font-medium text-slate-700">
                                        No pending requests
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Customer cancellation
                                        and refund requests
                                        will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div>

                                    <div className="max-h-72 overflow-y-auto">

                                        {notifications.map(
                                            (
                                                notification
                                            ) => (

                                                <Link
                                                    key={`${notification.type}-${notification.id}`}
                                                    href={`/admin/orders/${notification.id}`}
                                                    onClick={() =>
                                                        setShowNotifications(
                                                            false
                                                        )
                                                    }
                                                    className="block border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50"
                                                >

                                                    <div className="flex items-start justify-between gap-4">

                                                        <div className="min-w-0">

                                                            <div className="flex items-center gap-2">

                                                                <span
                                                                    className={`h-2 w-2 shrink-0 rounded-full ${notification.type ===
                                                                        "REFUND"
                                                                        ? "bg-amber-500"
                                                                        : "bg-red-500"
                                                                        }`}
                                                                />

                                                                <p className="text-sm font-semibold text-slate-900">
                                                                    {notification.type ===
                                                                        "REFUND"
                                                                        ? "Refund requested"
                                                                        : "Cancellation requested"}
                                                                </p>

                                                            </div>

                                                            <p className="mt-2 text-xs text-slate-600">
                                                                {notification
                                                                    .user
                                                                    .name ||
                                                                    "Customer"}
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-400">
                                                                {
                                                                    notification
                                                                        .user
                                                                        .email
                                                                }
                                                            </p>

                                                        </div>

                                                        <span className="shrink-0 text-xs font-semibold text-slate-700">
                                                            {
                                                                notification.orderNumber
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between">

                                                        <span
                                                            className={`text-[10px] uppercase tracking-[0.12em] ${notification.type ===
                                                                "REFUND"
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

                                            )
                                        )}

                                    </div>

                                    {notifications.length >
                                        2 && (
                                            <div className="border-t border-slate-100 px-5 py-3 text-center text-[10px] uppercase tracking-widest text-slate-400">
                                                Scroll to view more
                                                requests
                                            </div>
                                        )}

                                </div>
                            )}

                        </div>
                    )}

                </div>

            </div>

            {/* Filters */}

            <OrderFilter />

            {/* Order List */}

            <div className="mt-7 space-y-5">

                {/* List Header */}

                <div className="flex items-center justify-between px-1">

                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                            Order List
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Your current customer orders
                        </p>
                    </div>

                    <span className="text-sm text-slate-500">
                        {pagination.totalOrders}{" "}
                        {pagination.totalOrders === 1
                            ? "Order"
                            : "Orders"}
                    </span>

                </div>

                {/* Orders */}

                {orders.length > 0 ? (

                    orders.map((order) => (

                        <div
                            key={order.id}
                            className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]"
                        >

                            <div className="grid gap-8 p-6 lg:grid-cols-[1.6fr_1.2fr_1fr]">

                                {/* Order */}

                                <div className="flex min-w-0 items-start gap-5">

                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">

                                        <span className="text-lg font-semibold text-slate-400">
                                            #
                                        </span>

                                    </div>

                                    <div className="min-w-0">

                                        <div className="flex flex-wrap items-center gap-3">

                                            <h3 className="truncate text-base font-semibold text-slate-900">
                                                {
                                                    order.orderNumber
                                                }
                                            </h3>

                                            <span
                                                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[
                                                    order.status as keyof typeof statusStyles
                                                ]
                                                    }`}
                                            >
                                                {order.status}
                                            </span>

                                        </div>

                                        <p className="mt-3 text-sm font-medium text-slate-700">
                                            {order.user.name ||
                                                "Customer"}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {
                                                order.user
                                                    .email
                                            }
                                        </p>

                                    </div>

                                </div>

                                {/* Details */}

                                <div className="border-l border-slate-100 pl-0 lg:pl-7">

                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Ordered Items
                                    </p>

                                    <div className="mt-3 space-y-2">

                                        {order.items
                                            .slice(0, 2)
                                            .map(
                                                (item) => (
                                                    <p
                                                        key={
                                                            item.id
                                                        }
                                                        className="text-sm text-slate-700"
                                                    >
                                                        •{" "}
                                                        {
                                                            item.title
                                                        }
                                                        <span className="ml-1 text-xs text-slate-400">
                                                            ×{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>
                                                    </p>
                                                )
                                            )}

                                        {order.items.length >
                                            2 && (
                                                <p className="text-xs font-medium text-slate-400">
                                                    +
                                                    {order
                                                        .items
                                                        .length -
                                                        2}{" "}
                                                    more items
                                                </p>
                                            )}

                                    </div>

                                </div>

                                {/* Actions */}

                                <div className="flex flex-col items-end justify-between border-l border-slate-100 pl-0 lg:pl-7">

                                    <div className="text-right">

                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                            Payment
                                        </p>

                                        <span
                                            className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${paymentStyles[
                                                order.paymentStatus as keyof typeof paymentStyles
                                            ]
                                                }`}
                                        >
                                            {
                                                order.paymentStatus
                                            }
                                        </span>

                                        <p className="mt-4 text-base font-semibold text-slate-900">
                                            $
                                            {order.total.toFixed(
                                                2
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString(
                                                "en-US",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </p>

                                    </div>

                                    <div className="mt-9 flex items-center justify-center">

                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="group inline-flex h-11 items-center justify-center gap-3 border border-black bg-black px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-white hover:text-black"
                                        >
                                            <span className="text-lg font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                                                +
                                            </span>
                                            View Details
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))

                ) : (

                    /* Empty State */

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

                        <div className="px-6 py-20 text-center">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-slate-50">

                                <Bell className="h-8 w-8 stroke-[1.2] text-slate-400" />

                            </div>

                            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                                Order Collection
                            </p>

                            <h3 className="mt-4 text-2xl font-light uppercase tracking-[0.14em] text-slate-900">
                                No Orders Found
                            </h3>

                            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
                                No orders match the
                                filters you've selected.
                            </p>

                        </div>

                    </div>

                )}

            </div>

            {/* Pagination */}

            {pagination.totalPages > 0 && (

                <div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Page Info */}

                    <div className="text-sm text-slate-500">

                        Page{" "}

                        <span className="font-semibold text-slate-900">
                            {pagination.page}
                        </span>

                        {" "}of{" "}

                        <span className="font-semibold text-slate-900">
                            {pagination.totalPages}
                        </span>

                    </div>

                    {/* Controls */}

                    <div className="flex flex-wrap items-center gap-2">

                        {/* Previous */}

                        <button
                            type="button"
                            disabled={
                                !pagination.hasPreviousPage ||
                                isPending
                            }
                            onClick={() =>
                                handlePageChange(
                                    pagination.page - 1
                                )
                            }
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${pagination.hasPreviousPage
                                ? "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                                : "pointer-events-none border-slate-100 bg-slate-50 text-slate-300"
                                }`}
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}

                        <div className="flex flex-wrap items-center gap-1">

                            {getPaginationPages(
                                pagination.page,
                                pagination.totalPages
                            ).map((page, index) => {

                                if (page === "...") {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="flex h-9 min-w-9 items-center justify-center px-2 text-sm font-semibold text-slate-400"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        disabled={isPending}
                                        onClick={() =>
                                            handlePageChange(page)
                                        }
                                        className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${pagination.page === page
                                                ? "bg-slate-950 text-white shadow-sm"
                                                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                        </div>

                        {/* Next */}

                        <button
                            type="button"
                            disabled={
                                !pagination.hasNextPage ||
                                isPending
                            }
                            onClick={() =>
                                handlePageChange(
                                    pagination.page + 1
                                )
                            }
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${pagination.hasNextPage
                                ? "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                                : "pointer-events-none border-slate-100 bg-slate-50 text-slate-300"
                                }`}
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}


        </div>
    );
}