"use client"

type AddressProps = {
    id: string
    fullname: string
    countryCode: string
    phone: string
    addressLine: string
    city: string
    state: string
    country: string
    postalCode: string
    isDefault: boolean

}

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
        <div className="flex gap-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                ✓
            </div>

            <div className="flex-1">
                {/* Heading + Edit */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl uppercase tracking-[0.18em]">
                        Shipping
                    </h2>

                   <button
                            onClick={() => setCurrentStep(1)}
                            className="group relative text-sm"
                        >
                            Edit

                            <span
                                className=" absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-500 ease-out group-hover:scale-x-100"
                            />
                        </button>
                </div>

                {/* Shipping Details */}
                <div className="mt-3 space-y-1.5 text-sm leading-7 text-neutral-700">
                    <p className="font-medium text-black">
                        {shippingData.fullname}
                    </p>

                    <p className="text-xs">
                        {shippingData.addressLine}
                    </p>

                    <p className="text-xs">
                        {shippingData.city}, {shippingData.state} , {shippingData.postalCode}
                    </p>

                    <p className="text-xs">
                        {shippingData.country}
                    </p>

                    <p className="text-xs">
                        {shippingData.countryCode} {shippingData.phone}
                    </p>
                </div>

                <div className="mt-5 space-y-1 text-sm text-neutral-700">
                    <p className="text-xs">
                        You will be notified when item(s) are shipped.
                    </p>

                    <p className="text-xs">
                        Payment occurs only at shipment.
                    </p>
                </div>
            </div>
        </div>
    );
}