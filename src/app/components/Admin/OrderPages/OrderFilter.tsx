"use client";

import Select from "react-select";
import {
    useRouter,
    usePathname,
    useSearchParams
} from "next/navigation";
import { useEffect, useState } from "react";


const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];


const paymentOptions = [
    { value: "ALL", label: "All Payments" },
    { value: "PAID", label: "Paid" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
    { value: "REFUNDED", label: "Refunded" },
];


const sortOptions = [
    { value: "NEWEST", label: "Newest First" },
    { value: "OLDEST", label: "Oldest First" },
    { value: "HIGH", label: "Highest Total" },
    { value: "LOW", label: "Lowest Total" },
];

const methodOptions = [
    { value: "ALL", label: "All Methods" },
    { value: "COD", label: "Cash on Delivery" },
    { value: "STRIPE", label: "Stripe" },
];


const dateOptions = [
    { value: "ALL", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "This Month" },
];


const selectStyles = {

    control: (base: any, state: any) => ({

        ...base,

        minHeight: "48px",

        borderRadius: "16px",

        borderColor:
            state.isFocused
                ? "#000"
                : "#e5e7eb",

        boxShadow: "none",

        "&:hover": {
            borderColor: "#000",
        }

    }),


    indicatorSeparator: () => ({
        display: "none",
    }),

};

export default function OrderFilter() {

    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    useEffect(() => {

        setSearch(
            searchParams.get("search") ?? ""
        );

    }, [searchParams]);

    const updateFilter = (
        key: string,
        value: string
    ) => {

        const params =
            new URLSearchParams(
                searchParams.toString()
            );


        if (!value || value === "ALL") {

            params.delete(key);

        } else {

            params.set(key, value);

        }


        router.replace(
            `${pathname}?${params.toString()}`,
            {
                scroll: false,
            }
        );

    };

    const clearFilters = () => {

        router.replace(
            pathname,
            {
                scroll: false,
            }
        );

    };

    return (

        <section>

            <div className="mx-auto mb-10">

                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">


                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);

                                updateFilter(
                                    "search",
                                    e.target.value
                                );

                            }}
                            placeholder="Search orders..."
                            className=" h-12 rounded-2xl border  border-gray-200 px-4 text-sm outline-none focus:border-black "
                        />

                        {/* Status */}
                        <Select
                            instanceId="order-status"
                            styles={selectStyles}
                            options={statusOptions}
                            value={
                                statusOptions.find(
                                    x =>
                                        x.value ===
                                        (
                                            searchParams.get("status")
                                            ??
                                            "ALL"
                                        )
                                )
                            }
                            onChange={(option) =>
                                updateFilter(
                                    "status",
                                    option?.value ?? "ALL"
                                )
                            }
                        />

                        {/* Payment Status */}
                        <Select
                            instanceId="payment-status"
                            styles={selectStyles}
                            options={paymentOptions}
                            value={
                                paymentOptions.find(
                                    x =>
                                        x.value ===
                                        (
                                            searchParams.get("payment")
                                            ??
                                            "ALL"
                                        )
                                )
                            }
                            onChange={(option) =>
                                updateFilter(
                                    "payment",
                                    option?.value ?? "ALL"
                                )
                            }
                        />

                        {/* Payment */}
                        <Select
                            instanceId="payment-method"
                            styles={selectStyles}
                            options={methodOptions}
                            value={
                                methodOptions.find(
                                    x =>
                                        x.value ===
                                        (
                                            searchParams.get("method")
                                            ??
                                            "ALL"
                                        )
                                )
                            }
                            onChange={(option) =>
                                updateFilter(
                                    "method",
                                    option?.value ?? "ALL"
                                )
                            }
                        />

                        {/* Date */}
                        <Select
                            instanceId="order-date"
                            styles={selectStyles}
                            options={dateOptions}
                            value={
                                dateOptions.find(
                                    x =>
                                        x.value ===
                                        (
                                            searchParams.get("date")
                                            ??
                                            "ALL"
                                        )
                                )
                            }
                            onChange={(option) =>
                                updateFilter(
                                    "date",
                                    option?.value ?? "ALL"
                                )
                            }
                        />

                        {/* Sort by */}
                        <Select
                            instanceId="order-sort"
                            styles={selectStyles}
                            options={sortOptions}
                            value={
                                sortOptions.find(
                                    x =>
                                        x.value ===
                                        (
                                            searchParams.get("sort")
                                            ??
                                            "NEWEST"
                                        )
                                )
                            }
                            onChange={(option) =>
                                updateFilter(
                                    "sort",
                                    option?.value ?? ""
                                )
                            }
                        />

                        <button
                            onClick={clearFilters}
                            className="
                            rounded-2xl border border-gray-200
                            px-4 py-3 text-sm
                            hover:border-black
                            "
                        >
                            Clear Filters
                        </button>


                    </div>


                </div>

            </div>

        </section>

    );

}