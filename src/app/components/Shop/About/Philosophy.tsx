export default function Philosophy() {
    return (
        <section className="px-6 py-20">

            <div className="mx-auto grid max-w-7xl items-center gap-20 md:grid-cols-[0.9fr_1.1fr]">

                

                {/* Right Content */}
                <div>

                    <p className="mb-6 text-xs uppercase tracking-[0.35em] text-gray-500">
                        Philosophy
                    </p>

                    <h2 className="font-serif text-4xl leading-tight md:text-6xl">
                        Luxury is not
                        <br />
                        about excess.
                        <br />
                        It is about intention.
                    </h2>

                    <div className="mt-12 space-y-8 text-gray-600 leading-8">

                        <p>
                            We believe clothing should feel effortless,
                            timeless, and authentic. Every collection is
                            designed with restraint, allowing quality,
                            proportion, and craftsmanship to speak louder than
                            trends.
                        </p>

                        <p>
                            Rather than chasing seasonal moments, we focus on
                            creating garments that become part of everyday life
                            and remain relevant for years to come.
                        </p>

                    </div>

                </div>

                {/* Left Video */}
                <div className="relative aspect-4/5 overflow-hidden">

                    <video
                        src="/videos/about3.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                    />

                </div>

            </div>

        </section>
    );
}