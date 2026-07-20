"use client";

import Select from "react-select";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Option = {
    value: string;
    label: string;
};

type Props = {
    categories: {
        id: string;
        title: string;
    }[];
    brands: {
        id: string;
        title: string;
    }[];
};

const sortOptions: Option[] = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "bestseller", label: "Best Seller" },
];

const selectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        minHeight: "48px",
        borderRadius: "16px",
        borderColor: state.isFocused ? "#000" : "#e5e7eb",
        boxShadow: "none",
        "&:hover": {
            borderColor: "#000",
        },
    }),

    valueContainer: (base: any) => ({
        ...base,
        padding: "0 14px",
    }),

    indicatorSeparator: () => ({
        display: "none",
    }),

    menu: (base: any) => ({
        ...base,
        borderRadius: "16px",
        overflow: "hidden",
        zIndex: 50,
    }),

    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? "#f5f5f5" : "#fff",
        color: "#000",
        cursor: "pointer",
    }),
};

export default function FilterBar({ categories, brands }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [category, setCategory] = useState(searchParams.get("category") || "")
    const [brand, setBrand] = useState(searchParams.get("brand") || "")
    const [sort, setSort] = useState(searchParams.get("sort") || "");
    
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setCategory(searchParams.get("category") || "");
        setBrand(searchParams.get("brand") || "");
        setSort(searchParams.get("sort") || "");
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams();

            if (search.trim()) {
                params.set("search", search.trim());
            }

            if (category) {
                params.set("category", category);
            }

            if (brand) {
                params.set("brand", brand);
            }

            if (sort) {
                params.set("sort", sort);
            }

            const newUrl = `${pathname}${params.toString() ? `?${params}` : ""
                }`;

            const currentUrl = `${pathname}${searchParams.toString()
                ? `?${searchParams}`
                : ""
                }`;

            if (newUrl !== currentUrl) {
                router.replace(newUrl, {
                    scroll: false,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [
        search,
        category,
        brand,
        sort,
        pathname,
        router,
        searchParams,
    ]);

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setBrand("");
        setSort("");

        router.replace("/collections", {
            scroll: false,
        });
    };

    return (
        <section className="bg-white py-10">
            <div className="mx-auto max-w-375 px-5 md:px-6">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-12 rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-black"
                        />

                        {/* Category */}
                        <Select
                            instanceId="category"
                            styles={selectStyles}
                            placeholder="All Categories"
                            value={
                                [
                                    { value: "", label: "All Categories" },
                                    ...categories.map((c) => ({
                                        value: c.id,
                                        label: c.title,
                                    })),
                                ].find((item) => item.value === category) || null
                            }
                            onChange={(option) =>
                                setCategory(option?.value || "")
                            }
                            options={[
                                {
                                    value: "",
                                    label: "All Categories",
                                },
                                ...categories.map((category) => ({
                                    value: category.id,
                                    label: category.title,
                                })),
                            ]}
                        />

                        {/* Brand */}
                        <Select
                            instanceId="brand"
                            styles={selectStyles}
                            placeholder="All Brands"
                            value={
                                [
                                    { value: "", label: "All Brands" },
                                    ...brands.map((b) => ({
                                        value: b.id,
                                        label: b.title,
                                    })),
                                ].find((item) => item.value === brand) || null
                            }
                            onChange={(option) =>
                                setBrand(option?.value || "")
                            }
                            options={[
                                {
                                    value: "",
                                    label: "All Brands",
                                },
                                ...brands.map((brand) => ({
                                    value: brand.id,
                                    label: brand.title,
                                })),
                            ]}
                        />

                        {/* Sort */}
                        <Select
                            instanceId="sort"
                            styles={selectStyles}
                            placeholder="Sort By"
                            value={
                                sortOptions.find((option) => option.value === sort) || null
                            }
                            onChange={(option) => setSort(option?.value || "")}
                            options={sortOptions}
                        />

                        <button
                            onClick={clearFilters}
                            className="rounded-2xl border border-gray-200 px-4 py-3 text-sm transition hover:border-black"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}