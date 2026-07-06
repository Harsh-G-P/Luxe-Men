"use client";

import Image from "next/image";
import Link from "next/link";

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
                        {products.length} Products
                    </span>
                </div>

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
                    {products.map((product) => (
                        <tbody key={product.id}>

                            <tr className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {product.images?.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.title}
                                            width={56}
                                            height={56}
                                            className="h-14 w-14 rounded-xl object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-14 w-14 rounded-xl bg-gray-200" />
                                    )}
                                </td>

                                <td className="px-6 py-4 font-medium">
                                    {product.title}
                                </td>

                                <td className="px-6 py-4">
                                    {product.brand.title}
                                </td>

                                <td className="px-6 py-4">
                                    {product.category.title}
                                </td>

                                <td className="px-6 py-4">
                                    ${Number(product.price).toFixed(2)}
                                </td>

                                <td className="px-6 py-4">
                                    {product.variants.reduce((total, variant) => total + variant.stock, 0)}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex gap-2 flex-wrap">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${product.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {product.isActive ? "Active" : "Inactive"}
                                        </span>

                                        {product.isFeatured && (
                                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                                                Featured
                                            </span>
                                        )}

                                        {product.bestseller && (
                                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                                                Bestseller
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-3">
                                        <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
                                            Edit
                                        </button>

                                        <button className="rounded-lg bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-600">
                                            Delete
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