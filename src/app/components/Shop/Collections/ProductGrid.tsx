"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";

type Product = {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    brand: {
        title: string;
    };
};

type Props = {
    products: Product[];
};

export default function ProductGrid({ products }: Props) {
     if (products.length === 0) {
        return (
            <section className="bg-white py-20">
                <div className="mx-auto max-w-375 px-5 text-center">
                    <h2 className="text-3xl font-bold text-black">
                        No Products Found
                    </h2>

                    <p className="mt-4 text-gray-500">
                        We couldn't find any products matching your search.
                    </p>

                    <Link
                        href="/collections"
                        className="mt-8 inline-flex rounded-full border border-black px-6 py-3 font-medium transition hover:bg-black hover:text-white"
                    >
                        View All Products
                    </Link>
                </div>
            </section>
        );
    }
    return (
        <section className="bg-white py-12">
            <div className="mx-auto max-w-375 px-5 md:px-6">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        All Products
                    </h2>

                    <p className="text-sm text-gray-500">
                        {products.length} Products
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}