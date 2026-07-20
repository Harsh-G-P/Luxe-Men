"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    images: string[];
    title: string;
};


export default function ProductGallery({
    images,
    title,
}: Props) {


    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [showAllThumbnails, setShowAllThumbnails] = useState(false);


    const [zoomed, setZoomed] = useState<{
        [key: number]: {
            active: boolean;
            originX?: number;
            originY?: number;
        }
    }>({});



    useEffect(() => {

        const resize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        resize();

        window.addEventListener(
            "resize",
            resize
        );

        return () => window.removeEventListener(
            "resize",
            resize
        );

    }, []);



    const prevImage = () => {

        setCurrentIndex(prev =>
            prev === 0
                ? images.length - 1
                : prev - 1
        );

    };


    const nextImage = () => {

        setCurrentIndex(prev =>
            prev === images.length - 1
                ? 0
                : prev + 1
        );

    };



    const handleZoom = (
        index: number,
        e: React.MouseEvent<HTMLDivElement>
    ) => {

        const rect =
            e.currentTarget.getBoundingClientRect();


        const originX =
            ((e.clientX - rect.left) / rect.width) * 100;


        const originY =
            ((e.clientY - rect.top) / rect.height) * 100;

        setZoomed(prev => {

            const existing = prev[index];

            return {
                ...prev,
                [index]: {
                    active: !existing?.active,
                    originX,
                    originY
                }
            }

        });


    };


    const mainImages = isMobile
        ?
        [images[currentIndex]]
        :
        currentIndex === 0
            ?
            [images[0]]
            :
            [
                images[currentIndex - 1],
                images[currentIndex]
            ];

    const maxVisible = 4;

    return (

        <div className="w-full">

            {/* IMAGE AREA */}
            <div
                className=" relative w-full md:h-[72vh] h-[62vh] flex justify-center items-center gap-1 overflow-hidden select-none "
            >
                {
                    mainImages.map((img, index) => (

                        <div
                            key={index}
                            className=" relative w-full h-full overflow-hidden cursor-zoom-in "
                            onClick={(e) => handleZoom(index, e)}
                        >


                            <Image
                                src={img}
                                alt={`${title}-${index}`}
                                fill
                                loading="eager"
                                draggable={false}
                                sizes=" (max-width:768px)100vw, 50vw "
                                className=" object-cover transition-transform duration-300 "

                                style={{
                                    transform:
                                        zoomed[index]?.active
                                            ?
                                            "scale(3)"
                                            :
                                            "scale(1)",
                                    transformOrigin:
                                        zoomed[index]
                                            ?
                                            `${zoomed[index].originX}% ${zoomed[index].originY}%`
                                            :
                                            "center"
                                }}

                            />


                        </div>


                    ))
                }

                {/* MOBILE */}
                {
                    isMobile && (

                        <>

                            <div
                                className=" absolute bottom-4 right-2 text-xs "
                            >
                                {currentIndex + 1}/{images.length}
                            </div>



                            <div
                                className=" absolute bottom-2 left-2 right-2 h-0.5 bg-black/30 "
                            >

                                <div
                                    className=" h-full bg-black transition-all "
                                    style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                                />

                            </div>



                            <button
                                onClick={prevImage}
                                className=" absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-300 p-2 rounded-full "
                            >

                                <ChevronLeft
                                    size={22}
                                    className="text-white"
                                />

                            </button>



                            <button
                                onClick={nextImage}
                                className=" absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-300 p-2 rounded-full "
                            >

                                <ChevronRight
                                    size={22}
                                    className="text-white"
                                />

                            </button>


                        </>

                    )
                }

                {/* DESKTOP THUMBNAILS */}
                {
                    !isMobile && (

                        <div
                            className=" absolute bottom-8 right-4 flex items-center "
                        >


                            <div className="flex gap-1">


                                {
                                    (showAllThumbnails
                                        ? images
                                        : images.slice(0, maxVisible)
                                    )
                                        .map((img, index) => {


                                            if (
                                                currentIndex > 0 &&
                                                index === currentIndex - 1
                                            ) {

                                                return (

                                                    <div
                                                        key={index}
                                                        onClick={() => setCurrentIndex(index)}

                                                        className=" h-9 w-20 flex overflow-hidden border rounded cursor-pointer "

                                                    >

                                                        <Image
                                                            src={images[currentIndex - 1]}
                                                            alt=""
                                                            width={24}
                                                            height={48}
                                                            className=" object-cover w-1/2 "
                                                        />


                                                        <Image
                                                            src={images[currentIndex]}
                                                            alt=""
                                                            width={24}
                                                            height={48}
                                                            className=" object-cover w-1/2 "
                                                        />

                                                    </div>

                                                )

                                            }



                                            if (
                                                currentIndex > 0 && index === currentIndex
                                            )
                                                return null;



                                            return (

                                                <div
                                                    key={index}
                                                    onClick={() => setCurrentIndex(index)}
                                                    className=" relative w-7 h-9 border rounded overflow-hidden cursor-pointer "
                                                >

                                                    <Image
                                                        src={img}
                                                        alt=""
                                                        fill
                                                        sizes="28px"
                                                        className=" object-cover "

                                                    />


                                                    {
                                                        currentIndex !== index &&

                                                        <div
                                                            className=" absolute inset-0 bg-black/30"
                                                        />

                                                    }


                                                </div>


                                            )

                                        })

                                }



                                {
                                    !showAllThumbnails &&
                                    images.length > maxVisible &&

                                    <div
                                        onClick={() => setShowAllThumbnails(true)}
                                        className=" w-7 h-9 bg-gray-200 flex items-center justify-center text-xs font-bold cursor-pointer "
                                    >
                                        +{images.length - maxVisible}

                                    </div>

                                }


                            </div>



                            <div className="flex gap-1 ml-2">


                                <button
                                    onClick={prevImage}
                                    className=" bg-zinc-300 p-2 rounded-full"

                                >

                                    <ChevronLeft
                                        size={12}
                                        className="text-white"
                                    />

                                </button>



                                <button
                                    onClick={nextImage}
                                    className=" bg-zinc-300 p-2 rounded-full "
                                >

                                    <ChevronRight
                                        size={12}
                                        className="text-white"
                                    />

                                </button>


                            </div>


                        </div>

                    )
                }

            </div>

        </div>

    );

}