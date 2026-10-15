const sections = [
    {
        title: "Introduction",
        content:
            "At LUXE MEN, privacy is an essential part of the trust you place in our house. This Privacy Policy explains how we collect, use, protect, and manage your personal information while providing a considered digital experience.",
    },
    {
        title: "Information We Collect",
        content:
            "We may collect information such as your name, email address, telephone number, shipping and billing details, account information, and purchase history when required to provide our products and services.",
    },
    {
        title: "How We Use Your Information",
        content:
            "Your information enables us to process and fulfill orders, provide Client Services, personalize your experience, communicate important updates, and continually refine the LUXE MEN experience.",
    },
    {
        title: "Cookies & Analytics",
        content:
            "Cookies and similar technologies help us remember your preferences, understand how our website is used, improve performance, and create a more seamless experience for our visitors.",
    },
    {
        title: "Data Security",
        content:
            "We maintain appropriate technical and organizational measures designed to protect your personal information against unauthorized access, alteration, misuse, or disclosure.",
    },
    {
        title: "Third-Party Services",
        content:
            "We may work with carefully selected payment, delivery, analytics, and technology partners. These providers receive only the information reasonably required to perform their services on our behalf.",
    },
    {
        title: "Your Rights",
        content:
            "Depending on applicable law, you may have the right to access, correct, update, or request deletion of your personal information, as well as exercise other rights relating to its use.",
    },
    {
        title: "Contact Us",
        content:
            "If you have questions about this Privacy Policy or how your information is handled, our Client Services team is available through the Contact page.",
    },
];

export default function Sections() {
    return (
    <section className="bg-[#f8f6f1] px-5 pb-32 md:px-12 lg:px-20">

        <div className="mx-auto max-w-5xl">

            {/* Intro */}
            <div className="pb-20 text-center md:pb-28">

                {/* Decorative Mark */}
                <div className="mb-8 flex items-center justify-center gap-4">
                    <span className="h-px w-12 bg-[#b49a68]/50" />

                    <span className="h-1.5 w-1.5 rotate-45 border border-[#b49a68]" />

                    <span className="h-px w-12 bg-[#b49a68]/50" />
                </div>

                <p className="text-[8px] font-medium uppercase tracking-[0.6em] text-[#9b8050]">
                    Privacy &amp; Security
                </p>

                <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] tracking-[-0.04em] text-[#201f1b] md:text-6xl">
                    Your Privacy,
                    <br />
                    <span className="italic text-[#77736b]">
                        Our Commitment.
                    </span>
                </h2>

                <p className="mx-auto mt-8 max-w-2xl text-[11px] leading-7 tracking-wide text-[#858078]">
                    At LUXE MEN, discretion is part of the experience. This
                    Privacy Policy explains how we collect, use, protect, and
                    respect your personal information throughout your journey
                    with us.
                </p>

                {/* Last Updated */}
                <div className="mt-8 flex items-center justify-center gap-3">
                    <span className="h-px w-5 bg-[#d2cdc3]" />

                    <span className="text-[7px] uppercase tracking-[0.4em] text-[#aaa59c]">
                        Last Updated · 2026
                    </span>

                    <span className="h-px w-5 bg-[#d2cdc3]" />
                </div>

            </div>

            {/* Privacy Sections */}
            <div className="border-t border-[#d8d3ca]">

                {sections.map((section, index) => (
                    <article
                        key={section.title}
                        className="group grid border-b border-[#d8d3ca] py-10 transition-colors duration-500 hover:bg-[#f3f0e9] md:grid-cols-[110px_1fr] md:py-12"
                    >

                        {/* Number */}
                        <div className="mb-5 md:mb-0">

                            <span className="font-serif text-xl font-light text-[#b49a68]">
                                {(index + 1)
                                    .toString()
                                    .padStart(2, "0")}
                            </span>

                            <div className="mt-3 h-px w-7 bg-[#d1c8b8] transition-all duration-500 group-hover:w-12 group-hover:bg-[#9b8050]" />

                        </div>

                        {/* Content */}
                        <div className="max-w-3xl">

                            <h3 className="font-serif text-2xl font-light tracking-[-0.02em] text-[#292722] md:text-3xl">
                                {section.title}
                            </h3>

                            <p className="mt-5 text-[11px] leading-7 tracking-[0.02em] text-[#77736b]">
                                {section.content}
                            </p>

                        </div>

                    </article>
                ))}

            </div>

            {/* Closing */}
            <div className="pt-20 text-center md:pt-24">

                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-10 bg-[#d4cfc5]" />

                    <span className="h-1 w-1 rotate-45 border border-[#b49a68]" />

                    <span className="h-px w-10 bg-[#d4cfc5]" />
                </div>

                <p className="mt-7 font-serif text-xl italic text-[#77736b]">
                    Your trust deserves discretion.
                </p>

                <p className="mt-3 text-[7px] uppercase tracking-[0.55em] text-[#aaa59c]">
                    LUXE MEN · PRIVACY &amp; SECURITY
                </p>

            </div>

        </div>

    </section>
);

}
