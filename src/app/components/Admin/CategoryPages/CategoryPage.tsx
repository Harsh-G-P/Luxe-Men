"use client";

import Link from "next/link";
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
import CategoryFilter from "./CategoryFilter";

type Pagination = {
    page: number;
    limit: number;
    totalCategories: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type CategoryProps = {
    categories: {
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

export default function CategoryPage({
    categories,
    pagination,
}: CategoryProps) {
    const [title, setTitle] = useState<FormTitle>({
        title: "",
    });

    const [category, setCategory] =
        useState(categories);

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

    const [isFormOpen, setIsFormOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setCategory(categories);
    }, [categories]);


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
                `/admin/category?${params.toString()}`
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
                ? `/api/category/${editId}`
                : "/api/category";

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

                /*
                 * Refresh server component.
                 * Current page + filters are preserved.
                 */
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
                `/api/category/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data =
                await res.json();

            if (!res.ok) {
                toast.error(
                    data.message ||
                    "Failed to delete category"
                );

                return;
            }

            toast.success(
                data.message
            );

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

    const handleAdd = () => {
        setEditId(null);
        setTitle({
            title: "",
        });
        setFieldErrors({});
        setError("");
        setIsFormOpen(true);

        // Wait for the form to render, then focus the input
        setTimeout(() => {
            document
                .querySelector<HTMLInputElement>(
                    'input[placeholder="Category name..."]'
                )
                ?.focus();
        }, 0);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleEdit = (
        id: string,
        categoryTitle: string
    ) => {
        setEditId(id);

        setTitle({
            title: categoryTitle,
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
            <section className="w-full px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-2xl border border-[#dedbd4] bg-[#faf9f6] px-6 py-16 text-center sm:px-12 sm:py-20">

                    {/* Loading Indicator */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#dedbd4] bg-[#f5f3ed]">
                        <div className="h-6 w-6 animate-spin border-2 border-[#dedbd4] border-t-[#9b8150]" />
                    </div>

                    {/* Eyebrow */}
                    <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.3em] text-[#9b8150]">
                        LUXE MEN / CATEGORY MANAGEMENT
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
                        Please wait while we update your category catalog.
                    </p>

                    {/* Loading Status */}
                    <div className="mt-9 flex items-center justify-center gap-2">
                        <span className="h-1 w-1 animate-pulse bg-[#9b8150]" />
                        <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa49b]">
                            Updating Categories
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

                {/* Title */}
                <div className="min-w-0">
                    <div className="mb-3 flex items-center gap-3">
                        <span className="h-px w-7 bg-[#9a8a74]" />

                        <p className="text-[8px] uppercase tracking-[0.28em] text-[#aaa69e]">
                            Admin / Catalog Management
                        </p>
                    </div>

                    <h1 className="font-serif text-3xl font-normal tracking-[0.02em] text-[#1b1a18] sm:text-4xl">
                        Categories
                    </h1>

                    <p className="mt-2 max-w-xl text-[10px] leading-6 text-[#817d75]">
                        Create, update, and organize your product categories.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="group inline-flex h-11 items-center justify-center gap-3 border border-[#1b1a18] bg-[#1b1a18] px-5 text-[8px] uppercase tracking-[0.18em] text-[#faf9f6] transition-all duration-300 hover:border-[#6f604e] hover:bg-[#6f604e]"
                    >
                        <span className="text-base font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                            +
                        </span>
                        Add Category
                    </button>

                    <Link
                        href="/admin/category/categoryAttribute"
                        className="group inline-flex h-11 items-center justify-center gap-3 border border-[#dedbd4] bg-[#faf9f6] px-4 text-[8px] uppercase tracking-[0.14em] text-[#57534c] transition-all duration-300 hover:border-[#9a8a74] hover:bg-[#fdfcf9] hover:text-[#1b1a18]"
                    >
                        <span>Manage Attributes</span>

                        <span className="flex h-7 w-7 items-center justify-center border border-[#e2ded4] text-sm text-[#9a8a74] transition-all duration-300 group-hover:translate-x-0.5 group-hover:border-[#c8bb94]">
                            →
                        </span>
                    </Link>
                </div>
            </div>

            {/* Add / Update Category */}
            {isFormOpen && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-8 overflow-hidden border border-[#e2ded4] bg-[#faf9f6]">

                        {/* Form Header */}
                        <div className="flex items-center justify-between gap-4 border-b border-[#e8e4dc] px-5 py-4 sm:px-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#dedbd4] bg-[#f3f0e9] text-[#9a8a74]">
                                    <Tag className="h-4 w-4 stroke-[1.4]" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[7px] uppercase tracking-[0.25em] text-[#aaa69e]">
                                        Catalog Management
                                    </p>

                                    <h2 className="mt-1 font-serif text-lg font-normal text-[#1b1a18]">
                                        {editId ? "Update Category" : "Add Category"}
                                    </h2>

                                    <p className="mt-1 text-[9px] leading-5 text-[#817d75]">
                                        {editId
                                            ? "Update the selected category details."
                                            : "Create a new category for your collection."}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#dedbd4] text-lg font-light text-[#817d75] transition-colors duration-300 hover:border-[#9a8a74] hover:text-[#6f604e]"
                                aria-label="Close form"
                            >
                                ×
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="p-5 sm:p-6">

                            {error && (
                                <div className="mb-5 border border-[#d9c2b9] bg-[#f6eeea] px-4 py-3">
                                    <p className="text-[10px] leading-5 text-[#956d60]">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col gap-5 md:flex-row md:items-start">

                                {/* Category Name */}
                                <div className="min-w-0 flex-1">
                                    <label className="mb-2 block text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                        Category Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder={
                                            editId
                                                ? "Update category..."
                                                : "Enter category name..."
                                        }
                                        value={title.title}
                                        onChange={(e) =>
                                            setTitle({
                                                ...title,
                                                title: e.target.value,
                                            })
                                        }
                                        className={`h-11 w-full rounded-none border bg-[#fdfcf9] px-4 text-[10px] tracking-[0.03em] text-[#34312c] outline-none transition-colors duration-300 placeholder:text-[#aaa49b] ${fieldErrors.title
                                            ? "border-[#b98c7e] focus:border-[#956d60]"
                                            : "border-[#d4cfc5] hover:border-[#b9ad98] focus:border-[#9a8a74]"
                                            }`}
                                    />

                                    {fieldErrors.title && (
                                        <span className="mt-2 text-[10px] text-[#e7734d]">
                                            {fieldErrors.title}
                                        </span>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="flex flex-col gap-2 sm:flex-row md:pt-4.75">

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group inline-flex h-11 items-center justify-center gap-2 border border-[#1b1a18] bg-[#1b1a18] px-5 text-[8px] uppercase tracking-[0.16em] text-[#faf9f6] transition-all duration-300 hover:border-[#6f604e] hover:bg-[#6f604e] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border border-[#817d75] border-t-[#faf9f6]" />
                                                {editId ? "Updating..." : "Adding..."}
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-base font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                                                    {editId ? "✓" : "+"}
                                                </span>

                                                {editId ? "Update Category" : "Add Category"}
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex h-11 items-center justify-center border border-[#dedbd4] bg-[#fdfcf9] px-5 text-[8px] uppercase tracking-[0.16em] text-[#57534c] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#6f604e]"
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
            <CategoryFilter />

            {/* Category List */}
            <div className="mt-8 space-y-5">

                {/* List Heading */}
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#dedbd4] pb-4">
                    <div>
                        <p className="text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]">
                            Store Records
                        </p>

                        <h2 className="mt-2 font-serif text-xl font-normal text-[#1b1a18]">
                            Category List
                        </h2>

                        <p className="mt-1 text-[9px] text-[#817d75]">
                            Manage and organize your product collection.
                        </p>
                    </div>

                    <p className="text-[9px] uppercase tracking-[0.14em] text-[#817d75]">
                        <span className="text-[#1b1a18]">
                            {pagination.totalCategories}
                        </span>{" "}
                        {pagination.totalCategories === 1 ? "Category" : "Categories"}
                    </p>
                </div>

                {/* Categories */}
                {category.length > 0 ? (
                    category.map((category) => (
                        <div
                            key={category.id}
                            className="group overflow-hidden border border-[#e2ded4] bg-[#faf9f6] transition-all duration-300 hover:border-[#c8bb94] hover:bg-[#fdfcf9] hover:shadow-[0_10px_30px_rgba(45,40,30,0.06)]"
                        >
                            <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1.4fr_1fr_0.9fr] lg:gap-7">

                                {/* Category Information */}
                                <div className="flex min-w-0 items-start gap-4">
                                    <div className="relative shrink-0">
                                        <div className="flex h-14 w-14 items-center justify-center border border-[#e2ded4] bg-[#f3f0e9] sm:h-16 sm:w-16">
                                            <Tag className="h-6 w-6 stroke-[1.3] text-[#9a8a74] transition-colors duration-300 group-hover:text-[#6f604e]" />
                                        </div>

                                        <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 border border-[#faf9f6] bg-[#7c896c]" />
                                    </div>

                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <p className="text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                            Product Category
                                        </p>

                                        <h3 className="mt-2 wrap-break-word font-serif text-lg font-normal tracking-[0.02em] text-[#1b1a18]">
                                            {category.title}
                                        </h3>

                                        <p className="mt-2 text-[9px] leading-5 text-[#817d75]">
                                            Available in your catalog
                                        </p>

                                        <span className="mt-3 inline-block border border-[#d6ddcf] bg-[#eff1e9] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.15em] text-[#68795c]">
                                            Active
                                        </span>
                                    </div>
                                </div>

                                {/* Category Details */}
                                <div className="border-t border-[#e8e4dc] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                    <p className="text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                        Category Details
                                    </p>

                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="shrink-0 text-[9px] text-[#aaa49b]">
                                                Name
                                            </span>

                                            <span className="min-w-0 wrap-break-word text-right text-[10px] text-[#57534c]">
                                                {category.title}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-[9px] text-[#aaa49b]">
                                                Status
                                            </span>

                                            <span className="text-[9px] uppercase tracking-widest text-[#68795c]">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Date & Actions */}
                                <div className="flex flex-col justify-between gap-5 border-t border-[#e8e4dc] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                    <div>
                                        <p className="text-[7px] uppercase tracking-[0.22em] text-[#aaa69e]">
                                            Date Added
                                        </p>

                                        <p className="mt-2 font-serif text-base font-normal text-[#34312c]">
                                            {new Date(
                                                category.createdAt
                                            ).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex w-full gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    category.id,
                                                    category.title
                                                )
                                            }
                                            className="group/edit inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-[#dedbd4] bg-[#fdfcf9] px-3 py-2 text-[8px] uppercase tracking-[0.14em] text-[#57534c] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#6f604e]"
                                        >
                                            <Edit3 className="h-3.5 w-3.5 stroke-[1.5] transition-transform duration-300 group-hover/edit:-rotate-6" />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            disabled={deletingId === category.id}
                                            onClick={() =>
                                                handleDelete(category.id)
                                            }
                                            className="group/delete inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-[#e4d4ce] bg-[#f7efeb] px-3 py-2 text-[8px] uppercase tracking-[0.14em] text-[#956d60] transition-all duration-300 hover:border-[#956d60] hover:bg-[#956d60] hover:text-[#faf9f6] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {deletingId === category.id ? (
                                                <>
                                                    <span className="h-3 w-3 animate-spin rounded-full border border-[#d8bcb2] border-t-[#956d60] group-hover/delete:border-t-[#faf9f6]" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-3.5 w-3.5 stroke-[1.5] transition-transform duration-300 group-hover/delete:scale-110" />
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
                    <div className="border border-[#e2ded4] bg-[#faf9f6] px-6 py-16 text-center md:py-20">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#dedbd4] bg-[#f3f0e9]">
                            <Tag className="h-5 w-5 stroke-[1.3] text-[#9a8a74]" />
                        </div>

                        <p className="mt-7 text-[7px] uppercase tracking-[0.3em] text-[#aaa69e]">
                            Admin / Catalog Records
                        </p>

                        <h3 className="mt-3 font-serif text-2xl font-normal text-[#1b1a18]">
                            No Categories Found
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-[10px] leading-6 text-[#817d75]">
                            Your category collection is empty or no categories
                            match your current filters. Adjust your search or
                            create a new category to get started.
                        </p>

                        <div className="mt-7 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="group inline-flex h-11 items-center justify-center gap-3 border border-[#1b1a18] bg-[#1b1a18] px-5 text-[8px] uppercase tracking-[0.18em] text-[#faf9f6] transition-all duration-300 hover:border-[#6f604e] hover:bg-[#6f604e]"
                            >
                                <span className="text-base font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                                    +
                                </span>
                                Add Category
                            </button>
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
                            onClick={() =>
                                handlePageChange(pagination.page - 1)
                            }
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
                            onClick={() =>
                                handlePageChange(pagination.page + 1)
                            }
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