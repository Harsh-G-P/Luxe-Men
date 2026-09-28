import Link from "next/link";

export default function NotFound() {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f5f1] px-6">

            {/* Oversized Background Number */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="select-none font-serif text-[32vw] font-light leading-none tracking-[-0.09em] text-[#1d1c19]/2.5">
                    404
                </span>
            </div>

            {/* Editorial Corner Details */}
            <div className="absolute left-7 top-7 flex items-center gap-3 md:left-12 md:top-12">
                <span className="h-px w-10 bg-[#b49a68]/50 md:w-16" />
                <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]/70" />
            </div>

            <div className="absolute bottom-7 right-7 flex items-center gap-3 md:bottom-12 md:right-12">
                <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]/70" />
                <span className="h-px w-10 bg-[#b49a68]/50 md:w-16" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-3xl text-center">

                {/* Brand Label */}
                <div className="mb-9 flex items-center justify-center gap-4">

                    <span className="h-px w-10 bg-[#b49a68]/50" />

                    <p className="text-[8px] font-medium uppercase tracking-[0.6em] text-[#9b8050]">
                        Luxe Men
                    </p>

                    <span className="h-px w-10 bg-[#b49a68]/50" />

                </div>

                {/* 404 Label */}
                <p className="text-[9px] uppercase tracking-[0.55em] text-[#9b968d]">
                    Page 404
                </p>

                {/* Heading */}
                <h1 className="mt-7 font-serif text-5xl font-light leading-[0.95] tracking-[-0.045em] text-[#191816] sm:text-6xl md:text-8xl">
                    A Moment
                    <br />
                    <span className="italic text-[#77736b]">
                        Out of Place.
                    </span>
                </h1>

                {/* Description */}
                <p className="mx-auto mt-9 max-w-md text-[11px] leading-7 tracking-[0.035em] text-[#858078]">
                    The page you were looking for has moved or no longer
                    exists. Take a moment and continue your journey through
                    Luxe Men.
                </p>

                {/* CTA */}
                <Link
                    href="/collections"
                    className="group mt-12 inline-flex items-center gap-8 border border-[#292824] bg-[#292824] px-10 py-4 text-[9px] uppercase tracking-[0.4em] text-white transition-all duration-500 hover:bg-transparent hover:text-[#292824]"
                >
                    <span>Explore the Collection</span>

                    <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                        →
                    </span>
                </Link>

                {/* Return Home */}
                <div className="mt-8">
                    <Link
                        href="/"
                        className="text-[8px] uppercase tracking-[0.45em] text-[#99948b] transition-colors duration-300 hover:text-[#9b8050]"
                    >
                        Return to Maison
                    </Link>
                </div>

                {/* Bottom Signature */}
                <div className="mt-20 flex flex-col items-center">

                    <div className="h-px w-16 bg-[#d8d4cc]" />

                    <p className="mt-5 font-serif text-lg font-light italic text-[#77736b]">
                        Modern Elegance
                    </p>

                    <p className="mt-2 text-[7px] uppercase tracking-[0.55em] text-[#aaa59c]">
                        Established 2026
                    </p>

                </div>

            </div>

        </section>
    );
}
