"use client";

import { useEffect, useMemo, useState } from "react";

const storyParagraphs = [
    [
        "Style is more than what you wear."
    ],
    [
        "It is the way you enter a room. The way a perfectly cut jacket sits on your shoulders, the feel of a fine fabric against the skin, and the quiet confidence that comes from wearing something made with intention."
    ],
    [
        "At Luxe Men, we believe true luxury never needs to announce itself."
    ],
    [
        "We create timeless menswear for those who appreciate refined details, considered silhouettes, and the effortless balance between classic and contemporary."
    ],
    [
        "Every piece is designed to become part of your story. To be worn often, remembered always, and made to belong in your wardrobe for years to come."
    ],
    [
        "Welcome to Luxe Men."
    ],
    [
        "Wear it with intention."
    ]
];


export default function Story() {
    const [visibleWords, setVisibleWords] = useState(12);

    const allWords = useMemo(() => {
        return storyParagraphs.flatMap((paragraph) =>
            paragraph.flatMap((sentence) =>
                sentence.split(" ")
            )
        );
    }, []);

    const totalWords = allWords.length;

    useEffect(() => {
        const handleScroll = () => {
            const section =
                document.getElementById("luxemen-story");

            if (!section) return;

            const rect = section.getBoundingClientRect();

            const scrollDistance =
                rect.height - window.innerHeight;

            const scrolled = Math.min(
                Math.max(-rect.top, 0),
                Math.max(scrollDistance, 1)
            );

            const progress =
                scrollDistance > 0
                    ? scrolled / scrollDistance
                    : 1;

            const initialWords = 12;

            const currentWords =
                initialWords +
                Math.floor(
                    progress *
                    (totalWords - initialWords)
                );

            setVisibleWords(
                Math.min(totalWords, currentWords)
            );
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        handleScroll();

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, [totalWords]);

    let globalWordIndex = 0;

    return (
        <section
            id="luxemen-story"
            className="
                relative
                overflow-hidden
                bg-[#171714]
                px-6
                py-26
            "
        >
            {/* Luxury animated atmosphere */}
            <div
                className=" pointer-events-none absolute inset-[-20%] opacity-70 blur-3xl animate-[luxuryGlow_18s_ease-in-out_infinite_alternate]"
                style={{
                    background: `
            radial-gradient(
                circle at 25% 35%,
                rgba(153, 118, 55, 0.13),
                transparent 28%
            ),
            radial-gradient(
                circle at 75% 65%,
                rgba(184, 145, 72, 0.10),
                transparent 25%
            ),
            radial-gradient(
                circle at 50% 10%,
                rgba(112, 91, 54, 0.08),
                transparent 30%
            )
        `,
                }}
            />


            <div className="relative mx-auto max-w-300">

                <div
                    className="
                        mb-10
                        flex
                        flex-col
                        items-center
                    "
                >
                    <span
                        className="
                            mb-7
                            h-px
                            w-10
                            bg-[#8d816d]/50
                        "
                    />

                    <span
                        className="
                            text-center
                            text-[8px]
                            uppercase
                            tracking-[0.55em]
                            text-[#81796d]
                        "
                        style={{
                            fontFamily:
                                "var(--font-geist-sans), sans-serif",
                            fontWeight: 400,
                        }}
                    >
                        The Art of Dressing
                    </span>
                </div>

                {/* STORY */}
                <div
                    className=" mx-auto max-w-205 text-center text-[40px] leading-[1.2] tracking-[-0.02em] md:text-[56px] md:leading-[1.15] lg:text-[60px]"
                    style={{
                        fontFamily: "var(--font-story), serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        letterSpacing: "-0.035em",
                        fontKerning: "normal",
                        textRendering: "optimizeLegibility",
                    }}
                >

                    {storyParagraphs.map(
                        (paragraph, paragraphIndex) => {
                            const paragraphWidths = [
                                "max-w-[700px]",
                                "max-w-[700px]",
                                "max-w-[700px]",
                                "max-w-[700px]",
                                "max-w-[700px]",
                                "max-w-[700px]",
                                "max-w-[700px]",
                            ];

                            const width =
                                paragraphWidths[
                                paragraphIndex
                                ];

                            return (
                                <div
                                    key={paragraphIndex}
                                    className={`
                                        mx-auto
                                        ${width}
                                        ${paragraphIndex !== 0
                                            ? "mt-12 md:mt-14"
                                            : ""
                                        }
                                    `}
                                >
                                    {paragraph.map(
                                        (sentence) => {
                                            const words =
                                                sentence.split(" ");

                                            return (
                                                <span
                                                    key={sentence}
                                                >
                                                    {words.map(
                                                        (word) => {
                                                            const currentIndex =
                                                                globalWordIndex++;

                                                            const isVisible =
                                                                currentIndex <
                                                                visibleWords;

                                                            return (
                                                                <span
                                                                    key={
                                                                        currentIndex
                                                                    }
                                                                    className={`
                                                                        transition-colors
                                                                        duration-500
                                                                        ease-out
                                                                        ${isVisible
                                                                            ? "text-[#f2eee7]"
                                                                            : "text-[#393631]"
                                                                        }
                                                                    `}
                                                                >
                                                                    {word}{" "}
                                                                </span>
                                                            );
                                                        }
                                                    )}{" "}
                                                </span>
                                            );
                                        }
                                    )}
                                </div>
                            );
                        }
                    )}
                </div>

                {/* footer */}
                <div
                    className="
                        mt-20
                        flex
                        flex-col
                        items-center
                    "
                >
                    {/* Closing statement */}
                    <p
                        className="
                            max-w-120
                            text-center
                            text-[13px]
                            leading-[1.9]
                            tracking-[0.045em]
                            text-[#8f887d]
                            md:text-[14px]
                        "
                        style={{
                            fontFamily:
                                "var(--font-geist-sans), sans-serif",
                            fontWeight: 300,
                        }}
                    >
                        Designed for the man who
                        understands that true style
                        is found in the details.
                    </p>

                    {/* MINIMAL DIVIDER */}
                    <div
                        className="
                            my-12
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <span
                            className="
                                h-px
                                w-8
                                bg-[#716859]/50
                            "
                        />

                        <span
                            className="
                                h-1
                                w-1
                                rotate-45
                                bg-[#a0927b]/70
                            "
                        />

                        <span
                            className="
                                h-px
                                w-8
                                bg-[#716859]/50
                            "
                        />
                    </div>

                    {/* LM MONOGRAM */}
                    <div
                        className="
                            flex
                            flex-col
                            items-center
                        "
                    >
                        {/* Fine top line */}
                        <span
                            className="
                                mb-3
                                h-8
                                w-px
                                bg-[#8d816d]/60
                            "
                        />

                        {/* Monogram */}
                        <div
                            className="
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <span
                                className="
                                    select-none
                                    text-[46px]
                                    leading-none
                                    tracking-[-0.14em]
                                    text-[#e5ded3]
                                "
                                style={{
                                    fontFamily:
                                        "var(--font-story), serif",
                                    fontWeight: 500,
                                }}
                            >
                                L<span>M</span>
                            </span>
                        </div>

                        {/* Fine bottom line */}
                        <span
                            className="
                                mt-3
                                h-8
                                w-px
                                bg-[#8d816d]/60
                            "
                        />

                    </div>
                </div>

            </div>
        </section>
    );
}
