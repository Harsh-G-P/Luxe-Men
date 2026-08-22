"use client";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    useEffect,
    useState,
    useTransition,
} from "react";
import { toast } from "sonner";
import {
    Edit3,
    Trash2,
    Tag,
} from "lucide-react";
import BrandFilter from "./BrandFilter";

type Pagination = {
    page: number;
    limit: number;
    totalBrands: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type BrandProps = {
    brand: {
        id: string;
        title: string;
        createdAt: Date;
    }[];

    pagination: Pagination;
};

type FormTitle = {
    title: string;
};

type FieldErrors = {
    title?: string;
};

export default function BrandPage({
    brand,
    pagination,
}: BrandProps) {
    const [title, setTitle] = useState<FormTitle>({
        title: "",
    });

    const [brands, setBrands] = useState(brand);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [fieldErrors, setFieldErrors] =
        useState<FieldErrors>({});

    const [editId, setEditId] =
        useState<string | null>(null);

    const [deletingId, setDeletingId] =
        useState<string | null>(null);

    const [isPending, startTransition] =
        useTransition();

    // NEW
    const [isFormOpen, setIsFormOpen] =
        useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setBrands(brand);
    }, [brand]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.set(
            "page",
            page.toString()
        );

        startTransition(() => {
            router.push(
                `/admin/brand?${params.toString()}`
            );
        });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setFieldErrors({});

        try {
            const url = editId
                ? `/api/brand/${editId}`
                : "/api/brand";

            const method = editId
                ? "PUT"
                : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(title),
            });

            const data = await res.json();

            if (!res.ok) {
                if (
                    data.errors &&
                    typeof data.errors === "object"
                ) {
                    const errors: FieldErrors = {};

                    Object.entries(
                        data.errors
                    ).forEach(
                        ([key, message]) => {
                            errors[
                                key as keyof FieldErrors
                            ] = message as string;
                        }
                    );

                    setFieldErrors(errors);
                    return;
                }

                setError(
                    "❌ " +
                    (
                        data.message ||
                        "Something went wrong"
                    )
                );

                return;
            }

            if (data.success) {
                setTitle({
                    title: "",
                });

                setEditId(null);
                setIsFormOpen(false);
                setFieldErrors({});
                setError("");

                toast.success(
                    data.message
                );

                // Refresh server component
                startTransition(() => {
                    router.refresh();
                });
            }
        } catch (error) {
            console.log(error);

            setError(
                "❌ Network error. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (
        id: string
    ) => {
        setDeletingId(id);

        try {
            const res = await fetch(
                `/api/brand/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data =
                await res.json();

            if (!res.ok) {
                toast.error(
                    data.message ||
                    "Failed to delete brand"
                );

                return;
            }

            toast.success(
                data.message
            );

            // Refresh instead of full reload
            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.log(error);

            toast.error(
                "Something went wrong"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (
        id: string,
        brandTitle: string
    ) => {
        setEditId(id);

        setTitle({
            title: brandTitle,
        });

        setFieldErrors({});
        setError("");
        setIsFormOpen(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // NEW
    const handleAddBrand = () => {
        setEditId(null);

        setTitle({
            title: "",
        });

        setFieldErrors({});
        setError("");
        setIsFormOpen(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleCancel = () => {
        setEditId(null);

        setTitle({
            title: "",
        });

        setFieldErrors({});
        setError("");
        setIsFormOpen(false);
    };

    if (isPending) {
        return (
            <section className="w-full px-6 py-20">
                <div className="mx-auto max-w-2xl border border-slate-200 bg-white px-12 py-20 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
                    </div>

                    <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Brand
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em] text-slate-900">
                        Please Wait
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
                        We're processing your request.
                        Please wait while we update
                        your brand catalog.
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

                {/* Left */}

                <div className="min-w-0">

                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-slate-950" />

                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                            Store / Catalog
                        </p>
                    </div>

                    <h1 className="text-3xl font-light uppercase tracking-[0.08em] text-slate-950 sm:text-4xl">
                        Brands
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                        Create, update and manage your product brands.
                    </p>

                </div>

                {/* Right: Add Brand */}

                <div className="flex w-full sm:w-auto">

                    <button
                        type="button"
                        onClick={handleAddBrand}
                        className="group inline-flex h-11 w-full items-center justify-center gap-3 border border-black bg-black px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-white hover:text-black sm:w-auto"
                    >
                        <span className="text-lg font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                            +
                        </span>

                        Add Brand
                    </button>

                </div>

            </div>

            {/* Add / Update Brand */}

            {isFormOpen && (
                <form onSubmit={handleSubmit}>

                    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

                        {/* Form Header */}

                        <div className="border-b border-slate-100 px-6 py-5">

                            <div className="flex items-center justify-between gap-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                                        <Tag className="h-4 w-4" />
                                    </div>

                                    <div>

                                        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                                            {editId
                                                ? "Update Brand"
                                                : "Add Brand"}
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {editId
                                                ? "Update the selected brand."
                                                : "Create a new brand for your catalog."}
                                        </p>

                                    </div>

                                </div>

                                {/* Close */}

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                                    aria-label="Close form"
                                >
                                    ×
                                </button>

                            </div>

                        </div>

                        {/* Form Body */}

                        <div className="p-6">

                            {error && (
                                <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                                    <p className="text-sm text-rose-600">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col gap-4 md:flex-row">

                                <div className="flex-1">

                                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Brand Name
                                    </label>

                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder={
                                            editId
                                                ? "Update brand..."
                                                : "Brand name..."
                                        }
                                        value={title.title}
                                        onChange={(e) =>
                                            setTitle({
                                                ...title,
                                                title: e.target.value,
                                            })
                                        }
                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-slate-950 ${fieldErrors.title
                                                ? "border-rose-300 focus:ring-rose-500"
                                                : "border-slate-200"
                                            }`}
                                    />

                                    {fieldErrors.title && (
                                        <p className="mt-2 ml-1 text-xs text-rose-500">
                                            {fieldErrors.title}
                                        </p>
                                    )}

                                </div>

                                <div className="flex items-end gap-3">

                                    {/* Submit */}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group inline-flex h-11 items-center justify-center gap-2 border border-black bg-black px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {loading ? (
                                            <>
                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-500 border-t-white" />

                                                {editId
                                                    ? "Updating..."
                                                    : "Adding..."}
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-lg font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                                                    {editId
                                                        ? "✓"
                                                        : "+"}
                                                </span>

                                                {editId
                                                    ? "Update"
                                                    : "Add Brand"}
                                            </>
                                        )}

                                    </button>

                                    {/* Cancel */}

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex h-11 items-center justify-center border border-slate-200 bg-white px-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </form>
            )}

            {/* Filters */}

            <BrandFilter />

            {/* Brand List */}

            <div className="mt-7 space-y-5">

                <div className="flex items-center justify-between px-1">

                    <div>

                        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                            Brand List
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Your current brand collection
                        </p>

                    </div>

                    <span className="text-sm text-slate-500">
                        {pagination.totalBrands}{" "}
                        {pagination.totalBrands === 1
                            ? "Brand"
                            : "Brands"}
                    </span>

                </div>

                {/* Brands */}

                {brands.length > 0 ? (
                    brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]"
                        >

                            <div className="grid gap-8 p-6 lg:grid-cols-[1.6fr_1.2fr_1fr]">

                                {/* Brand */}

                                <div className="flex min-w-0 items-center gap-5">

                                    <div className="relative shrink-0">

                                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">

                                            <Tag className="h-8 w-8 stroke-[1.4] text-slate-400 transition-colors group-hover:text-slate-700" />

                                        </div>

                                        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />

                                    </div>

                                    <div className="min-w-0">

                                        <h3 className="truncate text-base font-semibold text-slate-900">
                                            {brand.title}
                                        </h3>

                                        <p className="mt-2 text-sm font-medium text-slate-600">
                                            Product Brand
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Available in your catalog
                                        </p>

                                    </div>

                                </div>

                                {/* Details */}

                                <div className="border-l border-slate-100 pl-0 lg:pl-7">

                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Brand Details
                                    </p>

                                    <div className="mt-3 space-y-2.5">

                                        <div className="flex items-center justify-between gap-4 text-sm">

                                            <span className="text-slate-400">
                                                Name
                                            </span>

                                            <span className="truncate font-medium text-slate-700">
                                                {brand.title}
                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between gap-4 text-sm">

                                            <span className="text-slate-400">
                                                Status
                                            </span>

                                            <span className="font-semibold text-emerald-600">
                                                Active
                                            </span>

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
                                                brand.createdAt
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

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    brand.id,
                                                    brand.title
                                                )
                                            }
                                            className="group/edit inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 hover:shadow-md lg:flex-none"
                                        >
                                            <Edit3 className="h-3.5 w-3.5 transition-transform group-hover/edit:-rotate-6" />

                                            Edit
                                        </button>

                                        {/* Delete */}

                                        <button
                                            type="button"
                                            disabled={
                                                deletingId ===
                                                brand.id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    brand.id
                                                )
                                            }
                                            className="group/delete inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-700 hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 lg:flex-none"
                                        >

                                            {deletingId ===
                                                brand.id ? (
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
                    ))
                ) : (

                    /* Empty State */

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

                        <div className="px-6 py-20 text-center">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                                <Tag className="h-8 w-8 stroke-[1.2] text-slate-400" />
                            </div>

                            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                                Brand Collection
                            </p>

                            <h3 className="mt-4 text-2xl font-light uppercase tracking-[0.14em] text-slate-900">
                                No Brands Found
                            </h3>

                            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
                                Your brand collection is
                                currently empty or no
                                brands match the filters
                                you've selected.
                            </p>

                            <div className="mt-9 flex items-center justify-center">

                                <button
                                    type="button"
                                    onClick={handleAddBrand}
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
                                >

                                    <span className="text-base leading-none">
                                        +
                                    </span>

                                    Add Brand

                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>

            {/* Pagination */}

            {pagination.totalPages > 0 && (
                <div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

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

                    <div className="flex flex-wrap items-center gap-2">

                        {/* Previous */}

                        <button
                            type="button"
                            disabled={
                                !pagination.hasPreviousPage ||
                                isPending
                            }
                            onClick={() =>
                                handlePageChange(
                                    pagination.page - 1
                                )
                            }
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${pagination.hasPreviousPage
                                    ? "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                                    : "pointer-events-none border-slate-100 bg-slate-50 text-slate-300"
                                }`}
                        >
                            Previous
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

                        {/* Next */}

                        <button
                            type="button"
                            disabled={
                                !pagination.hasNextPage ||
                                isPending
                            }
                            onClick={() =>
                                handlePageChange(
                                    pagination.page + 1
                                )
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