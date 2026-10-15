"use client";

import Select from "react-select";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    SlidersHorizontal,
    X,
} from "lucide-react";

const sortOptions = [
    {
        value: "NEWEST",
        label: "Newest First",
    },
    {
        value: "OLDEST",
        label: "Oldest First",
    },
    {
        value: "NAME_AZ",
        label: "Name A-Z",
    },
    {
        value: "NAME_ZA",
        label: "Name Z-A",
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

export default function CategoryAttributeFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    const [mobileOpen, setMobileOpen] =
        useState(false);

    useEffect(() => {
        setSearch(
            searchParams.get("search") ?? ""
        );
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

        // Reset pagination whenever a filter changes
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

    const clearFilters = () => {
        setSearch("");

        router.replace(pathname, {
            scroll: false,
        });
    };

    const activeFilterCount = useMemo(() => {
        let count = 0;

        const search =
            searchParams.get("search");

        const date =
            searchParams.get("date");

        const sort =
            searchParams.get("sort");

        if (search) {
            count++;
        }

        if (date && date !== "ALL") {
            count++;
        }

        if (sort && sort !== "NEWEST") {
            count++;
        }

        return count;
    }, [searchParams]);

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            minHeight: "44px",
            height: "44px",
            borderRadius: 0,
            border: state.isFocused
                ? "1px solid #9b8150"
                : "1px solid #d4cfc5",
            backgroundColor: "#faf9f6",
            boxShadow: "none",
            cursor: "pointer",
            paddingLeft: "8px",
            transition: "border-color 300ms ease",

            "&:hover": {
                borderColor: "#9b8150",
            },
        }),

        valueContainer: (base: any) => ({
            ...base,
            padding: "0 12px",
        }),

        placeholder: (base: any) => ({
            ...base,
            color: "#aaa49b",
            fontSize: "9px",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
        }),

        singleValue: (base: any) => ({
            ...base,
            color: "#34312c",
            fontSize: "10px",
            letterSpacing: "0.08em",
        }),

        indicatorSeparator: () => ({
            display: "none",
        }),

        dropdownIndicator: (base: any, state: any) => ({
            ...base,
            color: "#9b8150",
            paddingRight: "16px",
            transition: "transform 300ms ease",

            transform: state.selectProps.menuIsOpen
                ? "rotate(180deg)"
                : "rotate(0deg)",

            "&:hover": {
                color: "#9b8150",
            },
        }),

        menu: (base: any) => ({
            ...base,
            marginTop: "4px",
            borderRadius: 0,
            border: "1px solid #d4cfc5",
            backgroundColor: "#faf9f6",
            boxShadow: "0 15px 35px rgba(28, 27, 24, 0.08)",
            overflow: "hidden",
            zIndex: 50,
        }),

        menuList: (base: any) => ({
            ...base,

            /*
             * Four options visible.
             * Additional options scroll vertically.
             */
            maxHeight: "135px",
            overflowY: "auto",
            padding: "6px 0",

            /* Firefox */
            scrollbarWidth: "thin",
            scrollbarColor: "#c8b78e transparent",

            /* Chrome / Edge / Safari */
            "&::-webkit-scrollbar": {
                width: "4px",
            },

            "&::-webkit-scrollbar-track": {
                background: "transparent",
            },

            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c8b78e",
            },

            "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#9b8150",
            },
        }),

        option: (base: any, state: any) => ({
            ...base,

            minHeight: "41px",
            padding: "14px 18px",

            backgroundColor: state.isSelected
                ? "#f1eee7"
                : state.isFocused
                    ? "#f5f2eb"
                    : "#faf9f6",

            color: state.isSelected
                ? "#9b8150"
                : "#34312c",

            fontSize: "9px",
            lineHeight: "13px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",

            cursor: "pointer",
            transition: "all 200ms ease",

            "&:active": {
                backgroundColor: "#eee9df",
            },
        }),
    };

    const selectProps = {
        styles: selectStyles,

        menuPortalTarget:
            typeof document !== "undefined"
                ? document.body
                : undefined,

        menuPosition: "fixed" as const,

        menuPlacement: "auto" as const,

        menuShouldScrollIntoView: false,

        isSearchable: false,
    };


    return (
        <section className="mb-8">
            {/* Mobile Filter Button */}
            <div className="mb-4 md:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="group flex min-h-12 w-full items-center justify-between border border-[#e2ded4] bg-[#faf9f6] px-4 transition-all duration-300 hover:border-[#c8bb94]"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center border border-[#dedbd4] bg-[#f3f0e9] text-[#9a8a74]">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                        </div>

                        <div className="text-left">
                            <p className="text-[7px] uppercase tracking-[0.25em] text-[#aaa69e]">
                                Admin / Attributes
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#34312c]">
                                Filter Category Attributes
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {activeFilterCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center border border-[#c9b99b] bg-[#f0e9df] px-1.5 text-[8px] text-[#765f44]">
                                {activeFilterCount}
                            </span>
                        )}

                        <span
                            className={`text-[11px] text-[#9a8a74] transition-transform duration-300 ${mobileOpen ? "rotate-180" : ""
                                }`}
                        >
                            ↓
                        </span>
                    </div>
                </button>
            </div>

            {/* Filter Panel */}
            <div
                className={`overflow-visible border border-[#e2ded4] bg-[#faf9f6] transition-all duration-300 ${mobileOpen ? "block" : "hidden"
                    } md:block`}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-[#e8e4dc] px-5 py-4 sm:px-6">
                    <div>
                        <p className="text-[7px] uppercase tracking-[0.28em] text-[#aaa69e]">
                            Category Attribute Management
                        </p>

                        <h3 className="mt-1.5 font-serif text-lg font-normal text-[#1b1a18]">
                            Filter Category Attributes
                        </h3>

                        <p className="mt-1 text-[9px] leading-5 text-[#817d75]">
                            Find category attributes by name, creation date, and sorting order.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {/* Mobile Close */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="flex h-8 w-8 items-center justify-center border border-[#dedbd4] text-[#817d75] transition-colors duration-300 hover:border-[#9a8a74] hover:text-[#6f604e] md:hidden"
                            aria-label="Close filters"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>

                        {/* Desktop Clear */}
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="group hidden h-9 items-center gap-2 border border-[#dedbd4] px-3 text-[8px] uppercase tracking-[0.14em] text-[#817d75] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#6f604e] sm:inline-flex"
                        >
                            <span className="text-sm transition-transform duration-300 group-hover:rotate-90">
                                ×
                            </span>

                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="overflow-visible p-4 sm:p-5">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Search */}
                        <div className="min-w-0">
                            <label
                                htmlFor="category-attribute-search"
                                className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]"
                            >
                                Search
                            </label>

                            <input
                                id="category-attribute-search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    updateFilter("search", e.target.value);
                                }}
                                placeholder="Search category attributes..."
                                className="h-10.5 w-full rounded-none border border-[#d4cfc5] bg-[#fdfcf9] px-3 text-[10px] tracking-[0.04em] text-[#34312c] outline-none transition-colors duration-300 placeholder:text-[#aaa49b] hover:border-[#b9ad98] focus:border-[#9a8a74]"
                            />
                        </div>

                        {/* Date */}
                        <div className="min-w-0">
                            <label className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                Creation Date
                            </label>

                            <Select
                                {...selectProps}
                                instanceId="category-attribute-date"
                                options={dateOptions}
                                placeholder="All Dates"
                                value={
                                    dateOptions.find(
                                        (x) =>
                                            x.value ===
                                            (searchParams.get("date") ?? "ALL")
                                    ) ?? null
                                }
                                onChange={(option) =>
                                    updateFilter("date", option?.value ?? "ALL")
                                }
                            />
                        </div>

                        {/* Sort */}
                        <div className="min-w-0">
                            <label className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                Sort By
                            </label>

                            <Select
                                {...selectProps}
                                instanceId="category-attribute-sort"
                                options={sortOptions}
                                placeholder="Newest First"
                                value={
                                    sortOptions.find(
                                        (x) =>
                                            x.value ===
                                            (searchParams.get("sort") ?? "NEWEST")
                                    ) ?? null
                                }
                                onChange={(option) =>
                                    updateFilter("sort", option?.value ?? "NEWEST")
                                }
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-[#e8e4dc] pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[8px] uppercase tracking-[0.18em] text-[#817d75]">
                                Active Filters
                            </p>

                            <p className="mt-1 text-[9px] text-[#aaa49b]">
                                {activeFilterCount > 0
                                    ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} applied`
                                    : "No additional filters applied"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="self-start text-[8px] uppercase tracking-[0.16em] text-[#817d75] underline decoration-[#d4cfc5] underline-offset-4 transition-colors duration-300 hover:text-[#6f604e] sm:self-auto"
                        >
                            Reset All Filters
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}