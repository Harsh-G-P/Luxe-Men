"use client";

import Image from "next/image";

export default function CartHero() {
  return (
    <div className="relative w-full h-80">
      {/* Background Video */}
      <div className="fixed top-0 left-0 w-full h-100 -z-10 sm:mt-16 mt-14">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src="/videos/cart2.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pt-24">
        <div className="text-center text-white">
          <p className="mb-5 text-xs tracking-[0.5em] uppercase text-white/80">
            LUXE MEN
          </p>

          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.35em] uppercase font-light">
            Shopping Bag
          </h1>
        </div>
      </div>

      {/* Logo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
        <div className="w-14 h-14 border bg-black border-black rotate-45 flex items-center justify-center">
          <div className="-rotate-45">
            <Image
              src="/Images/brand1.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain scale-155 mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}