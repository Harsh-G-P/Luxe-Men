"use client"

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
        <div className="mt-14">

            <div className="flex gap-6">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                    ✓
                </div>

                <div className="flex-1">

                    {/* Heading + Edit */}
                    <div className="flex items-center justify-between">

                        <h2 className="text-2xl uppercase">
                            Packaging & Gifting
                        </h2>

                        <button
                            onClick={() => setCurrentStep(2)}
                            className="group relative text-sm"
                        >
                            Edit

                            <span
                                className=" absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-500 ease-out group-hover:scale-x-100"
                            />
                        </button>

                    </div>


                    {/* Details */}
                    <div className="mt-6 grid grid-cols-1 gap-3 text-xs md:grid-cols-2">

                        <p>
                            {packagingData.option}
                        </p>


                        <div>
                            <p className="text-left md:ms-24 font-md">
                                Gift Message:{" "}
                                <span className="font-light">
                                    {packagingData.giftMessage || "No Gift Message"}
                                </span>
                            </p>

                            <p className="text-left md:ms-24 font-md">
                                Remove price from invoice:{" "}
                                <span className="font-light">
                                    {removeInvoice ? "Yes" : "No"}
                                </span>
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}