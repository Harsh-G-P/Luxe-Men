
import Link from "next/link";


export default function Hero() {
    return (
        <section className="relative h-[60vh] overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src="/videos/collection.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/60" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-375 items-center px-5 md:px-6">
                <div className="max-w-3xl text-white">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-300">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <span className="font-medium text-white">Collections</span>
                    </div>

                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.4em] text-gray-300">
                        Collections
                    </p>

                    <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                        Premium Men's
                        <br />
                        Fashion Collection
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 md:text-lg md:leading-8">
                        Explore timeless essentials crafted with premium materials,
                        modern fits, and effortless style for every occasion.
                    </p>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 h-32 w-full bg-linear-to-t from-white to-transparent" />
        </section>
    );
}