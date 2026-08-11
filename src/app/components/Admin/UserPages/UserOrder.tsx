"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type Props = {
  orders: Order[];
};

const orderStatusStyles: Record<string, string> = {
  PENDING: "bg-slate-100 text-slate-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const paymentStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-cyan-100 text-cyan-700",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

export default function UserOrders({ orders }: Props) {
  return (
    <div className="border border-neutral-200 bg-white">
      {/* Orders header */}
      <div className="border-b border-neutral-200 px-8 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm uppercase tracking-[0.18em]">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Latest orders placed by this customer.
            </p>
          </div>

          {orders.length > 6 && (
            <div className="flex shrink-0 flex-col items-center gap-1 text-neutral-400">
              <span className="text-[9px] uppercase tracking-[0.16em]">
                Scroll for more
              </span>

              <ChevronDown
                className="h-4 w-4 animate-bounce"
                strokeWidth={1.5}
              />
            </div>
          )}
        </div>
      </div>

      {/* Orders content */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <span className="text-2xl text-neutral-400">🛍️</span>
          </div>

          <h3 className="mt-5 text-sm font-medium uppercase tracking-[0.12em] text-neutral-800">
            No Orders Yet
          </h3>

          <p className="mt-2 max-w-sm text-xs leading-5 text-neutral-500">
            This customer hasn&apos;t placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="max-h-137 divide-y divide-neutral-200 overflow-y-auto">
          {orders.map((order) => (
            <div
              key={order.id}
              className="px-8 py-6 transition hover:bg-neutral-50"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-sm font-medium tracking-wider">
                    {order.orderNumber}
                  </h3>

                  <p className="mt-2 text-xs text-neutral-500">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>

                <p className="text-sm font-semibold">
                  {formatCurrency(order.total)}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase ${orderStatusStyles[order.status] ||
                      "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {order.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase ${paymentStatusStyles[order.paymentStatus] ||
                      "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 transition hover:text-black"
                >
                  View Order →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}