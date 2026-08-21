"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "sonner";

type FormProps = {
    title: string;
    description: string;
    price: string;

    brandId: string;
    categoryId: string;

    images: string[];

    isActive: boolean;
    isFeatured: boolean;
    bestseller: boolean;

    variants: {
        attributes: Record<string, string>;
        sku: string;
        price: string;
        stock: number;
    }[];
};

type ProductFormProps = {
    product?: FormProps & {
        id: string;
    };

    brands: {
        id: string;
        title: string;
    }[];

    categories: {
        id: string;
        title: string;
        attributes: {
            title: string;
            values: string[];
        }[];
    }[];
};

type FieldErrors = Record<string, string>;

export default function AddProductPage({ product, brands, categories }: ProductFormProps) {

    const initialFormData: FormProps = product
        ? {
            title: product.title,
            description: product.description,
            price: product.price,

            brandId: product.brandId,
            categoryId: product.categoryId,

            images: product.images,

            isActive: product.isActive,
            isFeatured: product.isFeatured,
            bestseller: product.bestseller,

            variants: product.variants,
        }
        : {
            title: "",
            description: "",
            price: "",

            brandId: "",
            categoryId: "",

            images: [],

            isActive: true,
            isFeatured: false,
            bestseller: false,

            variants: [],
        };

    const [formData, setFormData] = useState<FormProps>(initialFormData);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

    const router = useRouter()

    const [skuLocked, setSkuLocked] = useState(false);

    const [showVariantModal, setShowVariantModal] = useState(false);

    const [editingVariantIndex, setEditingVariantIndex] =
        useState<number | null>(null);

    const [variantForm, setVariantForm] = useState({
        attributes: {} as Record<string, string>,
        sku: "",
        price: "",
        stock: 0,
    });

    const [categoryAttributes, setCategoryAttributes] = useState<
        {
            title: string;
            values: string[];
        }[]
    >([]);

    useEffect(() => {
        if (!product) return;

        const selectedCategory = categories.find(
            (category) => category.id === product.categoryId
        );

        setCategoryAttributes(selectedCategory?.attributes ?? []);
    }, [product, categories]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setFieldErrors({})

        try {
            const url = product
                ? `/api/products/${product.id}`
                : "/api/products";

            const method = product ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()


            if (!res.ok) {
                if (data.errors && typeof data.errors === "object") {
                    const errors: FieldErrors = {}

                    Object.entries(data.errors).forEach(([key, message]) => {
                        errors[key as keyof FieldErrors] = message as string
                    })

                    setFieldErrors(errors)
                    return
                }
                setError("❌ " + (data.message || "Something went wrong"))
                return
            }
            if (data.success) {
                setFieldErrors({});
                setError("");
                toast.success(data.message)
                router.push("/admin/products")
            }
        } catch (error) {
            console.log(error)
            setError("❌ Network error. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;

        if (!files) return;

        try {
            setLoading(true);

            const uploadPromises = Array.from(files).map(async (file) => {
                const form = new FormData();
                form.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: form,
                });

                const data = await res.json();
                console.log(data);

                if (!res.ok) {
                    throw new Error(data.message);
                }

                return data.data[0];
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls].slice(0, 10),
            }));
            toast.success("Image upload successfully")
        } catch (err) {
            console.log(err);
            toast.error("Image upload failed");
        } finally {
            setLoading(false);
        }
    };

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            minHeight: "50px",
            borderRadius: "12px",
            borderColor: state.isFocused ? "#000" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(0,0,0,0.1)" : "none",
            "&:hover": {
                borderColor: "#000",
            },
        }),
        placeholder: (base: any) => ({
            ...base,
            color: "#9ca3af",
        }),
        menu: (base: any) => ({
            ...base,
            borderRadius: "12px",
            overflow: "hidden",
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused
                ? "#f3f4f6"
                : state.isSelected
                    ? "#000"
                    : "#fff",
            color: state.isSelected ? "#fff" : "#111827",
            cursor: "pointer",
        }),
    };

    const handleSaveVariant = () => {
        // Check all attributes are selected
        if (
            Object.keys(variantForm.attributes).length !==
            categoryAttributes.length
        ) {
            toast.error("Please select all attributes");
            return;
        }

        // SKU
        if (!variantForm.sku.trim()) {
            toast.error("SKU is required");
            return;
        }

        // Price
        if (!variantForm.price) {
            toast.error("Price is required");
            return;
        }

        // Stock
        if (variantForm.stock < 0) {
            toast.error("Invalid stock");
            return;
        }

        // Prevent duplicate attribute combinations
        const exists = formData.variants.some((variant, index) => {
            if (editingVariantIndex === index) return false;

            return (
                JSON.stringify(
                    Object.entries(variant.attributes).sort()
                ) ===
                JSON.stringify(
                    Object.entries(variantForm.attributes).sort()
                )
            );
        });

        if (exists) {
            toast.error("Variant already exists");
            return;
        }

        // Prevent duplicate SKU
        if (
            formData.variants.some((variant, index) => {
                if (editingVariantIndex === index) return false;

                return (
                    variant.sku.toLowerCase() ===
                    variantForm.sku.toLowerCase()
                );
            })
        ) {
            toast.error("SKU already exists");
            return;
        }

        if (editingVariantIndex !== null) {
            const updatedVariants = [...formData.variants];
            updatedVariants[editingVariantIndex] = variantForm;

            setFormData((prev) => ({
                ...prev,
                variants: updatedVariants,
            }));

            setEditingVariantIndex(null);
        } else {
            setFormData((prev) => ({
                ...prev,
                variants: [...prev.variants, variantForm],
            }));
        }

        setVariantForm({
            attributes: {},
            sku: "",
            price: "",
            stock: 0,
        });

        setShowVariantModal(false);

        toast.success("Variant added");
    };

    const generateSKU = (
        productTitle: string,
        attributes: Record<string, string>
    ) => {
        const base = productTitle
            .slice(0, 3)
            .toUpperCase()
            .replace(/\s/g, "");

        const attrPart = Object.values(attributes)
            .map((v) => v.slice(0, 3).toUpperCase())
            .join("-");

        const random = Math.floor(1000 + Math.random() * 9000);

        return `${base}-${attrPart}-${random}`;
    };

    const generateUniqueSKU = (
        productTitle: string,
        attributes: Record<string, string>
    ) => {
        const base = productTitle
            .slice(0, 3)
            .toUpperCase()
            .replace(/\s/g, "");

        const attrPart = Object.values(attributes)
            .map((v) => v.slice(0, 3).toUpperCase())
            .join("-");

        let sku = "";
        let attempts = 0;

        do {
            const random = Math.floor(1000 + Math.random() * 9000);
            sku = `${base}-${attrPart}-${random}`;
            attempts++;
        } while (isSkuDuplicate(sku) && attempts < 10);

        return sku;
    };

    const isVariantComplete = (
        attributes: Record<string, string>,
        categoryAttributes: { title: string }[]
    ) => {
        return categoryAttributes.every(
            (attr) => attributes[attr.title]
        );
    };

    const isSkuDuplicate = (sku: string) => {
        return formData.variants.some(
            (v) => v.sku.toLowerCase() === sku.toLowerCase()
        );
    };

    const resetForm = () => {
        setFormData(initialFormData);

        setVariantForm({
            attributes: {},
            sku: "",
            price: "",
            stock: 0,
        });

        setCategoryAttributes([]);
        setFieldErrors({});
        setError("");
        setShowVariantModal(false);
        setSkuLocked(false);
        setEditingVariantIndex(null);
    };

    return (
    <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mx-auto max-w-375">

            <div className="mb-8">

                {/* Back */}
                <Link
                    href="/admin/products"
                    className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition group-hover:-translate-x-0.5 group-hover:border-slate-300">
                        ←
                    </span>

                    Back to Products
                </Link>

                {/* Heading */}
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

                    <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                            Catalog Management
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            {product ? "Edit Product" : "Add Product"}
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            {product
                                ? "Update product details, inventory, variants and storefront visibility."
                                : "Create a polished product with pricing, imagery, variants and storefront settings."}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                formData.isActive
                                    ? "bg-emerald-500"
                                    : "bg-slate-300"
                            }`}
                        />

                        <span className="text-xs font-semibold text-slate-600">
                            {formData.isActive
                                ? "Product Active"
                                : "Product Inactive"}
                        </span>
                    </div>

                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* Global Error */}
                {error && (
                    <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                            !
                        </span>

                        <p>{error}</p>
                    </div>
                )}

                {/* BASIC INFORMATION */}
                <section className="overflow-visible rounded-3xl border border-slate-200 bg-white shadow-[0_4px_30px_rgba(15,23,42,0.04)]">

                    {/* Section Header */}
                    <div className="border-b border-slate-100 px-6 py-5 sm:px-7">

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                                ✦
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                    Product Details
                                </p>

                                <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                                    Basic Information
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Essential information customers will see about this product.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="p-6 sm:p-7">

                        <div className="grid gap-6 md:grid-cols-2">

                            {/* Product Title */}
                            <div className="md:col-span-2">

                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Product Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Nike Air Force 1"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className={`h-13 w-full rounded-xl border bg-white px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 ${
                                        fieldErrors.title
                                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                            : "border-slate-200 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                                    }`}
                                />

                                {fieldErrors.title && (
                                    <p className="mt-2 text-xs font-medium text-red-500">
                                        {fieldErrors.title}
                                    </p>
                                )}

                            </div>

                            {/* Brand */}
                            <div>

                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Brand
                                </label>

                                <Select
                                    instanceId="brand"
                                    styles={selectStyles}
                                    placeholder="Select Brand"
                                    options={brands.map((brand) => ({
                                        value: brand.id,
                                        label: brand.title,
                                    }))}
                                    value={
                                        brands
                                            .map((brand) => ({
                                                value: brand.id,
                                                label: brand.title,
                                            }))
                                            .find(
                                                (option) =>
                                                    option.value ===
                                                    formData.brandId
                                            ) ?? null
                                    }
                                    onChange={(option) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            brandId: option?.value || "",
                                        }))
                                    }
                                />

                                {fieldErrors.brandId && (
                                    <p className="mt-2 text-xs font-medium text-red-500">
                                        {fieldErrors.brandId}
                                    </p>
                                )}

                            </div>

                            {/* Category */}
                            <div>

                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Category
                                </label>

                                <Select
                                    instanceId="category"
                                    styles={selectStyles}
                                    placeholder="Select Category"
                                    options={categories.map((category) => ({
                                        value: category.id,
                                        label: category.title,
                                    }))}
                                    value={
                                        categories
                                            .map((category) => ({
                                                value: category.id,
                                                label: category.title,
                                            }))
                                            .find(
                                                (option) =>
                                                    option.value ===
                                                    formData.categoryId
                                            ) ?? null
                                    }
                                    onChange={(option) => {
                                        const selectedCategory =
                                            categories.find(
                                                (category) =>
                                                    category.id ===
                                                    option?.value
                                            );

                                        const attributes =
                                            selectedCategory?.attributes ?? [];

                                        setCategoryAttributes(attributes);

                                        setFormData((prev) => ({
                                            ...prev,
                                            categoryId:
                                                option?.value || "",
                                            variants:
                                                attributes.length === 0
                                                    ? []
                                                    : prev.variants,
                                        }));
                                    }}
                                />

                                {fieldErrors.categoryId && (
                                    <p className="mt-2 text-xs font-medium text-red-500">
                                        {fieldErrors.categoryId}
                                    </p>
                                )}

                            </div>

                            {/* Price */}
                            <div>

                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Base Price
                                </label>

                                <div
                                    className={`flex h-13 overflow-hidden rounded-xl border bg-white transition focus-within:ring-4 ${
                                        fieldErrors.price
                                            ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-500/10"
                                            : "border-slate-200 focus-within:border-slate-950 focus-within:ring-slate-950/5"
                                    }`}
                                >
                                    <div className="flex w-14 shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
                                        $
                                    </div>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                                    />
                                </div>

                                {fieldErrors.price && (
                                    <p className="mt-2 text-xs font-medium text-red-500">
                                        {fieldErrors.price}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* Description */}
                        <div className="mt-6">

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Description
                            </label>

                            <textarea
                                rows={6}
                                placeholder="Write a detailed description of your product..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                className={`w-full resize-y rounded-xl border bg-white px-4 py-3.5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 ${
                                    fieldErrors.description
                                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                        : "border-slate-200 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                                }`}
                            />

                            {fieldErrors.description && (
                                <p className="mt-2 text-xs font-medium text-red-500">
                                    {fieldErrors.description}
                                </p>
                            )}

                            <p className="mt-2 text-xs text-slate-400">
                                Describe the product, materials, features and other important details.
                            </p>

                        </div>

                    </div>
                </section>

                {/* IMAGES */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_30px_rgba(15,23,42,0.04)]">

                    <div className="border-b border-slate-100 px-6 py-5 sm:px-7">

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                                ◇
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                    Visual Identity
                                </p>

                                <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                                    Product Images
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add high-quality images to showcase your product.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="p-6 sm:p-7">

                        {fieldErrors.images && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                                {fieldErrors.images}
                            </div>
                        )}

                        {/* Upload */}
                        <div className="group relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-10 text-center transition hover:border-slate-500 hover:bg-slate-50">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-md">
                                ↑
                            </div>

                            <h3 className="mt-5 text-sm font-semibold text-slate-900">
                                Upload product images
                            </h3>

                            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                                Upload clear product photography. The first image will be used as the primary thumbnail.
                            </p>

                            <input
                                id="product-images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            <label
                                htmlFor="product-images"
                                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
                            >
                                Choose Images
                                <span>→</span>
                            </label>

                            <p className="mt-3 text-[11px] text-slate-400">
                                PNG, JPG, JPEG or WEBP · Maximum 10 images
                            </p>

                        </div>

                        {/* Image Preview */}
                        {formData.images.length > 0 && (
                            <div className="mt-8">

                                <div className="mb-4 flex items-center justify-between">

                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Uploaded Images
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {formData.images.length} of 10 images
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                                        First image = thumbnail
                                    </span>

                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">

                                    {formData.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                                        >

                                            <img
                                                src={image}
                                                alt={`Product ${index + 1}`}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />

                                            {index === 0 && (
                                                <div className="absolute left-2 top-2 rounded-lg bg-slate-950/90 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                                                    Primary
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        images: prev.images.filter(
                                                            (_, i) => i !== index
                                                        ),
                                                    }))
                                                }
                                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-sm font-semibold text-slate-700 opacity-0 shadow-md backdrop-blur transition group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                                            >
                                                ×
                                            </button>

                                        </div>
                                    ))}

                                </div>

                            </div>
                        )}

                    </div>
                </section>

                {/* VARIANTS */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_30px_rgba(15,23,42,0.04)]">

                    <div className="border-b border-slate-100 px-6 py-5 sm:px-7">

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                                    ◈
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                        Inventory Structure
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                                        Product Variants
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage sizes, colors, SKUs, pricing and inventory.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (!formData.categoryId) {
                                        toast.error(
                                            "Please select a category first"
                                        );
                                        return;
                                    }

                                    setEditingVariantIndex(null);
                                    setSkuLocked(false);

                                    setVariantForm({
                                        attributes: {},
                                        sku: "",
                                        price: "",
                                        stock: 0,
                                    });

                                    setShowVariantModal(true);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
                            >
                                <span className="text-base leading-none">
                                    +
                                </span>
                                Add Variant
                            </button>

                        </div>

                    </div>

                    <div className="p-6 sm:p-7">

                        {fieldErrors.variants && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                                {fieldErrors.variants}
                            </div>
                        )}

                        <div className="overflow-hidden rounded-2xl border border-slate-200">

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-212.5">

                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50/80">

                                            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                                Attributes
                                            </th>

                                            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                                SKU
                                            </th>

                                            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                                Price
                                            </th>

                                            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                                Stock
                                            </th>

                                            <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                                Actions
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">

                                        {formData.variants.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-6 py-14 text-center"
                                                >
                                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                                        ◇
                                                    </div>

                                                    <p className="mt-4 text-sm font-semibold text-slate-700">
                                                        No variants yet
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Add variants to manage different product combinations.
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : (
                                            formData.variants.map(
                                                (variant, index) => (
                                                    <tr
                                                        key={index}
                                                        className="group transition hover:bg-slate-50/70"
                                                    >

                                                        <td className="px-6 py-5">

                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.entries(
                                                                    variant.attributes
                                                                ).map(
                                                                    ([
                                                                        key,
                                                                        value,
                                                                    ]) => (
                                                                        <span
                                                                            key={key}
                                                                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm"
                                                                        >
                                                                            <span className="text-slate-400">
                                                                                {key}
                                                                            </span>
                                                                            <span className="mx-1 text-slate-300">
                                                                                /
                                                                            </span>
                                                                            {value}
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs font-medium text-slate-600">
                                                                {variant.sku}
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <span className="text-sm font-semibold text-slate-900">
                                                                ${variant.price}
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <span
                                                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                                                                    variant.stock === 0
                                                                        ? "bg-red-50 text-red-600"
                                                                        : variant.stock < 10
                                                                            ? "bg-amber-50 text-amber-600"
                                                                            : "bg-emerald-50 text-emerald-600"
                                                                }`}
                                                            >
                                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                                {variant.stock} in stock
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <div className="flex justify-end gap-2">

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditingVariantIndex(
                                                                            index
                                                                        );
                                                                        setVariantForm(
                                                                            variant
                                                                        );
                                                                        setSkuLocked(
                                                                            true
                                                                        );
                                                                        setShowVariantModal(
                                                                            true
                                                                        );
                                                                    }}
                                                                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-950"
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setFormData(
                                                                            ( prev ) => ({
                                                                                ...prev,
                                                                                variants:
                                                                                    prev.variants.filter(
                                                                                        ( _, i ) =>
                                                                                            i !==
                                                                                            index
                                                                                    ),
                                                                            })
                                                                        )
                                                                    }
                                                                    className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100"
                                                                >
                                                                    Remove
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                )
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>
                </section>

                {/* STATUS */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_30px_rgba(15,23,42,0.04)]">

                    <div className="border-b border-slate-100 px-6 py-5 sm:px-7">

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                ●
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                    Storefront
                                </p>

                                <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                                    Product Status
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Control how this product appears throughout your store.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="grid gap-4 p-6 sm:p-7 md:grid-cols-3">

                        {/* Active */}
                        <label
                            className={`group cursor-pointer rounded-2xl border p-5 transition ${
                                formData.isActive
                                    ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">

                                <div>
                                    <div className="flex items-center gap-2">

                                        <span
                                            className={`h-2 w-2 rounded-full ${
                                                formData.isActive
                                                    ? "bg-emerald-400"
                                                    : "bg-slate-300"
                                            }`}
                                        />

                                        <h3
                                            className={`text-sm font-semibold ${
                                                formData.isActive
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            }`}
                                        >
                                            Active
                                        </h3>

                                    </div>

                                    <p
                                        className={`mt-2 text-xs leading-5 ${
                                            formData.isActive
                                                ? "text-slate-300"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        Customers can view and purchase this product.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isActive:
                                                e.target.checked,
                                        }))
                                    }
                                    className="h-5 w-5 shrink-0 accent-white"
                                />

                            </div>
                        </label>

                        {/* Featured */}
                        <label
                            className={`group cursor-pointer rounded-2xl border p-5 transition ${
                                formData.isFeatured
                                    ? "border-amber-300 bg-amber-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">

                                <div>
                                    <div className="flex items-center gap-2">

                                        <span className="text-sm">
                                            ✦
                                        </span>

                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Featured
                                        </h3>

                                    </div>

                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        Highlight this product on your homepage.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isFeatured:
                                                e.target.checked,
                                        }))
                                    }
                                    className="h-5 w-5 shrink-0 accent-slate-950"
                                />

                            </div>
                        </label>

                        {/* Bestseller */}
                        <label
                            className={`group cursor-pointer rounded-2xl border p-5 transition ${
                                formData.bestseller
                                    ? "border-violet-200 bg-violet-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">

                                <div>
                                    <div className="flex items-center gap-2">

                                        <span className="text-sm">
                                            ◆
                                        </span>

                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Bestseller
                                        </h3>

                                    </div>

                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        Mark this product as a bestseller.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={formData.bestseller}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            bestseller:
                                                e.target.checked,
                                        }))
                                    }
                                    className="h-5 w-5 shrink-0 accent-slate-950"
                                />

                            </div>
                        </label>

                    </div>
                </section>

                {/* ACTION BAR */}
                <div className="sticky bottom-4 z-30">

                    <div className="flex flex-col-reverse items-stretch justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_15px_50px_rgba(15,23,42,0.12)] backdrop-blur sm:flex-row sm:items-center">

                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                        >
                            Cancel
                        </button>

                        <div className="flex flex-col gap-2 sm:flex-row">

                            <Link
                                href="/admin/products"
                                className="rounded-xl px-5 py-3 text-center text-sm font-semibold text-slate-500 transition hover:text-slate-950"
                            >
                                Back to Products
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        {product
                                            ? "Updating..."
                                            : "Creating..."}
                                    </>
                                ) : (
                                    <>
                                        {product
                                            ? "Update Product"
                                            : "Create Product"}

                                        <span className="text-base">
                                            →
                                        </span>
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </div>

                {/*  VARIANT MODAL */}
                {showVariantModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                        onMouseDown={(e) => {
                            if (e.target === e.currentTarget) {
                                setEditingVariantIndex(null);
                                setShowVariantModal(false);
                            }
                        }}
                    >

                        <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.25)]">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                        Inventory
                                    </p>

                                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                                        {editingVariantIndex !== null
                                            ? "Edit Variant"
                                            : "Add Variant"}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingVariantIndex(null);
                                        setShowVariantModal(false);
                                    }}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                                >
                                    ×
                                </button>

                            </div>

                            {/* Modal Content */}
                            <div className="overflow-y-auto p-6">

                                <div className="space-y-5">

                                    {/* Attributes */}
                                    {categoryAttributes.map((attribute) => (
                                        <div key={attribute.title}>

                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                {attribute.title}
                                            </label>

                                            <Select
                                                instanceId={`variant-${attribute.title}`}
                                                styles={selectStyles}
                                                options={attribute.values.map(
                                                    (value) => ({
                                                        value,
                                                        label: value,
                                                    })
                                                )}
                                                value={
                                                    variantForm.attributes[
                                                        attribute.title
                                                    ]
                                                        ? {
                                                            value:
                                                                variantForm
                                                                    .attributes[
                                                                    attribute
                                                                        .title
                                                                ],
                                                            label:
                                                                variantForm
                                                                    .attributes[
                                                                    attribute
                                                                        .title
                                                                ],
                                                        }
                                                        : null
                                                }
                                                onChange={(option) => {
                                                    const updatedAttributes = {
                                                        ...variantForm.attributes,
                                                        [attribute.title]:
                                                            option?.value || "",
                                                    };

                                                    setVariantForm((prev) => {
                                                        const shouldAutoGenerate =
                                                            !skuLocked &&
                                                            isVariantComplete(
                                                                updatedAttributes,
                                                                categoryAttributes
                                                            );

                                                        if (!shouldAutoGenerate) {
                                                            return {
                                                                ...prev,
                                                                attributes:
                                                                    updatedAttributes,
                                                            };
                                                        }

                                                        let newSku =
                                                            generateSKU(
                                                                formData.title,
                                                                updatedAttributes
                                                            );

                                                        if (
                                                            isSkuDuplicate(
                                                                newSku
                                                            )
                                                        ) {
                                                            newSku =
                                                                generateUniqueSKU(
                                                                    formData.title,
                                                                    updatedAttributes
                                                                );
                                                        }

                                                        return {
                                                            ...prev,
                                                            attributes:
                                                                updatedAttributes,
                                                            sku: newSku,
                                                        };
                                                    });
                                                }}
                                            />

                                        </div>
                                    ))}

                                    {/* SKU */}
                                    <div>

                                        <div className="mb-2 flex items-center justify-between">

                                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                SKU
                                            </label>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSkuLocked(false);

                                                    setVariantForm(
                                                        (prev) => ({
                                                            ...prev,
                                                            sku: generateSKU(
                                                                formData.title,
                                                                prev.attributes
                                                            ),
                                                        })
                                                    );
                                                }}
                                                className="text-[11px] font-semibold text-slate-500 transition hover:text-slate-950"
                                            >
                                                Regenerate
                                            </button>

                                        </div>

                                        <input
                                            type="text"
                                            value={variantForm.sku}
                                            onChange={(e) => {
                                                setSkuLocked(true);

                                                setVariantForm((prev) => ({
                                                    ...prev,
                                                    sku: e.target.value,
                                                }));
                                            }}
                                            className="h-12.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm text-slate-800 outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5"
                                            placeholder="SKU-001"
                                        />

                                        <p className="mt-1.5 text-[11px] text-slate-400">
                                            Leave generated or enter your own SKU.
                                        </p>

                                    </div>

                                    {/* Price / Stock */}
                                    <div className="grid gap-4 sm:grid-cols-2">

                                        <div>

                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Price
                                            </label>

                                            <div className="flex h-12.5 overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-slate-950 focus-within:ring-4 focus-within:ring-slate-950/5">

                                                <div className="flex w-12 items-center justify-center border-r border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
                                                    $
                                                </div>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={variantForm.price}
                                                    onChange={(e) =>
                                                        setVariantForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                price: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                    className="w-full px-3 text-sm outline-none"
                                                    placeholder="0.00"
                                                />

                                            </div>

                                        </div>

                                        <div>

                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Stock
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={variantForm.stock}
                                                onChange={(e) =>
                                                    setVariantForm(
                                                        (prev) => ({
                                                            ...prev,
                                                            stock: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    )
                                                }
                                                className="h-12.5 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                                                placeholder="0"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingVariantIndex(null);
                                        setShowVariantModal(false);
                                    }}
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveVariant}
                                    className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                >
                                    {editingVariantIndex !== null
                                        ? "Update Variant"
                                        : "Save Variant"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </form>
        </div>
    </div>
);
}