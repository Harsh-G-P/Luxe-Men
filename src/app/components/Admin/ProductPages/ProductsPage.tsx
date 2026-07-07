"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
};


export default function ProductPage({ products }: ProductProps) {

    const [product, setProduct] = useState(products)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const getProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/products')
            const data = await res.json()
            if (!res.ok) {
                setError("❌ " + data.message)
                return
            }
            setProduct(data.data)
        } catch (error) {
            console.log(error)
            setError("❌ Failed to fetch categories. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE"
            })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message)
                return
            }
            getProducts()
            toast.success(data.message)

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6">

            <div className="flex items-center justify-between mb-5">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                    ← Back to Dashboard
                </Link>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Products
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your store products.
                    </p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="rounded-xl bg-black px-5 py-3 text-white font-medium hover:bg-gray-800"
                >
                    + Add Product
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Product List
                    </h2>

                    <span className="text-sm text-gray-500">
                        {product.length} Products
                    </span>
                </div>

                {error &&
                    <div className="text-center">
                        <p className="text-red-500 ms-3 mb-4">{error}</p>
                    </div>
                }
                <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                        <tr className="text-left">
                            <th className="w-24 px-6 py-3 text-sm font-semibold text-gray-600">
                                Image
                            </th>

                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                                Product
                            </th>

                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                                Brand
                            </th>

                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                                Category
                            </th>

                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                                Price
                            </th>

                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                                Stock
                            </th>

                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                                Status
                            </th>

                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* Products */}
                    {product.map((products) => (
                        <tbody key={products.id}>

                            <tr className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {products.images?.length > 0 ? (
                                        <Image
                                            src={products.images[0]}
                                            alt={products.title}
                                            width={56}
                                            height={56}
                                            className="h-14 w-14 rounded-xl object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-14 w-14 rounded-xl bg-gray-200" />
                                    )}
                                </td>

                                <td className="px-6 py-4 font-medium">
                                    {products.title}
                                </td>

                                <td className="px-6 py-4">
                                    {products.brand.title}
                                </td>

                                <td className="px-6 py-4">
                                    {products.category.title}
                                </td>

                                <td className="px-6 py-4">
                                    ${Number(products.price).toFixed(2)}
                                </td>

                                <td className="px-6 py-4">
                                    {products.variants.reduce((total, variant) => total + variant.stock, 0)}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex gap-2 flex-wrap">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${products.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {products.isActive ? "Active" : "Inactive"}
                                        </span>

                                        {products.isFeatured && (
                                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                                                Featured
                                            </span>
                                        )}

                                        {products.bestseller && (
                                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                                                Bestseller
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-3">
                                        <Link
                                            href={`/admin/products/${products.id}/edit`}
                                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(products.id)}
                                            className="rounded-lg bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-600">
                                            {loading ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    ))}

                </table>

            </div>
        </div>
    );
}