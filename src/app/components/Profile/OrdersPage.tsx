"use client";

import Link from "next/link";
import EmptyOrders from "./Orders/EmptyOrders";
import OrderCard from "./Orders/OrderCard";


const orders = [
  {
    id: "1",
    orderNumber: "ORD-7D93A2",
    date: "July 29, 2026",
    status: "Delivered",
    total: 249,

    items: [
      {
        id: "1",
        title: "Gucci Wool Jacket",
        variant: "Black / L",
        quantity: 1,
        price: 149,
        image: "/demo/p1.jpg",
      },
      {
        id: "2",
        title: "Straight Denim Jeans",
        variant: "Blue / 32",
        quantity: 1,
        price: 100,
        image: "/demo/p2.jpg",
      },
    ],
  },

  {
    id: "2",
    orderNumber: "ORD-8AB621",
    date: "July 21, 2026",
    status: "Processing",
    total: 179,

    items: [
      {
        id: "3",
        title: "Oversized Hoodie",
        variant: "Cream / XL",
        quantity: 1,
        price: 179,
        image: "/demo/p3.jpg",
      },
    ],
  },
];

export default function OrdersPage() {
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

      {orders.length === 0 ? (
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