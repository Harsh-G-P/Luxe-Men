import Link from "next/link";

export default function Story() {
    return (
        <section className="px-6 py-6">

            <div className="mx-auto max-w-7xl">

                <p className="mb-6 text-xs uppercase tracking-[0.35em] text-gray-500">
                    Our Story
                </p>

                <div className="grid gap-16 md:grid-cols-[1.2fr_0.8fr]">

                    <h2 className="font-serif text-2xl leading-tight text-black md:text-5xl">
                        We create clothing that feels effortless,
                        timeless, and made to be worn every day.
                    </h2>

                    <div className="space-y-4">

                        <p className="text-base leading-8 text-gray-600">
                            Our collections are built around thoughtful design,
                            premium materials, and clean silhouettes that never
                            rely on short-lived trends. Every piece is created
                            with comfort, quality, and longevity in mind.
                        </p>

                        <p className="text-base leading-8 text-gray-600">
                            Rather than producing more, we focus on producing
                            better—garments that become part of everyday life
                            and remain relevant season after season.
                        </p>

                        <Link
                            href="/collections"
                            className="inline-flex border-b border-black pb-1 text-sm uppercase tracking-[0.3em] transition hover:opacity-60 text-gray-500 hover:text-gray-6700"
                        >
                            Explore Collection
                        </Link>

                    </div>

                </div>

            </div>

        </section>
    );
}