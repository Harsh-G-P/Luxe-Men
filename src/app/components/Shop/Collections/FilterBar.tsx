"use client";

import Select from "react-select";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";

import {
    useEffect,
    useRef,
    useState,
} from "react";

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
    {
        value: "newest",
        label: "Newest",
    },
    {
        value: "price-low",
        label: "Price: Low to High",
    },
    {
        value: "price-high",
        label: "Price: High to Low",
    },
    {
        value: "bestseller",
        label: "Best Seller",
    },
];

const selectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        minHeight: "44px",
        height: "44px",
        borderRadius: "0px",
        border: `1px solid ${
            state.isFocused ? "#171717" : "#dedbd5"
        }`,
        backgroundColor: "#faf9f7",
        boxShadow: "none",
        cursor: "pointer",
        transition: "all 180ms ease",

        "&:hover": {
            borderColor: "#171717",
        },
    }),

    valueContainer: (base: any) => ({
        ...base,
        padding: "0 12px",
    }),

    singleValue: (base: any) => ({
        ...base,
        margin: 0,
        color: "#252525",
        fontSize: "11px",
        fontWeight: 400,
        letterSpacing: "0.02em",
    }),

    placeholder: (base: any) => ({
        ...base,
        margin: 0,
        color: "#77736d",
        fontSize: "9px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
    }),

    dropdownIndicator: (base: any, state: any) => ({
        ...base,
        padding: "0 10px 0 0",
        color: "#77736d",
        transition: "transform 180ms ease",
        transform: state.selectProps.menuIsOpen
            ? "rotate(180deg)"
            : "rotate(0deg)",

        "&:hover": {
            color: "#171717",
        },
    }),

    indicatorSeparator: () => ({
        display: "none",
    }),

    menu: (base: any) => ({
        ...base,
        marginTop: "5px",
        borderRadius: "0px",
        overflow: "hidden",
        border: "1px solid #dedbd5",
        backgroundColor: "#ffffff",
        boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
        zIndex: 100,
    }),

    menuList: (base: any) => ({
        ...base,
        padding: "5px",
    }),

    option: (base: any, state: any) => ({
        ...base,
        padding: "10px 12px",
        borderRadius: "0px",

        backgroundColor: state.isSelected
            ? "#171717"
            : state.isFocused
                ? "#f5f3ef"
                : "#ffffff",

        color: state.isSelected
            ? "#ffffff"
            : "#252525",

        fontSize: "11px",
        fontWeight: state.isSelected ? 500 : 400,
        cursor: "pointer",
        transition: "all 150ms ease",

        "&:active": {
            backgroundColor: "#171717",
            color: "#ffffff",
        },
    }),
};

export default function FilterBar({
    categories,
    brands,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [category, setCategory] = useState(
        searchParams.get("category") || ""
    );

    const [brand, setBrand] = useState(
        searchParams.get("brand") || ""
    );

    const [sort, setSort] = useState(
        searchParams.get("sort") || ""
    );

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const isFirstRender = useRef(true);

    const previousFilters = useRef({
        search: searchParams.get("search") || "",
        category: searchParams.get("category") || "",
        brand: searchParams.get("brand") || "",
        sort: searchParams.get("sort") || "",
    });

    useEffect(() => {
        setSearch(
            searchParams.get("search") || ""
        );

        setCategory(
            searchParams.get("category") || ""
        );

        setBrand(
            searchParams.get("brand") || ""
        );

        setSort(
            searchParams.get("sort") || ""
        );
    }, [searchParams]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const filtersChanged =
            previousFilters.current.search !== search ||
            previousFilters.current.category !== category ||
            previousFilters.current.brand !== brand ||
            previousFilters.current.sort !== sort;

        if (!filtersChanged) {
            return;
        }

        const timer = setTimeout(() => {
            const params = new URLSearchParams(
                searchParams.toString()
            );

            params.set("page", "1");

            if (search.trim()) {
                params.set(
                    "search",
                    search.trim()
                );
            } else {
                params.delete("search");
            }

            if (category) {
                params.set(
                    "category",
                    category
                );
            } else {
                params.delete("category");
            }

            if (brand) {
                params.set(
                    "brand",
                    brand
                );
            } else {
                params.delete("brand");
            }

            if (sort) {
                params.set(
                    "sort",
                    sort
                );
            } else {
                params.delete("sort");
            }

            const newUrl =
                `${pathname}?${params.toString()}`;

            const currentUrl =
                `${pathname}${
                    searchParams.toString()
                        ? `?${searchParams.toString()}`
                        : ""
                }`;

            if (newUrl !== currentUrl) {
                router.replace(newUrl, {
                    scroll: false,
                });
            }

            previousFilters.current = {
                search,
                category,
                brand,
                sort,
            };
        }, 500);

        return () =>
            clearTimeout(timer);
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

        previousFilters.current = {
            search: "",
            category: "",
            brand: "",
            sort: "",
        };

        router.replace(
            `${pathname}?page=1`,
            {
                scroll: false,
            }
        );
    };

    const hasFilters = Boolean(
        search ||
        category ||
        brand ||
        sort
    );

    const activeFilterCount = [
        search,
        category,
        brand,
        sort,
    ].filter(Boolean).length;

    const categoryOptions: Option[] = [
        {
            value: "",
            label: "All Categories",
        },
        ...categories.map((item) => ({
            value: item.id,
            label: item.title,
        })),
    ];

    const brandOptions: Option[] = [
        {
            value: "",
            label: "All Brands",
        },
        ...brands.map((item) => ({
            value: item.id,
            label: item.title,
        })),
    ];

    return (
        <>
            {/* MOBILE FILTER BUTTON */}
            <div className="bg-[#faf9f7] px-4 py-4 sm:px-5 lg:hidden">
                <button
                    type="button"
                    onClick={() =>
                        setMobileOpen(!mobileOpen)
                    }
                    className="flex h-11 w-full items-center justify-between border border-[#dedbd5] bg-white px-4 transition hover:border-black"
                >
                    <div className="flex items-center gap-3">
                        <svg
                            className="h-4 w-4 text-black/60"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M4 6h16" />
                            <path d="M7 12h10" />
                            <path d="M10 18h4" />
                        </svg>

                        <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#171717]">
                            Filters
                        </span>

                        {hasFilters && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[7px] text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </div>

                    <span
                        className={`text-lg leading-none transition-transform duration-300 ${
                            mobileOpen
                                ? "rotate-45"
                                : "rotate-0"
                        }`}
                    >
                        +
                    </span>
                </button>
            </div>

            {/* FILTER SIDEBAR */}
            <aside
                className={`
                    ${
                        mobileOpen
                            ? "block"
                            : "hidden"
                    }
                    lg:sticky
                    lg:top-16
                    lg:block
                    lg:h-[calc(100vh-48px)]
                    lg:self-start
                `}
            >
                <div className="mx-4 flex h-full flex-col border border-[#dedbd5] bg-white sm:mx-5 lg:mx-0">

                    {/*  HEADER */}
                    <div className="border-b border-[#e8e5df] px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">

                        <div className="flex items-start justify-between">

                            <div>
                                <div className="flex items-center gap-2.5">
                                    <span className="h-px w-6 bg-black/30 lg:w-8" />

                                    <span className="text-[7px] font-medium uppercase tracking-[0.4em] text-black/40 lg:text-[8px]">
                                        Refine
                                    </span>
                                </div>

                                <h3 className="mt-3 font-serif text-xl font-light tracking-tight text-[#171717] lg:mt-4 lg:text-2xl">
                                    Find Your Selection
                                </h3>

                                <p className="mt-2 max-w-60 text-[9px] leading-5 text-black/35 lg:text-[10px]">
                                    Curate your collection with refined filters.
                                </p>
                            </div>

                            {hasFilters && (
                                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-2 text-[7px] font-medium text-white lg:h-7 lg:min-w-7 lg:text-[8px]">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* FILTER CONTENT */}
                    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 lg:px-7 lg:py-8">

                        <div className="space-y-6 lg:space-y-8">

                            {/* SEARCH */}
                            <div>
                                <div className="mb-2.5 flex items-center gap-3">
                                    <span className="text-[7px] font-medium uppercase tracking-[0.35em] text-black/40 lg:text-[8px]">
                                        Search
                                    </span>

                                    <span className="h-px flex-1 bg-black/8" />
                                </div>

                                <div className="relative">
                                    <input
                                        id="product-search"
                                        type="text"
                                        value={search}
                                        placeholder="Search products"
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full border border-[#dedbd5] bg-[#faf9f7] px-3.5 pr-9 text-[10px] text-[#171717] outline-none transition placeholder:text-[8px] placeholder:uppercase placeholder:tracking-[0.13em] placeholder:text-black/30 hover:border-black/30 focus:border-black lg:h-12 lg:px-4 lg:text-[11px]"
                                    />

                                    <svg
                                        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/30"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                    >
                                        <circle
                                            cx="11"
                                            cy="11"
                                            r="7"
                                        />

                                        <path d="m20 20-4-4" />
                                    </svg>
                                </div>
                            </div>

                            {/* CATEGORY */}
                            <div>
                                <div className="mb-2.5 flex items-center gap-3">
                                    <span className="text-[7px] font-medium uppercase tracking-[0.35em] text-black/40 lg:text-[8px]">
                                        Category
                                    </span>

                                    <span className="h-px flex-1 bg-black/8" />
                                </div>

                                <Select
                                    instanceId="collection-category"
                                    styles={selectStyles}
                                    options={categoryOptions}
                                    value={
                                        categoryOptions.find(
                                            (option) =>
                                                option.value ===
                                                category
                                        ) || null
                                    }
                                    placeholder="All Categories"
                                    isSearchable={false}
                                    onChange={(option) =>
                                        setCategory(
                                            option?.value || ""
                                        )
                                    }
                                />
                            </div>

                            {/* BRAND */}
                            <div>
                                <div className="mb-2.5 flex items-center gap-3">
                                    <span className="text-[7px] font-medium uppercase tracking-[0.35em] text-black/40 lg:text-[8px]">
                                        Brand
                                    </span>

                                    <span className="h-px flex-1 bg-black/8" />
                                </div>

                                <Select
                                    instanceId="collection-brand"
                                    styles={selectStyles}
                                    options={brandOptions}
                                    value={
                                        brandOptions.find(
                                            (option) =>
                                                option.value ===
                                                brand
                                        ) || null
                                    }
                                    placeholder="All Brands"
                                    isSearchable={false}
                                    onChange={(option) =>
                                        setBrand(
                                            option?.value || ""
                                        )
                                    }
                                />
                            </div>

                            {/* SORT */}
                            <div>
                                <div className="mb-2.5 flex items-center gap-3">
                                    <span className="text-[7px] font-medium uppercase tracking-[0.35em] text-black/40 lg:text-[8px]">
                                        Sort By
                                    </span>

                                    <span className="h-px flex-1 bg-black/8" />
                                </div>

                                <Select
                                    instanceId="collection-sort"
                                    styles={selectStyles}
                                    options={sortOptions}
                                    value={
                                        sortOptions.find(
                                            (option) =>
                                                option.value ===
                                                sort
                                        ) || null
                                    }
                                    placeholder="Recommended"
                                    isSearchable={false}
                                    onChange={(option) =>
                                        setSort(
                                            option?.value || ""
                                        )
                                    }
                                />
                            </div>

                            {/*  ACTIVE FILTERS */}
                            {hasFilters && (
                                <div className="border-t border-[#eeeae4] pt-6 lg:pt-7">

                                    <div className="mb-3.5 flex items-center gap-3">
                                        <span className="text-[7px] font-medium uppercase tracking-[0.35em] text-black/40 lg:text-[8px]">
                                            Active Filters
                                        </span>

                                        <span className="h-px flex-1 bg-black/8" />
                                    </div>

                                    <div className="space-y-2">

                                        {search && (
                                            <div className="bg-[#faf9f7] px-3 py-2.5">
                                                <span className="block truncate text-[8px] uppercase tracking-widest text-black/50">
                                                    Search: {search}
                                                </span>
                                            </div>
                                        )}

                                        {category && (
                                            <div className="bg-[#faf9f7] px-3 py-2.5">
                                                <span className="text-[8px] uppercase tracking-widest text-black/50">
                                                    Category selected
                                                </span>
                                            </div>
                                        )}

                                        {brand && (
                                            <div className="bg-[#faf9f7] px-3 py-2.5">
                                                <span className="text-[8px] uppercase tracking-widest text-black/50">
                                                    Brand selected
                                                </span>
                                            </div>
                                        )}

                                        {sort && (
                                            <div className="bg-[#faf9f7] px-3 py-2.5">
                                                <span className="text-[8px] uppercase tracking-widest text-black/50">
                                                    Sort applied
                                                </span>
                                            </div>
                                        )}

                                    </div>

                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="group mt-4 flex w-full items-center justify-center gap-3 border border-black/15 px-4 py-3 text-[8px] font-medium uppercase tracking-[0.28em] text-black/50 transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
                                    >
                                        <span>
                                            Clear All Filters
                                        </span>

                                        <span className="text-sm leading-none transition-transform duration-300 group-hover:rotate-90">
                                            ×
                                        </span>
                                    </button>
                                </div>
                            )}

                            <div className="relative mt-10 hidden overflow-hidden border border-[#e7e3dc] bg-[#fffefd] lg:block">

                                {/* Decorative background circle */}
                                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-black/6" />

                                <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full border border-black/5" />

                                <div className="relative px-6 py-7">

                                    {/* Top label */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[7px] font-medium uppercase tracking-[0.35em] text-black/35">
                                            The Edit
                                        </span>

                                        <span className="font-serif text-[15px] italic text-black/20">
                                            ✰
                                        </span>
                                    </div>

                                    {/* Decorative line */}
                                    <div className="mt-5 h-px w-full bg-black/[0.07]" />

                                    {/* Large editorial text */}
                                    <div className="mt-6">
                                        <p className="font-serif text-[25px] font-light leading-[1.05] tracking-tight text-[#171717]">
                                            Less,
                                            <br />
                                            but better.
                                        </p>

                                        <p className="mt-4 max-w-47.5 text-[9px] leading-5 text-black/40">
                                            Thoughtfully selected pieces,
                                            defined by timeless form,
                                            quality and quiet character.
                                        </p>
                                    </div>

                                    {/* Bottom detail */}
                                    <div className="mt-7 flex items-end justify-between">

                                        <div>
                                            <div className="h-px w-8 bg-black/30" />

                                            <span className="mt-2 block text-[6px] uppercase tracking-[0.3em] text-black/30">
                                                Curated for you
                                            </span>
                                        </div>

                                        {/* Minimal diamond */}
                                        <div className="flex h-8 w-8 rotate-45 items-center justify-center border border-black/15">
                                            <div className="h-2 w-2 bg-black/70" />
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="hidden pb-4 pt-2 text-center lg:block">

                                <span className="font-serif text-[13px] italic text-black/20">
                                    “Designed to endure.”
                                </span>

                                <div className="mx-auto mt-3 h-px w-8 bg-black/15" />
                            </div>

                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-[#e8e5df] bg-[#faf9f7] px-5 py-4 sm:px-6 lg:px-7 lg:py-5">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-2">
                                <span className="h-1 w-1 rounded-full bg-black/40" />

                                <span className="text-[6px] uppercase tracking-[0.3em] text-black/35 lg:text-[7px]">
                                    Curated Collection
                                </span>
                            </div>

                            <span className="text-[6px] uppercase tracking-[0.25em] text-black/20 lg:text-[7px]">
                                Refine
                            </span>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
}
