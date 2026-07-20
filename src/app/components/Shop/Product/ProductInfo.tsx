"use client";

type Props = {
    brand: string;
    title: string;
    price: number;
    description: string;
    stock: number;
};

export default function ProductInfo({
    title,
    price,
    brand,
    description,
    stock
}: Props) {
    return (
        <div className="space-y-8">

            <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 md:text-xs md:tracking-[0.35em]">
                    {brand}
                </p>
            </div>

            {/* Title + Price */}
            <div>

                <h1
                    className=" text-sm font-serif tracking-wide text-black"
                >
                    {title}
                </h1>

                <div
                    className=" mt-3 flex items-center gap-3 text-sm text-gray-600"
                >
                    <span>
                        ${price}
                    </span>

                </div>

            </div>

            {/* Description */}
            <p
                className=" max-w-xl text-xs leading-relaxed text-gray-600"
            >
                {description}
            </p>

            {/* Stock */}
            {stock <= 0 && (
                <p
                    className=" text-xs text-red-500"
                >
                    Out of stock
                </p>
            )}

        </div>
    );
}