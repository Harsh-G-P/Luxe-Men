"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type BrandProps = {
    brand: {
        id: string;
        title: string;
        createdAt: Date;
    }[]
}

type FormTitle = {
    title: string
}

type FieldErrors = {
    title?: string
}

export default function BrandPage({ brand }: BrandProps) {

    const [title, setTitle] = useState<FormTitle>({
        title: ""
    })

    const [brands, setBrands] = useState(brand);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

    const [editId, setEditId] = useState<string | null>(null);

    const getBrand = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/brand')
            const data = await res.json()
            if (!res.ok) {
                setError("❌ " + data.message)
                return
            }
            setBrands(data.data)
        } catch (error) {
            console.log(error)
            setError("❌ Failed to fetch brands. Try again.")
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

            const url = editId ? `/api/brand/${editId}` : "/api/brand"
            const method = editId ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(title)
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
                setTitle({
                    title: "",
                })

                setEditId(null);
                setFieldErrors({});
                setError("");

                getBrand()
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
            const res = await fetch(`/api/brand/${id}`, {
                method: "DELETE"
            })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message)
                return
            }
            getBrand()
            toast.success(data.message)

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
                <p className="mt-2 text-gray-500">
                    Create, update and manage your product brands.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Add Brand */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">
                        {editId ? "Update Brand" : "Add Brand"}
                    </h2>

                    {error &&
                        <div className="text-center">
                            <p className="text-red-500 ms-3 mb-4">{error}</p>
                        </div>
                    }

                    <div className="flex flex-col md:flex-row gap-4">

                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={editId ? "Update brand..." : "Brand name..."}
                                value={title.title}
                                onChange={(e) => setTitle({ ...title, title: e.target.value })}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            />

                            {fieldErrors.title && (
                                <p className="mt-1 ml-1 text-sm text-red-500">
                                    {fieldErrors.title}
                                </p>
                            )}
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
                                        setTitle({ title: "" });
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

                </div>
            </form>

            {brands.length === 0 ?
                (
                    <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                            No brands found
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Create your first brand to get started.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Existing Brands
                            </h2>

                            <p className="mb-3 text-xs text-slate-500 animate-pulse">
                                ↓ Scroll down to view more Brands
                            </p>

                            <span className="text-sm text-gray-500">{brands.length} Brands</span>

                        </div>

                        {/* Header */}
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-left">
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                                        Brand
                                    </th>

                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                        </table>

                        {/* Scrollable Body */}
                        <div className="max-h-80 overflow-y-auto">
                            <table className="w-full">
                                <tbody>
                                    {brands.map((brand) => (
                                        <tr
                                            key={brand.id}
                                            className="border-t border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-5 font-medium text-gray-800">
                                                {brand.title}
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditId(brand.id);
                                                            setTitle({
                                                                title: brand.title,
                                                            });
                                                            setFieldErrors({});
                                                            setError("");
                                                        }}
                                                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm font-medium">
                                                        Edit
                                                    </button>

                                                    <button type="button"
                                                        onClick={() => handleDelete(brand.id)}
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