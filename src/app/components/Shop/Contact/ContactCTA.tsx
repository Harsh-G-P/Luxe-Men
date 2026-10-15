import Link from "next/link";

export default function ContactCTA() {
    return (
        <section className="bg-[#f7f5f1] px-5 py-8">

            <div className="mx-auto max-w-4xl text-center">

                {/* Decorative Mark */}
                <div className="mb-9 flex items-center justify-center gap-4">
                    <span className="h-px w-14 bg-[#b49a68]/40" />

                    <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]" />

                    <span className="h-px w-14 bg-[#b49a68]/40" />
                </div>

                {/* Eyebrow */}
                <p className="text-[9px] font-medium uppercase tracking-[0.55em] text-[#9b8050]">
                    Until We Meet Again
                </p>

                {/* Heading */}
                <h2 className="mt-6 font-serif text-5xl font-light leading-[0.95] tracking-[-0.045em] text-[#191816] md:text-7xl">
                    Your Journey
                    <br />
                    <span className="italic text-[#77736b]">
                        Continues.
                    </span>
                </h2>

                {/* Description */}
                <p className="mx-auto mt-8 max-w-md text-[11px] leading-7 tracking-[0.04em] text-[#858078]">
                    Take a moment to discover the world of Luxe Men —
                    thoughtfully designed pieces, refined details, and
                    enduring style.
                </p>

                {/* Single Luxury CTA */}
                <Link
                    href="/collections"
                    className="group relative mt-12 inline-flex items-center gap-8 border border-[#2a2925] px-10 py-4 text-[9px] uppercase tracking-[0.4em] text-[#2a2925] transition-all duration-500 hover:bg-[#2a2925] hover:text-white"
                >
                    <span>Explore the Collection</span>

                    <span className="text-sm transition-transform duration-500 group-hover:translate-x-1">
                        →
                    </span>
                </Link>

                {/* Closing Signature */}
                <div className="mt-24 flex flex-col items-center">

                    <div className="h-px w-20 bg-[#d8d4cc]" />

                    <p className="mt-6 font-serif text-xl font-light italic text-[#77736b]">
                        Luxe Men
                    </p>

                    <p className="mt-2 text-[7px] uppercase tracking-[0.55em] text-[#aaa59c]">
                        Modern Elegance
                    </p>

                </div>

            </div>

        </section>
    );
}
