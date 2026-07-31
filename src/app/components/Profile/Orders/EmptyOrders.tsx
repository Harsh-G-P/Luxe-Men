"use client";

import Link from "next/link";

export default function EmptyOrders() {
  return (
    <div className="border border-neutral-200 px-8 py-24 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neutral-200 text-4xl">
        📦
      </div>

      <h2 className="mt-8 text-3xl font-light uppercase tracking-[0.18em]">
        No Orders Yet
      </h2>

      <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-neutral-500">
        You haven't placed any orders yet. Discover our latest collection and
        find timeless pieces crafted with exceptional quality.
      </p>

      <Link
        href="/collections"
        className="mt-10 inline-flex items-center justify-center border border-black px-10 py-3 text-sm uppercase tracking-[0.12em] transition hover:bg-black hover:text-white"
      >
        Explore Collection
      </Link>

    </div>
  );
}