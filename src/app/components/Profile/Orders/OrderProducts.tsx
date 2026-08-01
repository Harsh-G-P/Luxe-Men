"use client";

import Image from "next/image";

type Item = {
  id: string;
  title: string;
  image: string | null;
  attributes: Record<string, string> | null;
  quantity: number;
  price: number;
};

type Props = {
  items: Item[];
};

export default function OrderProducts({ items }: Props) {
  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-8 py-5">

        <h2 className="text-sm uppercase tracking-[0.18em]">
          Ordered Items
        </h2>

      </div>

      <div className="divide-y divide-neutral-200">

        {items.map((product) => (
          <div
            key={product.id}
            className="flex gap-6 px-8 py-6 hover:bg-neutral-50 transition-colors"
          >

            <div className="shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100">

              <Image
                src={product.image || "/images/NoImage.jpg"}
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
                  {product.attributes
                    ? Object.entries(product.attributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" • ")
                    : "-"}
                </p>

              </div>

              <div className="mt-3 flex items-center justify-between">

                <span className="text-xs text-neutral-500">
                  QTY: {product.quantity}
                </span>

                <span className="font-light">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(product.price)}
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}