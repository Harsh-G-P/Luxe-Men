
"use client";

import Select from "react-select";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

const roleOptions = [
    { value: "ALL", label: "All Roles" },
    { value: "USER", label: "Users" },
    { value: "ADMIN", label: "Admins" },
];

const sortOptions = [
    { value: "NEWEST", label: "Newest First" },
    { value: "OLDEST", label: "Oldest First" },
];

const dateOptions = [
    { value: "ALL", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
];

const selectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        minHeight: "48px",
        borderRadius: "16px",
        borderColor: state.isFocused
            ? "#000"
            : "#e5e7eb",
        boxShadow: "none",

        "&:hover": {
            borderColor: "#000",
        },
    }),

    indicatorSeparator: () => ({
        display: "none",
    }),
};

export default function UserFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    useEffect(() => {
        setSearch(searchParams.get("search") ?? "");
    }, [searchParams]);

    const updateFilter = (
        key: string,
        value: string
    ) => {
        const params = new URLSearchParams(
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
        router.replace(pathname, {
            scroll: false,
        });

        setSearch("");
    };

    return (
        <section>
            <div className="mx-auto mb-10">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                        {/* Search */}
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);

                                updateFilter(
                                    "search",
                                    e.target.value
                                );
                            }}
                            placeholder="Search users..."
                            className="
                                h-12 rounded-2xl border
                                border-gray-200 px-4 text-sm
                                outline-none
                                focus:border-black
                            "
                        />

                        {/* Role */}
                        <Select
                            instanceId="user-role"
                            styles={selectStyles}
                            options={roleOptions}
                            value={
                                roleOptions.find(
                                    (x) =>
                                        x.value ===
                                        (
                                            searchParams.get("role") ??
                                            "ALL"
                                        )
                                )
                            }
                            onChange={(option) =>
                                updateFilter(
                                    "role",
                                    option?.value ?? "ALL"
                                )
                            }
                        />

                        {/* Date */}
                        <Select
                            instanceId="user-date"
                            styles={selectStyles}
                            options={dateOptions}
                            value={
                                dateOptions.find(
                                    (x) =>
                                        x.value ===
                                        (
                                            searchParams.get("date") ??
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

                        {/* Sort */}
                        <Select
                            instanceId="user-sort"
                            styles={selectStyles}
                            options={sortOptions}
                            value={
                                sortOptions.find(
                                    (x) =>
                                        x.value ===
                                        (
                                            searchParams.get("sort") ??
                                            "NEWEST"
                                        )
                                )
                            }
                            onChange={(option) =>
                                updateFilter(
                                    "sort",
                                    option?.value ?? "NEWEST"
                                )
                            }
                        />

                    </div>

                    {/* Clear */}
                    <div className="mt-4 lg:col-span-4">
                        <button
                            onClick={clearFilters}
                            className=" w-full rounded-2xl border border-gray-200 px-5 py-3 text-sm transition hover:border-black hover:bg-gray-50"
                        >
                            Clear Filters
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
