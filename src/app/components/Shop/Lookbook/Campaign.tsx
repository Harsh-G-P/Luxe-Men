import Image from "next/image";

export default function Campaign() {
    return (
        <section className="bg-[#f5f3ee] text-[#111]">

            <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-20">

                {/* CAMPAIGN 01 — SPRING / SUMMER */}
                <div>

                    <div className="mb-8 flex items-center justify-between border-t border-black/10 pt-3">

                        <p className="text-[8px] font-medium uppercase tracking-[0.4em] text-black/50">
                            LM — Campaign 01
                        </p>

                        <p className="text-[8px] uppercase tracking-[0.35em] text-black/35">
                            SS — 2026
                        </p>

                    </div>

                    <div className="grid items-center gap-10 md:grid-cols-[1.75fr_1.75fr] md:gap-14">

                        {/* Content */}
                        <div className="text-center md:order-1 md:text-left">

                            {/* Season */}
                            <p className="mb-5 text-[8px] uppercase tracking-[0.5em] text-black/45">
                                Spring / Summer — 2026
                            </p>


                            {/* Title */}
                            <h2 className="font-serif text-5xl font-normal leading-[0.88] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                                The Art
                                <br />
                                <span className="italic text-[#8a7c5d]">of Ease.</span>
                            </h2>


                            {/* Description */}
                            <p className="mx-auto mt-8 flex max-w-75 items-start gap-3 text-[11px] leading-[1.9] tracking-[0.02em] text-black/45 md:mx-0">
                                <span className="mt-1.75 h-px w-5 shrink-0 bg-[#B8A06A]/70" />
                                <span>
                                    An understated study in proportion,
                                    movement and effortless elegance.
                                </span>
                            </p>



                            {/* Signature */}
                            <div className="mt-9 flex items-center justify-center gap-4 md:justify-start">

                                <span className="h-px w-10 bg-black/20" />

                                <span className="font-serif text-sm tracking-[0.15em] text-black/55">
                                    LM
                                </span>

                                <span className="h-px w-10 bg-black/20" />

                            </div>

                        </div>

                        {/* Image */}
                        <div className="md:order-2">

                            <div className="relative aspect-4/5 max-h-155 overflow-hidden">

                                <Image
                                    src="/images/compaign2.jpg"
                                    alt="LM Spring Summer 2026 Campaign"
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-1000 hover:scale-[1.02]"
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                />

                            </div>

                            {/* Text BELOW IMAGE */}
                            <div className="relative mt-3 h-4">

                                {/* Center of image */}
                                <p className="absolute md:-translate-x-1/2 whitespace-nowrap text-[7px] uppercase tracking-[0.35em] text-black/35">
                                    The Art of Ease.
                                </p>

                                {/* Right side */}
                                <p className="absolute right-0 whitespace-nowrap text-[7px] uppercase tracking-[0.35em] text-black/35">
                                    Campaign 01
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-12 flex items-center justify-between border-b border-black/10 pb-3">

                    <p className="text-[7px] uppercase tracking-[0.35em] text-black/30">
                        Luxe Men — LM
                    </p>

                    <p className="text-[7px] uppercase tracking-[0.35em] text-black/30">
                        01 Campaign
                    </p>

                </div>


                {/* CAMPAIGN 02 — AUTUMN / WINTER */}
                <div className="pt-14">

                    <div className="mb-8 flex items-center justify-between">

                        <p className="text-[8px] font-medium uppercase tracking-[0.4em] text-black/50">
                            LM — Campaign 02
                        </p>

                        <p className="text-[8px] uppercase tracking-[0.35em] text-black/35">
                            AW — 2026
                        </p>

                    </div>

                    <div className="grid items-center gap-10 md:grid-cols-[1.25fr_0.75fr] md:gap-14">

                        {/* Image */}
                        <div className="md:order-1">

                            <div className="relative aspect-4/5 max-h-155 overflow-hidden bg-[#20201e]">

                                <Image
                                    src="/images/compaign1.jpg"
                                    alt="LM Autumn Winter 2026 Campaign"
                                    fill
                                    className="object-cover transition-transform duration-1000 hover:scale-[1.02]"
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                />

                            </div>

                            <div className="mt-3 flex justify-between">

                                <p className="text-[7px] uppercase tracking-[0.35em] text-black/35">
                                    Campaign 02
                                </p>

                                <p className="text-[7px] uppercase tracking-[0.35em] text-black/35">
                                    The Weight of Presence
                                </p>

                            </div>

                        </div>

                        {/* Content */}
                        <div className="text-center md:order-2 md:text-left">

                            {/* Season */}
                            <p className="mb-5 text-[8px] uppercase tracking-[0.5em] text-black/45">
                                Autumn / Winter — 2026
                            </p>

                            {/* Title */}
                            <h2 className="font-serif text-5xl font-normal leading-[0.88] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                                The Weight
                                <br />
                                <span className="italic text-[#8a7c5d]">of Presence.</span>
                            </h2>

                            {/* Description */}
                            <p className="mx-auto mt-8 flex max-w-75 items-start gap-3 text-[11px] leading-[1.9] tracking-[0.02em] text-black/45 md:mx-0">
                                <span className="mt-1.75 h-px w-5 shrink-0 bg-[#B8A06A]/70" />
                                <span>
                                    Rich textures, considered layers and quiet
                                    strength define the season.
                                </span>
                            </p>

                            {/* Signature */}
                            <div className="mt-9 flex items-center justify-center gap-4 md:justify-start">

                                <span className="h-px w-10 bg-black/20" />

                                <span className="font-serif text-sm tracking-[0.15em] text-black/55">
                                    LM
                                </span>

                                <span className="h-px w-10 bg-black/20" />

                            </div>

                        </div>

                    </div>

                </div>


                {/* Bottom */}
                <div className="mt-12 flex items-center justify-between border-b border-black/10 pb-3">

                    <p className="text-[7px] uppercase tracking-[0.35em] text-black/30">
                        Luxe Men — LM
                    </p>

                    <p className="text-[7px] uppercase tracking-[0.35em] text-black/30">
                        02 Campaign
                    </p>

                </div>

            </div>

        </section>
    );
}
