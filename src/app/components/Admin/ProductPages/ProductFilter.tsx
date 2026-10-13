"use client";

import Select from "react-select";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

type Option = {
    value: string;
    label: string;
};

const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
];

const featuredOptions = [
    { value: "ALL", label: "All Featured" },
    { value: "FEATURED", label: "Featured" },
    { value: "NOT_FEATURED", label: "Not Featured" },
];

const bestsellerOptions = [
    { value: "ALL", label: "All Products" },
    { value: "BESTSELLER", label: "Bestsellers" },
    { value: "NOT_BESTSELLER", label: "Not Bestsellers" },
];

const stockOptions = [
    { value: "ALL", label: "All Stock" },
    { value: "IN_STOCK", label: "In Stock" },
    { value: "LOW_STOCK", label: "Low Stock" },
    { value: "OUT_OF_STOCK", label: "Out of Stock" },
];

const sortOptions = [
    { value: "NEWEST", label: "Newest First" },
    { value: "OLDEST", label: "Oldest First" },
    { value: "HIGH", label: "Highest Price" },
    { value: "LOW", label: "Lowest Price" },
    { value: "NAME_AZ", label: "Name A-Z" },
    { value: "NAME_ZA", label: "Name Z-A" },
];

const dateOptions = [
    { value: "ALL", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "This Month" },
];

export default function ProductFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    const [brands, setBrands] = useState<Option[]>([]);
    const [categories, setCategories] = useState<Option[]>([]);

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setSearch(searchParams.get("search") ?? "");
    }, [searchParams]);

    useEffect(() => {
        const getFilters = async () => {
            try {
                const [brandsRes, categoriesRes] =
                    await Promise.all([
                        fetch("/api/brand"),
                        fetch("/api/category"),
                    ]);

                const brandsData = await brandsRes.json();
                const categoriesData =
                    await categoriesRes.json();

                if (brandsRes.ok) {
                    setBrands(
                        brandsData.data.map(
                            (brand: any) => ({
                                value: brand.id,
                                label: brand.title,
                            })
                        )
                    );
                }

                if (categoriesRes.ok) {
                    setCategories(
                        categoriesData.data.map(
                            (category: any) => ({
                                value: category.id,
                                label: category.title,
                            })
                        )
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load filters",
                    error
                );
            }
        };

        getFilters();
    }, []);

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

    const brandOptions = [
        {
            value: "ALL",
            label: "All Brands",
        },
        ...brands,
    ];

    const categoryOptions = [
        {
            value: "ALL",
            label: "All Categories",
        },
        ...categories,
    ];

    /*
     * Count active filters.
     */
    const activeFilterCount = useMemo(() => {
        let count = 0;

        const filterKeys = [
            "search",
            "brand",
            "category",
            "status",
            "featured",
            "bestseller",
            "stock",
            "date",
        ];

        filterKeys.forEach((key) => {
            const value = searchParams.get(key);

            if (value && value !== "ALL") {
                count++;
            }
        });

        const sort = searchParams.get("sort");

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
                                Admin / Catalog
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#34312c]">
                                Filter Products
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
                            Catalog Management
                        </p>

                        <h3 className="mt-1.5 font-serif text-lg font-normal text-[#1b1a18]">
                            Filter Products
                        </h3>

                        <p className="mt-1 text-[9px] leading-5 text-[#817d75]">
                            Refine your collection by brand, category, inventory, and status.
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
                                htmlFor="product-search"
                                className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]"
                            >
                                Search Products
                            </label>

                            <input
                                id="product-search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    updateFilter("search", e.target.value);
                                }}
                                placeholder="Search products..."
                                className="h-10.5 w-full rounded-none border border-[#d4cfc5] bg-[#fdfcf9] px-3 text-[10px] tracking-[0.04em] text-[#34312c] outline-none transition-colors duration-300 placeholder:text-[#aaa49b] hover:border-[#b9ad98] focus:border-[#9a8a74]"
                            />
                        </div>

                        {/* Brand */}
                        <div className="min-w-0">
                            <label className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                Brand
                            </label>

                            <Select
                                {...selectProps}
                                instanceId="product-brand"
                                options={brandOptions}
                                placeholder="All Brands"
                                value={
                                    brandOptions.find(
                                        (x) =>
                                            x.value ===
                                            (searchParams.get("brand") ?? "ALL")
                                    ) ?? null
                                }
                                onChange={(option) =>
                                    updateFilter("brand", option?.value ?? "ALL")
                                }
                            />
                        </div>

                        {/* Category */}
                        <div className="min-w-0">
                            <label className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                Category
                            </label>

                            <Select
                                {...selectProps}
                                instanceId="product-category"
                                options={categoryOptions}
                                placeholder="All Categories"
                                value={
                                    categoryOptions.find(
                                        (x) =>
                                            x.value ===
                                            (searchParams.get("category") ?? "ALL")
                                    ) ?? null
                                }
                                onChange={(option) =>
                                    updateFilter("category", option?.value ?? "ALL")
                                }
                            />
                        </div>

                        {/* Status */}
                        <div className="min-w-0">
                            <label className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                Product Status
                            </label>

                            <Select
                                {...selectProps}
                                instanceId="product-status"
                                options={statusOptions}
                                placeholder="All Status"
                                value={
                                    statusOptions.find(
                                        (x) =>
                                            x.value ===
                                            (searchParams.get("status") ?? "ALL")
                                    ) ?? null
                                }
                                onChange={(option) =>
                                    updateFilter("status", option?.value ?? "ALL")
                                }
                            />
                        </div>

                        {/* Featured */}
                        <div className="min-w-0">
                            <label className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                Featured
                            </label>

                            <Select
                                {...selectProps}
                                instanceId="product-featured"
                                options={featuredOptions}
                                placeholder="All Products"
                                value={
                                    featuredOptions.find(
                                        (x) =>
                                            x.value ===
                                            (searchParams.get("featured") ?? "ALL")
                                    ) ?? null
                                }
                                onChange={(option) =>
                                    updateFilter("featured", option?.value ?? "ALL")
                                }
                            />
                        </div>

                        {/* Bestseller */}
                        <div className="min-w-0">
                            <label className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                Bestseller
                            </label>

                            <Select
                                {...selectProps}
                                instanceId="product-bestseller"
                                options={bestsellerOptions}
                                placeholder="All Products"
                                value={
                                    bestsellerOptions.find(
                                        (x) =>
                                            x.value ===
                                            (searchParams.get("bestseller") ?? "ALL")
                                    ) ?? null
                                }
                                onChange={(option) =>
                                    updateFilter("bestseller", option?.value ?? "ALL")
                                }
                            />
                        </div>

                        {/* Stock */}
                        <div className="min-w-0">
                            <label className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                Inventory
                            </label>

                            <Select
                                {...selectProps}
                                instanceId="product-stock"
                                options={stockOptions}
                                placeholder="All Inventory"
                                value={
                                    stockOptions.find(
                                        (x) =>
                                            x.value ===
                                            (searchParams.get("stock") ?? "ALL")
                                    ) ?? null
                                }
                                onChange={(option) =>
                                    updateFilter("stock", option?.value ?? "ALL")
                                }
                            />
                        </div>

                        {/* Date */}
                        <div className="min-w-0">
                            <label className="mb-2 block text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                Date Added
                            </label>

                            <Select
                                {...selectProps}
                                instanceId="product-date"
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
                                instanceId="product-sort"
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