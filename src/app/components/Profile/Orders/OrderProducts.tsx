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
  <div className="overflow-hidden border border-[#eeece7] bg-[#fdfcf9]">
    
    {/* Header */}
    <div className="flex items-center justify-between border-b border-[#eeece7] px-5 py-4 md:px-6">
      <div>
        <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
          Your Selection
        </p>

        <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
          Ordered Items
        </h2>
      </div>

      <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
        {items.length} {items.length === 1 ? "Item" : "Items"}
      </span>
    </div>

    {/* Items */}
    <div className="divide-y divide-[#eeece7]">
      {items.map((product) => (
        <div
          key={product.id}
          className=" group flex gap-4 bg-[#fdfcf9] px-5 py-4 transition-colors duration-500 hover:bg-[#f8f6f1] md:gap-5 md:px-6"
        >
          {/* Product Image */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#eeece7]">
            <Image
              src={product.image || "/images/NoImage.jpg"}
              alt={product.title}
              width={80}
              height={80}
              className=" h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />

            <div
              className=" pointer-events-none absolute inset-0 bg-black/2 transition-colors duration-500 group-hover:bg-transparent"
            />
          </div>

          {/* Product Information */}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3
                    className=" truncate font-serif text-[15px] font-normal tracking-[0.01em] text-[#1b1a18] transition-colors duration-300 group-hover:text-[#6f604e]"
                  >
                    {product.title}
                  </h3>

                  <p
                    className=" mt-1 text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]"
                  >
                    Ref. {product.id.slice(-8)}
                  </p>
                </div>

                {/* Price */}
                <span
                  className=" shrink-0 font-serif text-[14px] font-normal tracking-[0.01em] text-[#242320]"
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(product.price)}
                </span>
              </div>

              {/* Attributes */}
              <div className="mt-3 flex min-w-0 flex-wrap gap-x-3 gap-y-1">
                {product.attributes ? (
                  Object.entries(product.attributes).map(([key, value]) => (
                    <span
                      key={key}
                      className="
                        text-[8px]
                        uppercase
                        tracking-[0.14em]
                        text-[#817d75]
                      "
                    >
                      {key}
                      <span className="mx-1 text-[#c5c0b7]">/</span>
                      <span className="text-[#57534c]">{value}</span>
                    </span>
                  ))
                ) : (
                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[0.14em]
                      text-[#aaa69e]
                    "
                  >
                    No details
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Information */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.22em]
                    text-[#aaa69e]
                  "
                >
                  Quantity
                </span>

                <span className="font-serif text-xs text-[#7c7771]">
                  {String(product.quantity).padStart(2, "0")}
                </span>
              </div>

              <span
                className=" h-px w-7 bg-[#d9d5cd] transition-all duration-500 group-hover:w-12 group-hover:bg-[#9a8a74]"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
    
  </div>
);
}