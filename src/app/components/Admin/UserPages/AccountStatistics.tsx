
"use client";

type Props = {
  totalOrders: number;
  totalSpent: number;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function AccountStatistics({
  totalOrders,
  totalSpent,
}: Props) {
  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">
        <h2 className="text-sm uppercase tracking-[0.18em]">
          Account Statistics
        </h2>
      </div>

      <div className="grid grid-cols-2 divide-x divide-neutral-200">

        <div className="px-6 py-6">

          <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
            Total Orders
          </p>

          <p className="mt-3 text-l font-medium">
            {totalOrders}
          </p>

        </div>

        <div className="px-6 py-6">

          <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
            Total Spent
          </p>

          <p className="mt-3 text-l font-medium">
            {formatCurrency(totalSpent)}
          </p>

        </div>

      </div>

    </div>
  );
}