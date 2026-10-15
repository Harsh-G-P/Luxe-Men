"use client";

import Link from "next/link";

export default function EmptyOrders() {
  return (
    <div
      className="
        relative
        overflow-hidden
        border
        border-[#d9d6cf]
        bg-[#faf9f6]
        px-8
        py-24
        text-center
        md:px-12
        md:py-28
      "
    >
      {/* Subtle editorial detail */}
      <div className="absolute left-1/2 top-0 h-px w-20 -translate-x-1/2 bg-[#a18450]" />

      {/* Luxe Men Monogram */}
<div
  className="
    mx-auto
    flex
    h-16
    w-16
    items-center
    justify-center
    border
    border-[#cfcac1]
    bg-[#f7f5f0]
  "
>
  <span
    className="
      font-serif
      text-[21px]
      font-normal
      tracking-[-0.12em]
      text-[#292824]
    "
  >
    LM
  </span>
</div>


      {/* Eyebrow */}
      <p className="mt-8 text-[8px] font-medium uppercase tracking-[0.4em] text-[#a18450]">
        Your Collection
      </p>

      {/* Heading */}
      <h2 className="mt-5 font-serif text-3xl font-normal tracking-[0.01em] text-[#171614] md:text-4xl">
        No Orders Yet
      </h2>

      {/* Description */}
      <p className="mx-auto mt-5 max-w-md text-[12px] leading-7 text-[#858077]">
        Your collection is waiting. Discover considered pieces designed with
        timeless character, refined materials, and enduring style.
      </p>

      {/* CTA */}
      <Link
        href="/collections"
        className="
          group
          relative
          mt-10
          inline-flex
          items-center
          gap-5
          border
          border-[#252421]
          bg-[#252421]
          px-9
          py-4
          text-[9px]
          font-medium
          uppercase
          tracking-[0.28em]
          text-[#faf9f6]
          transition-all
          duration-500
          hover:bg-[#f4f3ef]
          hover:text-[#252421]
        "
      >
        <span>Explore Collection</span>

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
      </Link>

      {/* Bottom detail */}
      <div className="mx-auto mt-12 flex items-center justify-center gap-4">
        <span className="h-px w-8 bg-[#d6d2ca]" />

        <span className="text-[7px] uppercase tracking-[0.32em] text-[#aaa69e]">
          Begin your collection
        </span>

        <span className="h-px w-8 bg-[#d6d2ca]" />
      </div>
    </div>
  );
}
