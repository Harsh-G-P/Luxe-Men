"use client";

type Props = {
    brand: string;
    title: string;
    price: number;
};

export default function ProductInfo({
    title,
    price,
    brand,
}: Props) {
    return (
        <div className="space-y-8">
            {/* Title + Price */}
            <div>
                {/* Brand */}
                <p
                    className="
                        mb-5
                        text-[9px]
                        uppercase
                        tracking-[0.28em]
                        text-gray-500
                        sm:mb-6
                        sm:text-xs
                        sm:tracking-[0.3em]
                        md:text-sm
                        md:tracking-[0.35em]
                    "
                >
                    {brand}
                </p>

                {/* Product Title */}
                <h1
                    className="
                        text-2xl
                        font-serif
                        font-light
                        leading-tight
                        tracking-wide
                        text-black
                        sm:text-3xl
                        md:text-4xl
                    "
                >
                    {title}
                </h1>

                {/* Price */}
                <span
                    className="
                        mt-4
                        block
                        text-sm
                        font-serif
                        tracking-wide
                        text-black
                        sm:mt-5
                        sm:text-base
                    "
                >
                    ${price}
                </span>
            </div>
        </div>
    );
}
