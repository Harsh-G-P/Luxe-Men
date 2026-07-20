export default function Hero() {
    return (
        <section className="relative h-screen overflow-hidden">

            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src="/videos/lookbook.mp4" />
            </video>

            <div className="absolute inset-0 bg-black/45" />

            <div className="relative flex h-full items-center justify-center text-center text-white">

                <div>

                    <p className="text-xs uppercase tracking-[0.45em]">
                        Spring Summer 2026
                    </p>

                    <h1 className="mt-8 font-serif text-6xl md:text-8xl">
                        LUXE MEN
                    </h1>

                    <p className="mt-8 text-sm uppercase tracking-[0.3em] text-white/80">
                        Editorial Campaign
                    </p>

                </div>

            </div>

        </section>
    );
}