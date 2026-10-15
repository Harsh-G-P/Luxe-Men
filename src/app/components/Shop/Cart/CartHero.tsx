"use client";

import Image from "next/image";

export default function CartHero() {
  return (
    <section className="group relative h-[36vh] min-h-75 overflow-hidden bg-[#171717] sm:h-[48vh] sm:min-h-110">

      {/* BACKGROUND IMAGE  */}
      <div className="absolute inset-0 overflow-hidden">

        <Image
          src="/images/cart1.jpg"
          alt="Luxury fashion"
          fill
          priority
          sizes="100vw"
          className="
                    object-cover
                    object-[20%_48%]
                    grayscale-15
                    transition-transform
                    duration-1800
                    ease-out
                    group-hover:scale-[1.025]
                "
        />

      </div>


      {/*IMAGE OVERLAYS */}
      {/* Luxury tint */}
      <div className="absolute inset-0 bg-[#171717]/20" />

      {/* Cinematic gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/15" />

      {/* Bottom contrast */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/55 to-transparent sm:h-40 sm:from-black/45" />

      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/35 to-transparent sm:h-32" />


      {/* DECORATIVE FRAME */}
      <div className="pointer-events-none absolute inset-3 z-20 sm:inset-6 lg:inset-8">

        {/* TOP */}
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

        {/* LEFT */}
        <div className="absolute inset-y-0 left-0 w-px bg-white/10" />

        {/* RIGHT */}
        <div className="absolute inset-y-0 right-0 w-px bg-white/10" />

        {/* BOTTOM LEFT */}
        <div className="absolute bottom-0 left-0 right-1/2 h-px bg-white/10" />

        {/* BOTTOM RIGHT */}
        <div className="absolute bottom-0 left-1/2 right-0 h-px bg-white/10" />

      </div>


      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex h-full max-w-375 items-center px-6 sm:px-12 lg:px-16">

        <div className="max-w-3xl text-white">

          {/* LABEL */}
          <span className="text-[6px] font-medium uppercase tracking-[0.45em] text-white/55 sm:text-[7px] sm:tracking-[0.5em]">
            Your Selection
          </span>

          {/* HEADING */}
          <h1 className="font-serif text-[38px] font-light leading-[0.98] tracking-tight sm:text-5xl md:text-6xl lg:text-[72px]">
            Your Selection.
            <br />
            <span className="italic text-white/75">
              Chosen with intention.
            </span>
          </h1>

          <div className="mt-5 flex items-center gap-3 sm:mt-7 sm:gap-4">

            <span className="h-px w-8 bg-white/35 sm:w-12" />

            <span className="h-1 w-1 rotate-45 border border-white/40" />

            <span className="h-px w-8 bg-white/15 sm:w-12" />

          </div>

          {/* DESCRIPTION */}
          <p className="mt-4 hidden max-w-lg text-[12px] leading-6 text-white/55 sm:mt-6 sm:block sm:text-sm sm:leading-7">
            A curated selection of pieces, considered for your wardrobe.
          </p>

          {/* DESKTOP META */}

          <div className="mt-8 hidden items-center gap-8 sm:flex">

            <div className="flex items-center gap-3">

              <span className="h-px w-5 bg-white/40" />

              <span className="text-[7px] uppercase tracking-[0.35em] text-white/45">
                Your Selection
              </span>

            </div>

            <span className="text-[7px] uppercase tracking-[0.35em] text-white/25">
              Luxe Men
            </span>

          </div>

        </div>

      </div>

      {/* TOP RIGHT DETAIL */}
      <div className="absolute right-8 top-8 z-30 hidden sm:block lg:right-12 lg:top-10">

        <div className="flex flex-col items-end gap-2">

          <span className="text-[7px] uppercase tracking-[0.4em] text-white/35">
            Shopping
          </span>

          <span className="font-serif text-lg italic text-white/25">
            LM
          </span>

        </div>

      </div>

      {/* DESKTOP EXPLORE */}
      <div className="absolute bottom-8 right-8 z-30 hidden items-center gap-4 sm:flex lg:right-12">

        <span className="text-[7px] uppercase tracking-[0.4em] text-white/40">
          View Selection
        </span>

        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-white/50">

          <svg
            className="h-3 w-3 text-white/60 transition-transform duration-300 group-hover:translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >

            <path d="M12 5v14" />

            <path d="m7 14 5 5 5-5" />

          </svg>

        </span>

      </div>


      {/* MOBILE DETAIL */}
      <div className="absolute bottom-5 left-6 z-30 sm:hidden">

        <div className="flex items-center gap-2.5">

          <span className="h-px w-5 bg-white/35" />

          <span className="text-[6px] uppercase tracking-[0.35em] text-white/40">
            Luxe Men
          </span>

        </div>

      </div>


      {/* BOTTOM CENTER LM LOGO */}
      <div
        className="
                absolute
                bottom-10
                left-1/2
                flex
                h-14
                w-14
                -translate-x-1/2
                translate-y-1/2
                items-center
                justify-center
            "
      >

        {/* Outer diamond */}

        <div
          className="
                    absolute
                    inset-1
                    rotate-45
                    border
                    border-white/30
                "
        />

        {/* Inner diamond */}

        <div
          className="
                    absolute
                    inset-3
                    rotate-45
                    border
                    bg-white/50
                    border-white/10
                "
        />

        {/* LM */}

        <span
          className="
                    relative
                    z-10
                    font-serif
                    text-[17px]
                    font-bold
                    tracking-[-0.12em]
                    text-black
                "
        >
          LM
        </span>

      </div>

    </section>
  );


}