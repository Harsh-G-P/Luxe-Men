"use client";

import { useState } from "react";
import Image from "next/image";

const rows = [
  // Row 1 
  [
    {
      src: "/images/l4.jpg",
      alt: "Lookbook look 1",
      size: "big",
    },
    {
      src: "/images/l5.jpg",
      alt: "Lookbook look 2",
      size: "small",
    },
    {
      src: "/images/l6.jpg",
      alt: "Lookbook look 3",
      size: "small",
    },
  ],

  // Row 2 
  [
    {
      src: "/images/l7.jpg",
      alt: "Lookbook look 4",
      size: "small",
    },
    {
      src: "/images/l8.jpg",
      alt: "Lookbook look 5",
      size: "big",
    },
    {
      src: "/images/l9.jpg",
      alt: "Lookbook look 6",
      size: "small",
    },
  ],

  // Row 3 
  [
    {
      src: "/images/l_1.jpg",
      alt: "Lookbook look 7",
      size: "small",
    },
    {
      src: "/images/l16.jpg",
      alt: "Lookbook look 8",
      size: "small",
    },
    {
      src: "/images/l3.jpg",
      alt: "Lookbook look 9",
      size: "big",
    },
  ],

  // Row 4 
  [
    {
      src: "/images/l10.jpg",
      alt: "Lookbook look 10",
      size: "big",
    },
    {
      src: "/images/l11.jpg",
      alt: "Lookbook look 11",
      size: "small",
    },
    {
      src: "/images/l12.jpg",
      alt: "Lookbook look 12",
      size: "small",
    },
  ],

  // Row 5 
  [
    {
      src: "/images/l13.jpg",
      alt: "Lookbook look 13",
      size: "small",
    },
    {
      src: "/images/l14.jpg",
      alt: "Lookbook look 14",
      size: "big",
    },
    {
      src: "/images/l15.jpg",
      alt: "Lookbook look 15",
      size: "small",
    },
  ],
];

export default function Editorial() {
  const [visibleRows, setVisibleRows] = useState(2);

  const hasMore = visibleRows < rows.length;

  const handleShowMore = () => {
    setVisibleRows((current) => Math.min(current + 1, rows.length));
  };

  return (
    <section className="bg-[#f5f2eb] px-5 py-16 md:px-10 md:py-24 lg:px-16">

      {/* Header */}
      <header className="mb-12 md:mb-16">

        {/* Top line */}
        <div className="mb-7 flex items-center justify-between border-b border-black/8 pb-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#ad9662]" />

            <span className="text-[8px] uppercase tracking-[0.35em] text-black/45">
              Collection ❖❖
            </span>
          </div>

          <span className="text-[8px] tracking-[0.3em] text-black/25">
            MMXXVI
          </span>
        </div>

        {/* Title */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-[42px] font-normal leading-[0.9] tracking-[-0.045em] text-[#171614] md:text-[64px] lg:text-[72px]">
              The{" "}
              <span className="italic text-[#a28b59]">
                Lookbook.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 text-[11px] leading-[1.8] tracking-wide text-black/45 md:mt-7 md:whitespace-nowrap">
              A curated expression of quiet silhouettes, refined textures and effortless movement.
            </p>

          </div>

          {/* Small metadata */}
          <div className="hidden items-center gap-4 md:flex">
            <span className="h-px w-8 bg-black/15" />

            <span className="text-[8px] uppercase tracking-[0.3em] text-black/35">
              Selected Forms
            </span>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="mt-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-black/8" />

          <span className="text-[8px] uppercase tracking-[0.3em] text-black/30">
            Quietly Considered
          </span>

        </div>

      </header>

      {/* Lookbook */}
      <div className="space-y-5 md:space-y-8">
        {rows.slice(0, visibleRows).map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-8"
          >
            {row.map((look, index) => {
              const isBig = look.size === "big";

              return (
                <div
                  key={`${look.src}-${rowIndex}-${index}`}
                  className={`group ${isBig
                      ? "md:col-span-2"
                      : "md:col-span-1"
                    }`}
                >
                  <div
                    className={`relative overflow-hidden ${isBig
                        ? "aspect-16/10"
                        : "aspect-3/4"
                      }`}
                  >
                    <Image
                      src={look.src}
                      alt={look.alt}
                      fill
                      priority={rowIndex === 0}
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                      sizes={
                        isBig
                          ? "(max-width: 768px) 100vw, 50vw"
                          : "(max-width: 768px) 100vw, 25vw"
                      }
                    />

                    <span className="absolute bottom-4 left-4 text-[8px] tracking-[0.25em] text-white/75">
                      {String(rowIndex * 3 + index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Show More */}
      {hasMore && (
        <div className="relative mt-10 flex flex-col items-center">

          <button
            onClick={handleShowMore}
            className="group flex flex-col items-center"
          >
            {/* Gold line */}
            <span className="mb-5 h-10 w-px bg-[#B8A06A]/60 transition-all duration-500 group-hover:h-14" />

            <span className="text-[9px] uppercase tracking-[0.35em] text-black/50 transition-colors duration-300 group-hover:text-black">
              Discover More
            </span>

            <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-[#9f8958] transition-all duration-500 group-hover:border-[#B8A06A] group-hover:bg-[#B8A06A] group-hover:text-white">
              ↓
            </span>
          </button>

        </div>
      )}

      {/* End */}
      {!hasMore && (
        <div className="relative mt-14">

          <div className="flex items-center gap-5">
            <span className="h-px flex-1 bg-black/10" />

            <span className="text-[8px] uppercase tracking-[0.35em] text-black/30">
              End of Collection
            </span>

            <span className="h-px flex-1 bg-black/10" />
          </div>

          <div className="mt-8 text-center">
            <span className="font-serif text-sm italic text-[#B8A06A]/70">
              Quietly considered.
            </span>
          </div>

        </div>
      )}

    </section>
  );
}
