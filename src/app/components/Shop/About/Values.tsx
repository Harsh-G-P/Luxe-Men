export default function Values() {
    const values = [
        {
            number: "01",
            title: "Quality",
            description:
                "Every garment is crafted from carefully selected materials, balancing durability, comfort, and refined finishes that stand the test of time.",
        },
        {
            number: "02",
            title: "Timeless Design",
            description:
                "We create understated silhouettes with clean lines and thoughtful proportions, designed to outlive seasonal trends.",
        },
        {
            number: "03",
            title: "Responsibility",
            description:
                "Our philosophy is simple: create fewer, better products that people value, wear longer, and return to season after season.",
        },
    ];

    return (
        <section className="px-6 py-12">

            <div className="mx-auto max-w-7xl">

                <div className="mb-24 text-center">

                    <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                        Our Values
                    </p>

                    <h2 className="mt-6 font-serif text-3xl md:text-5xl">
                        What We Stand For
                    </h2>

                </div>

                <div className="grid gap-12 md:grid-cols-3">

                    {values.map((value) => (
                        <div
                            key={value.title}
                            className="group border-t border-gray-300 pt-10 transition-all duration-500 hover:border-black"
                        >
                            <span className="text-4xl font-serif text-gray-200 transition group-hover:text-black">
                                {value.number}
                            </span>

                            <h3 className="mt-8 font-serif text-2xl">
                                {value.title}
                            </h3>

                            <p className="mt-6 text-sm leading-5 text-gray-600">
                                {value.description}
                            </p>
                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}