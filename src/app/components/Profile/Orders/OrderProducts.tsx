"use client";

import Image from "next/image";

const products = [
  {
    id: "1",
    title: "Gucci Oversized Hoodie",
    variant: "Black • Size L",
    quantity: 2,
    price: 149,
    image: "/products/p1.webp",
  },
  {
    id: "2",
    title: "Wide Leg Denim Jeans",
    variant: "Blue • Size 32",
    quantity: 1,
    price: 119,
    image: "/products/p2.webp",
  },
  {
    id: "3",
    title: "Leather Sneakers",
    variant: "White • Size 9",
    quantity: 1,
    price: 229,
    image: "/products/p3.webp",
  },
];

export default function OrderProducts() {
  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-8 py-5">

        <h2 className="text-sm uppercase tracking-[0.18em]">
          Ordered Items
        </h2>

      </div>

      <div className="divide-y divide-neutral-200">

        {products.map((product) => (
          <div
            key={product.id}
            className="flex gap-6 px-8 py-6 hover:bg-neutral-50 transition-colors"
          >

            <div className="shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100">

              <Image
                src={product.image}
                alt={product.title}
                width={96}
                height={96}
                className="h-24 w-24 object-cover"
              />

            </div>

            <div className="flex flex-1 flex-col justify-between">

              <div>

                <h3 className="font-medium tracking-[0.04em]">
                  {product.title}
                </h3>

                <p className="mt-2 text-xs text-neutral-500">
                  {product.variant}
                </p>

              </div>

              <div className="mt-3 flex items-center justify-between">

                <span className="text-xs text-neutral-500">
                  QTY: {product.quantity}
                </span>

                <span className="font-light">
                  ${product.price.toFixed(2)}
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}