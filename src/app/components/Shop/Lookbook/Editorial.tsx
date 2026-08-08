import Image from "next/image";

export default function Editorial() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="relative h-[90vh]">
        <Image
          src="/images/look2.jpg"
          alt="Editorial look 1"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="relative h-[90vh]">
        <Image
          src="/images/look3.jpg"
          alt="Editorial look 2"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}