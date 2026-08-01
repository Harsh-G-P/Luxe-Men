"use client"

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
                    data.message ||
                    "Unable to complete checkout."
                );
                return;
            }

            if (paymentMethod === "STRIPE") {
                window.location.href = data.data.url;
                return;
            }

            window.dispatchEvent(new Event("cartUpdated"));

            router.push(`/checkout/success?order=${data.data.orderNumber}`);
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
        <section className="mt-14">

            <div className="mb-8 flex items-center gap-5">

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black">
                    3
                </div>

                <h2 className="text-2xl uppercase tracking-[0.18em]">
                    Payment
                </h2>

            </div>


            <div className="space-y-6">
                {/* Cash */}
                <label
                    className={`flex cursor-pointer items-center gap-5 border p-8 transition ${paymentMethod === "COD"
                        ? "border-black"
                        : "border-neutral-300"
                        }`}
                >
                    <input
                        type="radio"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="h-4 w-4 accent-black"
                    />

                    <div>
                        <h3 className="text-xs">Cash on Delivery</h3>

                        <p className="text-sm text-neutral-500">
                            Pay with cash when your order is delivered.
                        </p>
                    </div>
                </label>

                {/* Online */}
                <label
                    className={`flex cursor-pointer items-center gap-5 border p-8 transition ${paymentMethod === "STRIPE"
                        ? "border-black"
                        : "border-neutral-300"
                        }`}
                >
                    <input
                        type="radio"
                        checked={paymentMethod === "STRIPE"}
                        onChange={() => setPaymentMethod("STRIPE")}
                        className="h-4 w-4 accent-black"
                    />

                    <div>
                        <h3 className="text-sm">Online Payment</h3>

                        <p className="text-xs text-neutral-500">
                            Pay securely using your preferred payment method through Stripe.
                        </p>
                    </div>
                </label>
            </div>

            {/* Online Details */}
            {paymentMethod === "STRIPE" && (
                <div className="mt-8 border border-neutral-300 p-8">
                    <p className="text-sm text-neutral-600">
                        You will be redirected to the secure payment gateway after clicking
                        <strong> Place Order</strong>.
                    </p>
                </div>
            )}

            <button
                type="button"
                disabled={loading || !shippingData}
                onClick={handlePlaceOrder}
                className={`mt-10 h-13 px-10 text-[13px] uppercase tracking-[0.08em] text-white transition ${loading
                        ? "cursor-not-allowed bg-neutral-500"
                        : "bg-black hover:bg-neutral-800"
                    }`}
            >
                {
                    loading
                        ? paymentMethod === "STRIPE"
                            ? "Redirecting to Stripe..."
                            : "Placing Order..."
                        : "Place Order"
                }
            </button>


        </section>
    );
}