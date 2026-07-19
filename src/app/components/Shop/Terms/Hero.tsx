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
                    <source src="/videos/footer.mp4" type="video/mp4" />
                </video>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">

                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-300">
                        <Link
                            href="/"
                            className="transition hover:text-white"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <span className="font-medium text-white">
                            Terms & Conditions
                        </span>
                    </div>

                    <p className="mb-4 text-md uppercase tracking-[0.35em]">
                        LUXE MEN
                    </p>

                    <h1 className="font-serif text-4xl uppercase tracking-wide md:text-6xl">
                        Terms & Conditions
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-md leading-7 text-white/80">
                        Please review the terms governing your use of the
                        LUXE MEN website, products, and services. These terms
                        help ensure a secure, transparent, and premium shopping
                        experience for every customer.
                    </p>

                </div>

            </div>

        </section>
    );
}