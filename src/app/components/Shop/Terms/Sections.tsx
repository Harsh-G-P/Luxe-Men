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
        <section className="px-6 pb-32 md:px-20">

            <div className="mx-auto max-w-4xl">

                {/* Intro */}
                <div className="mb-20 text-center">

                    <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500">
                        Legal Information
                    </p>

                    <h2 className="mt-5 font-serif text-3xl md:text-4xl">
                        Terms That Protect
                        <br />
                        Every Experience
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-600">
                        These Terms & Conditions outline the rules governing the
                        use of the LUXE MEN website, products, and services. By
                        using our website, you agree to these terms and our
                        commitment to providing a secure and transparent shopping
                        experience.
                    </p>

                </div>

                {/* Sections */}
                <div>
                    {sections.map((section, index) => (
                        <div
                            key={section.title}
                            className="group grid gap-6 border-t border-gray-200 py-12 px-6 transition-all duration-500 hover:bg-black md:grid-cols-[60px_1fr]"
                        >
                            <span className="font-serif text-lg text-gray-300 transition-colors duration-500 group-hover:text-white">
                                {(index + 1).toString().padStart(2, "0")}
                            </span>

                            <div className="transition-all duration-500 group-hover:translate-x-3">

                                <h3 className="font-serif text-xl transition-colors duration-500 group-hover:text-white md:text-2xl">
                                    {section.title}
                                </h3>

                                <div className="mt-5 h-px w-12 bg-gray-300 transition-all duration-500 group-hover:w-180 group-hover:bg-white" />

                                <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-600 transition-colors duration-500 group-hover:text-white/80">
                                    {section.content}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </section>
    );
}