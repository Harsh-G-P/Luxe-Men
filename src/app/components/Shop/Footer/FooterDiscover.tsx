import Link from "next/link";

export default function FooterDiscover() {
    return (
        <div className="space-y-10">

            <div>
                <p className="mb-7 text-[10px] uppercase tracking-[0.45em] text-white/40">
                    Discover
                </p>

                <p className="max-w-sm text-sm leading-7 text-white/50">
                    A considered collection of timeless menswear,
                    refined essentials, and enduring craftsmanship.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-8">

                <Link
                    href="/collections"
                    className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                >
                    Explore Collection →
                </Link>

                <Link
                    href="/about"
                    className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                >
                    Our Story →
                </Link>

                <Link
                    href="/contact"
                    className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                >
                    Client Services →
                </Link>

            </div>

        </div>
    );
}
