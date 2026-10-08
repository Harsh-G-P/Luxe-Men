"use client";

import Link from "next/link";
import EmptyOrders from "./Orders/EmptyOrders";
import OrderCard from "./Orders/OrderCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;

  items: {
    id: string;
    title: string;
    quantity: number;
    price: number;
    image: string | null;
    attributes: Record<string, string> | null;
  }[];
};

type Pagination = {
  page: number;
  limit: number;
  totalOrders: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 6,
    totalOrders: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/order?page=${page}&limit=6`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load orders");
        return;
      }

      setOrders(data.data.orders);
      setPagination(data.data.pagination);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handlePrevious = () => {
    if (!pagination.hasPreviousPage || loading) return;

    fetchOrders(pagination.page - 1);
  };

  const handleNext = () => {
    if (!pagination.hasNextPage || loading) return;

    fetchOrders(pagination.page + 1);
  };

  if (loading && orders.length === 0) {
    return (
      <section className="min-h-screen bg-[#f7f6f2]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">

          {/* Header */}
          <div className="text-center">

            <div className="flex items-center justify-center gap-5">
              <span className="h-px w-12 bg-[#cfc9bd]" />

              <span className="text-[9px] uppercase tracking-[0.42em] text-[#a18450]">
                The Collection
              </span>

              <span className="h-px w-12 bg-[#cfc9bd]" />
            </div>

            <h1 className="mt-7 font-serif text-4xl font-normal tracking-[0.02em] text-[#171614] md:text-5xl">
              Your Orders
            </h1>

            <p className="mx-auto mt-5 max-w-md text-[12px] leading-6 tracking-[0.02em] text-[#858077]">
              A record of your purchases, prepared exclusively for you.
            </p>

          </div>

          <div className="mx-auto mt-12 h-px max-w-4xl bg-[#dedad2]" />

          {/* Loading */}
          <div className="flex min-h-[420px] items-center justify-center">

            <div className="text-center">

              <div className="relative mx-auto h-9 w-9">
                <div className="absolute inset-0 rounded-full border border-[#ddd8cf]" />

                <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-[#a18450]" />
              </div>

              <p className="mt-7 text-[8px] uppercase tracking-[0.38em] text-[#aaa49a]">
                Retrieving your orders
              </p>

            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f7f6f2]">

      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">

        {/* HEADER */}
        <header className="text-center">

          <div className="flex items-center justify-center gap-5">

            <span className="h-px w-12 bg-[#cfc9bd]" />

            <span className="text-[9px] font-medium uppercase tracking-[0.42em] text-[#a18450]">
              The Collection
            </span>

            <span className="h-px w-12 bg-[#cfc9bd]" />

          </div>

          <h1 className="mt-7 font-serif text-4xl font-normal tracking-[0.02em] text-[#171614] md:text-5xl">
            Your Orders
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[12px] leading-6 tracking-[0.02em] text-[#858077]">
            A record of your purchases, prepared exclusively for you.
          </p>

        </header>

        {/* Divider */}
        <div className="mx-auto mt-12 h-px max-w-4xl bg-[#dedad2]" />

        {/* EMPTY STATE */}
        {pagination.totalOrders === 0 ? (

          <div className="mt-20">
            <EmptyOrders />
          </div>

        ) : (

          <>

            {/* NAVIGATION */}
            <div className="mt-10 flex items-center justify-between">

              {/* Account */}
              <Link
                href="/profile"
                className="
                  group
                  inline-flex
                  items-center
                  gap-4
                  border-b
                  border-[#c9c5bd]
                  pb-2
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.26em]
                  text-[#625e56]
                  transition-all
                  duration-500
                  hover:border-[#171614]
                  hover:text-[#171614]
                "
              >
                <span
                  className="
                    text-sm
                    font-light
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:-translate-x-1
                  "
                >
                  ←
                </span>

                <span>Account</span>
              </Link>

              {/* Order Count */}
              <p className="text-[9px] uppercase tracking-[0.26em] text-[#aaa49a]">
                {pagination.totalOrders}{" "}
                {pagination.totalOrders === 1 ? "Order" : "Orders"}
              </p>

            </div>

            {/* ORDERS */}
            <div
              className={`
                mt-8
                space-y-8
                transition-opacity
                duration-500
                ${loading ? "opacity-40" : "opacity-100"}
              `}
            >
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="
                    transition-transform
                    duration-500
                    ease-out
                    hover:-translate-y-px
                  "
                >
                  <OrderCard order={order} />
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (

              <nav
                aria-label="Orders pagination"
                className="mt-20 border-t border-[#dedad2] pt-10"
              >

                <div className="grid grid-cols-3 items-center">

                  {/* PREVIOUS */}
                  <div className="justify-self-start">

                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={
                        !pagination.hasPreviousPage || loading
                      }
                      className="
                        group
                        relative
                        inline-flex
                        items-center
                        gap-4
                        pb-2
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.25em]
                        text-[#625e56]
                        transition-colors
                        duration-500
                        hover:text-[#171614]
                        disabled:pointer-events-none
                        disabled:opacity-20
                      "
                    >

                      <span
                        className="
                          text-sm
                          font-light
                          transition-transform
                          duration-500
                          ease-out
                          group-hover:-translate-x-1
                        "
                      >
                        ←
                      </span>

                      <span>
                        Previous
                      </span>

                      {/* Underline */}
                      <span
                        className="
                          absolute
                          bottom-0
                          left-0
                          h-px
                          w-full
                          origin-right
                          scale-x-0
                          bg-[#171614]
                          transition-transform
                          duration-500
                          ease-out
                          group-hover:origin-left
                          group-hover:scale-x-100
                        "
                      />

                    </button>

                  </div>

                  {/* PAGE */}
                  <div className="text-center">

                    <p className="text-[8px] uppercase tracking-[0.35em] text-[#aaa49a]">
                      Page
                    </p>

                    <p className="mt-2 font-serif text-lg text-[#25231f]">

                      {String(pagination.page).padStart(2, "0")}

                      <span className="mx-2 font-sans text-xs text-[#c6c0b6]">
                        /
                      </span>

                      <span className="font-sans text-xs tracking-[0.1em] text-[#8b867d]">
                        {String(pagination.totalPages).padStart(2, "0")}
                      </span>

                    </p>

                  </div>

                  {/* NEXT */}
                  <div className="justify-self-end">

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        !pagination.hasNextPage || loading
                      }
                      className="
                        group
                        relative
                        inline-flex
                        items-center
                        gap-4
                        pb-2
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.25em]
                        text-[#171614]
                        transition-colors
                        duration-500
                        hover:text-[#625e56]
                        disabled:pointer-events-none
                        disabled:opacity-20
                      "
                    >

                      <span>
                        Next
                      </span>

                      <span
                        className="
                          text-sm
                          font-light
                          transition-transform
                          duration-500
                          ease-out
                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>

                      {/* Underline */}
                      <span
                        className="
                          absolute
                          bottom-0
                          right-0
                          h-px
                          w-full
                          origin-left
                          scale-x-0
                          bg-[#171614]
                          transition-transform
                          duration-500
                          ease-out
                          group-hover:origin-right
                          group-hover:scale-x-100
                        "
                      />

                    </button>

                  </div>

                </div>

                {/* RESULTS */}
                <p className="mt-8 text-center text-[8px] uppercase tracking-[0.3em] text-[#aaa49a]">
                  Showing{" "}
                  {(pagination.page - 1) * pagination.limit + 1}
                  {"–"}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.totalOrders
                  )}{" "}
                  of {pagination.totalOrders}
                </p>


              </nav>
            )}

          </>
        )}

      </div>
    </section>
  );
}
