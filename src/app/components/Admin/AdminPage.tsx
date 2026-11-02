"use client"

import Image from "next/image";
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
            <section className="w-full px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-2xl border border-[#dedbd4] bg-[#faf9f6] px-6 py-16 text-center sm:px-12 sm:py-20">

                    {/* Loading Indicator */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#dedbd4] bg-[#f5f3ed]">
                        <div className="h-6 w-6 animate-spin border-2 border-[#dedbd4] border-t-[#9b8150]" />
                    </div>

                    {/* Eyebrow */}
                    <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.3em] text-[#9b8150]">
                        LUXE MEN / ADMINISTRATION
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
                        Please wait while we're retrieving your dashboard details.
                    </p>

                    {/* Loading Status */}
                    <div className="mt-9 flex items-center justify-center gap-2">
                        <span className="h-1 w-1 animate-pulse bg-[#9b8150]" />
                        <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa49b]">
                            Loading Dashboard
                        </span>
                    </div>

                </div>
            </section>
        );
    }

    if (!dashboard) {
        return (
            <section className="w-full px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-2xl border border-[#dedbd4] bg-[#faf9f6] px-6 py-16 text-center sm:px-12 sm:py-20">

                    {/* Unavailable Icon */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#dedbd4] bg-[#f5f3ed]">
                        <span className="font-serif text-2xl font-normal text-[#9b8150]">
                            !
                        </span>
                    </div>

                    {/* Eyebrow */}
                    <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.3em] text-[#9b8150]">
                        LUXE MEN / ADMINISTRATION
                    </p>

                    {/* Heading */}
                    <h2 className="mt-4 text-2xl font-light uppercase tracking-[0.18em] text-[#1b1a18] sm:text-3xl">
                        Unavailable
                    </h2>

                    {/* Divider */}
                    <div className="mx-auto mt-6 h-px w-12 bg-[#b49a6c]" />

                    {/* Description */}
                    <p className="mx-auto mt-6 max-w-sm text-xs leading-6 text-[#817d75] sm:text-sm">
                        We couldn't retrieve the dashboard information right now.
                        Please try again later.
                    </p>

                    {/* Retry Button */}
                    <div className="mt-9 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                setLoading(true);
                                fetchDashboard();
                            }}
                            className="group inline-flex min-h-11 items-center justify-center gap-3 border border-[#1b1a18] bg-[#1b1a18] px-6 py-3 text-[9px] font-medium uppercase tracking-[0.18em] text-[#faf9f6] transition-colors duration-300 hover:border-[#6f604e] hover:bg-[#6f604e]"
                        >
                            <span className="text-base font-light leading-none transition-transform duration-300 group-hover:rotate-90">
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
        <main className="min-h-screen bg-[#f5f4ef] text-[#1b1a18]">
            <div className="w-full min-w-0">

                {/* Welcome */}
                <div className="mb-8 flex flex-col gap-6 border-b border-[#dedbd4] pb-7 sm:mb-10 sm:pb-8 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-px w-8 bg-[#9b8150]" />
                            <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-[#9b8150] sm:text-[9px] sm:tracking-[0.3em]">
                                LUXE MEN / ADMINISTRATION
                            </p>
                        </div>

                        <h1 className="font-serif text-3xl font-normal tracking-[-0.03em] text-[#1b1a18] sm:text-4xl lg:text-5xl">
                            Good evening, {adminName}.
                        </h1>

                        <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-[#817d75]">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        <p className="mt-3 max-w-xl text-xs leading-6 text-[#817d75] sm:text-sm">
                            Here's what's happening with your store today.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="group min-w-0 border border-[#e2ded4] bg-[#faf9f6] p-4 transition-colors duration-300 hover:border-[#b9a782] hover:bg-[#f0ece3] sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-[8px] uppercase tracking-[0.14em] text-[#817d75] transition-colors duration-300 group-hover:text-[#6f604e] sm:text-[9px] sm:tracking-[0.2em]">
                                    {stat.label}
                                </p>

                                <span className="shrink-0 text-sm text-[#9b8150] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                                    ↗
                                </span>
                            </div>

                            <div className="mt-5 flex flex-col items-start gap-3 sm:mt-7">
                                <p className="wrap-break-word font-serif text-2xl font-normal tracking-tight text-[#1b1a18] sm:text-3xl">
                                    {stat.value}
                                </p>

                                <span className="inline-flex w-fit items-center border border-[#d9ddcf] bg-[#eef0e8] px-2 py-1 text-[8px] tracking-[0.04em] text-[#68795c] sm:text-[9px]">
                                    {stat.change}
                                </span>
                            </div>

                            <div className="mt-5 h-px w-8 bg-[#c8bb94] transition-all duration-300 group-hover:w-14" />
                        </Link>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="mt-4 grid min-w-0 gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1.5fr_1fr]">

                    {/* Sales Overview */}
                    <div className="min-w-0 border border-[#e2ded4] bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#9b8150] sm:text-[9px]">
                                    Performance / Analytics
                                </p>

                                <h2 className="mt-2 font-serif text-lg font-normal text-[#1b1a18] sm:text-xl">
                                    Sales Overview
                                </h2>

                                <p className="mt-3 wrap-break-word font-serif text-2xl font-normal tracking-tight text-[#1b1a18] sm:text-3xl">
                                    ${dashboard.salesOverviewTotal.toLocaleString()}
                                </p>

                                <p className="mt-2 text-[9px] text-[#817d75] sm:text-[10px]">
                                    {salesPeriod === "7D"
                                        ? "Last 7 days"
                                        : salesPeriod === "30D"
                                            ? "Last 30 days"
                                            : "Last year"}
                                </p>
                            </div>

                            {/* Period Selector */}
                            <div className="group/period relative shrink-0">
                                <button
                                    type="button"
                                    className="flex min-h-9 items-center gap-2 border border-[#dedbd4] bg-[#fdfcf9] px-2.5 text-[8px] uppercase tracking-[0.08em] text-[#57534c] transition-colors duration-300 hover:border-[#9b8150] hover:text-[#6f604e] sm:px-3 sm:text-[9px]"
                                >
                                    <span>
                                        {salesPeriod === "7D"
                                            ? "7 Days"
                                            : salesPeriod === "30D"
                                                ? "30 Days"
                                                : "1 Year"}
                                    </span>
                                    <span className="text-[#9b8150]">⌄</span>
                                </button>

                                <div className="invisible absolute right-0 top-full z-30 mt-1 w-36 border border-[#dedbd4] bg-[#faf9f6] p-1 opacity-0 transition-all duration-200 group-hover/period:visible group-hover/period:opacity-100 group-focus-within/period:visible group-focus-within/period:opacity-100">
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
                                            className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-[9px] transition-colors duration-200 ${salesPeriod === period.value
                                                ? "bg-[#f0ece3] text-[#6f604e]"
                                                : "text-[#57534c] hover:bg-[#f3f0e9] hover:text-[#1b1a18]"
                                                }`}
                                        >
                                            <span>{period.label}</span>
                                            {salesPeriod === period.value && (
                                                <span className="text-[#9b8150]">✓</span>
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
                                <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#faf9f6]/80">
                                    <div className="h-6 w-6 animate-spin border-2 border-[#dedbd4] border-t-[#9b8150]" />
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
                                    <div className="min-w-40 border border-[#dedbd4] bg-[#1b1a18] px-3 py-3 text-[#faf9f6] sm:min-w-44 sm:px-4">
                                        <p className="text-[8px] uppercase tracking-[0.16em] text-[#c8bb94]">
                                            {new Date(
                                                chartData[activePoint].date
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>

                                        <div className="mt-3 flex items-end justify-between gap-4">
                                            <div>
                                                <p className="text-[8px] uppercase tracking-[0.14em] text-white/50">
                                                    Revenue
                                                </p>
                                                <p className="mt-1 font-serif text-base sm:text-lg">
                                                    ${chartData[activePoint].revenue.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[8px] uppercase tracking-[0.14em] text-white/50">
                                                    Orders
                                                </p>
                                                <p className="mt-1 font-serif text-base sm:text-lg">
                                                    {chartData[activePoint].orders}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute left-1/2 top-full h-48 w-px -translate-x-1/2 bg-[#9b8150]/40" />
                                </div>
                            )}

                            {/* Chart Area */}
                            <div className="relative h-full">
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
                                                stopColor="#9b8150"
                                                stopOpacity="0.2"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#9b8150"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    {/* Subtle Grid Lines */}
                                    {[60, 130, 200, 280].map((y) => (
                                        <line
                                            key={y}
                                            x1="0"
                                            y1={y}
                                            x2="1000"
                                            y2={y}
                                            stroke="#e8e4dc"
                                            strokeWidth="1"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    ))}

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

                                            return `M ${points[0]} L ${points.slice(1).join(" L ")} L 1000,300 L 0,300 Z`;
                                        })()}
                                        fill="url(#salesGradient)"
                                    />

                                    {/* Main Line */}
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
                                        stroke="#9b8150"
                                        strokeWidth="2"
                                        vectorEffect="non-scaling-stroke"
                                    />

                                    {/* Hover Points */}
                                    {chartData.map((item, index) => {
                                        const x =
                                            (index / (chartData.length - 1)) * 1000;
                                        const y =
                                            280 -
                                            (item.revenue / maxRevenue) * 230;

                                        return (
                                            <g key={item.date}>
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

                                                {activePoint === index && (
                                                    <>
                                                        <circle
                                                            cx={x}
                                                            cy={y}
                                                            r="8"
                                                            fill="#faf9f6"
                                                            stroke="#9b8150"
                                                            strokeWidth="2"
                                                        />
                                                        <circle
                                                            cx={x}
                                                            cy={y}
                                                            r="3"
                                                            fill="#9b8150"
                                                        />
                                                    </>
                                                )}
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Hover Columns */}
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

                        {/* Chart Labels */}
                        <div className="mt-4 flex justify-between gap-1 overflow-hidden text-[7px] uppercase tracking-[0.08em] text-[#aaa49b] sm:text-[9px] sm:tracking-[0.14em]">
                            {chartData.map((item, index) => {
                                const showLabel =
                                    salesPeriod === "1Y"
                                        ? true
                                        : salesPeriod === "30D"
                                            ? index % 7 === 0
                                            : true;

                                if (!showLabel) return null;

                                return (
                                    <span key={item.date} className="whitespace-nowrap">
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
                    <div className="min-w-0 border border-[#e2ded4] bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#9b8150] sm:text-[9px]">
                                    Commerce / Performance
                                </p>
                                <h2 className="mt-2 font-serif text-lg font-normal text-[#1b1a18] sm:text-xl">
                                    Best Sellers
                                </h2>
                            </div>

                            <Link
                                href="/admin/products?bestseller=BESTSELLER"
                                className="group/view flex shrink-0 items-center gap-2 border border-[#dedbd4] bg-[#fdfcf9] px-2.5 py-2 text-[8px] uppercase tracking-widest text-[#57534c] transition-colors duration-300 hover:border-[#9b8150] hover:text-[#6f604e] sm:px-3 sm:text-[9px]"
                            >
                                <span>View all</span>
                                <span className="text-[#9b8150] transition-transform duration-300 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5">
                                    ↗
                                </span>
                            </Link>
                        </div>

                        <div className="mt-5 border-t border-[#e8e4dc] sm:mt-7">
                            {dashboard.bestSellers.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="group flex min-w-0 items-center gap-3 border-b border-[#e8e4dc] py-4 transition-colors duration-300 last:border-0 hover:bg-[#f3f0e9] sm:gap-4"
                                >
                                    {/* Number */}
                                    <span className="w-5 shrink-0 text-[9px] tabular-nums text-[#aaa49b]">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {/* Image */}
                                    {product.images ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.title}
                                            width={48}
                                            height={48}
                                            className="h-11 w-11 shrink-0 border border-[#e2ded4] object-cover sm:h-12 sm:w-12"
                                        />

                                    ) : (
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#e2ded4] bg-[#f3f0e9] sm:h-12 sm:w-12">
                                            <span className="font-serif text-sm text-[#b49a6c]">
                                                L
                                            </span>
                                        </div>
                                    )}

                                    {/* Product Info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[11px] text-[#34312c] transition-colors duration-300 group-hover:text-[#6f604e] sm:text-xs">
                                            {product.title}
                                        </p>
                                        <p className="mt-1.5 text-[8px] uppercase tracking-[0.12em] text-[#aaa49b]">
                                            Best seller
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="flex shrink-0 items-center gap-2">
                                        <span className="text-[11px] tabular-nums text-[#57534c] sm:text-xs">
                                            ${product.price.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-[#b49a6c] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            ↗
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="mt-4 min-w-0 overflow-hidden border border-[#e2ded4] bg-[#faf9f6] sm:mt-6">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 border-b border-[#e2ded4] p-4 sm:p-6 lg:px-8">
                        <div>
                            <p className="text-[8px] uppercase tracking-[0.2em] text-[#9b8150] sm:text-[9px]">
                                Commerce / Activity
                            </p>
                            <h2 className="mt-2 font-serif text-lg font-normal text-[#1b1a18] sm:text-xl">
                                Recent Orders
                            </h2>
                        </div>

                        <Link
                            href="/admin/orders"
                            className="group/view flex shrink-0 items-center gap-2 border border-[#dedbd4] bg-[#fdfcf9] px-2.5 py-2 text-[8px] uppercase tracking-widest text-[#57534c] transition-colors duration-300 hover:border-[#9b8150] hover:text-[#6f604e] sm:px-3 sm:text-[9px]"
                        >
                            <span className="hidden sm:inline">View all orders</span>
                            <span className="sm:hidden">View all</span>
                            <span className="text-[#9b8150] transition-transform duration-300 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5">
                                ↗
                            </span>
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-162.5 text-left">
                            <thead>
                                <tr className="border-b border-[#e8e4dc] bg-[#f3f0e9] text-[8px] uppercase tracking-[0.16em] text-[#817d75] sm:text-[9px] sm:tracking-[0.2em]">
                                    <th className="px-4 py-3.5 font-medium sm:px-8 sm:py-4">
                                        Order
                                    </th>
                                    <th className="px-4 py-3.5 font-medium sm:px-8 sm:py-4">
                                        Customer
                                    </th>
                                    <th className="px-4 py-3.5 font-medium sm:px-8 sm:py-4">
                                        Product
                                    </th>
                                    <th className="px-4 py-3.5 font-medium sm:px-8 sm:py-4">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3.5 font-medium sm:px-8 sm:py-4">
                                        Status
                                    </th>
                                    <th className="w-12 px-4 py-3.5 font-medium sm:px-8 sm:py-4" />
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
                                        className="group cursor-pointer border-b border-[#e8e4dc] text-[11px] transition-colors duration-200 last:border-0 hover:bg-[#f0ece3] focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#9b8150] sm:text-xs"
                                    >
                                        <td className="whitespace-nowrap px-4 py-4 text-[#817d75] sm:px-8 sm:py-5">
                                            <span className="text-[#b49a6c]">#</span>
                                            {order.orderNumber}
                                        </td>

                                        <td className="px-4 py-4 text-[#34312c] sm:px-8 sm:py-5">
                                            {order.user.name}
                                        </td>

                                        <td className="px-4 py-4 text-[#817d75] sm:px-8 sm:py-5">
                                            {order.product}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 tabular-nums text-[#34312c] sm:px-8 sm:py-5">
                                            ${order.total.toLocaleString()}
                                        </td>

                                        <td className="px-4 py-4 sm:px-8 sm:py-5">
                                            <span
                                                className={`inline-flex border px-2 py-1 text-[8px] uppercase tracking-[0.08em] sm:px-2.5 sm:text-[9px] ${getStatusStyles(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 sm:px-8 sm:py-5">
                                            <div className="flex justify-end">
                                                <span className="text-sm text-[#b49a6c] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
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