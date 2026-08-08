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


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/order", {
        method: "GET"
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message)
        return
      }
      setOrders(data.data)
    } catch (error) {
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16">

        <div className="text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
            Account
          </p>

          <h1 className="mt-4 text-5xl font-light uppercase tracking-[0.18em]">
            My Orders
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-500">
            Review your purchases and track every order you've placed.
          </p>

        </div>

        <div className="mx-auto mt-10 h-px max-w-3xl bg-neutral-200" />

        <div className="flex min-h-80 items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />

            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-neutral-500">
              Loading Orders
            </p>

          </div>

        </div>

      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">

      {/* Heading */}
      <div className="text-center">

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
          Account
        </p>

        <h1 className="mt-4 text-5xl font-light uppercase tracking-[0.18em]">
          My Orders
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-500">
          Review your purchases and track every order you've placed.
        </p>

      </div>

      <div className="mx-auto mt-10 h-px max-w-3xl bg-neutral-200" />

      {/* Orders */}

      {orders.length < 1 ? (
        <div className="mt-16">
          <EmptyOrders />
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <div className="flex items-center">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              ← Back to Profile
            </Link>
          </div>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      )}

    </section>
  );
}