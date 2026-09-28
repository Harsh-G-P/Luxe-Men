const sections = [
    {
        title: "Acceptance of Terms",
        content:
            "By accessing and using the LUXE MEN website, you agree to comply with these Terms & Conditions and all applicable laws governing your use of this website.",
    },
    {
        title: "Use of the Website",
        content:
            "You agree to use this website only for lawful purposes and in a manner that does not interfere with the security, functionality, or experience of other visitors.",
    },
    {
        title: "Intellectual Property",
        content:
            "All content on the LUXE MEN website, including photographs, logos, graphics, videos, designs, and written content, is the exclusive property of LUXE MEN and may not be copied, reproduced, or distributed without prior written permission.",
    },
    {
        title: "Accuracy of Information",
        content:
            "While we strive to keep all information accurate and up to date, LUXE MEN does not guarantee that all content, descriptions, or visuals will always be complete, accurate, or free from errors.",
    },
    {
        title: "User Responsibilities",
        content:
            "Users are responsible for ensuring that any information they provide is accurate and for maintaining the confidentiality of their account where applicable.",
    },
    {
        title: "Limitation of Liability",
        content:
            "LUXE MEN shall not be responsible for any indirect, incidental, or consequential damages arising from the use of this website or reliance on its content.",
    },
    {
        title: "Changes to These Terms",
        content:
            "We may revise these Terms & Conditions from time to time. Continued use of the website after updates constitutes acceptance of the revised terms.",
    },
    {
        title: "Contact",
        content:
            "If you have any questions regarding these Terms & Conditions, please visit our Client Services page for assistance.",
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
                        Legal Information
                    </p>

                    <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] tracking-[-0.04em] text-[#201f1b] md:text-6xl">
                        Terms of
                        <br />
                        <span className="italic text-[#77736b]">
                            Elegance.
                        </span>
                    </h2>

                    <p className="mx-auto mt-8 max-w-2xl text-[11px] leading-7 tracking-wide text-[#858078]">
                        These Terms & Conditions establish the principles
                        governing your experience with LUXE MEN. By visiting
                        our website, you acknowledge and agree to the terms
                        outlined below.
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

                {/* Legal Sections */}
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

                                <h3 className="font-serif text-2xl font-light tracking-[-0.02em] text-[#292722] transition-colors duration-300 md:text-3xl">
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
                        Crafted with consideration.
                    </p>

                    <p className="mt-3 text-[7px] uppercase tracking-[0.55em] text-[#aaa59c]">
                        LUXE MEN · EST. 2026
                    </p>

                </div>

            </div>

        </section>
    );
}
