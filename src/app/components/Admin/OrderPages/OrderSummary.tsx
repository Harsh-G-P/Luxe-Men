"use client";

import Link from "next/link";

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
  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">

      {/* Header */}
      <div className="border-b border-[#eeece7] px-5 py-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
              Admin / Order Management
            </p>

            <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
              Order Summary
            </h2>
          </div>

          <span className="shrink-0 text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Financials
          </span>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 md:px-6">

        {/* Subtotal */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#817d75]">
            Subtotal
          </span>

          <span className="font-serif text-[14px] text-[#242320]">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(order.subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#817d75]">
            Shipping
          </span>

          {order.shipping === 0 ? (
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#6f604e]">
              Free
            </span>
          ) : (
            <span className="font-serif text-[14px] text-[#242320]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(order.shipping)}
            </span>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-[#eeece7] pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]">
                Order Value
              </p>

              <p className="mt-1 font-serif text-base text-[#1b1a18]">
                Total Amount
              </p>
            </div>

            <span className="font-serif text-xl font-normal tracking-[0.01em] text-[#1b1a18]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(order.total)}
            </span>
          </div>
        </div>

        {/* Order Information */}
        <div className="space-y-4 border-t border-[#eeece7] pt-5">

          {/* Quantity */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[9px] uppercase tracking-[0.18em] text-[#aaa69e]">
              Total Quantity
            </span>

            <span className="font-serif text-sm text-[#57534c]">
              {String(totalQuantity).padStart(2, "0")}
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[9px] uppercase tracking-[0.18em] text-[#aaa69e]">
              Payment Method
            </span>

            <span className="text-right text-[9px] uppercase tracking-[0.14em] text-[#57534c]">
              {order.paymentMethod}
            </span>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[9px] uppercase tracking-[0.18em] text-[#aaa69e]">
              Payment Status
            </span>

            <span
              className={`inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.16em] ${order.paymentStatus === "PAID"
                ? "text-[#6f604e]"
                : order.paymentStatus === "PENDING"
                  ? "text-[#9a8060]"
                  : order.paymentStatus === "FAILED"
                    ? "text-[#9a6f63]"
                    : "text-[#817d75]"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${order.paymentStatus === "PAID"
                  ? "bg-[#9a8a74]"
                  : order.paymentStatus === "PENDING"
                    ? "bg-[#b39a73]"
                    : order.paymentStatus === "FAILED"
                      ? "bg-[#9a6f63]"
                      : "bg-[#aaa69e]"
                  }`}
              />

              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="space-y-2.5 border-t border-[#eeece7] pt-5">

          {/* Download Invoice */}
          <Link
            href={`/api/order/${order.id}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-10 w-full items-center justify-center gap-3 border border-[#d9d5cd] bg-[#fdfcf9] px-5 text-center text-[9px] font-medium uppercase tracking-[0.2em] text-[#1b1a18] transition-all duration-300 hover:border-[#1b1a18] hover:bg-[#615e57] hover:text-white focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#9a8a74]"
          >
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
              ↓
            </span>

            View / Download Invoice
          </Link>

          {/* Return to Orders */}
          <Link
            href="/admin/orders"
            className="flex w-full items-center justify-center border border-[#d9d5cd] px-5 py-3 text-[8px] uppercase tracking-[0.2em] text-[#57534c] transition-all duration-500 hover:border-[#9a8a74] hover:text-[#6f604e]"
          >
            Back to Orders
          </Link>
        </div>

      </div>
    </div>
  );
}