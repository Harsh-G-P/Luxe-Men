"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Props = {
    images: string[];
    title: string;
};

export default function ProductGallery({
    images,
    title,
}: Props) {
    const [scrollProgress, setScrollProgress] = useState(0);

    const mobileScrollRef = useRef<HTMLDivElement>(null);

    if (!images || images.length === 0) {
        return null;
    }

    // =========================================
    // MOBILE SCROLL
    // =========================================

    const handleMobileScroll = () => {
        const container = mobileScrollRef.current;

        if (!container) return;

        const maxScroll =
            container.scrollWidth - container.clientWidth;

        if (maxScroll <= 0) {
            setScrollProgress(0);
            return;
        }

        const progress =
            (container.scrollLeft / maxScroll) * 100;

        setScrollProgress(progress);
    };

    // =========================================
    // DESKTOP IMAGE PATTERN
    //
    // 1 | 2
    //   3
    // 4 | 5
    //   6
    // 7 | 8
    //   9
    // =========================================

    const rows: {
        images: string[];
        startIndex: number;
        fullWidth: boolean;
    }[] = [];

    let index = 0;
    let row = 0;

    while (index < images.length) {
        const fullWidth = row % 2 === 1;

        if (fullWidth) {
            rows.push({
                images: [images[index]],
                startIndex: index,
                fullWidth: true,
            });

            index += 1;
        } else {
            rows.push({
                images: images.slice(index, index + 2),
                startIndex: index,
                fullWidth: false,
            });

            index += 2;
        }

        row++;
    }

    return (
        <div className="mt-5 w-full">

            {/* =====================================================
                DESKTOP GALLERY
            ====================================================== */}

            <div className="hidden w-full px-5 py-5 md:block lg:px-6">

                {rows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`
                            mb-2
                            grid
                            gap-2
                            ${
                                row.fullWidth
                                    ? "grid-cols-1"
                                    : "grid-cols-2"
                            }
                        `}
                    >
                        {row.images.map(
                            (image, imageIndex) => {
                                const actualIndex =
                                    row.startIndex +
                                    imageIndex;

                                return (
                                    <div
                                        key={actualIndex}
                                        className={`
                                            relative
                                            overflow-hidden
                                            bg-[#f5f4f1]
                                            ${
                                                row.fullWidth
                                                    ? "aspect-4/3"
                                                    : "aspect-3/4"
                                            }
                                        `}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${title}-${actualIndex}`}
                                            fill
                                            priority={
                                                actualIndex < 3
                                            }
                                            draggable={false}
                                            sizes={
                                                row.fullWidth
                                                    ? "100vw"
                                                    : "50vw"
                                            }
                                            className="
                                                object-cover
                                            "
                                        />
                                    </div>
                                );
                            }
                        )}
                    </div>
                ))}

            </div>

            {/* =====================================================
                MOBILE HORIZONTAL GALLERY
            ====================================================== */}

            <div className="w-full md:hidden">

                <div
                    ref={mobileScrollRef}
                    onScroll={handleMobileScroll}
                    className="
                        flex
                        w-full
                        overflow-x-auto
                        scroll-smooth
                        snap-x
                        snap-mandatory
                        overscroll-x-contain
                        [&::-webkit-scrollbar]:hidden
                        [-ms-overflow-style:none]
                        scrollbar-none
                    "
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="
                                relative
                                w-full
                                min-w-full
                                shrink-0
                                snap-center
                                overflow-hidden
                                bg-[#f5f4f1]
                            "
                        >
                            <div className="relative aspect-3/4 w-full">

                                <Image
                                    src={image}
                                    alt={`${title}-${index}`}
                                    fill
                                    priority={index === 0}
                                    draggable={false}
                                    sizes="100vw"
                                    className="
                                        object-cover
                                    "
                                />

                                {/* IMAGE NUMBER */}

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        bottom-4
                                        right-4
                                        bg-white/80
                                        px-2
                                        py-1
                                        text-[10px]
                                        font-medium
                                        tracking-wide
                                        text-black
                                    "
                                >
                                    {index + 1} / {images.length}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* =================================================
                    MOBILE SCROLL PROGRESS
                ================================================== */}

                <div
                    className="
                        mx-3
                        mt-3
                        h-px
                        bg-black/10
                    "
                >
                    <div
                        className="
                            h-px
                            bg-black
                            transition-[width]
                            duration-150
                            ease-out
                        "
                        style={{
                            width: `${Math.max(
                                scrollProgress,
                                2
                            )}%`,
                        }}
                    />
                </div>

            </div>

        </div>
    );
}
