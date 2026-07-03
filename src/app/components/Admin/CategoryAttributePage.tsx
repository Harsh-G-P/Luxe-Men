"use client";

import { Prisma } from "@/generated/prisma/client";
import Link from "next/link";
import { useState } from "react";
import Select from "react-select";
import { toast } from "sonner";

type CategoryProps = {
    attribute: {
        id: string;
        title: string;
        values: Prisma.JsonValue;
        categoryId: string;
        category: {
            title: string;
        }
        createdAt: Date;
    }[];

    categories: {
        id: string;
        title: string;
        createdAt: Date;
    }[]
}

type FormAttribute = {
    title: string;
    values: Prisma.JsonValue;
    categoryId: string;
}

type FieldErrors = {
    title?: string
    values?: string;
    categoryId?: string;
}

export default function CategoryAttributePage({ attribute, categories }: CategoryProps) {

    const [formData, setFromData] = useState<FormAttribute>({
        title: "",
        values: "",
        categoryId: ""
    })
    const [attributes, setAttributes] = useState(attribute);
    const [category, setCategory] = useState(categories);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [editId, setEditId] = useState<string | null>(null);

    const getAttribute = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/category/categoryAttribute')
            const data = await res.json()
            if (!res.ok) {
                setError("❌ " + data.message)
                return
            }
            setAttributes(data.data)
        } catch (error) {
            console.log(error)
            setError("❌ Failed to fetch attributies. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setFieldErrors({})
        try {

            const url = editId ? `/api/category/categoryAttribute/${editId}` : "/api/category/categoryAttribute"
            const method = editId ? "PUT" : "POST"
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
                setFromData({
                    title: "",
                    values: "",
                    categoryId: ""
                })

                setEditId(null);
                setFieldErrors({});
                setError("");

                getAttribute()
                toast.success(data.message)
            }

        } catch (error) {
            console.log(error)
            setError("❌ Network error. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {

            const res = await fetch(`/api/category/categoryAttribute/${id}`, {
                method: "DELETE"
            })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message)
                return
            }
            getAttribute()
            toast.success(data.message)

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            minHeight: "50px",
            borderRadius: "12px", // rounded-xl
            borderColor: state.isFocused ? "#000" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 1px #000" : "none",
            "&:hover": {
                borderColor: state.isFocused ? "#000" : "#d1d5db",
            },
            paddingLeft: "4px",
            paddingRight: "4px",
        }),
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Category Attributes
                </h1>

                <p className="mt-2 text-gray-500">
                    Manage attributes for each product category.
                </p>
            </div>

            {/* Back */}
            <div className="flex items-center mb-5">
                <Link
                    href="/admin/category"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                >
                    ← Back to Category
                </Link>
            </div>

            {/* Add Attribute */}
            <form onSubmit={handleSubmit}>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Add Category Attribute
                    </h2>

                    <div className="grid md:grid-cols-3 gap-5">

                        {/* Category */}
                        <div>
                            <Select
                                instanceId="category"
                                styles={selectStyles}
                                options={category.map((item) => ({
                                    value: item.id,
                                    label: item.title,
                                }))}
                                placeholder="Select Category"
                                value={
                                    category
                                        .map((item) => ({
                                            value: item.id,
                                            label: item.title,
                                        }))
                                        .find(
                                            (option) =>
                                                option.value === formData.categoryId
                                        ) ?? null
                                }
                                onChange={(option) =>
                                    setFromData({
                                        ...formData,
                                        categoryId: option?.value || "",
                                    })
                                }
                            />

                            <div className="h-5 mt-1">
                                {fieldErrors.categoryId && (
                                    <p className="text-sm text-red-500">
                                        {fieldErrors.categoryId}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Attribute */}
                        <div>
                            <input
                                type="text"
                                placeholder="Attribute Name"
                                value={formData.title}
                                onChange={(e) =>
                                    setFromData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            />

                            <div className="h-5 mt-1">
                                {fieldErrors.title && (
                                    <p className="text-sm text-red-500">
                                        {fieldErrors.title}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Values */}
                        <div>
                            <input
                                type="text"
                                placeholder="Values (S, M, L, XL)"
                                value={String(formData.values)}
                                onChange={(e) =>
                                    setFromData({
                                        ...formData,
                                        values: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            />

                            <div className="h-5 mt-1">
                                {fieldErrors.values && (
                                    <p className="text-sm text-red-500">
                                        {fieldErrors.values}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="self-start">
                        <button
                            type="submit"
                            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium">
                            {loading
                                ? editId
                                    ? "UPDATING..."
                                    : "ADDING..."
                                : editId
                                    ? "UPDATE"
                                    : "ADD"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setFromData({ title: "", values: "", categoryId: "" });
                                    setFieldErrors({});
                                    setError("");
                                }}
                                className="border ms-3 border-gray-300 hover:bg-gray-100 px-8 py-3 rounded-xl font-medium"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

            </form>

            {attributes.length === 0 ?
                (
                    <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                            No Attributes found
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Create your first Attribute to get started.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Existing Attributes
                            </h2>

                            <span className="text-sm text-gray-500">
                                {attributes.length} Attributes
                            </span>
                        </div>

                        {/* Header */}
                        <table className="w-full table-fixed">
                            <thead className="bg-gray-50">
                                <tr className="text-left">
                                    <th className="w-1/4 px-6 py-3 text-sm font-semibold text-gray-600">
                                        Category
                                    </th>

                                    <th className="w-1/4 px-6 py-3 text-sm font-semibold text-gray-600">
                                        Attribute
                                    </th>

                                    <th className="w-1/3 px-6 py-3 text-sm font-semibold text-gray-600">
                                        Values
                                    </th>

                                    <th className="w-1/6 px-6 py-3 text-right text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                        </table>

                        {/* Scrollable Body (about 4 rows) */}
                        <div className="max-h-76 overflow-y-auto">
                            <table className="w-full table-fixed">
                                <tbody>
                                    {attributes.map((attribute) => (
                                        <tr
                                            key={attribute.id}
                                            className="border-t border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="w-1/4 px-6 py-5 font-medium text-gray-800">
                                                {attribute.category.title}
                                            </td>

                                            <td className="w-1/4 px-6 py-5">
                                                {attribute.title}
                                            </td>

                                            <td className="w-1/3 px-6 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {Array.isArray(attribute.values) &&
                                                        attribute.values.map((value, index) => (
                                                            <span
                                                                key={index}
                                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                                            >
                                                                {String(value)}
                                                            </span>
                                                        ))}
                                                </div>
                                            </td>

                                            <td className="w-1/6 px-6 py-5">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setEditId(attribute.id);
                                                            setFromData({
                                                                title: attribute.title,
                                                                values: attribute.values,
                                                                categoryId: attribute.categoryId
                                                            });
                                                            setFieldErrors({});
                                                            setError("");
                                                        }}
                                                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm font-medium">
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(attribute.id)}
                                                        className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white text-sm font-medium">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
        </div>
    );
}