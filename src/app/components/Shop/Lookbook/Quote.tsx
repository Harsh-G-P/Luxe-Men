export default function Quote() {
    return (
        <section className="relative overflow-hidden bg-[#f5f2eb] px-6 py-8">

            <div className="mx-auto max-w-6xl">

                {/* Top detail */}
                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-8 bg-[#a58e5c]" />

                    <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8655]">
                        Philosophy
                    </p>

                    <span className="h-px w-8 bg-[#a58e5c]" />
                </div>

                {/* Quote */}
                <div className="mx-auto mt-10 max-w-4xl text-center md:mt-14">

                    <h2 className="font-serif text-[42px] font-normal leading-[1.02] tracking-[-0.04em] text-[#191816] md:text-[64px] lg:text-[78px]">
                        Quiet confidence,
                        <br />
                        <span className="italic text-[#a58e5c]">
                            timeless expression.
                        </span>
                    </h2>

                </div>

                {/* Supporting text */}
                <div className="mx-auto mt-9 max-w-2xl text-center md:mt-11">
                    <p className="text-[11px] leading-[1.9] tracking-[0.04em] text-black/40 md:whitespace-nowrap">
                        Considered in every detail, refined through restraint, created for effortless expression.
                    </p>
                </div>


                {/* Bottom detail */}
                <div className="mt-12 flex items-center justify-center gap-5 md:mt-16">
                    <span className="h-px w-16 bg-black/8" />

                    <span className="text-[8px] uppercase tracking-[0.35em] text-black/25">
                        Designed with Intention
                    </span>

                    <span className="h-px w-16 bg-black/8" />
                </div>


            </div>

        </section>
    );
}
