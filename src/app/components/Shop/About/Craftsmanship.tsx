export default function Craftsmanship() {
    return (
        <section className="px-6 py-18">

            <div className="mx-auto grid max-w-7xl items-center gap-20 md:grid-cols-2">

                <div className="relative aspect-4/5 overflow-hidden">

                    <video
                        src="/videos/about2.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                    />

                </div>

                <div>

                    <p className="mb-5 text-xs uppercase tracking-[0.35em] text-gray-500">
                        Craftsmanship
                    </p>

                    <h2 className="font-serif text-4xl leading-tight md:text-6xl">
                        Every detail is
                        considered.
                    </h2>

                    <div className="mt-10 space-y-8 text-gray-600 leading-8">

                        <p>
                            We believe quality begins long before a garment
                            reaches your wardrobe. From carefully selected
                            fabrics to precise finishing, every detail matters.
                        </p>

                        <p>
                            Our collections are produced with an emphasis on
                            durability, comfort, and refined construction so
                            every piece feels exceptional from the first wear.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}