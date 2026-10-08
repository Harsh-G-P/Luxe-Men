"use client";

import Link from "next/link";
import OrderItem from "./OrderItem";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;

  items: {
    id: string;
    title: string;
    quantity: number;
    price: number;
    image: string | null;
    attributes: Record<string, string> | null;
  }[];
};

type Props = {
  order: Order;
};

export default function OrderCard({ order }: Props) {
  const statusStyles = {
    PENDING: "text-[#8a6a32]",
    CONFIRMED: "text-[#4c5968]",
    PROCESSING: "text-[#4c5968]",
    SHIPPED: "text-[#6b5542]",
    DELIVERED: "text-[#526354]",
    CANCELLED: "text-[#7b4d4d]",
  } as const;

  const statusStyle =
    statusStyles[order.status as keyof typeof statusStyles] ??
    "text-neutral-500";

  const formattedDate = new Date(order.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(order.total);

  return (
    <div
      className="
    group
    overflow-hidden
    border
    border-[#d8d5cf]
    bg-[#fdfcf9]
    transition-all
    duration-500
    ease-out
    hover:-translate-y-0.5
    hover:border-[#b9b3a8]
    hover:bg-[#fdfbf7]
  "
    >


      {/* Header */}
      <div className="border-b border-[#e4e1db] px-6 py-5 md:px-7">
        <div className="flex items-start justify-between gap-8">

          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#8b8881]">
              Order
            </p>

            <h2 className="mt-2 font-serif text-[17px] font-normal tracking-[0.03em] text-[#171715]">
              {order.orderNumber}
            </h2>

            <p className="mt-2 text-[11px] tracking-[0.02em] text-[#898680]">
              {formattedDate}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`h-1.25 w-1.25 rounded-full bg-current ${statusStyle}`}
            />

            <span
              className={`text-[9px] font-medium uppercase tracking-[0.22em] ${statusStyle}`}
            >
              {order.status}
            </span>
          </div>

        </div>
      </div>

      {/* Products */}
      <div className="divide-y divide-[#eeece7]">
        {order.items.map((item) => (
          <OrderItem
            key={item.id}
            item={item}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between border-t border-[#e4e1db] bg-[#faf9f6] px-6 py-5 md:px-7">

        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-[#8b8881]">
            Total
          </p>

          <p className="mt-2 font-serif text-[18px] font-normal tracking-[0.01em] text-[#171715]">
            {formattedTotal}
          </p>
        </div>

        <Link
          href={`/profile/orders/${order.id}`}
          className="group/link relative pb-1 text-[9px] font-medium uppercase tracking-[0.24em] text-[#171715]"
        >
          View Details
          <span className="absolute bottom-0 left-0 h-px w-full origin-right bg-[#171715] transition-transform duration-300 group-hover/link:origin-left group-hover/link:scale-x-0" />
        </Link>

      </div>

    </div>
  );
}
