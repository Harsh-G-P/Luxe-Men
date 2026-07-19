const sections = [
    {
        title: "Introduction",
        content:
            "At LUXE MEN, protecting your privacy is fundamental to the trust you place in our brand. This Privacy Policy explains how we collect, use, and safeguard your personal information while providing a premium shopping experience.",
    },
    {
        title: "Information We Collect",
        content:
            "We may collect information such as your name, email address, shipping and billing details, telephone number, and purchase history to fulfill orders and improve your experience.",
    },
    {
        title: "How We Use Your Information",
        content:
            "Your information allows us to process orders, deliver products, provide customer support, personalize your experience, and communicate important service updates.",
    },
    {
        title: "Cookies & Analytics",
        content:
            "Cookies help us remember your preferences, improve website performance, and better understand how visitors interact with our website.",
    },
    {
        title: "Data Security",
        content:
            "We apply industry-standard security practices to protect your personal information against unauthorized access, misuse, or disclosure.",
    },
    {
        title: "Third-Party Services",
        content:
            "We work with trusted payment, delivery, and technology partners who process only the information necessary to provide their respective services securely.",
    },
    {
        title: "Your Rights",
        content:
            "You may request access to your personal information, update inaccurate details, or request deletion of your data where permitted by applicable law.",
    },
    {
        title: "Contact Us",
        content:
            "If you have any questions regarding this Privacy Policy, please contact our Client Services team through the Contact page.",
    },
];

export default function Sections() {
    return (
        <section className="px-6 pb-32 md:px-20">

            <div className="mx-auto max-w-4xl">

                {/* Intro */}
                <div className="mb-20 text-center">

                    <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500">
                        Privacy & Security
                    </p>

                    <h2 className="mt-5 font-serif text-3xl md:text-4xl">
                        Your Trust,
                        <br />
                        Our Responsibility
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-600">
                        At LUXE MEN, protecting your privacy is part of the
                        experience. We are committed to handling your personal
                        information responsibly and transparently.
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