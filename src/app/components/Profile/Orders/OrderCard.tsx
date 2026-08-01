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
  const statusColor = {
    PENDING: "bg-yellow-500",
    CONFIRMED: "bg-indigo-500",
    PROCESSING: "bg-blue-500",
    SHIPPED: "bg-orange-500",
    DELIVERED: "bg-green-500",
    CANCELLED: "bg-red-500",
  } as const;

  return (
    <div className="overflow-hidden border border-neutral-200 bg-white">

      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-neutral-200 px-5 py-3 md:flex-row md:items-center md:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
            Order Number
          </p>

          <h2 className="mt-2 text-sm font-semibold tracking-[0.08em]">
            {order.orderNumber}
          </h2>

          <p className="mt-3 text-xs text-neutral-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

        </div>

        <div className="text-left md:text-right">

          <div className="inline-flex items-center gap-3">

            <span
              className={`h-2.5 w-2.5 rounded-full ${statusColor[
                order.status as keyof typeof statusColor
              ] ?? "bg-neutral-400"
                }`}
            />

            <span className="text-xs uppercase tracking-[0.12em]">
              {order.status}
            </span>

          </div>

        </div>

      </div>

      {/* Products */}

      <div className="divide-y divide-neutral-100">
        {order.items.map((item) => (
          <OrderItem
            key={item.id}
            item={item}
          />
        ))}
      </div>

      {/* Footer */}

      <div className="flex flex-col gap-6 border-t border-neutral-200 px-5 py-3 md:flex-row md:items-center md:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
            Total
          </p>

          <p className="mt-2 text-sm font-semibold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(order.total)}
          </p>

        </div>

        <Link
          href={`/profile/orders/${order.id}`}
          className="inline-flex items-center justify-center border border-black px-5 py-2 text-xs uppercase tracking-[0.12em] transition hover:bg-black hover:text-white"
        >
          View Details →
        </Link>

      </div>

    </div>
  );
}