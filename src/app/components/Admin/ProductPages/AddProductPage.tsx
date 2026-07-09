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
        <div className="max-w-6xl mx-auto p-6">

            <div className="flex items-center justify-between mb-5">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                    ← Back to Products
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    {product ? "Edit Product" : "Add Product"}
                </h1>

                <p>
                    {product
                        ? "Update your product."
                        : "Create a new product and its variants."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {error &&
                    <div className="text-center">
                        <p className="text-red-500 ms-3 mb-4">{error}</p>
                    </div>
                }

                {/* Basic Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Basic Information
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Enter the essential details about your product.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        {/* Product Title */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Product Title
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Nike Air Force 1"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 transition outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                            />
                            {fieldErrors.title && (
                                <p className="mt-1 text-sm text-red-500">
                                    {fieldErrors.title}
                                </p>
                            )}
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
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
                                        .find((option) => option.value === formData.brandId) ?? null
                                }
                                onChange={(option) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        brandId: option?.value || "",
                                    }))
                                }
                            />

                            {fieldErrors.brandId && (
                                <p className="mt-1 text-sm text-red-500">
                                    {fieldErrors.brandId}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
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
                                        .find((option) => option.value === formData.categoryId) ?? null
                                }
                                onChange={(option) => {
                                    const selectedCategory = categories.find(
                                        (category) => category.id === option?.value
                                    );

                                    const attributes = selectedCategory?.attributes ?? [];

                                    setCategoryAttributes(attributes);

                                    setFormData((prev) => ({
                                        ...prev,
                                        categoryId: option?.value || "",
                                        variants: attributes.length === 0 ? [] : prev.variants,
                                    }));
                                }}
                            />

                            {fieldErrors.categoryId && (
                                <p className="mt-1 text-sm text-red-500">
                                    {fieldErrors.categoryId}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Base Price
                            </label>

                            <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white transition focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
                                <div className="flex items-center justify-center px-4 text-gray-500 font-medium border-r border-gray-300 bg-gray-50">
                                    $
                                </div>

                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 outline-none"
                                />
                                {fieldErrors.price && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {fieldErrors.price}
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            rows={6}
                            placeholder="Write a detailed description of your product..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 transition outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                        />
                        {fieldErrors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {fieldErrors.description}
                            </p>
                        )}

                        <p className="mt-2 text-xs text-gray-500">
                            Describe the product, materials, features and other important details.
                        </p>
                    </div>
                </div>

                {/* Images */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Product Images
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Upload up to 10 images. The first image will be used as the product thumbnail.
                        </p>
                    </div>

                    {fieldErrors.images && (
                        <p className="mt-1 text-sm text-red-500">
                            {fieldErrors.images}
                        </p>
                    )}

                    {/* Upload Area */}
                    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-black">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                            📷
                        </div>

                        <h3 className="mt-3 text-base font-medium text-gray-900">
                            Upload Product Images
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Click below.
                        </p>


                        <div className="flex w-full flex-col items-center justify-center text-center">
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
                                className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                            >
                                Choose Images
                            </label>
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                            PNG, JPG, JPEG, WEBP • Max 10 images
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="mt-8">
                        <h3 className="mb-4 font-medium text-gray-900">
                            Uploaded Images
                        </h3>

                        <div className="flex flex-wrap gap-4">
                            {formData.images.map((image, index) => (
                                <div key={index} className="relative w-fit">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                images: prev.images.filter((_, i) => i !== index),
                                            }))
                                        }
                                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-black shadow hover:bg-slate-300"
                                    >
                                        ×
                                    </button>

                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="h-24 w-24 rounded-xl border border-gray-200 object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

                {/* Variants */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Product Variants
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Add different sizes, colors and stock for this product.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                if (!formData.categoryId) {
                                    toast.error("Please select a category first");
                                    return;
                                }

                                setSkuLocked(false);

                                setVariantForm({
                                    attributes: {},
                                    sku: "",
                                    price: "",
                                    stock: 0,
                                });

                                setShowVariantModal(true);
                            }}
                            className="rounded-xl bg-black px-5 py-2.5 font-medium text-white transition hover:bg-gray-800"
                        >
                            + Add Variant
                        </button>
                    </div>

                    {fieldErrors.variants && (
                        <p className="mt-1 text-sm text-red-500">
                            {fieldErrors.variants}
                        </p>
                    )}

                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Attributes
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        SKU
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Price
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Stock
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {formData.variants.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            No variants added.
                                        </td>
                                    </tr>
                                ) : (
                                    formData.variants.map((variant, index) => (
                                        <tr
                                            key={index}
                                            className="border-t hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(variant.attributes).map(
                                                        ([key, value]) => (
                                                            <span
                                                                key={key}
                                                                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                                                            >
                                                                {key}: {value}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 font-mono text-sm">
                                                {variant.sku}
                                            </td>

                                            <td className="px-6 py-4 font-medium">
                                                ${variant.price}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    {variant.stock} In Stock
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingVariantIndex(index);
                                                            setVariantForm(variant);
                                                            setShowVariantModal(true);
                                                        }}
                                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                variants: prev.variants.filter(
                                                                    (_, i) => i !== index
                                                                ),
                                                            }))
                                                        }
                                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                                                    >
                                                        Remove
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* Status */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Product Status
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Choose how this product should appear in your store.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">

                        <label className="cursor-pointer rounded-xl border border-gray-200 p-4 transition hover:border-black hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        Active
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Customers can view and purchase this product.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isActive: e.target.checked,
                                        }))
                                    }
                                    className="h-5 w-5 accent-black"
                                />
                            </div>
                        </label>

                        <label className="cursor-pointer rounded-xl border border-gray-200 p-4 transition hover:border-black hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        Featured
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Highlight this product on your homepage.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isFeatured: e.target.checked,
                                        }))
                                    }
                                    className="h-5 w-5 accent-black"
                                />
                            </div>
                        </label>

                        <label className="cursor-pointer rounded-xl border border-gray-200 p-4 transition hover:border-black hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        Bestseller
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Mark this product as a bestseller.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={formData.bestseller}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            bestseller: e.target.checked,
                                        }))
                                    }
                                    className="h-5 w-5 accent-black"
                                />
                            </div>
                        </label>

                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-xl border border-gray-300 px-6 py-3"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl bg-black px-6 py-3 text-white"
                    >
                        {loading
                            ? product
                                ? "Updating..."
                                : "Creating..."
                            : product
                                ? "Update Product"
                                : "Create Product"}
                    </button>
                </div>

                {showVariantModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    {editingVariantIndex !== null
                                        ? "Edit Variant"
                                        : "Add Variant"}
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingVariantIndex(null);
                                        setShowVariantModal(false);
                                    }}
                                    className="text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-5">

                                {categoryAttributes.map((attribute) => (
                                    <div key={attribute.title}>
                                        <label className="mb-2 block text-sm font-medium">
                                            {attribute.title}
                                        </label>

                                        <Select
                                            instanceId={attribute.title}
                                            styles={selectStyles}
                                            options={attribute.values.map((value) => ({
                                                value,
                                                label: value,
                                            }))}
                                            value={
                                                variantForm.attributes[attribute.title]
                                                    ? {
                                                        value:
                                                            variantForm.attributes[
                                                            attribute.title
                                                            ],
                                                        label:
                                                            variantForm.attributes[
                                                            attribute.title
                                                            ],
                                                    }
                                                    : null
                                            }
                                            onChange={(option) => {
                                                const updatedAttributes = {
                                                    ...variantForm.attributes,
                                                    [attribute.title]: option?.value || "",
                                                };

                                                setVariantForm((prev) => {
                                                    const shouldAutoGenerate =
                                                        !skuLocked &&
                                                        isVariantComplete(updatedAttributes, categoryAttributes);

                                                    if (!shouldAutoGenerate) {
                                                        return {
                                                            ...prev,
                                                            attributes: updatedAttributes,
                                                        };
                                                    }

                                                    let newSku = generateSKU(formData.title, updatedAttributes);

                                                    if (isSkuDuplicate(newSku)) {
                                                        newSku = generateUniqueSKU(
                                                            formData.title,
                                                            updatedAttributes
                                                        );
                                                    }

                                                    return {
                                                        ...prev,
                                                        attributes: updatedAttributes,
                                                        sku: newSku,
                                                    };
                                                });
                                            }}
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        SKU
                                    </label>

                                    <input
                                        type="text"
                                        value={variantForm.sku}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setSkuLocked(true);

                                            setVariantForm((prev) => ({
                                                ...prev,
                                                sku: value,
                                            }));
                                        }}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSkuLocked(false);
                                            setVariantForm((prev) => ({
                                                ...prev,
                                                sku: generateSKU(formData.title, prev.attributes),
                                            }));
                                        }}
                                        className="text-xs text-blue-600 mt-1"
                                    >
                                        Regenerate SKU
                                    </button>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        value={variantForm.price}
                                        onChange={(e) =>
                                            setVariantForm((prev) => ({
                                                ...prev,
                                                price: e.target.value,
                                            }))
                                        }
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Stock
                                    </label>

                                    <input
                                        type="number"
                                        value={variantForm.stock}
                                        onChange={(e) =>
                                            setVariantForm((prev) => ({
                                                ...prev,
                                                stock: Number(e.target.value),
                                            }))
                                        }
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingVariantIndex(null);
                                            setShowVariantModal(false);
                                        }}
                                        className="rounded-xl border px-5 py-2"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSaveVariant}
                                        className="rounded-xl bg-black px-5 py-2 text-white"
                                    >
                                        {editingVariantIndex !== null
                                            ? "Update Variant"
                                            : "Save Variant"}
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </form>
        </div>
    );
}