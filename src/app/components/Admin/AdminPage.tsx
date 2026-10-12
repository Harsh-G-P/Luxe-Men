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
    const [salesLoading, setSalesLoading] = useState(false);
    const [salesPeriod, setSalesPeriod] = useState<"7D" | "30D" | "1Y">("30D");

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/dashboard?period=30D", {
                method: "GET",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to fetch dashboard");
                return;
            }

            setDashboard(data.data);
        } catch (error) {
            toast.error("Dashboard fetch error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchSales = async (
        period: "7D" | "30D" | "1Y"
    ) => {
        try {
            setSalesLoading(true);
            setActivePoint(null);

            const res = await fetch(
                `/api/dashboard?period=${period}`,
                {
                    method: "GET",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(
                    data.message || "Failed to fetch sales data"
                );
                return;
            }

            setDashboard((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    salesOverview: data.data.salesOverview,
                    salesOverviewTotal:
                        data.data.salesOverviewTotal,
                    salesOverviewOrders:
                        data.data.salesOverviewOrders,
                };
            });
        } catch (error) {
            toast.error("Sales data fetch error");
        } finally {
            setSalesLoading(false);
        }
    };


    const stats = dashboard
        ? [
            {
                label: "Revenue",
                value: `$${dashboard.statistics.revenue.toLocaleString()}`,
                change: "+12.8%",
                href: "/admin/orders",
            },
            {
                label: "Orders",
                value: dashboard.statistics.orders.toLocaleString(),
                change: "+8.4%",
                href: "/admin/orders",
            },
            {
                label: "Customers",
                value: dashboard.statistics.users.toLocaleString(),
                change: "+18.2%",
                href: "/admin/user",
            },
            {
                label: "Products",
                value: dashboard.statistics.products.toLocaleString(),
                change: "+2.1%",
                href: "/admin/products",
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
            <section className="w-full px-6 py-20">

                <div className="mx-auto max-w-2xl border border-slate-200 bg-white px-12 py-20 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50">

                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />

                    </div>

                    <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Dashboard
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em] text-slate-900">
                        Please Wait
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
                        We're processing your request.
                        Please wait while we're retrieving
                        your Dashboard details.
                    </p>

                </div>

            </section>
        );
    }

    if (!dashboard) {
        return (
            <section className="w-full px-6 py-20">

                <div className="mx-auto max-w-2xl border border-neutral-200 bg-white px-12 py-20 text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neutral-200 text-3xl">
                        !
                    </div>

                    <p className="mt-8 text-xs uppercase tracking-[0.35em] text-neutral-500">
                        Dashboard
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em]">
                        Unavailable
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm text-neutral-500">
                        We couldn't retrieve the dashboard information right now.
                        Please try again later.
                    </p>

                    <div className="mt-9 flex items-center justify-center">

                        <button
                            onClick={() => {
                                setLoading(true);
                                fetchDashboard();
                            }}
                            className="group inline-flex h-11 items-center justify-center gap-3 border border-black bg-black px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-white hover:text-black"
                        >
                            <span className="text-lg font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                                +
                            </span>

                            Try Again
                        </button>

                    </div>

                </div>

            </section>
        );
    }

    const chartData = dashboard.salesOverview;

    const maxRevenue = Math.max(
        ...chartData.map((item) => item.revenue),
        1
    );


    return (
        <main className="min-h-screen bg-[#f5f4ef] text-[#111111]">
            <div className="w-full">

                {/* Welcome */}

                <div className="mb-10 flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">

                        <div className="mb-4 flex items-center gap-3">

                            <span className="h-px w-8 bg-slate-950" />

                            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                                Store / Dashboard
                            </p>

                        </div>

                        <h1 className="text-3xl font-light uppercase tracking-[0.08em] text-slate-950 sm:text-4xl">
                            Good evening, {adminName}.
                        </h1>
                        <p className="text-xs text-black/40 mt-2">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                            Here&apos;s what&apos;s happening with your store
                            today.
                        </p>

                    </div>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="group rounded-xl border border-black/10 bg-white p-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-black hover:bg-black hover:text-white sm:rounded-2xl sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <p className="text-[9px] uppercase tracking-[0.15em] text-black/35 transition-colors duration-200 group-hover:text-white/60 sm:text-xs sm:tracking-[0.2em]">
                                    {stat.label}
                                </p>

                                <span className="text-sm text-black transition-all duration-300 group-hover:rotate-180 group-hover:text-white">
                                    ↗
                                </span>
                            </div>

                            <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
                                <p className="text-xl font-light text-black transition-colors duration-200 group-hover:text-white sm:text-2xl">
                                    {stat.value}
                                </p>

                                <span className="w-fit rounded-full bg-[#e8eee9] px-2 py-1 text-[9px] text-[#637568] transition-all duration-200 group-hover:bg-white/10 group-hover:text-white sm:px-2.5 sm:py-1 sm:text-[10px]">
                                    {stat.change}
                                </span>
                            </div>
                        </Link>
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
                                    {salesPeriod === "7D"
                                        ? "Last 7 days"
                                        : salesPeriod === "30D"
                                            ? "Last 30 days"
                                            : "Last year"}
                                </p>
                            </div>

                            <div className="group/period relative">
                                <button
                                    type="button"
                                    className="flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-[10px] text-black/45 transition-all duration-200 hover:border-black hover:bg-black hover:text-white sm:px-3.5 sm:py-2 sm:text-xs"
                                >
                                    <span>
                                        {salesPeriod === "7D"
                                            ? "Last 7 days"
                                            : salesPeriod === "30D"
                                                ? "Last 30 days"
                                                : "Last year"}
                                    </span>

                                    <span className="text-sm text-black transition-all duration-300 group-hover/period:rotate-180 group-hover/period:text-white">
                                        ↗
                                    </span>
                                </button>

                                <div className="invisible absolute right-0 top-full z-30 mt-2 w-36 translate-y-1 rounded-xl border border-black/10 bg-white p-1.5 opacity-0 shadow-[0_12px_35px_rgba(0,0,0,0.12)] transition-all duration-200 group-hover/period:visible group-hover/period:translate-y-0 group-hover/period:opacity-100">
                                    {[
                                        { value: "7D", label: "Last 7 days" },
                                        { value: "30D", label: "Last 30 days" },
                                        { value: "1Y", label: "Last year" },
                                    ].map((period) => (
                                        <button
                                            key={period.value}
                                            type="button"
                                            onClick={() => {
                                                const value = period.value as "7D" | "30D" | "1Y";

                                                setSalesPeriod(value);
                                                fetchSales(value);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[10px] transition-colors duration-200 sm:text-xs ${salesPeriod === period.value
                                                ? "bg-black text-white"
                                                : "text-black/50 hover:bg-black hover:text-white"
                                                }`}
                                        >
                                            <span>{period.label}</span>

                                            {salesPeriod === period.value && (
                                                <span className="text-xs">✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sales Chart */}
                        <div
                            className="relative mt-8 h-56 select-none sm:mt-10 sm:h-72"
                            onMouseLeave={() => setActivePoint(null)}
                        >
                            {salesLoading && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-[2px]">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-black" />
                                </div>
                            )}
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

                                            return ` M ${points[0]} L ${points.slice(1).join(" L ")} L 1000,300 L 0,300 Z`;
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
                            {chartData.map((item, index) => {
                                const showLabel =
                                    salesPeriod === "1Y"
                                        ? true
                                        : salesPeriod === "30D"
                                            ? index % 7 === 0
                                            : true;

                                if (!showLabel) return null;

                                return (
                                    <span key={item.date}>
                                        {new Date(item.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: salesPeriod === "1Y" ? undefined : "numeric",
                                        })}
                                    </span>
                                );
                            })}
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

                            <Link
                                href="/admin/products?bestseller=BESTSELLER"
                                className="group/view flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-[10px] text-black/45 transition-all duration-200 hover:border-black hover:bg-black hover:text-white sm:px-3.5 sm:py-2 sm:text-xs"
                            >
                                <span>View all</span>

                                <span className="text-sm text-black transition-all duration-300 group-hover/view:rotate-180 group-hover/view:text-white">
                                    ↗
                                </span>
                            </Link>
                        </div>

                        <div className="mt-6 space-y-2 sm:mt-8">
                            {dashboard.bestSellers.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-all duration-200 hover:border-black hover:bg-black sm:gap-4 sm:px-4 sm:py-4"
                                >
                                    {/* Number */}
                                    <span className="w-5 shrink-0 text-[10px] text-black/20 transition-colors duration-200 group-hover:text-white/40 sm:text-xs">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {/* Image */}
                                    {product.images ? (
                                        <img
                                            src={product.images}
                                            alt={product.title}
                                            className="h-10 w-10 shrink-0 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 shrink-0 rounded-lg bg-[#eeeeeb] transition-colors duration-200 group-hover:bg-white/10 sm:h-12 sm:w-12" />
                                    )}

                                    {/* Product info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-black/80 transition-colors duration-200 group-hover:text-white sm:text-sm">
                                            {product.title}
                                        </p>

                                        <p className="mt-1 text-[10px] text-black/30 transition-colors duration-200 group-hover:text-white/40 sm:text-xs">
                                            Best seller
                                        </p>
                                    </div>

                                    {/* Price + arrow */}
                                    <div className="flex shrink-0 items-center gap-2">
                                        <span className="text-xs text-black/60 transition-colors duration-200 group-hover:text-white sm:text-sm">
                                            ${product.price.toLocaleString()}
                                        </span>


                                        <span className="text-sm text-black/0 transition-all duration-300 group-hover:rotate-180 group-hover:text-white">
                                            ↗
                                        </span>

                                    </div>
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

                        <Link
                            href="/admin/orders"
                            className="group/view flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-[10px] text-black/45 transition-all duration-200 hover:border-black hover:bg-black hover:text-white sm:px-3.5 sm:py-2 sm:text-xs"
                        >
                            <span className="hidden sm:inline">
                                View all orders
                            </span>

                            <span className="sm:hidden">
                                View all
                            </span>

                            <span className="text-sm text-black transition-all duration-300 group-hover/view:rotate-180 group-hover/view:text-white">
                                ↗
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

                                    <th className="w-12 px-4 py-3 font-normal sm:px-8 sm:py-4" />
                                </tr>
                            </thead>

                            <tbody>
                                {dashboard.recentOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        onClick={() => {
                                            window.location.href = `/admin/orders/${order.id}`;
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                window.location.href = `/admin/orders/${order.id}`;
                                            }
                                        }}
                                        tabIndex={0}
                                        role="link"
                                        aria-label={`View order ${order.orderNumber}`}
                                        className="group cursor-pointer border-b border-black/5 text-xs transition-colors duration-200 last:border-0 hover:bg-black hover:text-white focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                                    >
                                        <td className="px-4 py-4 text-black/50 transition-colors duration-200 group-hover:text-white/60 sm:px-8 sm:py-5">
                                            #{order.orderNumber}
                                        </td>

                                        <td className="px-4 py-4 transition-colors duration-200 group-hover:text-white sm:px-8 sm:py-5">
                                            {order.user.name}
                                        </td>

                                        <td className="px-4 py-4 text-black/50 transition-colors duration-200 group-hover:text-white/60 sm:px-8 sm:py-5">
                                            {order.product}
                                        </td>

                                        <td className="px-4 py-4 transition-colors duration-200 group-hover:text-white sm:px-8 sm:py-5">
                                            ${order.total.toLocaleString()}
                                        </td>

                                        <td className="px-4 py-4 sm:px-8 sm:py-5">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[9px] uppercase tracking-wide transition-all duration-200 sm:px-3 sm:text-[10px] ${getStatusStyles(
                                                    order.status
                                                )} group-hover:bg-white/10 group-hover:text-white`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>

                                        {/* Arrow */}
                                        <td className="px-4 py-4 sm:px-8 sm:py-5">
                                            <div className="flex justify-end">
                                                <span className="text-sm text-black/0 transition-all duration-300 group-hover:rotate-180 group-hover:text-white">
                                                    ↗
                                                </span>
                                            </div>
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