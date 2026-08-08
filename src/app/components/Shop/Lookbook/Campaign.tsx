import Image from "next/image";

export default function Campaign() {
    return (
        <section className="py-20">

            <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 md:grid-cols-2">

                <div>

                    <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                        Campaign
                    </p>

                    <h2 className="mt-6 font-serif text-5xl">
                        Crafted Beyond
                        <br />
                        Trends.
                    </h2>

                    <p className="mt-8 max-w-lg leading-8 text-gray-600">
                        Modern tailoring meets timeless elegance. Every
                        silhouette is designed with simplicity, precision and
                        confidence.
                    </p>

                </div>

                <div className="relative aspect-4/5">
                    <Image
                        src="/images/look1.jpg"
                        alt="Campaign"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

            </div>

        </section>
    );
}