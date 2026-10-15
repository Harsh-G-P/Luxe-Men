"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    images: string[];
    title: string;
};

export default function ProductGallery({
    images,
    title,
}: Props) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeImage, setActiveImage] = useState<number | null>(null);

    const mobileScrollRef = useRef<HTMLDivElement>(null);

    if (!images || images.length === 0) {
        return null;
    }

    useEffect(() => {
        if (activeImage === null) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setActiveImage(null);
            }

            if (event.key === "ArrowRight") {
                setActiveImage((current) =>
                    current === null
                        ? null
                        : (current + 1) % images.length
                );
            }

            if (event.key === "ArrowLeft") {
                setActiveImage((current) =>
                    current === null
                        ? null
                        : (current - 1 + images.length) % images.length
                );
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeImage, images.length]);

    // MOBILE SCROLL
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

    // DESKTOP IMAGE PATTERN
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

            {/* DESKTOP GALLERY */}

            <div className="hidden w-full px-5 py-5 md:block lg:px-6">

                {rows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`
                            mb-2
                            grid
                            gap-2
                            ${row.fullWidth
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
                                        onClick={() => setActiveImage(actualIndex)}
                                        className={` relative cursor-zoom-in overflow-hidden bg-[#f5f4f1] ${row.fullWidth ? "aspect-4/3" : "aspect-3/4"}`}
                                    >

                                        <Image
                                            src={image}
                                            alt={`${title}-${actualIndex}`}
                                            fill
                                            loading={actualIndex === 0 ? "eager" : "lazy"}
                                            fetchPriority={actualIndex === 0 ? "high" : "auto"}
                                            draggable={false}
                                            sizes={
                                                row.fullWidth
                                                    ? "(min-width: 768px) 46vw, 100vw"
                                                    : "(min-width: 1280px) 22vw, (min-width: 768px) 23vw, 100vw"
                                            }
                                            className="object-cover"
                                        />

                                    </div>
                                );
                            }
                        )}
                    </div>
                ))}

            </div>

            {/* MOBILE HORIZONTAL GALLERY */}

            <div className="w-full md:hidden">

                <div
                    ref={mobileScrollRef}
                    onScroll={handleMobileScroll}
                    className=" flex w-full overflow-x-auto scroll-smooth snap-x snap-mandatory overscroll-x-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none
                    "
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className=" relative w-full min-w-full shrink-0 snap-center overflow-hidden bg-[#f5f4f1]
                            "
                        >
                            <div className="relative aspect-3/4 w-full">

                                <Image
                                    src={image}
                                    alt={`${title}-${index}`}
                                    fill
                                    priority={index === 0}
                                    draggable={false}
                                    sizes="(min-width: 768px) 46vw, 100vw"
                                    className="
                                        object-cover
                                    "
                                />

                                {/* IMAGE NUMBER */}

                                <div
                                    className=" pointer-events-none absolute bottom-4 right-4 bg-white/80 px-2 py-1 text-[10px] font-medium tracking-wide text-black
                                    "
                                >
                                    {index + 1} / {images.length}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* MOBILE SCROLL PROGRESS */}

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


            {activeImage !== null && (
                <div
                    className=" fixed inset-0 z-100 hidden bg-[#111110]/95 lg:flex lg:items-center lg:justify-center"
                    onClick={() => setActiveImage(null)}
                >
                    {/* TOP BAR */}
                    <div
                        className=" absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-6 md:px-12"
                    >
                        <span
                            className=" text-[10px] font-medium uppercase tracking-[0.35em] text-white/80"
                        >
                            LUXE MEN
                        </span>

                        <button
                            type="button"
                            aria-label="Close image preview"
                            onClick={() => setActiveImage(null)}
                            className=" group flex items-center gap-3 text-white/70 transition-colors duration-300 hover:text-white"
                        >
                            <span className="text-[9px] uppercase tracking-[0.2em]">
                                Close
                            </span>
                            <X
                                size={19}
                                strokeWidth={1}
                                className="transition-transform duration-300 group-hover:rotate-90"
                            />
                        </button>
                    </div>

                    {/* PREVIOUS */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            aria-label="Previous image"
                            onClick={(event) => {
                                event.stopPropagation();
                                setActiveImage(
                                    (activeImage - 1 + images.length) % images.length
                                );
                            }}
                            className=" absolute left-4 top-1/2 z-20 -translate-y-1/2 p-3 text-white/50 transition-colors duration-300 hover:text-white md:left-10"
                        >
                            <ChevronLeft size={23} strokeWidth={1} />
                        </button>
                    )}

                    {/* IMAGE */}
                    <div
                        className=" relative h-[78vh] w-[76vw] max-w-275"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <Image
                            key={activeImage}
                            src={images[activeImage]}
                            alt={`${title} — image ${activeImage + 1}`}
                            fill
                            priority
                            sizes="(min-width: 1024px) 76vw, 100vw"
                            className=" object-contain animate-in fade-in duration-500"
                        />
                    </div>

                    {/* NEXT */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            aria-label="Next image"
                            onClick={(event) => {
                                event.stopPropagation();
                                setActiveImage((activeImage + 1) % images.length);
                            }}
                            className=" absolute right-4 top-1/2 z-20 -translate-y-1/2 p-3 text-white/50 transition-colors duration-300 hover:text-white md:right-10"
                        >
                            <ChevronRight size={23} strokeWidth={1} />
                        </button>
                    )}

                    {/* BOTTOM BAR */}
                    <div
                        className=" absolute inset-x-0 bottom-0 flex items-center justify-between px-8 py-6 md:px-12 "
                    >
                        <span
                            className=" max-w-[60%] truncate text-[10px] uppercase tracking-[0.2em] text-white/60 "
                        >
                            {title}
                        </span>

                        <span
                            className=" text-[10px] tabular-nums tracking-[0.2em] text-white/70 "
                        >
                            {String(activeImage + 1).padStart(2, "0")}
                            <span className="mx-2 text-white/30">/</span>
                            {String(images.length).padStart(2, "0")}
                        </span>
                    </div>

                    {/* SUBTLE PROGRESS LINE */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-white/10">
                        <div
                            className="h-full bg-white/70 transition-[width] duration-300"
                            style={{
                                width: `${((activeImage + 1) / images.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            )}


        </div>
    );
}
