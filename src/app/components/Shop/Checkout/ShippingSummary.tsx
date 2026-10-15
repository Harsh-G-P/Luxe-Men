"use client";

type AddressProps = {
    id: string;
    fullname: string;
    countryCode: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
};

type Props = {
    shippingData: AddressProps | null;
    setCurrentStep: (step: number) => void;
};

export default function ShippingSummary({
    shippingData,
    setCurrentStep,
}: Props) {

    if (!shippingData) return null;

    return (
        <section className="text-[#1c1b18]">

            {/* COMPLETED STEP */}
            <div className="relative overflow-hidden border border-[#d8d3c9] bg-[#faf9f6] px-7 py-6">

                {/* Gold accent */}
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
                                    Shipping
                                </h2>

                            </div>


                            {/* EDIT */}

                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
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

                        {/* SHIPPING DETAILS */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                            <div>

                                <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                                    Deliver To
                                </p>

                                <p className="mt-2 font-serif text-[16px] tracking-tight text-[#25231f]">
                                    {shippingData.fullname}
                                </p>

                                <div className="mt-3 space-y-1 text-[9px] leading-5 text-[#858077]">

                                    <p>
                                        {shippingData.addressLine}
                                    </p>

                                    <p>
                                        {shippingData.city},{" "}
                                        {shippingData.state},{" "}
                                        {shippingData.postalCode}
                                    </p>

                                    <p>
                                        {shippingData.country}
                                    </p>

                                </div>

                            </div>


                            <div>

                                <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                                    Contact
                                </p>

                                <p className="mt-2 text-[9px] leading-5 text-[#858077]">
                                    {shippingData.countryCode}{" "}
                                    {shippingData.phone}
                                </p>

                            </div>

                        </div>

                        {/* DELIVERY NOTE */}
                        <div className="mt-6 border-t border-[#ded9d0] pt-4">

                            <div className="flex items-start gap-3">

                                <span className="mt-1.25 h-1.5 w-1.5 shrink-0 bg-[#9b8150]" />

                                <div className="space-y-1">

                                    <p className="text-[8px] leading-4 uppercase tracking-[0.18em] text-[#777168]">
                                        Shipment Notification
                                    </p>

                                    <p className="text-[9px] leading-5 text-[#99938a]">
                                        You will be notified when your item(s)
                                        are shipped.
                                    </p>

                                    <p className="text-[9px] leading-5 text-[#99938a]">
                                        Payment occurs only at shipment.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}
