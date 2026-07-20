import Link from "next/link";

export default function ContactCTA() {
    return (
        <section className="px-5 py-20 md:px-20">

            <div className="mx-auto max-w-3xl text-center">

                <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gray-400">
                    Still Need Help?
                </p>

                <h2 className="font-serif text-4xl md:text-5xl">
                    We're Always Here
                    <br />
                    To Assist You.
                </h2>

                <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-gray-600">
                    Discover our latest collections or browse our products.
                    If you still need assistance, our support team is ready to help.
                </p>

                <Link
                    href="/collections"
                    className="mt-12 inline-flex rounded-full bg-black px-10 py-4 text-xs tracking-[0.3em] text-white transition hover:opacity-90"
                >
                    SHOP COLLECTION
                </Link>

            </div>

        </section>
    );
}