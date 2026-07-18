export default function Banner() {
    return (
        <section className="py-25">

            <div className="relative h-[80vh] overflow-hidden">

                <video
                    src="/videos/about4.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/45" />

                <div className="relative flex h-full items-center justify-center px-6">

                    <div className="max-w-5xl text-center text-white">

                        <p className="mb-6 text-xs uppercase tracking-[0.45em] text-white/80">
                            EST. 2026
                        </p>

                        <h2 className="font-serif text-5xl leading-[1.05] md:text-8xl">
                            Quiet Luxury.
                            <br />
                            Made for Everyday.
                        </h2>

                        <p className="mx-auto mt-10 max-w-2xl text-sm leading-8 text-white/75 md:text-base">
                            Timeless essentials crafted with premium materials,
                            modern tailoring, and an uncompromising attention
                            to detail.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}