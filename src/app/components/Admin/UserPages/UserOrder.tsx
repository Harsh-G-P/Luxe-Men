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
    <div className="w-full overflow-hidden border border-neutral-200 bg-white">

      {/* Header */}

      <div className="border-b border-neutral-200 px-4 py-5 sm:px-8">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

          <div className="min-w-0">

            <h2 className="text-sm uppercase tracking-[0.18em]">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Latest orders placed by this customer.
            </p>

          </div>

          {orders.length > 0 && (
            <span className="shrink-0 self-start text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </span>
          )}

        </div>

      </div>

      {/* Orders */}

      {orders.length === 0 ? (

        <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:px-8">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <span className="text-2xl text-neutral-400">
              🛍️
            </span>
          </div>

          <h3 className="mt-5 text-sm font-medium uppercase tracking-[0.12em] text-neutral-800">
            No Orders Yet
          </h3>

          <p className="mt-2 max-w-sm text-xs leading-5 text-neutral-500">
            This customer hasn&apos;t placed any orders yet.
          </p>

        </div>

      ) : (

        <>

          {/* Order List */}

          <div className="divide-y divide-neutral-200">

            {paginatedOrders.map((order) => (

              <div
                key={order.id}
                className="px-4 py-5 transition hover:bg-neutral-50 sm:px-8 sm:py-6"
              >

                {/* Top */}

                <div className="flex min-w-0 items-start justify-between gap-4">

                  <div className="min-w-0">

                    <h3 className="truncate text-sm font-medium tracking-wider">
                      {order.orderNumber}
                    </h3>

                    <p className="mt-2 text-xs text-neutral-500">
                      {formatDateTime(
                        order.createdAt
                      )}
                    </p>

                  </div>

                  <p className="shrink-0 text-sm font-semibold">
                    {formatCurrency(
                      order.total
                    )}
                  </p>

                </div>

                {/* Bottom */}

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase ${
                        orderStatusStyles[
                          order.status
                        ] ||
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase ${
                        paymentStatusStyles[
                          order.paymentStatus
                        ] ||
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>

                  </div>

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="self-start text-[11px] uppercase tracking-[0.12em] text-neutral-500 transition hover:text-black sm:self-auto"
                  >
                    View Order →
                  </Link>

                </div>

              </div>

            ))}

          </div>

          {/* Pagination */}

          {totalPages > 1 && (

            <div className="border-t border-neutral-200 px-4 py-4 sm:px-8">

              {/* Mobile Pagination */}

              <div className="flex items-center justify-between gap-3 sm:hidden">

                <button
                  type="button"
                  onClick={() =>
                    goToPage(
                      currentPage - 1
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className="flex h-9 items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Page{" "}
                  <span className="text-neutral-800">
                    {currentPage}
                  </span>{" "}
                  / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    goToPage(
                      currentPage + 1
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="flex h-9 items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>

              </div>


              {/* Desktop Pagination */}

              <div className="hidden items-center justify-between gap-4 sm:flex">

                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                  Page{" "}
                  <span className="text-neutral-800">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-neutral-800">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-2">

                  {/* Previous */}

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    className="flex h-9 items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-500 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>


                  {/* Page Numbers */}

                  <div className="flex items-center gap-1">

                    {(() => {

                      const pages: (
                        | number
                        | "..."
                      )[] = [];

                      if (totalPages <= 4) {

                        for (
                          let i = 1;
                          i <= totalPages;
                          i++
                        ) {
                          pages.push(i);
                        }

                      } else if (
                        currentPage <= 2
                      ) {

                        pages.push(
                          1,
                          2,
                          3,
                          4,
                          "...",
                          totalPages
                        );

                      } else if (
                        currentPage >=
                        totalPages - 1
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

                      return pages.map(
                        (
                          page,
                          index
                        ) => {

                          if (
                            page ===
                            "..."
                          ) {

                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="flex h-9 min-w-8 items-center justify-center px-1 text-xs text-neutral-400"
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
                                goToPage(
                                  page
                                )
                              }
                              className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-semibold transition ${
                                currentPage ===
                                page
                                  ? "bg-black text-white"
                                  : "border border-neutral-200 bg-white text-neutral-500 hover:border-black hover:text-black"
                              }`}
                            >
                              {page}
                            </button>
                          );

                        }
                      );

                    })()}

                  </div>


                  {/* Next */}

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="flex h-9 items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-500 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
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