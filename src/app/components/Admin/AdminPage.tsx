"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
    adminName: string;
};

type DashboardData = {
    statistics: {
        users: number;
        products: number;
        orders: number;
        revenue: number;
    };

    salesOverview: {
        date: string;
        revenue: number;
        orders: number;
    }[];

    salesOverviewTotal: number;
    salesOverviewOrders: number;

    bestSellers: {
        id: string;
        title: string;
        price: number;
        images: string | null;
    }[];

    recentOrders: {
        id: string;
        orderNumber: string;
        total: number;
        status: string;
        createdAt: string;
        product: string;
        user: {
            name: string;
        };
    }[];
};

export default function AdminPage({ adminName }: Props) {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activePoint, setActivePoint] = useState<number | null>(null);

    const fetchDashboard = async () => {
        try {
            const res = await fetch("/api/dashboard", {
                method: "GET"
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || "Failed to fetch dashboard")
                return
            }
            setDashboard(data.data)
        } catch (error) {
            toast.error("Dashboard fetch error")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchDashboard()
    }, [])


    const stats = dashboard
        ? [
            {
                label: "Revenue",
                value: `$${dashboard.statistics.revenue.toLocaleString()}`,
                change: "+12.8%",
            },
            {
                label: "Orders",
                value: dashboard.statistics.orders.toLocaleString(),
                change: "+8.4%",
            },
            {
                label: "Customers",
                value: dashboard.statistics.users.toLocaleString(),
                change: "+18.2%",
            },
            {
                label: "Products",
                value: dashboard.statistics.products.toLocaleString(),
                change: "+2.1%",
            },
        ]
        : [];

    const getStatusStyles = (status: string) => {
        switch (status.toUpperCase()) {
            case "PAID":
            case "DELIVERED":
                return "bg-[#e8eee9] text-[#637568]";

            case "SHIPPED":
                return "bg-[#e9ecef] text-[#65707a]";

            case "PROCESSING":
                return "bg-[#efebe4] text-[#81735e]";

            case "PENDING":
                return "bg-[#f1f1ef] text-[#686864]";

            case "CANCELLED":
            case "CANCELED":
            case "FAILED":
                return "bg-[#f3e7e7] text-[#8a6262]";

            case "REFUNDED":
                return "bg-[#eee8f2] text-[#75647f]";

            default:
                return "bg-[#f1f1ef] text-[#686864]";
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7f7f5] text-[#111111]">
                <section className="w-full px-4 py-12 sm:px-6 sm:py-20">
                    <div className="mx-auto max-w-2xl border border-black/10 bg-white px-6 py-16 text-center shadow-[0_2px_15px_rgba(0,0,0,0.02)] sm:px-12 sm:py-20">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/10">
                            <div className="h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-black" />
                        </div>

                        <p className="mt-8 text-[9px] uppercase tracking-[0.35em] text-black/35 sm:text-xs">
                            Admin Dashboard
                        </p>

                        <h2 className="mt-4 text-2xl font-light uppercase tracking-[0.16em] sm:text-3xl">
                            Loading Dashboard
                        </h2>

                        <p className="mx-auto mt-5 max-w-md text-xs leading-6 text-black/40 sm:text-sm">
                            We're retrieving your latest sales, products, customers,
                            and order information.
                        </p>

                        <div className="mx-auto mt-10 h-px w-16 bg-black/10" />

                    </div>
                </section>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="min-h-screen bg-[#f7f7f5] text-[#111111]">
                <section className="w-full px-4 py-12 sm:px-6 sm:py-20">
                    <div className="mx-auto max-w-2xl border border-black/10 bg-white px-6 py-16 text-center shadow-[0_2px_15px_rgba(0,0,0,0.02)] sm:px-12 sm:py-20">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-black/10 text-2xl font-light">
                            !
                        </div>

                        <p className="mt-8 text-[9px] uppercase tracking-[0.35em] text-black/35 sm:text-xs">
                            Admin Dashboard
                        </p>

                        <h2 className="mt-4 text-2xl font-light uppercase tracking-[0.16em] sm:text-3xl">
                            Dashboard Unavailable
                        </h2>

                        <p className="mx-auto mt-5 max-w-md text-xs leading-6 text-black/40 sm:text-sm">
                            We couldn't retrieve the dashboard information right now.
                            Please try again or return to the admin dashboard.
                        </p>

                        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

                            <button
                                onClick={() => {
                                    setLoading(true);
                                    fetchDashboard();
                                }}
                                className="inline-flex items-center justify-center border border-black bg-black px-8 py-3 text-xs uppercase tracking-[0.12em] text-white transition hover:bg-black/80"
                            >
                                Try Again
                            </button>
                        </div>

                    </div>
                </section>
            </main>
        );
    }

    const chartData = dashboard.salesOverview;

    const maxRevenue = Math.max(
        ...chartData.map((item) => item.revenue),
        1
    );


    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#111111]">
            <div className="w-full">

                {/* Welcome */}
                <div className="mb-6 sm:mb-8 lg:mb-10">
                    <p className="text-xs text-black/40 sm:text-sm">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>

                    <h3 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl lg:text-4xl">
                        Good evening, {adminName}.
                    </h3>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-black/10 bg-white p-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)] sm:rounded-2xl sm:p-6"
                        >
                            <p className="text-[9px] uppercase tracking-[0.15em] text-black/35 sm:text-xs sm:tracking-[0.2em]">
                                {stat.label}
                            </p>

                            <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
                                <p className="text-xl font-light sm:text-2xl">
                                    {stat.value}
                                </p>

                                <span className="w-fit rounded-full bg-[#e8eee9] px-2 py-1 text-[9px] text-[#637568] sm:px-2.5 sm:py-1 sm:text-[10px]">
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1.5fr_1fr]">

                    {/* Sales */}
                    <div className="min-w-0 rounded-xl border border-black/10 bg-white p-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)] sm:rounded-2xl sm:p-6 lg:p-8">

                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.15em] text-black/35 sm:text-xs sm:tracking-[0.2em]">
                                    Sales Overview
                                </p>

                                <p className="mt-2 text-xl font-light sm:text-2xl">
                                    ${dashboard.salesOverviewTotal.toLocaleString()}
                                </p>

                                <p className="mt-1 text-[9px] text-black/30 sm:text-[10px]">
                                    Last 30 days
                                </p>
                            </div>

                            <button className="shrink-0 rounded-lg border border-black/10 px-2.5 py-2 text-[10px] text-black/50 transition hover:border-black/20 hover:text-black sm:px-3 sm:text-xs">
                                Last 30 days
                            </button>
                        </div>

                        {/* Sales Chart */}
                        <div
                            className="relative mt-8 h-56 select-none sm:mt-10 sm:h-72"
                            onMouseLeave={() => setActivePoint(null)}
                        >
                            {/* Tooltip */}
                            {activePoint !== null && (
                                <div
                                    className="pointer-events-none absolute z-20 -translate-x-1/2"
                                    style={{
                                        left: `${(activePoint / (chartData.length - 1)) * 100}%`,
                                        top: "0",
                                    }}
                                >
                                    <div className="min-w-44 rounded-xl border border-black/10 bg-[#111111] px-4 py-3 text-white shadow-[0_12px_35px_rgba(0,0,0,0.15)]">
                                        <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                                            {new Date(
                                                chartData[activePoint].date
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>

                                        <div className="mt-2 flex items-end justify-between gap-6">
                                            <div>
                                                <p className="text-[9px] uppercase tracking-wider text-white/40">
                                                    Revenue
                                                </p>

                                                <p className="mt-0.5 text-lg font-light">
                                                    ${chartData[activePoint].revenue.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[9px] uppercase tracking-wider text-white/40">
                                                    Orders
                                                </p>

                                                <p className="mt-0.5 text-lg font-light">
                                                    {chartData[activePoint].orders}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tooltip line */}
                                    <div className="absolute left-1/2 top-full h-48 w-px -translate-x-1/2 bg-black/10" />
                                </div>
                            )}

                            {/* Chart area */}
                            <div className="relative h-full">

                                {/* SVG */}
                                <svg
                                    viewBox="0 0 1000 300"
                                    preserveAspectRatio="none"
                                    className="absolute inset-0 h-full w-full overflow-visible"
                                >
                                    <defs>
                                        <linearGradient
                                            id="salesGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#111111"
                                                stopOpacity="0.10"
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#111111"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    {/* Area */}
                                    <path
                                        d={(() => {
                                            const points = chartData.map((item, index) => {
                                                const x =
                                                    (index / (chartData.length - 1)) * 1000;

                                                const y =
                                                    280 -
                                                    (item.revenue / maxRevenue) * 230;

                                                return `${x},${y}`;
                                            });

                                            return `
                        M ${points[0]}
                        L ${points.slice(1).join(" L ")}
                        L 1000,300
                        L 0,300
                        Z
                    `;
                                        })()}
                                        fill="url(#salesGradient)"
                                    />

                                    {/* Main line */}
                                    <path
                                        d={(() => {
                                            const points = chartData.map((item, index) => {
                                                const x =
                                                    (index / (chartData.length - 1)) * 1000;

                                                const y =
                                                    280 -
                                                    (item.revenue / maxRevenue) * 230;

                                                return `${x},${y}`;
                                            });

                                            return `M ${points.join(" L ")}`;
                                        })()}
                                        fill="none"
                                        stroke="#111111"
                                        strokeWidth="2"
                                        vectorEffect="non-scaling-stroke"
                                    />

                                    {/* Hover points */}
                                    {chartData.map((item, index) => {
                                        const x =
                                            (index / (chartData.length - 1)) * 1000;

                                        const y =
                                            280 -
                                            (item.revenue / maxRevenue) * 230;

                                        return (
                                            <g key={item.date}>
                                                {/* Invisible large hit area */}
                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r="18"
                                                    fill="transparent"
                                                    className="cursor-pointer"
                                                    onMouseEnter={() =>
                                                        setActivePoint(index)
                                                    }
                                                />

                                                {/* Active luxury dot */}
                                                {activePoint === index && (
                                                    <>
                                                        <circle
                                                            cx={x}
                                                            cy={y}
                                                            r="8"
                                                            fill="white"
                                                            stroke="#111111"
                                                            strokeWidth="2"
                                                        />

                                                        <circle
                                                            cx={x}
                                                            cy={y}
                                                            r="3"
                                                            fill="#111111"
                                                        />
                                                    </>
                                                )}
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Invisible hover columns */}
                                <div className="absolute inset-0 flex">
                                    {chartData.map((item, index) => (
                                        <div
                                            key={item.date}
                                            className="h-full flex-1"
                                            onMouseEnter={() =>
                                                setActivePoint(index)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Chart labels */}
                        <div className="mt-3 flex justify-between text-[8px] uppercase tracking-wider text-black/25 sm:mt-4 sm:text-[10px] sm:tracking-widest">
                            {[
                                chartData[0],
                                chartData[7],
                                chartData[14],
                                chartData[21],
                                chartData[29],
                            ].map((item) => (
                                <span key={item.date}>
                                    {new Date(item.date).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                        }
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="min-w-0 rounded-xl border border-black/10 bg-white p-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)] sm:rounded-2xl sm:p-6 lg:p-8">

                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.15em] text-black/35 sm:text-xs sm:tracking-[0.2em]">
                                    Best Sellers
                                </p>

                                <p className="mt-2 text-lg font-light sm:text-xl">
                                    Top Products
                                </p>
                            </div>

                            <Link href={'/collections?sort=bestseller'} className="shrink-0 text-[10px] text-black/40 transition hover:text-black sm:text-xs">
                                View all
                            </Link>
                        </div>

                        <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                            {dashboard.bestSellers.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 border-b border-black/5 pb-4 last:border-0 sm:gap-4 sm:pb-5"
                                >
                                    <span className="text-[10px] text-black/20 sm:text-xs">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {product.images ? (
                                        <img
                                            src={product.images}
                                            alt={product.title}
                                            className="h-10 w-10 shrink-0 rounded-lg object-cover sm:h-12 sm:w-12"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 shrink-0 rounded-lg bg-[#eeeeeb] sm:h-12 sm:w-12" />
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-black/80 sm:text-sm">
                                            {product.title}
                                        </p>

                                        <p className="mt-1 text-[10px] text-black/30 sm:text-xs">
                                            Best seller
                                        </p>
                                    </div>

                                    <span className="shrink-0 text-xs text-black/60 sm:text-sm">
                                        ${product.price.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>

                {/* Recent Orders */}
                <div className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.02)] sm:mt-6 sm:rounded-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 border-b border-black/10 p-4 sm:p-6 lg:px-8">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.15em] text-black/35 sm:text-xs sm:tracking-[0.2em]">
                                Commerce
                            </p>

                            <h3 className="mt-2 text-lg font-light sm:text-xl">
                                Recent Orders
                            </h3>
                        </div>

                        <Link href={'/admin/orders'} className="shrink-0 text-[10px] text-black/40 transition hover:text-black sm:text-xs">
                            <span className="hidden sm:inline">
                                View all orders →
                            </span>

                            <span className="sm:hidden">
                                View all →
                            </span>
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-162.5 text-left">
                            <thead>
                                <tr className="border-b border-black/5 text-[9px] uppercase tracking-[0.15em] text-black/25 sm:text-[10px] sm:tracking-[0.2em]">
                                    <th className="px-4 py-3 font-normal sm:px-8 sm:py-4">
                                        Order
                                    </th>

                                    <th className="px-4 py-3 font-normal sm:px-8 sm:py-4">
                                        Customer
                                    </th>

                                    <th className="px-4 py-3 font-normal sm:px-8 sm:py-4">
                                        Product
                                    </th>

                                    <th className="px-4 py-3 font-normal sm:px-8 sm:py-4">
                                        Amount
                                    </th>

                                    <th className="px-4 py-3 font-normal sm:px-8 sm:py-4">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {dashboard.recentOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-black/5 text-xs last:border-0 sm:text-sm"
                                    >
                                        <td className="px-4 py-4 text-black/50 sm:px-8 sm:py-5">
                                            #{order.orderNumber}
                                        </td>

                                        <td className="px-4 py-4 sm:px-8 sm:py-5">
                                            {order.user.name}
                                        </td>

                                        <td className="px-4 py-4 text-black/50 sm:px-8 sm:py-5">
                                            {order.product}
                                        </td>

                                        <td className="px-4 py-4 sm:px-8 sm:py-5">
                                            ${order.total.toLocaleString()}
                                        </td>

                                        <td className="px-4 py-4 sm:px-8 sm:py-5">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[9px] uppercase tracking-wide sm:px-3 sm:text-[10px] ${getStatusStyles(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </main>
    );
}