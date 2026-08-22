"use client";

import Select from "react-select";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    SlidersHorizontal,
    X,
} from "lucide-react";

const roleOptions = [
    {
        value: "ALL",
        label: "All Roles",
    },
    {
        value: "USER",
        label: "Users",
    },
    {
        value: "ADMIN",
        label: "Admins",
    },
];

const sortOptions = [
    {
        value: "NEWEST",
        label: "Newest First",
    },
    {
        value: "OLDEST",
        label: "Oldest First",
    },
];

const dateOptions = [
    {
        value: "ALL",
        label: "All Dates",
    },
    {
        value: "today",
        label: "Today",
    },
    {
        value: "week",
        label: "Last 7 Days",
    },
    {
        value: "month",
        label: "This Month",
    },
];

export default function UserFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    const [mobileOpen, setMobileOpen] =
        useState(false);

    /*
     * Keep search synced with URL
     */
    useEffect(() => {
        setSearch(
            searchParams.get("search") ?? ""
        );
    }, [searchParams]);

    /*
     * Update filter
     */
    const updateFilter = (
        key: string,
        value: string
    ) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (
            !value ||
            value === "ALL" ||
            (
                key === "sort" &&
                value === "NEWEST"
            )
        ) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        /*
         * Always return to page 1
         * when filters change.
         */
        params.delete("page");

        const query = params.toString();

        router.replace(
            query
                ? `${pathname}?${query}`
                : pathname,
            {
                scroll: false,
            }
        );
    };

    /*
     * Clear filters
     */
    const clearFilters = () => {
        setSearch("");
        setMobileOpen(false);

        router.replace(pathname, {
            scroll: false,
        });
    };

    /*
     * Active filter count
     */
    const activeFilterCount = useMemo(() => {
        let count = 0;

        const search =
            searchParams.get("search");

        const role =
            searchParams.get("role");

        const date =
            searchParams.get("date");

        const sort =
            searchParams.get("sort");

        if (search) {
            count++;
        }

        if (
            role &&
            role !== "ALL"
        ) {
            count++;
        }

        if (
            date &&
            date !== "ALL"
        ) {
            count++;
        }

        if (
            sort &&
            sort !== "NEWEST"
        ) {
            count++;
        }

        return count;
    }, [searchParams]);

    /*
     * Select styles
     */
    const selectStyles = {
        control: (
            base: any,
            state: any
        ) => ({
            ...base,

            minHeight: "50px",
            height: "50px",

            borderRadius: "14px",

            backgroundColor:
                "#ffffff",

            border:
                state.isFocused
                    ? "1px solid #111827"
                    : "1px solid #e5e7eb",

            boxShadow:
                state.isFocused
                    ? "0 0 0 3px rgba(15,23,42,0.06)"
                    : "0 1px 2px rgba(15,23,42,0.02)",

            transition:
                "all 150ms ease",

            "&:hover": {
                borderColor:
                    "#cbd5e1",
            },

            cursor: "pointer",
        }),

        valueContainer: (
            base: any
        ) => ({
            ...base,
            padding: "0 15px",
        }),

        placeholder: (
            base: any
        ) => ({
            ...base,

            color: "#94a3b8",

            fontSize: "13px",
        }),

        singleValue: (
            base: any
        ) => ({
            ...base,

            color: "#334155",

            fontSize: "13px",

            fontWeight: 500,
        }),

        input: (
            base: any
        ) => ({
            ...base,

            color: "#0f172a",

            fontSize: "13px",
        }),

        indicatorsContainer: (
            base: any
        ) => ({
            ...base,

            paddingRight: "8px",
        }),

        dropdownIndicator: (
            base: any,
            state: any
        ) => ({
            ...base,

            color:
                state.isFocused
                    ? "#0f172a"
                    : "#94a3b8",

            transition:
                "transform 150ms ease",

            transform:
                state.selectProps
                    .menuIsOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",

            "&:hover": {
                color: "#0f172a",
            },
        }),

        indicatorSeparator: () => ({
            display: "none",
        }),

        menu: (
            base: any
        ) => ({
            ...base,

            marginTop: "7px",

            borderRadius: "14px",

            overflow: "hidden",

            border:
                "1px solid #e2e8f0",

            backgroundColor:
                "#ffffff",

            boxShadow:
                "0 20px 50px rgba(15,23,42,0.14), 0 4px 12px rgba(15,23,42,0.06)",

            zIndex: 99999,
        }),

        menuList: (
            base: any
        ) => ({
            ...base,

            padding: "6px",

            maxHeight: "260px",
        }),

        option: (
            base: any,
            state: any
        ) => ({
            ...base,

            borderRadius: "9px",

            padding:
                "10px 12px",

            marginBottom: "2px",

            backgroundColor:
                state.isSelected
                    ? "#0f172a"
                    : state.isFocused
                        ? "#f8fafc"
                        : "#ffffff",

            color:
                state.isSelected
                    ? "#ffffff"
                    : "#334155",

            fontSize: "13px",

            fontWeight:
                state.isSelected
                    ? 600
                    : 500,

            cursor: "pointer",

            transition:
                "background-color 120ms ease",

            "&:active": {
                backgroundColor:
                    "#0f172a",

                color:
                    "#ffffff",
            },
        }),
    };

    /*
     * Shared Select props
     */
    const selectProps = {
        styles: selectStyles,

        menuPortalTarget:
            typeof document !==
            "undefined"
                ? document.body
                : undefined,

        menuPosition:
            "fixed" as const,

        menuPlacement:
            "auto" as const,

        menuShouldScrollIntoView:
            false,

        isSearchable: false,
    };

    return (
        <section className="mb-10">

            {/* MOBILE FILTER BUTTON */}

            <div className="mb-4 md:hidden">

                <button
                    type="button"
                    onClick={() =>
                        setMobileOpen(
                            (prev) => !prev
                        )
                    }
                    className="group flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-slate-300"
                >

                    <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">

                            <SlidersHorizontal className="h-4 w-4" />

                        </div>

                        <div className="text-left">

                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                                Users
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                Filter Users
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        {activeFilterCount > 0 && (
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-950 px-2 text-[10px] font-bold text-white">
                                {activeFilterCount}
                            </span>
                        )}

                        <span
                            className={`text-slate-400 transition-transform duration-300 ${
                                mobileOpen
                                    ? "rotate-180"
                                    : ""
                            }`}
                        >
                            ↓
                        </span>

                    </div>

                </button>

            </div>

            {/* FILTER PANEL */}

            <div
                className={`
                    overflow-visible rounded-3xl border border-slate-200
                    bg-white shadow-[0_4px_25px_rgba(15,23,42,0.04)]
                    transition-all duration-300
                    ${
                        mobileOpen
                            ? "block"
                            : "hidden"
                    }
                    md:block
                `}
            >

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

                    <div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                            Users
                        </p>

                        <h3 className="mt-1 text-base font-semibold tracking-tight text-slate-900">
                            Filter Users
                        </h3>

                    </div>

                    <div className="flex items-center gap-2">

                        {/* MOBILE CLOSE */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileOpen(
                                    false
                                )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-900 hover:bg-slate-950 hover:text-white md:hidden"
                            aria-label="Close filters"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* DESKTOP CLEAR */}

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="group hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-900 hover:bg-slate-950 hover:text-white hover:shadow-md sm:inline-flex"
                        >

                            <span className="text-sm transition-transform duration-200 group-hover:rotate-90">
                                ×
                            </span>

                            Clear Filters

                        </button>

                    </div>

                </div>

                {/* FILTERS */}

                <div className="overflow-visible p-4 sm:p-5">

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {/* SEARCH */}

                        <div className="relative">

                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(
                                        e.target.value
                                    );

                                    updateFilter(
                                        "search",
                                        e.target.value
                                    );
                                }}
                                placeholder="Search users..."
                                className="h-12.5 w-full rounded-[14px] border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                            />

                        </div>

                        {/* ROLE */}

                        <Select
                            {...selectProps}
                            instanceId="user-role"
                            options={
                                roleOptions
                            }
                            placeholder="All Roles"
                            value={
                                roleOptions.find(
                                    (x) =>
                                        x.value ===
                                        (
                                            searchParams.get(
                                                "role"
                                            ) ??
                                            "ALL"
                                        )
                                )
                            }
                            onChange={(
                                option
                            ) =>
                                updateFilter(
                                    "role",
                                    option?.value ??
                                        "ALL"
                                )
                            }
                        />

                        {/* DATE */}

                        <Select
                            {...selectProps}
                            instanceId="user-date"
                            options={
                                dateOptions
                            }
                            placeholder="All Dates"
                            value={
                                dateOptions.find(
                                    (x) =>
                                        x.value ===
                                        (
                                            searchParams.get(
                                                "date"
                                            ) ??
                                            "ALL"
                                        )
                                )
                            }
                            onChange={(
                                option
                            ) =>
                                updateFilter(
                                    "date",
                                    option?.value ??
                                        "ALL"
                                )
                            }
                        />

                        {/* SORT */}

                        <Select
                            {...selectProps}
                            instanceId="user-sort"
                            options={
                                sortOptions
                            }
                            placeholder="Newest First"
                            value={
                                sortOptions.find(
                                    (x) =>
                                        x.value ===
                                        (
                                            searchParams.get(
                                                "sort"
                                            ) ??
                                            "NEWEST"
                                        )
                                )
                            }
                            onChange={(
                                option
                            ) =>
                                updateFilter(
                                    "sort",
                                    option?.value ??
                                        "NEWEST"
                                )
                            }
                        />

                    </div>

                    {/* FOOTER */}

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                            Refine your users
                        </p>

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="text-left text-xs font-semibold text-slate-500 underline-offset-4 transition hover:text-slate-950 hover:underline sm:text-right"
                        >
                            Reset all filters
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}