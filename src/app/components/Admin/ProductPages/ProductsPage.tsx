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
            <section className="w-full px-6 py-20">
                <div className="mx-auto max-w-2xl border border-slate-200 bg-white px-12 py-20 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
                    </div>

                    <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Product
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em] text-slate-900">
                        Please Wait
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
                        We're processing your request. Please wait while
                        we update your product catalog.
                    </p>

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
        <div className="w-full px-6">

            {/* Header */}

            <div className="mb-10 flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-start lg:justify-between">

                <div>

                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-black" />

                        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-400">
                            Store / Catalog
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        <h1 className="text-4xl font-light uppercase tracking-[0.08em] text-neutral-950">
                            Products
                        </h1>

                    </div>

                    <p className="mt-4 text-sm text-neutral-500">
                        Manage your collection, inventory and product visibility.
                    </p>

                </div>


                <Link
                    href="/admin/products/new"
                    className="group inline-flex h-12 items-center gap-3 border border-black bg-black px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-white hover:text-black"
                >
                    <span className="text-lg font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                        +
                    </span>

                    Add Product
                </Link>

            </div>

            <ProductFilter />

            {/* Product List */}

            <div className="mt-7 space-y-5">

                <div className="flex items-center justify-between px-1">

                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                            Product List
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Your current catalog
                        </p>
                    </div>

                    <span className="text-sm text-slate-500">
                        {pagination.totalProducts}{" "}
                        {pagination.totalProducts === 1
                            ? "Product"
                            : "Products"}
                    </span>

                </div>

                {products.length > 0 ? (
                    products.map((product) => {

                        const stock = product.variants.reduce(
                            (total, variant) =>
                                total + variant.stock,
                            0
                        );

                        return (
                            <div
                                key={product.id}
                                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]"
                            >

                                <div className="grid gap-8 p-6 lg:grid-cols-[1.6fr_1.2fr_0.9fr_1fr]">

                                    {/* Product */}

                                    <div className="flex min-w-0 items-center gap-5">

                                        {/* Image */}

                                        <div className="relative shrink-0">

                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1 shadow-sm">

                                                {product.images?.length >
                                                    0 ? (
                                                    <Image
                                                        src={
                                                            product
                                                                .images[0]
                                                        }
                                                        alt={
                                                            product.title
                                                        }
                                                        width={82}
                                                        height={82}
                                                        className="h-20.5 w-20.5 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-20.5 w-20.5 items-center justify-center rounded-xl bg-slate-100">
                                                        <Package className="h-7 w-7 text-slate-300" />
                                                    </div>
                                                )}

                                            </div>

                                            {/* Active indicator */}

                                            <span
                                                className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${product.isActive
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-400"
                                                    }`}
                                            />

                                        </div>

                                        {/* Product Info */}

                                        <div className="min-w-0">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <h3 className="truncate text-base font-semibold text-slate-900">
                                                    {product.title}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${product.isActive
                                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10"
                                                        : "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-500/10"
                                                        }`}
                                                >
                                                    {product.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </div>

                                            <p className="mt-2 text-sm font-medium text-slate-600">
                                                {product.brand.title}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {product.category.title}
                                            </p>

                                        </div>

                                    </div>

                                    {/* Product Details */}

                                    <div className="border-l border-slate-100 pl-0 lg:pl-7">

                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                            Product Details
                                        </p>

                                        <div className="mt-3 space-y-2.5">

                                            <div className="flex items-center justify-between gap-4 text-sm">

                                                <span className="text-slate-400">
                                                    Brand
                                                </span>

                                                <span className="truncate font-medium text-slate-700">
                                                    {product.brand.title}
                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between gap-4 text-sm">

                                                <span className="text-slate-400">
                                                    Category
                                                </span>

                                                <span className="truncate font-medium text-slate-700">
                                                    {product.category.title}
                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between gap-4 text-sm">

                                                <span className="text-slate-400">
                                                    Stock
                                                </span>

                                                <span
                                                    className={`font-semibold ${stock === 0
                                                        ? "text-rose-600"
                                                        : stock < 10
                                                            ? "text-amber-600"
                                                            : "text-emerald-600"
                                                        }`}
                                                >
                                                    {stock}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Price */}

                                    <div className="border-l border-slate-100 pl-0 lg:pl-7">

                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                            Price & Status
                                        </p>

                                        <div className="mt-3">

                                            <p className="text-md font-semibold tracking-tight text-slate-900">
                                                $
                                                {Number(
                                                    product.price
                                                ).toFixed(2)}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">

                                                {product.isFeatured && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/10">

                                                        <Star className="h-3 w-3 fill-current" />

                                                        Featured

                                                    </span>
                                                )}

                                                {product.bestseller && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700 ring-1 ring-inset ring-violet-600/10">

                                                        <Trophy className="h-3 w-3" />

                                                        Bestseller

                                                    </span>
                                                )}

                                                {!product.isFeatured &&
                                                    !product.bestseller && (
                                                        <span className="text-xs text-slate-400">
                                                            Standard
                                                        </span>
                                                    )}

                                            </div>

                                        </div>

                                    </div>

                                    {/* Actions */}

                                    <div className="flex flex-col items-end justify-between border-l border-slate-100 pl-0 lg:pl-7">

                                        <div className="text-right">

                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Added
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-slate-600">
                                                {new Date(
                                                    product.createdAt
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </p>

                                        </div>

                                        <div className="mt-6 flex w-full gap-2 lg:w-auto">

                                            {/* Edit */}

                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="group/edit inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 hover:shadow-md lg:flex-none"
                                            >
                                                <Edit3 className="h-3.5 w-3.5 transition-transform group-hover/edit:-rotate-6" />

                                                Edit
                                            </Link>

                                            {/* Delete */}

                                            <button
                                                type="button"
                                                disabled={deletingId === product.id}
                                                onClick={() => handleDelete(product.id)}
                                                className="group/delete inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-700 hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 lg:flex-none"
                                            >
                                                {deletingId === product.id ? (
                                                    <>
                                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600 group-hover/delete:border-rose-400 group-hover/delete:border-t-white" />

                                                        Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="h-3.5 w-3.5 transition-transform group-hover/delete:scale-110" />

                                                        Delete
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
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

                        <div className="px-6 py-20 text-center">

                            {/* Icon */}

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                                <Package className="h-8 w-8 stroke-[1.2] text-slate-400" />
                            </div>

                            {/* Label */}

                            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                                Product Collection
                            </p>

                            {/* Title */}

                            <h3 className="mt-4 text-2xl font-light uppercase tracking-[0.14em] text-slate-900">
                                No Products Found
                            </h3>

                            {/* Description */}

                            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
                                Your product catalog is currently empty or no products
                                match the filters you've selected.
                            </p>

                            {/* Actions */}

                            <div className="mt-9 flex items-center justify-center gap-3">

                                <Link
                                    href="/admin/products/new"
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
                                >
                                    <span className="text-base leading-none">
                                        +
                                    </span>

                                    Add Product
                                </Link>

                            </div>

                        </div>

                    </div>
                )}

            </div>

            {/* Pagination */}

            {pagination.totalPages > 0 && (
                <div className="mt-7 flex items-center justify-between border-t border-slate-200 pt-5">

                    <div className="text-sm text-slate-500">

                        Page{" "}

                        <span className="font-semibold text-slate-900">
                            {pagination.page}
                        </span>

                        {" "}of{" "}

                        <span className="font-semibold text-slate-900">
                            {pagination.totalPages}
                        </span>

                    </div>

                    <div className="flex items-center gap-2">

                        <button
                            type="button"
                            disabled={!pagination.hasPreviousPage || isPending}
                            onClick={() =>
                                handlePageChange(pagination.page - 1)
                            }
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${pagination.hasPreviousPage
                                ? "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                                : "pointer-events-none border-slate-100 bg-slate-50 text-slate-300"
                                }`}
                        >
                            Previous
                        </button>

                        <div className="flex flex-wrap items-center gap-1">

                            {getPaginationPages(
                                pagination.page,
                                pagination.totalPages
                            ).map((page, index) => {

                                if (page === "...") {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="flex h-9 min-w-9 items-center justify-center px-2 text-sm font-semibold text-slate-400"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        disabled={isPending}
                                        onClick={() =>
                                            handlePageChange(page)
                                        }
                                        className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${pagination.page === page
                                                ? "bg-slate-950 text-white shadow-sm"
                                                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                        </div>

                        <button
                            type="button"
                            disabled={!pagination.hasNextPage || isPending}
                            onClick={() =>
                                handlePageChange(pagination.page + 1)
                            }
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${pagination.hasNextPage
                                ? "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                                : "pointer-events-none border-slate-100 bg-slate-50 text-slate-300"
                                }`}
                        >
                            Next
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}