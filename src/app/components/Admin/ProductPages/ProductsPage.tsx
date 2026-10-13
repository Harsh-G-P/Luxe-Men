"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
    Edit3,
    Trash2,
    Package,
    Star,
    Trophy,
} from "lucide-react";
import ProductFilter from "./ProductFilter";

type Pagination = {
    page: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type ProductProps = {
    products: {
        id: string;
        title: string;
        price: string;
        images: string[];

        isActive: boolean;
        isFeatured: boolean;
        bestseller: boolean;

        createdAt: Date;

        brand: {
            title: string;
        };

        category: {
            title: string;
        };

        variants: {
            stock: number;
        }[];
    }[];

    pagination: Pagination;
};

export default function ProductPage({
    products,
    pagination,
}: ProductProps) {

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", page.toString());

        startTransition(() => {
            router.push(`/admin/products?${params.toString()}`);
        });
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);

            window.location.reload();

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    };

    if (isPending) {
        return (
            <section className="w-full px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-2xl border border-[#dedbd4] bg-[#faf9f6] px-6 py-16 text-center sm:px-12 sm:py-20">

                    {/* Loading Indicator */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#dedbd4] bg-[#f5f3ed]">
                        <div className="h-6 w-6 animate-spin border-2 border-[#dedbd4] border-t-[#9b8150]" />
                    </div>

                    {/* Eyebrow */}
                    <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.3em] text-[#9b8150]">
                        LUXE MEN / PRODUCT MANAGEMENT
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
                        Please wait while we update your product catalog.
                    </p>

                    {/* Loading Status */}
                    <div className="mt-9 flex items-center justify-center gap-2">
                        <span className="h-1 w-1 animate-pulse bg-[#9b8150]" />
                        <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa49b]">
                            Updating Products
                        </span>
                    </div>

                </div>
            </section>
        );
    }

    const getPaginationPages = (
        currentPage: number,
        totalPages: number
    ): (number | "...")[] => {
        const maxVisiblePages = 4;

        if (totalPages <= maxVisiblePages) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        // First pages
        if (currentPage <= 2) {
            return [
                1,
                2,
                3,
                4,
                "...",
                totalPages,
            ];
        }

        // Last pages
        if (currentPage >= totalPages - 1) {
            return [
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        // Middle pages
        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    };


    return (
        <div className="w-full bg-[#f5f4ef]">

            {/* Header */}
            <div className="mb-8 flex flex-col gap-6 border-b border-[#dedbd4] pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                    <div className="mb-3 flex items-center gap-3">
                        <span className="h-px w-7 bg-[#9a8a74]" />

                        <p className="text-[8px] uppercase tracking-[0.28em] text-[#aaa69e]">
                            Admin / Catalog Management
                        </p>
                    </div>

                    <h1 className="font-serif text-3xl font-normal tracking-[0.02em] text-[#1b1a18] sm:text-4xl">
                        Products
                    </h1>

                    <p className="mt-2 max-w-xl text-[10px] leading-6 text-[#817d75]">
                        Manage your collection, inventory, pricing, and product visibility.
                    </p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="group inline-flex min-h-11 items-center justify-center gap-3 border border-[#1b1a18] bg-[#1b1a18] px-5 py-3 text-[8px] uppercase tracking-[0.18em] text-[#faf9f6] transition-all duration-300 hover:border-[#6f604e] hover:bg-[#6f604e]"
                >
                    <span className="text-base font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                        +
                    </span>

                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <ProductFilter />

            {/* Product List */}
            <div className="mt-8 space-y-5">

                {/* List Heading */}
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#dedbd4] pb-4">
                    <div>
                        <p className="text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]">
                            Store Records
                        </p>

                        <h2 className="mt-2 font-serif text-xl font-normal text-[#1b1a18]">
                            Product List
                        </h2>

                        <p className="mt-1 text-[9px] text-[#817d75]">
                            Review your catalog, stock levels, and product details.
                        </p>
                    </div>

                    <p className="text-[9px] uppercase tracking-[0.14em] text-[#817d75]">
                        <span className="text-[#1b1a18]">
                            {pagination.totalProducts}
                        </span>{" "}
                        {pagination.totalProducts === 1 ? "Product" : "Products"}
                    </p>
                </div>

                {/* Products */}
                {products.length > 0 ? (
                    products.map((product) => {
                        const stock = product.variants.reduce(
                            (total, variant) => total + variant.stock,
                            0
                        );

                        return (
                            <div
                                key={product.id}
                                className="group overflow-hidden border border-[#e2ded4] bg-[#faf9f6] transition-all duration-300 hover:border-[#c8bb94] hover:bg-[#fdfcf9] hover:shadow-[0_10px_30px_rgba(45,40,30,0.06)]"
                            >
                                <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1.5fr_1.15fr_0.9fr] lg:gap-7">

                                    {/* Product Information */}
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="relative shrink-0">
                                            <div className="border border-[#e2ded4] bg-[#f3f0e9] p-1">
                                                {product.images?.length > 0 ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.title}
                                                        width={82}
                                                        height={82}
                                                        className="h-20.5 w-20.5 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-20.5 w-20.5 items-center justify-center bg-[#eeece5]">
                                                        <Package className="h-7 w-7 stroke-[1.2] text-[#b5afa3]" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Active Indicator */}
                                            <span
                                                className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-[#faf9f6] ${product.isActive
                                                        ? "bg-[#7c896c]"
                                                        : "bg-[#b9b3a8]"
                                                    }`}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                                Product Reference
                                            </p>

                                            <h3 className="mt-2 wrap-break-word font-serif text-base font-normal leading-6 tracking-[0.01em] text-[#1b1a18]">
                                                {product.title}
                                            </h3>

                                            <p className="mt-2 text-[10px] text-[#57534c]">
                                                {product.brand.title}
                                            </p>

                                            <p className="mt-1 text-[9px] text-[#aaa49b]">
                                                {product.category.title}
                                            </p>

                                            <span
                                                className={`mt-4 inline-block border px-2.5 py-1.5 text-[7px] uppercase tracking-[0.15em] ${product.isActive
                                                        ? "border-[#d6dfd0] bg-[#eff2eb] text-[#68795c]"
                                                        : "border-[#e2ded4] bg-[#f1efe9] text-[#817d75]"
                                                    }`}
                                            >
                                                {product.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="border-t border-[#e8e4dc] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                        <p className="text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                            Product Details
                                        </p>

                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="text-[10px] text-[#aaa49b]">
                                                    Brand
                                                </span>

                                                <span className="min-w-0 text-right text-[10px] text-[#57534c]">
                                                    {product.brand.title}
                                                </span>
                                            </div>

                                            <div className="flex items-start justify-between gap-4">
                                                <span className="text-[10px] text-[#aaa49b]">
                                                    Category
                                                </span>

                                                <span className="min-w-0 text-right text-[10px] text-[#57534c]">
                                                    {product.category.title}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 border-t border-[#eeece7] pt-3">
                                                <span className="text-[10px] text-[#aaa49b]">
                                                    Total Stock
                                                </span>

                                                <span
                                                    className={`font-serif text-lg ${stock === 0
                                                            ? "text-[#9a6f63]"
                                                            : stock < 10
                                                                ? "text-[#a18450]"
                                                                : "text-[#68795c]"
                                                        }`}
                                                >
                                                    {stock}
                                                </span>
                                            </div>

                                            <p className="text-[8px] leading-5 text-[#aaa49b]">
                                                Combined inventory across all variants.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price & Status */}
                                    <div className="border-t border-[#e8e4dc] pt-5 lg:border-l lg:pt-0 lg:pl-6">
                                        <p className="text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                            Price & Status
                                        </p>

                                        <p className="mt-3 font-serif text-2xl font-normal tracking-tight text-[#1b1a18]">
                                            ${Number(product.price).toFixed(2)}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {product.isFeatured && (
                                                <span className="inline-flex items-center gap-1.5 border border-[#e1d4bc] bg-[#f4eee3] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.12em] text-[#8b704d]">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    Featured
                                                </span>
                                            )}

                                            {product.bestseller && (
                                                <span className="inline-flex items-center gap-1.5 border border-[#ded6e4] bg-[#f1edf3] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.12em] text-[#77657f]">
                                                    <Trophy className="h-3 w-3" />
                                                    Bestseller
                                                </span>
                                            )}

                                            {!product.isFeatured && !product.bestseller && (
                                                <span className="border border-[#e2ded4] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.12em] text-[#817d75]">
                                                    Standard
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-5 border-t border-[#eeece7] pt-4">
                                            <p className="text-[7px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                                Added On
                                            </p>

                                            <p className="mt-2 text-[10px] text-[#57534c]">
                                                {new Date(
                                                    product.createdAt
                                                ).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 flex gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="group/edit inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-[#dedbd4] bg-[#fdfcf9] px-3 py-2.5 text-[8px] uppercase tracking-[0.14em] text-[#57534c] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#1b1a18]"
                                            >
                                                <Edit3 className="h-3.5 w-3.5 stroke-[1.5] transition-transform duration-300 group-hover/edit:-rotate-6" />
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                disabled={deletingId === product.id}
                                                onClick={() => handleDelete(product.id)}
                                                className="group/delete inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-[#e5d8d2] bg-[#f8f1ed] px-3 py-2.5 text-[8px] uppercase tracking-[0.12em] text-[#956d60] transition-all duration-300 hover:border-[#9a6f63] hover:bg-[#9a6f63] hover:text-[#faf9f6] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingId === product.id ? (
                                                    <>
                                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border border-[#d9c1b7] border-t-[#956d60] group-hover/delete:border-t-white" />
                                                        <span>Deleting</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="h-3.5 w-3.5 stroke-[1.5] transition-transform duration-300 group-hover/delete:scale-110" />
                                                        <span>Delete</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* Empty State */
                    <div className="border border-[#e2ded4] bg-[#faf9f6] px-6 py-16 text-center md:py-20">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#dedbd4] bg-[#f3f0e9]">
                            <Package className="h-5 w-5 stroke-[1.3] text-[#9a8a74]" />
                        </div>

                        <p className="mt-7 text-[7px] uppercase tracking-[0.3em] text-[#aaa69e]">
                            Admin / Catalog Records
                        </p>

                        <h3 className="mt-3 font-serif text-2xl font-normal text-[#1b1a18]">
                            No Products Found
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-[10px] leading-6 text-[#817d75]">
                            Your catalog is empty or no products match your current
                            filters. Adjust your search criteria or add a new product
                            to your collection.
                        </p>

                        <div className="mt-8 flex justify-center">
                            <Link
                                href="/admin/products/new"
                                className="group inline-flex min-h-10 items-center justify-center gap-3 border border-[#1b1a18] bg-[#1b1a18] px-5 py-3 text-[8px] uppercase tracking-[0.18em] text-[#faf9f6] transition-all duration-300 hover:border-[#6f604e] hover:bg-[#6f604e]"
                            >
                                <span className="text-base font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                                    +
                                </span>
                                Add Product
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 0 && (
                <div className="mt-8 flex flex-col gap-5 border-t border-[#dedbd4] pt-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Page Information */}
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#817d75]">
                        <span>Page</span>

                        <span className="font-medium text-[#1b1a18]">
                            {String(pagination.page).padStart(2, "0")}
                        </span>

                        <span className="text-[#c3beb4]">/</span>

                        <span>
                            {String(pagination.totalPages).padStart(2, "0")}
                        </span>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex flex-wrap items-center gap-1.5">

                        {/* Previous */}
                        <button
                            type="button"
                            disabled={!pagination.hasPreviousPage || isPending}
                            onClick={() => handlePageChange(pagination.page - 1)}
                            className="group flex h-9 items-center gap-2 border border-[#dedbd4] bg-[#faf9f6] px-3 text-[8px] uppercase tracking-[0.12em] text-[#57534c] transition-all duration-300 hover:border-[#9b8150] hover:text-[#9b8150] disabled:cursor-not-allowed disabled:border-[#e8e4dc] disabled:bg-[#f1efe9] disabled:text-[#c3beb4] disabled:hover:border-[#e8e4dc] disabled:hover:text-[#c3beb4]"
                        >
                            <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
                                ←
                            </span>
                            <span className="hidden xs:inline">Previous</span>
                            <span className="xs:hidden">Prev</span>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex flex-wrap items-center gap-1">
                            {getPaginationPages(
                                pagination.page,
                                pagination.totalPages
                            ).map((page, index) => {
                                if (page === "...") {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            aria-hidden="true"
                                            className="flex h-9 min-w-5 items-center justify-center text-[10px] text-[#aaa49b]"
                                        >
                                            ···
                                        </span>
                                    );
                                }

                                const isActive = pagination.page === page;

                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        disabled={isPending}
                                        aria-label={`Go to page ${page}`}
                                        aria-current={isActive ? "page" : undefined}
                                        onClick={() => handlePageChange(page)}
                                        className={`relative flex h-9 min-w-9 items-center justify-center border px-2.5 text-[9px] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${isActive
                                                ? "border-[#1b1a18] bg-[#1b1a18] text-[#faf9f6]"
                                                : "border-transparent bg-transparent text-[#817d75] hover:border-[#dedbd4] hover:bg-[#faf9f6] hover:text-[#9b8150]"
                                            }`}
                                    >
                                        {String(page).padStart(2, "0")}

                                        {isActive && (
                                            <span className="absolute inset-x-2 -bottom-px h-0.5 bg-[#b49a6c]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next */}
                        <button
                            type="button"
                            disabled={!pagination.hasNextPage || isPending}
                            onClick={() => handlePageChange(pagination.page + 1)}
                            className="group flex h-9 items-center gap-2 border border-[#dedbd4] bg-[#faf9f6] px-3 text-[8px] uppercase tracking-[0.12em] text-[#57534c] transition-all duration-300 hover:border-[#9b8150] hover:text-[#9b8150] disabled:cursor-not-allowed disabled:border-[#e8e4dc] disabled:bg-[#f1efe9] disabled:text-[#c3beb4] disabled:hover:border-[#e8e4dc] disabled:hover:text-[#c3beb4]"
                        >
                            <span className="hidden xs:inline">Next</span>
                            <span className="xs:hidden">Next</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                                →
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}