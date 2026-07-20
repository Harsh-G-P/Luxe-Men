import Link from "next/link";

export default function NotFound() {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f6f2] px-6">

            {/* Background Typography */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                <span className="select-none font-serif text-[28vw] font-light leading-none tracking-[-0.08em] text-black/3">
                    404
                </span>

            </div>

            {/* Decorative Lines */}
            <div className="absolute left-12 top-12 h-px w-28 bg-black/20" />
            <div className="absolute bottom-12 right-12 h-px w-28 bg-black/20" />

            <div className="relative z-10 max-w-3xl text-center">

                <p className="mb-8 text-[11px] uppercase tracking-[0.6em] text-gray-500">
                    EST. 2026
                </p>

                <h1 className="font-serif text-5xl font-light leading-[1.05] tracking-tight text-black md:text-8xl">
                    The Journey
                    <br />
                    Ends Here
                </h1>

                <p className="mx-auto mt-10 max-w-xl text-[15px] leading-8 text-gray-500">
                    The page you're looking for no longer exists or may have
                    been moved. Continue exploring our collections, crafted
                    with timeless design and modern luxury.
                </p>

                <div className="mt-16 flex flex-col items-center justify-center gap-5 sm:flex-row">

                    <Link
                        href="/collections"
                        className="min-w-56 border border-black bg-black px-10 py-4 text-center text-[11px] uppercase tracking-[0.35em] text-white transition duration-300 hover:bg-white hover:text-black"
                    >
                        Explore Collection
                    </Link>

                    <Link
                        href="/"
                        className="min-w-56 border border-black px-10 py-4 text-center text-[11px] uppercase tracking-[0.35em] text-black transition duration-300 hover:bg-black hover:text-white"
                    >
                        Return Home
                    </Link>

                </div>

            </div>

        </section>
    );
}