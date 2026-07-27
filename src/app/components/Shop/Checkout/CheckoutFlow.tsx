"use client";

import { useState } from "react";
import ShippingStep from "./ShippingStep";
import PackagingStep from "./PackagingStep";
import PaymentStep from "./PaymentStep";
import ShippingSummary from "./ShippingSummary";
import PackagingSummary from "./PackagingSummary";


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

export default function CheckoutFlow() {

    const [selected, setSelected] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    const [shippingData, setShippingData] = useState<AddressProps | null>(null);

    const [packagingData, setPackagingData] = useState({
        option: "Signature Box",
        giftMessage: "",
    });

    const [removeInvoice, setRemoveInvoice] = useState(false);
    const [giftMessageEnabled, setGiftMessageEnabled] = useState(false);
    const [giftMessage, setGiftMessage] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("COD");


    return (
        <>

            {currentStep === 1 && (
                <ShippingStep
                    selected={selected}
                    setSelected={setSelected}
                    setCurrentStep={setCurrentStep}
                    setShippingData={setShippingData}
                />
            )}

            {currentStep > 1 && (
                <ShippingSummary
                    shippingData={shippingData}
                    setCurrentStep={setCurrentStep}
                />
            )}


            {currentStep === 2 && (
                <PackagingStep
                    packagingData={packagingData}
                    setPackagingData={setPackagingData}
                    removeInvoice={removeInvoice}
                    setRemoveInvoice={setRemoveInvoice}
                    giftMessageEnabled={giftMessageEnabled}
                    setGiftMessageEnabled={setGiftMessageEnabled}
                    giftMessage={giftMessage}
                    setGiftMessage={setGiftMessage}
                    setCurrentStep={setCurrentStep}
                />
            )}

            {currentStep > 2 && (
                <PackagingSummary
                    packagingData={packagingData}
                    removeInvoice={removeInvoice}
                    setCurrentStep={setCurrentStep}
                />
            )}

            {currentStep === 3 && (
                <PaymentStep
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />
            )}

        </>
    );
}