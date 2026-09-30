"use client";

type PackagingData = {
    option: string;
    giftMessage: string;
};

type Props = {
    packagingData: PackagingData;
    removeInvoice: boolean;
    setCurrentStep: (step: number) => void;
};

export default function PackagingSummary({
    packagingData,
    removeInvoice,
    setCurrentStep,
}: Props) {
    return (
        <section className="mt-5 text-[#1c1b18]">

            {/* COMPLETED STEP */}
            <div className="relative overflow-hidden border border-[#d8d3c9] bg-[#faf9f6] px-7 py-6">

                {/* GOLD ACCENT */}

                <span className="absolute left-0 top-0 h-full w-0.5 bg-[#9b8150]" />


                <div className="flex items-start gap-5">

                    {/* COMPLETED ICON */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#9b8150] text-[11px] text-[#9b8150]">
                        ✓
                    </div>


                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">

                        {/* HEADER */}
                        <div className="flex items-start justify-between gap-5">

                            <div>

                                <p className="text-[8px] uppercase tracking-[0.45em] text-[#9b8150]">
                                    Completed
                                </p>

                                <h2 className="mt-2 font-serif text-[24px] leading-none tracking-tight">
                                    Packaging & Gifting
                                </h2>

                            </div>


                            {/* EDIT */}
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="
                                    group
                                    relative
                                    shrink-0
                                    text-[8px]
                                    uppercase
                                    tracking-[0.3em]
                                    text-[#5e5951]
                                "
                            >
                                Edit

                                <span
                                    className="
                                        absolute
                                        -bottom-1
                                        left-0
                                        h-px
                                        w-full
                                        origin-left
                                        scale-x-0
                                        bg-[#9b8150]
                                        transition-transform
                                        duration-500
                                        group-hover:scale-x-100
                                    "
                                />
                            </button>

                        </div>

                        {/* DIVIDER */}
                        <div className="my-5 h-px bg-[#ded9d0]" />

                        {/* PACKAGING DETAILS */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* PRESENTATION */}
                            <div>

                                <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                                    Presentation
                                </p>

                                <p className="mt-2 font-serif text-[16px] tracking-tight text-[#25231f]">
                                    {packagingData.option}
                                </p>

                                <p className="mt-2 text-[9px] leading-5 text-[#99938a]">
                                    Carefully prepared according to your
                                    selected presentation.
                                </p>

                            </div>


                            {/* PREFERENCES */}
                            <div>

                                <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                                    Preferences
                                </p>

                                <div className="mt-3 space-y-3">

                                    {/* GIFT MESSAGE */}
                                    <div>

                                        <p className="text-[8px] uppercase tracking-[0.15em] text-[#777168]">
                                            Personal Message
                                        </p>

                                        <p className="mt-1 text-[9px] leading-5 text-[#99938a]">
                                            {packagingData.giftMessage ||
                                                "No gift message"}
                                        </p>

                                    </div>


                                    {/* INVOICE */}
                                    <div>

                                        <p className="text-[8px] uppercase tracking-[0.15em] text-[#777168]">
                                            Pricing Information
                                        </p>

                                        <p className="mt-1 text-[9px] leading-5 text-[#99938a]">
                                            {removeInvoice
                                                ? "Pricing concealed on invoice"
                                                : "Pricing included on invoice"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* FOOTER DETAIL */}
                        <div className="mt-6 border-t border-[#ded9d0] pt-4">

                            <div className="flex items-start gap-3">

                                <span className="mt-1.25 h-1.5 w-1.5 shrink-0 bg-[#9b8150]" />

                                <p className="text-[9px] leading-5 text-[#99938a]">
                                    Your presentation preferences have been
                                    recorded and will accompany the order
                                    through final preparation.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}
