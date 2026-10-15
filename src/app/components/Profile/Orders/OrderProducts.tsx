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
    <div
      className=" overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]"
    >

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
      <div className="border-t border-[#d7d3ce]">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center md:px-6">
            <p className="font-serif text-sm text-[#1b1a18]">
              No Items Found
            </p>

            <p className="mt-1 text-[9px] leading-5 text-[#817d75]">
              There are no products associated with this order.
            </p>
          </div>
        ) : (
          items.map((product) => (
            <div
              key={product.id}
              className="group flex gap-4 px-5 py-4 transition-colors duration-500 md:gap-5 md:px-6"
            >
              {/* Product Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#eeece7]">
                <Image
                  src={product.image || "/images/NoImage.jpg"}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />

                <div className="pointer-events-none absolute inset-0 bg-black/2 transition-colors duration-500 group-hover:bg-transparent" />
              </div>

              {/* Product Information */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-serif text-[15px] font-normal tracking-[0.01em] text-[#1b1a18] transition-colors duration-300 group-hover:text-[#6f604e]">
                        {product.title}
                      </h3>

                      <p className="mt-1 text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]">
                        Product ID · {product.id.slice(-8)}
                      </p>
                    </div>

                    {/* Unit Price */}
                    <span className="shrink-0 font-serif text-[14px] font-normal tracking-[0.01em] text-[#242320]">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.price)}
                    </span>
                  </div>

                  {/* Product Attributes */}
                  <div className="mt-3 flex min-w-0 flex-wrap gap-x-3 gap-y-1">
                    {product.attributes &&
                      Object.keys(product.attributes).length > 0 ? (
                      Object.entries(product.attributes).map(
                        ([key, value]) => (
                          <span
                            key={key}
                            className="text-[8px] uppercase tracking-[0.14em] text-[#817d75]"
                          >
                            {key}
                            <span className="mx-1 text-[#c5c0b7]">
                              /
                            </span>
                            <span className="text-[#57534c]">
                              {String(value)}
                            </span>
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-[8px] uppercase tracking-[0.14em] text-[#aaa69e]">
                        No attributes
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Information */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                      Quantity
                    </span>

                    <span className="font-serif text-xs text-[#7c7771]">
                      {String(product.quantity).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Item Subtotal */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#aaa69e]">
                      Subtotal
                    </span>

                    <span className="font-serif text-xs text-[#242320]">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.price * product.quantity)}
                    </span>
                  </div>
                </div>

                {/* Hover Accent */}
                <div className="mt-3 h-px w-7 bg-[#d9d5cd] transition-all duration-500 group-hover:w-12 group-hover:bg-[#9a8a74]" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}