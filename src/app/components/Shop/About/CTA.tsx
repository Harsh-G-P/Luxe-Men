import Link from "next/link";

export default function CTA() {
    return (
        <section className="px-5 py-12">

            <div className="mx-auto max-w-3xl text-center">

                <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gray-400">
                    Discover More
                </p>

                <h2 className="font-serif text-4xl md:text-5xl">
                    Explore
                    <br />
                    Our Collection
                </h2>

                <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-gray-600">
                    Discover timeless essentials crafted with premium
                    materials, modern silhouettes, and everyday versatility.
                </p>

                <Link
                    href="/collections"
                    className="mt-12 inline-flex rounded-full bg-black px-10 py-4 text-xs tracking-[0.3em] text-white transition hover:opacity-90"
                >
                    SHOP COLLECTION
                </Link>

            </div>

        </section>
    );
}