"use client";

import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Order = {
  id: string
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentId: string | null;
  items: {
    id: string;
    title: string;
    image: string | null;
    attributes: Record<string, string> | null;
    quantity: number;
    price: number;
    total: number;
  }[];
};

type Props = {
  order: Order;
};


export default function OrderSummary({ order }: Props) {

  const [copiedPaymentId, setCopiedPaymentId] = useState(false);

  const handleCopyPaymentId = async () => {
    if (!order.paymentId) return;

    await navigator.clipboard.writeText(order.paymentId);

    setCopiedPaymentId(true);
    setTimeout(() => setCopiedPaymentId(false), 1500);
  };

  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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
            {order.shipping === 0 ? (
              <span className="rounded-full bg-green-100 px-2 py-1 text-[11px] font-medium uppercase text-green-700">
                FREE
              </span>
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(order.shipping)
            )}
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
              Total Quantity
            </span>

            <span className="text-xs font-medium">
              {totalQuantity}
            </span>
          </div>

          <div className="flex items-center justify-between">

            <span className="text-sm text-neutral-500">
              Payment Method
            </span>

            <span className="text-xs font-medium">
              {order.paymentMethod}
            </span>


          </div>

          <div className="group flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              Payment ID
            </span>

            <div className="flex items-center gap-2">
              <span className="break-all text-xs font-medium">
                {order.paymentId
                  ? `${order.paymentId.slice(0, 8)}...${order.paymentId.slice(-6)}`
                  : "-"}
              </span>

              {order.paymentId && (
                <button
                  type="button"
                  onClick={handleCopyPaymentId}
                  className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  title={copiedPaymentId ? "Copied!" : "Copy Payment ID"}
                >
                  {copiedPaymentId ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-neutral-400 hover:text-black" />
                  )}
                </button>
              )}
            </div>
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

          <Link
            href={`/api/order/${order.id}/invoice`}
            target="_blank"
            className="block w-full border border-black px-6 py-3 text-center text-xs uppercase tracking-[0.12em] transition hover:bg-gray-700 hover:text-white"
          >
            ↓ Download Invoice
          </Link>

        </div>

      </div>

    </div>
  );
}