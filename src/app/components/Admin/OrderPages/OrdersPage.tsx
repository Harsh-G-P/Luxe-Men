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
            <section className="w-full px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-2xl border border-[#dedbd4] bg-[#faf9f6] px-6 py-16 text-center sm:px-12 sm:py-20">

                    {/* Loading Indicator */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#dedbd4] bg-[#f5f3ed]">
                        <div className="h-6 w-6 animate-spin border-2 border-[#dedbd4] border-t-[#9b8150]" />
                    </div>

                    {/* Eyebrow */}
                    <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.3em] text-[#9b8150]">
                        LUXE MEN / ORDER MANAGEMENT
                    </p>

                    {/* Heading */}
                    <h2 className="mt-4 text-2xl font-light uppercase tracking-[0.18em] text-[#1b1a18] sm:text-3xl">
                        Please Wait
                    </h2>

                    {/* Divider */}
                    <div className="mx-auto mt-6 h-px w-12 bg-[#b49a6c]" />

                    {/* Description */}
                    <p className="mx-auto mt-6 max-w-sm text-xs leading-6 text-[#817d75] sm:text-sm">
                        We're processing your request.
                        Please wait while we update your order list.
                    </p>

                    {/* Loading Status */}
                    <div className="mt-9 flex items-center justify-center gap-2">
                        <span className="h-1 w-1 animate-pulse bg-[#9b8150]" />
                        <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa49b]">
                            Updating Orders
                        </span>
                    </div>

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
        <div className="w-full bg-[#f5f4ef]">

            {/* Header */}
            <div className="mb-8 flex flex-col gap-6 border-b border-[#dedbd4] pb-8 lg:flex-row lg:items-end lg:justify-between">

                {/* Title */}
                <div className="min-w-0">
                    <div className="mb-3 flex items-center gap-3">
                        <span className="h-px w-7 bg-[#9a8a74]" />

                        <p className="text-[8px] uppercase tracking-[0.28em] text-[#aaa69e]">
                            Admin / Order Management
                        </p>
                    </div>

                    <h1 className="font-serif text-3xl font-normal tracking-[0.02em] text-[#1b1a18] sm:text-4xl">
                        Orders
                    </h1>

                    <p className="mt-2 max-w-xl text-[10px] leading-6 text-[#817d75]">
                        Manage customer orders, fulfillment, payments, and
                        customer requests.
                    </p>
                </div>

                {/* Notifications */}
                <div
                    ref={notificationRef}
                    className="relative self-start lg:self-auto"
                >
                    <button
                        type="button"
                        onClick={() => {
                            router.refresh();
                            setShowNotifications((prev) => !prev);
                        }}
                        className="group relative flex h-11 items-center gap-3 border border-[#dedbd4] bg-[#faf9f6] px-4 text-[#57534c] transition-all duration-300 hover:border-[#9a8a74] hover:bg-[#fdfcf9]"
                        aria-label="Cancellation and refund requests"
                        aria-expanded={showNotifications}
                    >
                        <Bell className="h-4 w-4 stroke-[1.5]" />

                        <span className="text-[8px] uppercase tracking-[0.18em]">
                            Notifications
                        </span>

                        {totalNotifications > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center border border-[#cbb9a0] bg-[#f0e9df] px-1 text-[8px] font-medium text-[#765f44]">
                                {totalNotifications}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute left-0 top-14 z-50 w-[calc(100vw-2rem)] max-w-96 overflow-hidden border border-[#dedbd4] bg-[#faf9f6] shadow-[0_18px_45px_rgba(45,40,30,0.12)] sm:left-auto sm:right-0 sm:w-[min(24rem,calc(100vw-2.5rem))]">


                            {/* Dropdown Header */}
                            <div className="border-b border-[#e8e4dc] px-5 py-4">
                                <p className="text-[8px] uppercase tracking-[0.25em] text-[#aaa69e]">
                                    Admin / Notifications
                                </p>

                                <div className="mt-2 flex items-center justify-between gap-3">
                                    <h3 className="font-serif text-lg font-normal text-[#1b1a18]">
                                        Customer Requests
                                    </h3>

                                    {totalNotifications > 0 && (
                                        <span className="shrink-0 border border-[#d9cbb7] bg-[#f4eee5] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.15em] text-[#8b704d]">
                                            {totalNotifications} Pending
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-[9px] leading-5 text-[#817d75]">
                                    Cancellation and refund requests awaiting review.
                                </p>
                            </div>

                            {/* Dropdown Content */}
                            {totalNotifications === 0 ? (
                                <div className="px-5 py-10 text-center">
                                    <Bell className="mx-auto h-5 w-5 stroke-[1.3] text-[#c6c0b5]" />

                                    <p className="mt-4 text-[9px] uppercase tracking-[0.18em] text-[#57534c]">
                                        All Caught Up
                                    </p>

                                    <p className="mt-2 text-[10px] leading-5 text-[#aaa49b]">
                                        New cancellation and refund requests will
                                        appear here.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <Link
                                                key={`${notification.type}-${notification.id}`}
                                                href={`/admin/orders/${notification.id}`}
                                                onClick={() =>
                                                    setShowNotifications(false)
                                                }
                                                className="block border-b border-[#eeece7] px-5 py-4 transition-colors duration-300 hover:bg-[#f3f0e9]"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`h-1.5 w-1.5 shrink-0 ${notification.type ===
                                                                    "REFUND"
                                                                    ? "bg-[#a18450]"
                                                                    : "bg-[#9a6f63]"
                                                                    }`}
                                                            />

                                                            <p className="text-[9px] uppercase tracking-[0.12em] text-[#34312c]">
                                                                {notification.type ===
                                                                    "REFUND"
                                                                    ? "Refund Requested"
                                                                    : "Cancellation Requested"}
                                                            </p>
                                                        </div>

                                                        <p className="mt-2 truncate text-[10px] text-[#57534c]">
                                                            {notification.user.name ||
                                                                "Customer"}
                                                        </p>

                                                        <p className="mt-1 break-all text-[9px] leading-4 text-[#aaa49b]">
                                                            {notification.user.email}
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 text-[9px] text-[#817d75]">
                                                        {notification.orderNumber}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <span
                                                        className={`text-[7px] uppercase tracking-[0.2em] ${notification.type ===
                                                            "REFUND"
                                                            ? "text-[#8b704d]"
                                                            : "text-[#9a6f63]"
                                                            }`}
                                                    >
                                                        Needs Review
                                                    </span>

                                                    <span className="text-[9px] text-[#9a8a74] transition-transform duration-300 group-hover:translate-x-0.5">
                                                        View →
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {notifications.length > 2 && (
                                        <div className="border-t border-[#e8e4dc] px-5 py-3 text-center text-[7px] uppercase tracking-[0.2em] text-[#aaa49b]">
                                            Scroll to view more requests
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
            <div className="mt-8 space-y-5">

                {/* List Heading */}
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#dedbd4] pb-4">
                    <div>
                        <p className="text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]">
                            Store Records
                        </p>

                        <h2 className="mt-2 font-serif text-xl font-normal text-[#1b1a18]">
                            Order List
                        </h2>

                        <p className="mt-1 text-[9px] text-[#817d75]">
                            Review orders and manage fulfillment.
                        </p>
                    </div>

                    <p className="text-[9px] uppercase tracking-[0.14em] text-[#817d75]">
                        <span className="text-[#1b1a18]">
                            {pagination.totalOrders}
                        </span>{" "}
                        {pagination.totalOrders === 1 ? "Order" : "Orders"}
                    </p>
                </div>

                {/* Orders */}
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="group overflow-hidden border border-[#e2ded4] bg-[#faf9f6] transition-all duration-300 hover:border-[#c8bb94] hover:bg-[#fdfcf9] hover:shadow-[0_10px_30px_rgba(45,40,30,0.06)]"
                        >
                            <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1.5fr_1.15fr_0.9fr] lg:gap-7">

                                {/* Order Information */}
                                <div className="flex min-w-0 items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#e2ded4] bg-[#f3f0e9]">
                                        <span className="font-serif text-lg font-normal text-[#9a8a74]">
                                            LM
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                            Order Reference
                                        </p>

                                        <h3 className="mt-2 wrap-break-word font-serif text-base font-normal tracking-[0.02em] text-[#1b1a18]">
                                            {order.orderNumber}
                                        </h3>

                                        <p className="mt-3 text-[10px] text-[#57534c]">
                                            {order.user.name || "Customer"}
                                        </p>

                                        <p className="mt-1 break-all text-[9px] leading-4 text-[#aaa49b]">
                                            {order.user.email}
                                        </p>

                                        <span
                                            className={`mt-4 inline-block border px-2.5 py-1.5 text-[7px] uppercase tracking-[0.15em] ${statusStyles[
                                                order.status as keyof typeof statusStyles
                                            ]
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Ordered Items */}
                                <div className="border-t border-[#e8e4dc] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                    <p className="text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                        Ordered Items
                                    </p>

                                    <div className="mt-4 space-y-3">
                                        {order.items.slice(0, 2).map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-start justify-between gap-3"
                                            >
                                                <p className="min-w-0 wrap-break-word text-[10px] leading-5 text-[#57534c]">
                                                    {item.title}
                                                </p>

                                                <span className="shrink-0 text-[9px] text-[#aaa49b]">
                                                    × {item.quantity}
                                                </span>
                                            </div>
                                        ))}

                                        {order.items.length > 2 && (
                                            <p className="border-t border-[#eeece7] pt-3 text-[8px] uppercase tracking-[0.12em] text-[#9a8a74]">
                                                +{order.items.length - 2} More{" "}
                                                {order.items.length - 2 === 1
                                                    ? "Item"
                                                    : "Items"}
                                            </p>
                                        )}

                                        {order.items.length === 0 && (
                                            <p className="text-[10px] text-[#aaa49b]">
                                                No items found.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Payment & Actions */}
                                <div className="flex flex-col justify-between gap-6 border-t border-[#e8e4dc] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                    <div>
                                        <p className="text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                            Payment Status
                                        </p>

                                        <span
                                            className={`mt-3 inline-block border px-2.5 py-1.5 text-[7px] uppercase tracking-[0.15em] ${paymentStyles[
                                                order.paymentStatus as keyof typeof paymentStyles
                                            ]
                                                }`}
                                        >
                                            {order.paymentStatus}
                                        </span>

                                        <p className="mt-5 font-serif text-xl font-normal text-[#1b1a18]">
                                            ${order.total.toFixed(2)}
                                        </p>

                                        <p className="mt-1.5 text-[8px] uppercase tracking-widest text-[#aaa49b]">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="group/link inline-flex min-h-10 w-full items-center justify-center gap-3 border border-[#1b1a18] bg-[#1b1a18] px-4 py-3 text-[8px] uppercase tracking-[0.18em] text-[#faf9f6] transition-all duration-300 hover:border-[#6f604e] hover:bg-[#6f604e]"
                                    >
                                        <span>View Details</span>

                                        <span className="text-sm transition-transform duration-300 group-hover/link:translate-x-1">
                                            →
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* Empty State */
                    <div className="border border-[#e2ded4] bg-[#faf9f6] px-6 py-16 text-center md:py-20">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#dedbd4] bg-[#f3f0e9]">
                            <Bell className="h-5 w-5 stroke-[1.3] text-[#9a8a74]" />
                        </div>

                        <p className="mt-7 text-[7px] uppercase tracking-[0.3em] text-[#aaa69e]">
                            Admin / Order Records
                        </p>

                        <h3 className="mt-3 font-serif text-2xl font-normal text-[#1b1a18]">
                            No Orders Found
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-[10px] leading-6 text-[#817d75]">
                            No orders match your current filters. Adjust your
                            search criteria to view available orders.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}

            {pagination.totalPages > 0 && (
                <div className="mt-8 flex flex-col gap-5 border-t border-[#dedbd4] pt-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Page Information */}
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#817d75]">
                        <span>Page</span>
                        <span className="font-medium text-[#1b1a18]">
                            {String(pagination.page).padStart(2, "0")}
                        </span>
                        <span className="text-[#c3beb4]">/</span>
                        <span>
                            {String(pagination.totalPages).padStart(2, "0")}
                        </span>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex flex-wrap items-center gap-1.5">

                        {/* Previous */}
                        <button
                            type="button"
                            disabled={!pagination.hasPreviousPage || isPending}
                            onClick={() =>
                                handlePageChange(pagination.page - 1)
                            }
                            className="group flex h-9 items-center gap-2 border border-[#dedbd4] bg-[#faf9f6] px-3 text-[8px] uppercase tracking-[0.12em] text-[#57534c] transition-all duration-300 hover:border-[#9b8150] hover:text-[#9b8150] disabled:cursor-not-allowed disabled:border-[#e8e4dc] disabled:bg-[#f1efe9] disabled:text-[#c3beb4] disabled:hover:border-[#e8e4dc] disabled:hover:text-[#c3beb4]"
                        >
                            <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
                                ←
                            </span>
                            <span className="hidden xs:inline">Previous</span>
                            <span className="xs:hidden">Prev</span>
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
                                            aria-hidden="true"
                                            className="flex h-9 min-w-5 items-center justify-center text-[10px] text-[#aaa49b]"
                                        >
                                            ···
                                        </span>
                                    );
                                }

                                const isActive = pagination.page === page;

                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        disabled={isPending}
                                        aria-label={`Go to page ${page}`}
                                        aria-current={isActive ? "page" : undefined}
                                        onClick={() => handlePageChange(page)}
                                        className={`relative flex h-9 min-w-9 items-center justify-center border px-2.5 text-[9px] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${isActive
                                            ? "border-[#1b1a18] bg-[#1b1a18] text-[#faf9f6]"
                                            : "border-transparent bg-transparent text-[#817d75] hover:border-[#dedbd4] hover:bg-[#faf9f6] hover:text-[#9b8150]"
                                            }`}
                                    >
                                        {String(page).padStart(2, "0")}

                                        {isActive && (
                                            <span className="absolute inset-x-2 -bottom-px h-0.5 bg-[#b49a6c]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next */}
                        <button
                            type="button"
                            disabled={!pagination.hasNextPage || isPending}
                            onClick={() =>
                                handlePageChange(pagination.page + 1)
                            }
                            className="group flex h-9 items-center gap-2 border border-[#dedbd4] bg-[#faf9f6] px-3 text-[8px] uppercase tracking-[0.12em] text-[#57534c] transition-all duration-300 hover:border-[#9b8150] hover:text-[#9b8150] disabled:cursor-not-allowed disabled:border-[#e8e4dc] disabled:bg-[#f1efe9] disabled:text-[#c3beb4] disabled:hover:border-[#e8e4dc] disabled:hover:text-[#c3beb4]"
                        >
                            <span className="hidden xs:inline">Next</span>
                            <span className="xs:hidden">Next</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                                →
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}