import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative py-10 w-full overflow-hidden">

            <div className="relative -mx-5 md:-mx-20 mb-24 h-100 overflow-hidden md:h-130">
                {/* Background Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                >
                    <source src="/videos/about.mp4" type="video/mp4" />
                </video>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-300">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <span className="font-medium text-white">About</span>
                    </div>
                    <p className="mb-4 text-md uppercase tracking-[0.35em]">
                        EST. 2026
                    </p>

                    <h1 className="font-serif text-4xl uppercase tracking-wide md:text-6xl">
                        Crafted Beyond Trends
                    </h1>
                    <p className="mx-auto max-w-xl mt-5 text-md leading-6 text-white/80 ">
                            Modern menswear built on timeless design,
                            exceptional craftsmanship, and everyday luxury.
                        </p>
                </div>
            </div>
        </section>
    );
}