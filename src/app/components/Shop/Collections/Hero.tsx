import Image from "next/image";

export default function Hero() {
    return (
        <section className="group relative h-[36vh] min-h-75 overflow-hidden bg-[#171717] sm:h-[48vh] sm:min-h-110">

            {/* =========================
                BACKGROUND IMAGE
            ========================== */}
            <div className="absolute inset-0 overflow-hidden">
                <Image
                    src="/images/l2.jpg"
                    alt="Premium men's fashion collection"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center grayscale-15 transition-transform duration-1800 ease-out group-hover:scale-[1.025]"
                />
            </div>

            {/* =========================
                IMAGE OVERLAYS
            ========================== */}

            {/* Luxury tint */}
            <div className="absolute inset-0 bg-[#171717]/20" />

            {/* Cinematic gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/15" />

            {/* Mobile stronger bottom contrast */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/55 to-transparent sm:h-40 sm:from-black/45" />

            {/* Top gradient */}
            <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/35 to-transparent sm:h-32" />

            {/* =========================
                DECORATIVE FRAME
            ========================== */}
            <div className="pointer-events-none absolute inset-3 border border-white/8 sm:inset-6 lg:inset-8" />

            {/* =========================
                CONTENT
            ========================== */}
            <div className="relative z-10 mx-auto flex h-full max-w-375 items-center px-6 sm:px-12 lg:px-16">

                <div className="max-w-3xl text-white">

                    {/* Collection Number + Label */}
                    <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">

                        <span className="font-serif text-[10px] italic text-white/35 sm:text-xs">
                            01
                        </span>

                        <span className="h-px w-6 bg-white/30 sm:w-10" />

                        <span className="text-[6px] font-medium uppercase tracking-[0.45em] text-white/55 sm:text-[7px] sm:tracking-[0.5em]">
                            The Collection
                        </span>

                    </div>

                    {/* =========================
                        HEADING
                    ========================== */}
                    <h1 className="font-serif text-[34px] font-light leading-[0.98] tracking-tight sm:text-5xl md:text-6xl lg:text-[72px]">

                        Modern essentials.

                        <br />

                        <span className="italic text-white/75">
                            Timeless character.
                        </span>

                    </h1>

                    {/* Fine divider */}
                    <div className="mt-5 flex items-center gap-3 sm:mt-7 sm:gap-4">

                        <span className="h-px w-8 bg-white/35 sm:w-12" />

                        <span className="h-1 w-1 rotate-45 border border-white/40" />

                        <span className="h-px w-8 bg-white/15 sm:w-12" />

                    </div>

                    {/* =========================
                        DESCRIPTION
                    ========================== */}
                    <p className="mt-4 hidden max-w-lg text-[12px] leading-6 text-white/55 sm:mt-6 sm:block sm:text-sm sm:leading-7">
                        Discover a considered selection of premium
                        menswear, designed around refined silhouettes,
                        exceptional materials, and effortless style.
                    </p>

                    {/* =========================
                        DESKTOP META
                    ========================== */}
                    <div className="mt-8 hidden items-center gap-8 sm:flex">

                        <div className="flex items-center gap-3">
                            <span className="h-px w-5 bg-white/40" />

                            <span className="text-[7px] uppercase tracking-[0.35em] text-white/45">
                                Curated Selection
                            </span>
                        </div>

                        <span className="text-[7px] uppercase tracking-[0.35em] text-white/25">
                            Menswear
                        </span>

                    </div>

                </div>
            </div>

            {/* =========================
                TOP RIGHT DETAIL
            ========================== */}
            <div className="absolute right-8 top-8 z-10 hidden sm:block lg:right-12 lg:top-10">

                <div className="flex flex-col items-end gap-2">

                    <span className="text-[7px] uppercase tracking-[0.4em] text-white/35">
                        Collection
                    </span>

                    <span className="font-serif text-lg italic text-white/25">
                        MM
                    </span>

                </div>

            </div>

            {/* =========================
                DESKTOP EXPLORE
            ========================== */}
            <div className="absolute bottom-8 right-8 z-10 hidden items-center gap-4 sm:flex lg:right-12">

                <span className="text-[7px] uppercase tracking-[0.4em] text-white/40">
                    Explore Collection
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

            {/* =========================
                MOBILE DETAIL
            ========================== */}
            <div className="absolute bottom-5 left-6 z-10 sm:hidden">

                <div className="flex items-center gap-2.5">

                    <span className="h-px w-5 bg-white/35" />

                    <span className="text-[6px] uppercase tracking-[0.35em] text-white/40">
                        Menswear
                    </span>

                </div>

            </div>

        </section>
    );
}