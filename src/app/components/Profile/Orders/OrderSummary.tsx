"use client";

import Link from "next/link";


type Order = {
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
};

type Props = {
  order: Order;
};

export default function OrderSummary({ order }: Props) {
  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">
        <h2 className="text-sm uppercase tracking-[0.18em]">
          Order Summary
        </h2>
      </div>

      <div className="space-y-5 px-6 py-6">

        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            Subtotal
          </span>

          <span className="text-xs font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(order.subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            Shipping
          </span>

          <span className="text-xs font-medium">
            {order.shipping === 0
              ? "FREE"
              : `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(order.shipping)}`}
          </span>
        </div>

        <div className="border-t border-neutral-200 pt-5">

          <div className="flex items-center justify-between">

            <span className="text-sm uppercase tracking-[0.12em]">
              Total
            </span>

            <span className="text-sm font-semibold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(order.total)}
            </span>

          </div>

        </div>

        <div className="border-t border-neutral-200 pt-5 space-y-4">

          <div className="flex items-center justify-between">

            <span className="text-sm text-neutral-500">
              Payment Method
            </span>

            <span className="text-xs font-medium">
              {order.paymentMethod}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-sm text-neutral-500">
              Payment Status
            </span>

            <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] ${order.paymentStatus === "PAID"
              ? "bg-green-100 text-green-700"
              : order.paymentStatus === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : order.paymentStatus === "FAILED"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
              {order.paymentStatus}
            </span>

          </div>

        </div>

        <div className="border-t border-neutral-200 pt-6 space-y-3">

          <button
            type="button"
            className="block w-full border border-black px-6 py-3 text-center text-xs uppercase tracking-[0.12em] transition hover:bg-gray-700 hover:text-white"
          >
            Download Invoice
          </button>

          <Link
            href="/"
            className="block w-full border border-black px-6 py-3 text-center text-xs uppercase tracking-[0.12em] transition hover:bg-black hover:text-white"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}