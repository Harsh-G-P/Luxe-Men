"use client";

import Select from "react-select";

const orderStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const paymentStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "46px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#000" : "#e5e7eb",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#000",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

export default function AdminActions() {
  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">

        <h2 className="text-sm uppercase tracking-[0.18em]">
          Admin Actions
        </h2>

      </div>

      <div className="space-y-6 px-6 py-6">

        <div>

          <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
            Order Status
          </label>

          <Select
            styles={selectStyles}
            options={orderStatusOptions}
          />

        </div>

        <div>

          <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
            Payment Status
          </label>

          <Select
            styles={selectStyles}
            options={paymentStatusOptions}
          />

        </div>

        <button className="w-full border border-black py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-black hover:text-white">
          Save Changes
        </button>

        <div className="border-t border-neutral-200 pt-6 space-y-3">

          <button className="w-full border border-red-800 py-3 text-xs uppercase tracking-[0.12em] text-red-800 transition hover:bg-red-800 hover:text-white">
            Cancel Order
          </button>

        </div>

      </div>

    </div>
  );
}