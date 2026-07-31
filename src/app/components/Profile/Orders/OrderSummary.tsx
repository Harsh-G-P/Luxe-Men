"use client";

import Link from "next/link";

export default function OrderSummary() {
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
            $527.00
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            Shipping
          </span>

          <span className="text-xs font-medium">
            FREE
          </span>
        </div>

        <div className="border-t border-neutral-200 pt-5">

          <div className="flex items-center justify-between">

            <span className="text-sm uppercase tracking-[0.12em]">
              Total
            </span>

            <span className="text-sm font-semibold">
              $527.00
            </span>

          </div>

        </div>

        <div className="border-t border-neutral-200 pt-5 space-y-4">

          <div className="flex items-center justify-between">

            <span className="text-sm text-neutral-500">
              Payment Method
            </span>

            <span className="text-xs font-medium">
              Stripe
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-sm text-neutral-500">
              Payment Status
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-green-700">
              Paid
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