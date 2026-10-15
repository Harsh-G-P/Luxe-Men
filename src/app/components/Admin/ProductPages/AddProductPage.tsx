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
        <div className="min-h-screen w-full bg-[#f5f4ef]">
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/products"
                        className="group inline-flex items-center gap-2 border-b border-[#d9d5cd] pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#171512] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#6f604e] mb-5"
                    >
                        <span className="text-[13px] leading-none transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>

                        <span>Back to Products</span>
                    </Link>

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="mb-2 text-[8px] uppercase tracking-[0.28em] text-[#9a8a74]">
                                Admin / Catalog Management
                            </p>

                            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#1b1a18] sm:text-4xl">
                                {product ? "Edit Product" : "Add Product"}
                            </h1>

                            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#817d75]">
                                {product
                                    ? "Update product details, inventory, variants and storefront visibility."
                                    : "Create a considered product listing with pricing, imagery, variants and storefront settings."}
                            </p>
                        </div>

                        {/* Product Status */}
                        <div className="inline-flex w-fit items-center gap-3 border border-[#e2ded4] bg-[#faf9f6] px-4 py-3">
                            <span
                                className={`h-1.5 w-1.5 ${formData.isActive
                                        ? "bg-[#7c896c]"
                                        : "bg-[#aaa69e]"
                                    }`}
                            />
                            <span className="text-[8px] uppercase tracking-[0.16em] text-[#57534c]">
                                {formData.isActive
                                    ? "Product Active"
                                    : "Product Inactive"}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Global Error */}
                    {error && (
                        <div className="flex items-center gap-3 border border-[#d8bdb4] bg-[#f8efeb] px-5 py-4 text-xs text-[#956d60]">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#d8bdb4] text-sm">
                                !
                            </span>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* BASIC INFORMATION */}
                    <section className="overflow-visible border border-[#e2ded4] bg-[#faf9f6]">
                        <div className="border-b border-[#e8e4dc] px-5 py-5 sm:px-7">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d8cbb3] bg-[#f1ece3] font-serif text-lg text-[#9a8a74]">
                                    ✦
                                </div>

                                <div>
                                    <p className="text-[7px] uppercase tracking-[0.25em] text-[#9a8a74]">
                                        Product Details
                                    </p>
                                    <h2 className="mt-1.5 font-serif text-xl font-normal text-[#1b1a18]">
                                        Basic Information
                                    </h2>
                                    <p className="mt-1 text-[10px] leading-5 text-[#817d75]">
                                        Essential information customers will see about this product.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-7">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Product Title */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
                                        Product Title
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. Levi's 511 Slim Fit Jeans"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        className={`h-12 w-full rounded-none border bg-[#fdfcf9] px-4 text-xs text-[#34312c] outline-none transition-colors duration-300 placeholder:text-[#aaa49b] ${fieldErrors.title
                                                ? "border-[#c99b8e] focus:border-[#956d60]"
                                                : "border-[#d4cfc5] hover:border-[#b9ad98] focus:border-[#9a8a74]"
                                            }`}
                                    />

                                    {fieldErrors.title && (
                                        <span className="mt-2 text-[10px] text-[#e7734d]">
                                            {fieldErrors.title}
                                        </span>
                                    )}
                                </div>

                                {/* Brand */}
                                <div className="min-w-0">
                                    <label className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
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
                                        <span className="mt-2 text-[10px] text-[#e7734d]">
                                            {fieldErrors.brandId}
                                        </span>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="min-w-0">
                                    <label className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
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
                                                categoryId: option?.value || "",
                                                variants:
                                                    attributes.length === 0
                                                        ? []
                                                        : prev.variants,
                                            }));
                                        }}
                                    />

                                    {fieldErrors.categoryId && (
                                        <span className="mt-2 text-[10px] text-[#e7734d]">
                                            {fieldErrors.categoryId}
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
                                        Base Price
                                    </label>

                                    <div
                                        className={`flex h-12 overflow-hidden border bg-[#fdfcf9] transition-colors duration-300 ${fieldErrors.price
                                                ? "border-[#c99b8e] focus-within:border-[#956d60]"
                                                : "border-[#d4cfc5] focus-within:border-[#9a8a74]"
                                            }`}
                                    >
                                        <div className="flex w-12 shrink-0 items-center justify-center border-r border-[#e2ded4] bg-[#f3f0e9] font-serif text-base text-[#9a8a74]">
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
                                            className="w-full bg-transparent px-4 text-xs text-[#34312c] outline-none placeholder:text-[#aaa49b]"
                                        />
                                    </div>

                                    {fieldErrors.price && (
                                        <span className="mt-2 text-[10px] text-[#e7734d]">
                                            {fieldErrors.price}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <label className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
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
                                    className={`w-full resize-y rounded-none border bg-[#fdfcf9] px-4 py-3.5 text-xs leading-6 text-[#34312c] outline-none transition-colors duration-300 placeholder:text-[#aaa49b] ${fieldErrors.description
                                            ? "border-[#c99b8e] focus:border-[#956d60]"
                                            : "border-[#d4cfc5] hover:border-[#b9ad98] focus:border-[#9a8a74]"
                                        }`}
                                />

                                <p className="mt-2 text-[9px] leading-5 text-[#aaa49b]">
                                    Describe the product, materials, features and other important details.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* IMAGES */}
                    <section className="overflow-hidden border border-[#e2ded4] bg-[#faf9f6]">
                        <div className="border-b border-[#e8e4dc] px-5 py-5 sm:px-7">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#dedbd4] bg-[#f3f0e9] font-serif text-xl text-[#9a8a74]">
                                    ◇
                                </div>

                                <div>
                                    <p className="text-[7px] uppercase tracking-[0.25em] text-[#9a8a74]">
                                        Visual Identity
                                    </p>
                                    <h2 className="mt-1.5 font-serif text-xl font-normal text-[#1b1a18]">
                                        Product Images
                                    </h2>
                                    <p className="mt-1 text-[10px] leading-5 text-[#817d75]">
                                        Add high-quality images to showcase your product.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-7">
                            {fieldErrors.images && (
                                <div className="mb-5 border border-[#d8bdb4] bg-[#f8efeb] px-4 py-3 text-[10px] text-[#956d60]">
                                    {fieldErrors.images}
                                </div>
                            )}

                            {/* Upload */}
                            <div className="group relative overflow-hidden border border-dashed border-[#d4cfc5] bg-[#fdfcf9] px-5 py-10 text-center transition-colors duration-300 hover:border-[#b9ad98] hover:bg-[#f7f4ed] sm:px-6">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#e2ded4] bg-[#faf9f6] font-serif text-2xl text-[#9a8a74] transition-transform duration-300 group-hover:-translate-y-1">
                                    ↑
                                </div>

                                <h3 className="mt-5 font-serif text-lg font-normal text-[#1b1a18]">
                                    Upload product images
                                </h3>

                                <p className="mx-auto mt-1 max-w-md text-[10px] leading-5 text-[#817d75]">
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
                                    className="mt-5 inline-flex cursor-pointer items-center gap-3 border border-[#1b1a18] bg-[#1b1a18] px-5 py-3 text-[8px] uppercase tracking-[0.16em] text-[#faf9f6] transition-colors duration-300 hover:border-[#8e7b60] hover:bg-[#8e7b60]"
                                >
                                    Choose Images
                                    <span className="text-sm">→</span>
                                </label>

                                <p className="mt-3 text-[9px] text-[#aaa49b]">
                                    PNG, JPG, JPEG or WEBP · Maximum 10 images
                                </p>
                            </div>

                            {/* Image Preview */}
                            {formData.images.length > 0 && (
                                <div className="mt-8">
                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="font-serif text-lg font-normal text-[#1b1a18]">
                                                Uploaded Images
                                            </h3>
                                            <p className="mt-1 text-[9px] text-[#817d75]">
                                                {formData.images.length} of 10 images
                                            </p>
                                        </div>

                                        <span className="w-fit border border-[#dedbd4] bg-[#f3f0e9] px-3 py-2 text-[8px] uppercase tracking-[0.12em] text-[#817d75]">
                                            First image = thumbnail
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                                        {formData.images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-square overflow-hidden border border-[#e2ded4] bg-[#f3f0e9]"
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Product ${index + 1}`}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                />

                                                {index === 0 && (
                                                    <div className="absolute left-2 top-2 border border-white/20 bg-[#1b1a18]/90 px-2 py-1 text-[7px] uppercase tracking-[0.12em] text-white">
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
                                                    aria-label={`Remove image ${index + 1}`}
                                                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center border border-[#e2ded4] bg-[#faf9f6]/95 text-base text-[#817d75] opacity-100 transition-colors duration-300 hover:border-[#956d60] hover:bg-[#956d60] hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
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
                    <section className="overflow-hidden border border-[#e2ded4] bg-[#faf9f6]">
                        <div className="border-b border-[#e8e4dc] px-5 py-5 sm:px-7">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#dedbd4] bg-[#f3f0e9] font-serif text-xl text-[#9a8a74]">
                                        ◈
                                    </div>

                                    <div>
                                        <p className="text-[7px] uppercase tracking-[0.25em] text-[#9a8a74]">
                                            Inventory Structure
                                        </p>
                                        <h2 className="mt-1.5 font-serif text-xl font-normal text-[#1b1a18]">
                                            Product Variants
                                        </h2>
                                        <p className="mt-1 text-[10px] leading-5 text-[#817d75]">
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
                                    className="inline-flex items-center justify-center gap-2 border border-[#1b1a18] bg-[#1b1a18] px-5 py-3 text-[8px] uppercase tracking-[0.15em] text-[#faf9f6] transition-colors duration-300 hover:border-[#8e7b60] hover:bg-[#8e7b60]"
                                >
                                    <span className="text-base leading-none">+</span>
                                    Add Variant
                                </button>
                            </div>
                        </div>

                        <div className="p-5 sm:p-7">
                            {fieldErrors.variants && (
                                <div className="mb-5 border border-[#d8bdb4] bg-[#f8efeb] px-4 py-3 text-[10px] text-[#956d60]">
                                    {fieldErrors.variants}
                                </div>
                            )}

                            <div className="overflow-hidden border border-[#e2ded4]">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-212.5">
                                        <thead>
                                            <tr className="border-b border-[#e2ded4] bg-[#f3f0e9]">
                                                <th className="px-5 py-4 text-left text-[7px] font-normal uppercase tracking-[0.2em] text-[#817d75] sm:px-6">
                                                    Attributes
                                                </th>
                                                <th className="px-5 py-4 text-left text-[7px] font-normal uppercase tracking-[0.2em] text-[#817d75] sm:px-6">
                                                    SKU
                                                </th>
                                                <th className="px-5 py-4 text-left text-[7px] font-normal uppercase tracking-[0.2em] text-[#817d75] sm:px-6">
                                                    Price
                                                </th>
                                                <th className="px-5 py-4 text-left text-[7px] font-normal uppercase tracking-[0.2em] text-[#817d75] sm:px-6">
                                                    Stock
                                                </th>
                                                <th className="px-5 py-4 text-right text-[7px] font-normal uppercase tracking-[0.2em] text-[#817d75] sm:px-6">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-[#e8e4dc]">
                                            {formData.variants.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-6 py-14 text-center"
                                                    >
                                                        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#e2ded4] bg-[#f3f0e9] font-serif text-xl text-[#9a8a74]">
                                                            ◇
                                                        </div>
                                                        <p className="mt-4 font-serif text-base text-[#34312c]">
                                                            No variants yet
                                                        </p>
                                                        <p className="mt-1 text-[10px] leading-5 text-[#aaa49b]">
                                                            Add variants to manage different product combinations.
                                                        </p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                formData.variants.map(
                                                    (variant, index) => (
                                                        <tr
                                                            key={index}
                                                            className="transition-colors duration-300 hover:bg-[#f5f2eb]"
                                                        >
                                                            <td className="px-5 py-5 sm:px-6">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {Object.entries(
                                                                        variant.attributes
                                                                    ).map(
                                                                        ([key, value]) => (
                                                                            <span
                                                                                key={key}
                                                                                className="border border-[#dedbd4] bg-[#fdfcf9] px-2.5 py-1.5 text-[9px] text-[#57534c]"
                                                                            >
                                                                                <span className="text-[#9a8a74]">
                                                                                    {key}
                                                                                </span>
                                                                                <span className="mx-1.5 text-[#c8bb94]">
                                                                                    /
                                                                                </span>
                                                                                {value}
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-5 sm:px-6">
                                                                <span className="border border-[#e2ded4] bg-[#f3f0e9] px-2.5 py-1.5 font-mono text-[10px] text-[#57534c]">
                                                                    {variant.sku}
                                                                </span>
                                                            </td>

                                                            <td className="px-5 py-5 sm:px-6">
                                                                <span className="font-serif text-base text-[#34312c]">
                                                                    ${variant.price}
                                                                </span>
                                                            </td>

                                                            <td className="px-5 py-5 sm:px-6">
                                                                <span
                                                                    className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-[9px] ${variant.stock === 0
                                                                            ? "border-[#dfc5bd] bg-[#f8efeb] text-[#956d60]"
                                                                            : variant.stock < 10
                                                                                ? "border-[#ded0b5] bg-[#f5efe3] text-[#8e754e]"
                                                                                : "border-[#d5ddce] bg-[#eef1e9] text-[#68795c]"
                                                                        }`}
                                                                >
                                                                    <span className="h-1.5 w-1.5 bg-current" />
                                                                    {variant.stock} in stock
                                                                </span>
                                                            </td>

                                                            <td className="px-5 py-5 sm:px-6">
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
                                                                        className="border border-[#dedbd4] bg-[#fdfcf9] px-3 py-2 text-[8px] uppercase tracking-widest text-[#57534c] transition-colors duration-300 hover:border-[#9a8a74] hover:text-[#6f604e]"
                                                                    >
                                                                        Edit
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setFormData(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    variants:
                                                                                        prev.variants.filter(
                                                                                            (_, i) =>
                                                                                                i !==
                                                                                                index
                                                                                        ),
                                                                                })
                                                                            )
                                                                        }
                                                                        className="border border-[#dfc5bd] bg-[#f8efeb] px-3 py-2 text-[8px] uppercase tracking-widest text-[#956d60] transition-colors duration-300 hover:border-[#956d60] hover:bg-[#956d60] hover:text-white"
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
                    <section className="overflow-hidden border border-[#e2ded4] bg-[#faf9f6]">
                        <div className="border-b border-[#e8e4dc] px-5 py-5 sm:px-7">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#dedbd4] bg-[#f3f0e9] text-sm text-[#9a8a74]">
                                    ●
                                </div>

                                <div>
                                    <p className="text-[7px] uppercase tracking-[0.25em] text-[#9a8a74]">
                                        Storefront
                                    </p>
                                    <h2 className="mt-1.5 font-serif text-xl font-normal text-[#1b1a18]">
                                        Product Status
                                    </h2>
                                    <p className="mt-1 text-[10px] leading-5 text-[#817d75]">
                                        Control how this product appears throughout your store.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 p-5 sm:p-7 md:grid-cols-3">
                            {/* Active */}
                            <label
                                className={`group cursor-pointer border p-5 transition-colors duration-300 ${formData.isActive
                                        ? "border-[#9a8a74] bg-[#f0ece3]"
                                        : "border-[#e2ded4] bg-[#fdfcf9] hover:border-[#c8bb94]"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`h-1.5 w-1.5 ${formData.isActive
                                                        ? "bg-[#7c896c]"
                                                        : "bg-[#aaa69e]"
                                                    }`}
                                            />
                                            <h3 className="text-xs text-[#34312c]">
                                                Active
                                            </h3>
                                        </div>
                                        <p className="mt-2 text-[10px] leading-5 text-[#817d75]">
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
                                        className="h-4 w-4 shrink-0 accent-[#68795c]"
                                    />
                                </div>
                            </label>

                            {/* Featured */}
                            <label
                                className={`group cursor-pointer border p-5 transition-colors duration-300 ${formData.isFeatured
                                        ? "border-[#c8bb94] bg-[#f5f0e5]"
                                        : "border-[#e2ded4] bg-[#fdfcf9] hover:border-[#c8bb94]"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-[#9a8a74]">
                                                ✦
                                            </span>
                                            <h3 className="text-xs text-[#34312c]">
                                                Featured
                                            </h3>
                                        </div>
                                        <p className="mt-2 text-[10px] leading-5 text-[#817d75]">
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
                                        className="h-4 w-4 shrink-0 accent-[#9a8a74]"
                                    />
                                </div>
                            </label>

                            {/* Bestseller */}
                            <label
                                className={`group cursor-pointer border p-5 transition-colors duration-300 ${formData.bestseller
                                        ? "border-[#c8bb94] bg-[#f5f0e5]"
                                        : "border-[#e2ded4] bg-[#fdfcf9] hover:border-[#c8bb94]"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-[#9a8a74]">
                                                ◆
                                            </span>
                                            <h3 className="text-xs text-[#34312c]">
                                                Bestseller
                                            </h3>
                                        </div>
                                        <p className="mt-2 text-[10px] leading-5 text-[#817d75]">
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
                                        className="h-4 w-4 shrink-0 accent-[#9a8a74]"
                                    />
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* ACTION BAR */}
                    <div className="sticky bottom-4 z-30">
                        <div className="flex flex-col-reverse items-stretch justify-between gap-3 border border-[#dedbd4] bg-[#faf9f6]/95 p-3 shadow-[0_12px_35px_rgba(40,35,25,0.08)] backdrop-blur-md sm:flex-row sm:items-center">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="border border-[#dedbd4] bg-[#fdfcf9] px-5 py-3 text-[8px] uppercase tracking-[0.15em] text-[#817d75] transition-colors duration-300 hover:border-[#9a8a74] hover:text-[#6f604e]"
                            >
                                Cancel
                            </button>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Link
                                    href="/admin/products"
                                    className="px-5 py-3 text-center text-[8px] uppercase tracking-[0.15em] text-[#817d75] transition-colors duration-300 hover:text-[#1b1a18]"
                                >
                                    Back to Products
                                </Link>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-3 border border-[#1b1a18] bg-[#1b1a18] px-6 py-3 text-[8px] uppercase tracking-[0.16em] text-[#faf9f6] transition-colors duration-300 hover:border-[#8e7b60] hover:bg-[#8e7b60] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/30 border-t-white" />
                                            {product ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            {product
                                                ? "Update Product"
                                                : "Create Product"}
                                            <span className="text-sm">→</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* VARIANT MODAL */}
                    {showVariantModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1a18]/55 p-4 backdrop-blur-sm"
                            onMouseDown={(e) => {
                                if (e.target === e.currentTarget) {
                                    setEditingVariantIndex(null);
                                    setShowVariantModal(false);
                                }
                            }}
                        >
                            <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden border border-[#dedbd4] bg-[#faf9f6] shadow-[0_30px_100px_rgba(27,26,24,0.25)]">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between border-b border-[#e8e4dc] px-5 py-5 sm:px-6">
                                    <div>
                                        <p className="text-[7px] uppercase tracking-[0.25em] text-[#9a8a74]">
                                            Inventory Management
                                        </p>
                                        <h2 className="mt-1.5 font-serif text-2xl font-normal text-[#1b1a18]">
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
                                        aria-label="Close variant modal"
                                        className="flex h-9 w-9 items-center justify-center border border-[#dedbd4] bg-[#fdfcf9] text-lg text-[#817d75] transition-colors duration-300 hover:border-[#9a8a74] hover:text-[#6f604e]"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="overflow-y-auto p-5 sm:p-6">
                                    <div className="space-y-5">
                                        {/* Attributes */}
                                        {categoryAttributes.map((attribute) => (
                                            <div key={attribute.title}>
                                                <label className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
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
                                                                value: variantForm
                                                                    .attributes[
                                                                    attribute.title
                                                                ],
                                                                label: variantForm
                                                                    .attributes[
                                                                    attribute.title
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

                                                            let newSku = generateSKU(
                                                                formData.title,
                                                                updatedAttributes
                                                            );

                                                            if (isSkuDuplicate(newSku)) {
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
                                                <label className="block text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
                                                    SKU
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSkuLocked(false);

                                                        setVariantForm((prev) => ({
                                                            ...prev,
                                                            sku: generateSKU(
                                                                formData.title,
                                                                prev.attributes
                                                            ),
                                                        }));
                                                    }}
                                                    className="text-[8px] uppercase tracking-[0.12em] text-[#9a8a74] transition-colors duration-300 hover:text-[#6f604e]"
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
                                                className="h-12 w-full rounded-none border border-[#d4cfc5] bg-[#f3f0e9] px-4 font-mono text-xs text-[#34312c] outline-none transition-colors duration-300 focus:border-[#9a8a74] focus:bg-[#fdfcf9]"
                                                placeholder="SKU-001"
                                            />

                                            <p className="mt-1.5 text-[9px] text-[#aaa49b]">
                                                Leave generated or enter your own SKU.
                                            </p>
                                        </div>

                                        {/* Price / Stock */}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
                                                    Price
                                                </label>

                                                <div className="flex h-12 overflow-hidden border border-[#d4cfc5] bg-[#fdfcf9] focus-within:border-[#9a8a74]">
                                                    <div className="flex w-12 shrink-0 items-center justify-center border-r border-[#e2ded4] bg-[#f3f0e9] font-serif text-base text-[#9a8a74]">
                                                        $
                                                    </div>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={variantForm.price}
                                                        onChange={(e) =>
                                                            setVariantForm((prev) => ({
                                                                ...prev,
                                                                price: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full bg-transparent px-3 text-xs text-[#34312c] outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
                                                    Stock
                                                </label>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={variantForm.stock}
                                                    onChange={(e) =>
                                                        setVariantForm((prev) => ({
                                                            ...prev,
                                                            stock: Number(
                                                                e.target.value
                                                            ),
                                                        }))
                                                    }
                                                    className="h-12 w-full rounded-none border border-[#d4cfc5] bg-[#fdfcf9] px-4 text-xs text-[#34312c] outline-none transition-colors duration-300 focus:border-[#9a8a74]"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex flex-col-reverse gap-2 border-t border-[#e8e4dc] bg-[#f5f4ef] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingVariantIndex(null);
                                            setShowVariantModal(false);
                                        }}
                                        className="border border-[#dedbd4] bg-[#faf9f6] px-5 py-3 text-[8px] uppercase tracking-[0.14em] text-[#817d75] transition-colors duration-300 hover:border-[#9a8a74] hover:text-[#6f604e]"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSaveVariant}
                                        className="border border-[#1b1a18] bg-[#1b1a18] px-5 py-3 text-[8px] uppercase tracking-[0.14em] text-[#faf9f6] transition-colors duration-300 hover:border-[#8e7b60] hover:bg-[#8e7b60]"
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