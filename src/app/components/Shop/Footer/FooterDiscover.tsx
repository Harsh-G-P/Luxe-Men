import Link from "next/link";

export default function FooterDiscover() {
    return (
        <div className="space-y-10">

            <div>
                <p className="mb-6 text-xs uppercase tracking-[0.35em] text-gray-400">
                    Discover
                </p>

                <p className="max-w-sm text-md leading-7 text-white/70">
                    Explore timeless menswear, premium craftsmanship,
                    and refined essentials designed for the modern gentleman.
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