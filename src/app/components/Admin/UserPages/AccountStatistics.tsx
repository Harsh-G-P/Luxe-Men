
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
    <div className="overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">
      {/* HEADER */}
      <div className="border-b border-[#e2ded4] px-5 py-4 md:px-6">
        <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
          Customer Overview
        </p>

        <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
          Account Statistics
        </h2>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 divide-x divide-[#e2ded4]">
        {/* TOTAL ORDERS */}
        <div className="px-4 py-5 transition-colors duration-300 hover:bg-[#faf8f3] sm:px-6 sm:py-6">
          <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Total Orders
          </p>

          <p className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#1b1a18] sm:text-4xl">
            {String(totalOrders).padStart(2, "0")}
          </p>

          <div className="mt-4 h-px w-7 bg-[#c8bb94]" />
        </div>

        {/* TOTAL SPENT */}
        <div className="min-w-0 px-4 py-5 transition-colors duration-300 hover:bg-[#faf8f3] sm:px-6 sm:py-6">
          <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Total Spent
          </p>

          <p className="mt-3 wrap-break-word font-serif text-2xl font-normal tracking-tight text-[#1b1a18] sm:text-3xl">
            {formatCurrency(totalSpent)}
          </p>

          <div className="mt-4 h-px w-7 bg-[#c8bb94]" />
        </div>
      </div>
    </div>
  );
}