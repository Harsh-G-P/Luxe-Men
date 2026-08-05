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
    return (
        <div className="group rounded-lg transition-colors hover:bg-neutral-100">
            <div className="flex gap-6 px-5 py-4">

                <div className="shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100">

                    <Image
                        src={item.image || "/images/NoImage.jpg"}
                        alt={item.title}
                        width={96}
                        height={96}
                        className="h-24 w-24 object-cover"
                    />

                </div>

                <div className="flex flex-1 flex-col justify-between">

                    <div>
                        <h3 className="font-medium tracking-[0.04em]">
                            {item.title}
                        </h3>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                            #{item.id.slice(-8)}
                        </p>

                        <p className="mt-2 text-xs text-neutral-500">
                            {item.attributes
                                ? Object.entries(item.attributes)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(" • ")
                                : "-"}
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">

                        <div className="text-xs text-neutral-500">
                            QTY{" "}
                            <span className="text-neutral-900">
                                : {item.quantity}
                            </span>
                        </div>

                        <div className="font-light">
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                            }).format(item.price)}
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}