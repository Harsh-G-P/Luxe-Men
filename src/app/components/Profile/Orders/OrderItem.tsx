"use client";

import Image from "next/image";

type Item = {
    id: string;
    title: string;
    quantity: number;
    price: number;
    image: string | null;
    attributes: Record<string, string> | null;
};

type Props = {
    item: Item;
};

export default function OrderItem({ item }: Props) {
    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(item.price);

    return (
        <div
            className=" group border-b border-[#eeece7] transition-colors duration-500 last:border-b-0 hover:bg-[#fdfbf7]"
        >
            <div className="flex gap-5 px-6 py-6 md:gap-7 md:px-7">

                {/* Product Image */}
                <div
                    className="
                        relative
                        shrink-0
                        overflow-hidden
                        bg-[#eeece7]
                    "
                >
                    <Image
                        src={item.image || "/images/NoImage.jpg"}
                        alt={item.title}
                        width={112}
                        height={140}
                        className="
                            h-28
                            w-22.5
                            object-cover
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-[1.035]
                            md:h-32
                            md:w-26
                        "
                    />

                    {/* Image overlay */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-black/2
                            transition-colors
                            duration-500
                            group-hover:bg-transparent
                        "
                    />
                </div>

                {/* Product Information */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">

                    <div>

                        <div className="flex items-start justify-between gap-5">

                            <div className="min-w-0">

                                <h3
                                    className="
                                        truncate
                                        font-serif
                                        text-[16px]
                                        font-normal
                                        tracking-[0.01em]
                                        text-[#1b1a18]
                                        transition-colors
                                        duration-300
                                        group-hover:text-[#6f604e]
                                    "
                                >
                                    {item.title}
                                </h3>

                                <p
                                    className="
                                        mt-2
                                        text-[8px]
                                        uppercase
                                        tracking-[0.26em]
                                        text-[#aaa69e]
                                    "
                                >
                                    Ref. {item.id.slice(-8)}
                                </p>

                            </div>

                            {/* Price */}
                            <p
                                className="
                                    shrink-0
                                    font-serif
                                    text-[15px]
                                    font-normal
                                    tracking-[0.01em]
                                    text-[#242320]
                                "
                            >
                                {formattedPrice}
                            </p>

                        </div>

                        {/* Attributes */}
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">

                            {item.attributes
                                ? Object.entries(item.attributes).map(
                                    ([key, value]) => (
                                        <span
                                            key={key}
                                            className="
                                                text-[9px]
                                                uppercase
                                                tracking-[0.16em]
                                                text-[#817d75]
                                            "
                                        >
                                            {key}
                                            <span className="mx-1.5 text-[#c5c0b7]">
                                                /
                                            </span>
                                            <span className="text-[#57534c]">
                                                {value}
                                            </span>
                                        </span>
                                    )
                                )
                                : (
                                    <span className="text-[9px] uppercase tracking-[0.16em] text-[#aaa69e]">
                                        No details
                                    </span>
                                )}

                        </div>

                    </div>

                    {/* Bottom Information */}
                    <div className="mt-6 flex items-center justify-between">

                        <div className="flex items-center gap-3">
                            <span
                                className="
                                    text-[8px]
                                    uppercase
                                    tracking-[0.25em]
                                    text-[#aaa69e]
                                "
                            >
                                Quantity
                            </span>

                            <span className="font-serif text-sm text-[#7c7771]">
                                {String(item.quantity).padStart(2, "0")}
                            </span>
                        </div>

                        <span
                            className="
                                h-px
                                w-10
                                bg-[#d9d5cd]
                                transition-all
                                duration-500
                                group-hover:w-16
                                group-hover:bg-[#9a8a74]
                            "
                        />

                    </div>

                </div>

            </div>
        </div>
    );
}
