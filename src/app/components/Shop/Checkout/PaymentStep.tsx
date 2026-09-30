"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AddressProps = {
    id: string;
};

type Props = {
    paymentMethod: string;
    setPaymentMethod: any;

    shippingData: AddressProps | null;

    packagingData: {
        option: string;
        notes: string;
    };

    removeInvoice: boolean;
    giftMessage: string;
};

export default function PaymentStep({
    paymentMethod,
    setPaymentMethod,
    shippingData,
    packagingData,
    removeInvoice,
    giftMessage,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = async () => {
        if (!shippingData) return;

        try {
            setLoading(true);

            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    addressId: shippingData.id,
                    paymentMethod,
                    packagingOption: packagingData.option,
                    giftMessage,
                    removeInvoice,
                    notes: packagingData.notes,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(
                    data.message || "Unable to complete checkout."
                );
                return;
            }

            if (paymentMethod === "STRIPE") {
                window.location.href = data.data.url;
                return;
            }

            window.dispatchEvent(new Event("cartUpdated"));

            router.push(
                `/checkout/success?order=${data.data.orderNumber}`
            );
        } catch (err) {
            console.error(err);

            toast.error(
                "Checkout failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mt-14 text-[#1c1b18]">

            {/* SECTION HEADER  */}
            <div className="mb-9 flex items-start gap-5">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#9b8150] text-[12px] text-[#9b8150]">
                    03
                </div>

                <div>

                    <p className="text-[8px] uppercase tracking-[0.45em] text-[#9b8150]">
                        The Final Arrangement
                    </p>

                    <h2 className="mt-2 font-serif text-[28px] leading-none tracking-tight">
                        Payment
                    </h2>

                    <p className="mt-3 max-w-lg text-[10px] leading-5 text-[#8b867d]">
                        Complete your order securely. Your selected
                        presentation and delivery details will accompany the
                        order through final preparation.
                    </p>

                </div>

            </div>

            {/* PAYMENT METHODS */}
            <div className="space-y-4">

                {/* CASH ON DELIVERY */}
                <label
                    className={`
                        group
                        relative
                        flex
                        cursor-pointer
                        items-start
                        gap-5
                        overflow-hidden
                        border
                        p-7
                        transition-all
                        duration-500
                        max-md:p-5
                        ${paymentMethod === "COD"
                            ? "border-[#9b8150] bg-[#f4f1e9]"
                            : "border-[#d8d3c9] bg-[#faf9f6] hover:border-[#b7aa91]"
                        }
                    `}
                >

                    {/* ACTIVE GOLD ACCENT */}
                    <span
                        className={`
                            absolute
                            left-0
                            top-0
                            h-full
                            w-0.5
                            origin-top
                            bg-[#9b8150]
                            transition-transform
                            duration-500
                            ${paymentMethod === "COD"
                                ? "scale-y-100"
                                : "scale-y-0"
                            }
                        `}
                    />


                    <input
                        type="radio"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#9b8150]"
                    />


                    <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-5">

                            <div>

                                <p className="text-[8px] uppercase tracking-[0.35em] text-[#9b8150]">
                                    Payment I
                                </p>

                                <h3 className="mt-2 font-serif text-[18px] tracking-tight text-[#25231f]">
                                    Cash on Delivery
                                </h3>

                            </div>


                            {paymentMethod === "COD" && (
                                <span className="shrink-0 text-[7px] uppercase tracking-[0.3em] text-[#9b8150]">
                                    Selected
                                </span>
                            )}

                        </div>


                        <p className="mt-3 max-w-md text-[10px] leading-5 text-[#858077]">
                            Pay with cash when your order is delivered.
                            Payment is collected upon successful delivery.
                        </p>

                    </div>

                </label>


                {/* ONLINE PAYMENT */}
                <label
                    className={`
                        group
                        relative
                        flex
                        cursor-pointer
                        items-start
                        gap-5
                        overflow-hidden
                        border
                        p-7
                        transition-all
                        duration-500
                        max-md:p-5
                        ${paymentMethod === "STRIPE"
                            ? "border-[#9b8150] bg-[#f4f1e9]"
                            : "border-[#d8d3c9] bg-[#faf9f6] hover:border-[#b7aa91]"
                        }
                    `}
                >

                    {/* ACTIVE GOLD ACCENT */}
                    <span
                        className={`
                            absolute
                            left-0
                            top-0
                            h-full
                            w-0.5
                            origin-top
                            bg-[#9b8150]
                            transition-transform
                            duration-500
                            ${paymentMethod === "STRIPE"
                                ? "scale-y-100"
                                : "scale-y-0"
                            }
                        `}
                    />


                    <input
                        type="radio"
                        checked={paymentMethod === "STRIPE"}
                        onChange={() => setPaymentMethod("STRIPE")}
                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#9b8150]"
                    />


                    <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-5">

                            <div>

                                <p className="text-[8px] uppercase tracking-[0.35em] text-[#9b8150]">
                                    Payment II
                                </p>

                                <h3 className="mt-2 font-serif text-[18px] tracking-tight text-[#25231f]">
                                    Online Payment
                                </h3>

                            </div>


                            {paymentMethod === "STRIPE" && (
                                <span className="shrink-0 text-[7px] uppercase tracking-[0.3em] text-[#9b8150]">
                                    Selected
                                </span>
                            )}

                        </div>


                        <p className="mt-3 max-w-md text-[10px] leading-5 text-[#858077]">
                            Pay securely through our encrypted payment gateway
                            using your preferred payment method.
                        </p>

                    </div>

                </label>

            </div>

            {/* ONLINE PAYMENT INFORMATION */}
            {paymentMethod === "STRIPE" && (
                <div className="mt-6 overflow-hidden border border-[#d8d3c9] bg-[#efede7]">

                    <div className="flex items-start gap-4 px-6 py-5">

                        <span className="mt-1.25 h-1.5 w-1.5 shrink-0 bg-[#9b8150]" />

                        <div>

                            <p className="text-[8px] uppercase tracking-[0.35em] text-[#9b8150]">
                                Secure Payment
                            </p>

                            <p className="mt-2 max-w-xl text-[9px] leading-5 text-[#858077]">
                                You will be redirected to our secure payment
                                gateway after selecting{" "}
                                <span className="text-[#4f4b44]">
                                    Place Order
                                </span>
                                . Your payment details are handled securely
                                by Stripe.
                            </p>

                        </div>

                    </div>

                </div>
            )}

            {/* ORDER CONFIRMATION */}
            <div className="mt-8 border-t border-[#d8d3c9] pt-6">

                <div className="flex items-start gap-4">

                    <span className="mt-1.25 h-1.5 w-1.5 shrink-0 bg-[#9b8150]" />

                    <div>

                        <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                            Order Confirmation
                        </p>

                        <p className="mt-2 max-w-xl text-[9px] leading-5 text-[#99938a]">
                            By placing your order, your selected shipping,
                            packaging and payment preferences will be
                            submitted for final processing.
                        </p>

                    </div>

                </div>

            </div>

            {/* PLACE ORDER */}
            <button
                type="button"
                disabled={loading || !shippingData}
                onClick={handlePlaceOrder}
                className={`
                    group
                    relative
                    mt-8
                    flex
                    h-14
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.35em]
                    text-white
                    transition-colors
                    duration-500
                    ${loading || !shippingData
                        ? "cursor-not-allowed bg-[#77736b]"
                        : "bg-[#181714] hover:bg-[#292721]"
                    }
                `}
            >

                <span className="relative z-10">

                    {loading
                        ? paymentMethod === "STRIPE"
                            ? "Redirecting to Secure Payment..."
                            : "Placing Order..."
                        : "Place Order"}

                </span>


                {!loading && (
                    <span className="relative z-10 ml-3 translate-x-1 text-[#c4a66a] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                        →
                    </span>
                )}


                {!loading && !shippingData && (
                    <span className="absolute inset-0 bg-[#77736b]" />
                )}


                {!loading && shippingData && (
                    <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-700 group-hover:scale-x-100" />
                )}

            </button>

            {/* FOOTER DETAIL */}
            <div className="mt-10 flex items-center justify-center gap-4">

                <span className="h-px w-10 bg-[#d1cbc1]" />

                <span className="text-[7px] uppercase tracking-[0.4em] text-[#aaa49a]">
                    LUXE MEN
                </span>

                <span className="h-px w-10 bg-[#d1cbc1]" />

            </div>

        </section>
    );
}
