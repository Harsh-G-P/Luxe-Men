import Image from "next/image";

export default function Editorial() {
    return (
        <section className="grid md:grid-cols-2">

            <div className="relative h-[90vh]">

                <Image
                    fill
                    src="/images/look2.jpg"
                    alt=""
                    className="object-cover"
                />

            </div>

            <div className="relative h-[90vh]">

                <Image
                    fill
                    src="/images/look3.jpg"
                    alt=""
                    className="object-cover"
                />

            </div>

        </section>
    );
}