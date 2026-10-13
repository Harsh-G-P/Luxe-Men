"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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

const ORDERS_PER_PAGE = 7;

export default function UserOrders({ orders }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    orders.length / ORDERS_PER_PAGE
  );

  const paginatedOrders = useMemo(() => {
    const start =
      (currentPage - 1) * ORDERS_PER_PAGE;

    return orders.slice(
      start,
      start + ORDERS_PER_PAGE
    );
  }, [orders, currentPage]);

  const goToPage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };



  return (
    <div className="w-full overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">
      {/* HEADER */}
      <div className="border-b border-[#e2ded4] px-5 py-4 md:px-6">
        <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
          Admin / Customer Management
        </p>

        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
            Recent Orders
          </h2>

          {orders.length > 0 && (
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#9a8a74]">
              {String(orders.length).padStart(2, "0")}{" "}
              {orders.length === 1 ? "Order" : "Orders"}
            </span>
          )}
        </div>

        <p className="mt-2 text-[10px] leading-5 text-[#817d75]">
          Latest orders placed by this customer.
        </p>
      </div>

      {/* ORDERS */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-16 text-center sm:py-20">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#cec8bc]" />
            <span className="font-serif text-2xl text-[#9b8150]">
              0
            </span>
            <span className="h-px w-8 bg-[#cec8bc]" />
          </div>

          <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
            Purchase History
          </p>

          <h3 className="mt-3 font-serif text-2xl font-normal text-[#1b1a18]">
            No Orders Yet
          </h3>

          <p className="mt-3 max-w-sm text-[10px] leading-6 text-[#817d75]">
            This customer hasn&apos;t placed any orders yet. Their
            purchase history will appear here once an order is placed.
          </p>

          <div className="mt-6 h-px w-12 bg-[#cfc6b6]" />
        </div>
      ) : (
        <>

          {/* ORDER LIST */}
          <div className="space-y-0 divide-y divide-[#e2ded4]">
            {paginatedOrders.map((order, index) => (
              <div
                key={order.id}
                className="group relative border-l-2 border-l-transparent px-5 py-5 transition-all duration-500 ease-out hover:border-l-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_8px_24px_rgba(65,55,38,0.06)] md:px-6 md:py-6"
              >
                {/* ORDER HEADER */}
                <div className="flex min-w-0 items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3 sm:gap-4">
                    <span className="mt-0.5 shrink-0 font-serif text-lg italic text-[#c0b7a5] transition-colors duration-300 group-hover:text-[#9b8150]">
                      {String(
                        (currentPage - 1) * ORDERS_PER_PAGE + index + 1
                      ).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <h3 className="truncate text-xs font-medium tracking-widest text-[#1b1a18] transition-colors duration-300 group-hover:text-[#806c4d] sm:text-sm">
                        {order.orderNumber}
                      </h3>

                      <p className="mt-2 text-[9px] tracking-wide text-[#817d75]">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <p className="shrink-0 font-serif text-base text-[#1b1a18] transition-colors duration-300 group-hover:text-[#9b8150] sm:text-lg">
                    {formatCurrency(order.total)}
                  </p>
                </div>

                {/* ORDER FOOTER */}
                <div className="mt-5 flex flex-col gap-4 border-t border-[#e8e4dc] pt-4 transition-colors duration-300 group-hover:border-[#ded5c3] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`border px-2.5 py-1 text-[7px] uppercase tracking-[0.16em] ${orderStatusStyles[order.status] ||
                        "border-[#dedbd4] bg-[#f3f0e9] text-[#817d75]"
                        }`}
                    >
                      {order.status}
                    </span>

                    <span
                      className={`border px-2.5 py-1 text-[7px] uppercase tracking-[0.16em] ${paymentStatusStyles[order.paymentStatus] ||
                        "border-[#dedbd4] bg-[#f3f0e9] text-[#817d75]"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="group/link inline-flex self-start items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-[#817d75] transition-colors duration-300 hover:text-[#9b8150] focus-visible:outline-1 focus-visible:outline-[#9a8a74] sm:self-auto"
                  >
                    View Order
                    <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="border-t border-[#e2ded4] px-4 py-4 md:px-6">
              {/* MOBILE PAGINATION */}
              <div className="flex items-center justify-between gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-9 items-center gap-1 border border-[#dedbd4] bg-[#faf9f6] px-2.5 text-[9px] uppercase tracking-wide text-[#57534c] transition-colors duration-200 hover:border-[#c8bb94] hover:text-[#9b8150] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>

                <span className="whitespace-nowrap text-[8px] uppercase tracking-[0.15em] text-[#99948b]">
                  Page{" "}
                  <span className="text-[#1b1a18]">
                    {currentPage}
                  </span>{" "}
                  / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex h-9 items-center gap-1 border border-[#dedbd4] bg-[#faf9f6] px-2.5 text-[9px] uppercase tracking-wide text-[#57534c] transition-colors duration-200 hover:border-[#c8bb94] hover:text-[#9b8150] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* DESKTOP PAGINATION */}
              <div className="hidden items-center justify-between gap-4 sm:flex">
                <p className="text-[8px] uppercase tracking-[0.18em] text-[#99948b]">
                  Page{" "}
                  <span className="text-[#1b1a18]">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-[#1b1a18]">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  {/* PREVIOUS */}
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="flex h-9 items-center gap-1 border border-[#dedbd4] bg-[#faf9f6] px-3 text-[9px] uppercase tracking-wide text-[#817d75] transition-colors duration-200 hover:border-[#c8bb94] hover:text-[#9b8150] disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  {/* PAGE NUMBERS */}
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages: (number | "...")[] = [];

                      if (totalPages <= 4) {
                        for (
                          let i = 1;
                          i <= totalPages;
                          i++
                        ) {
                          pages.push(i);
                        }
                      } else if (currentPage <= 2) {
                        pages.push(
                          1,
                          2,
                          3,
                          4,
                          "...",
                          totalPages
                        );
                      } else if (
                        currentPage >= totalPages - 1
                      ) {
                        pages.push(
                          1,
                          "...",
                          totalPages - 3,
                          totalPages - 2,
                          totalPages - 1,
                          totalPages
                        );
                      } else {
                        pages.push(
                          1,
                          "...",
                          currentPage - 1,
                          currentPage,
                          currentPage + 1,
                          "...",
                          totalPages
                        );
                      }

                      return pages.map((page, index) => {
                        if (page === "...") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="flex h-9 min-w-7 items-center justify-center px-1 text-xs text-[#aaa49b]"
                            >
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() =>
                              goToPage(page)
                            }
                            aria-current={
                              currentPage === page
                                ? "page"
                                : undefined
                            }
                            className={`flex h-9 min-w-9 items-center justify-center px-3 text-[10px] transition-colors duration-200 ${currentPage === page
                                ? "border border-[#1b1a18] bg-[#1b1a18] text-[#faf9f6]"
                                : "border border-[#dedbd4] bg-[#faf9f6] text-[#817d75] hover:border-[#c8bb94] hover:text-[#9b8150]"
                              }`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* NEXT */}
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                    className="flex h-9 items-center gap-1 border border-[#dedbd4] bg-[#faf9f6] px-3 text-[9px] uppercase tracking-wide text-[#817d75] transition-colors duration-200 hover:border-[#c8bb94] hover:text-[#9b8150] disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}