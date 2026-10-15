import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative h-[62vh] md:h-[95vh] min-h-155 overflow-hidden bg-[#171614]">

            {/* Background Image */}
            <Image
                src="/images/contact3.jpg"
                alt="Contact Luxe Men"
                fill
                priority
                className="object-cover object-[center_50%]"
                sizes="100vw"
            />

            {/* Elegant overlay */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Subtle bottom gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10" />

            {/* Content */}
            <div className="relative flex h-full flex-col items-center justify-end px-6 pb-14 text-center text-white md:pb-16">

                {/* LABEL */}
                <span className="text-[7px] font-medium uppercase tracking-[0.5em] text-white/70">
                    Get in Touch
                </span>

                {/* HEADING */}
                <h1 className="mt-5 font-serif text-[52px] font-light leading-[0.92] tracking-[-0.045em] sm:text-[60px] md:text-[78px] lg:text-[92px]">
                    Let’s Start a
                    <br />
                    <span className="italic text-white/65">
                        Conversation.
                    </span>
                </h1>

                {/* Divider */}
                <div className="mt-6 flex items-center gap-3 sm:mt-7 sm:gap-4">
                    <span className="h-px w-8 bg-white/30 sm:w-12" />

                    <span className="h-1 w-1 rotate-45 border border-[#c0a76b]/70" />

                    <span className="h-px w-8 bg-white/30 sm:w-12" />
                </div>

                {/* DESCRIPTION */}
                <p className="mt-5 hidden max-w-120 text-[10px] leading-[1.9] tracking-[0.035em] text-white/50 sm:mt-6 sm:block sm:text-[11px]">
                    Have a question, need assistance or simply want to know more?
                    <br className="hidden md:block" />
                    We’re here to help with every detail.
                </p>

                {/* META + BRAND */}
                <div className="mt-7 flex items-center gap-6 sm:mt-8 sm:gap-8">

                    <div className="flex items-center gap-3">
                        <span className="h-px w-5 bg-white/35" />

                        <span className="text-[7px] uppercase tracking-[0.35em] text-white/40">
                            Contact
                        </span>
                    </div>

                    <span className="text-[7px] uppercase tracking-[0.35em] text-white/45">
                        Luxe Men
                    </span>

                </div>

                {/* Explore */}
                <div className="mt-9 flex flex-col items-center gap-3">

                    <span className="relative h-8 w-px overflow-hidden bg-white/15">
                        <span className="absolute left-0 top-0 h-3 w-px bg-white/60 animate-[scrollLine_2s_ease-in-out_infinite]" />
                    </span>

                    <span className="animate-[fadePulse_2s_ease-in-out_infinite] text-[7px] uppercase tracking-[0.45em] text-white/65">
                        Connect
                    </span>

                </div>

            </div>

        </section>
    );
}
