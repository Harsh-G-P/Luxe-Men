"use client"

type Props = {
    paymentMethod: string;
    setPaymentMethod: any;
}

export default function PaymentStep({ paymentMethod,
    setPaymentMethod }: Props) {
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
                    className={`flex cursor-pointer items-center gap-5 border p-8 transition ${paymentMethod === "Cash"
                        ? "border-black"
                        : "border-neutral-300"
                        }`}
                >
                    <input
                        type="radio"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("Cash")}
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
                    className={`flex cursor-pointer items-center gap-5 border p-8 transition ${paymentMethod === "Online"
                        ? "border-black"
                        : "border-neutral-300"
                        }`}
                >
                    <input
                        type="radio"
                        checked={paymentMethod === "Online"}
                        onChange={() => setPaymentMethod("Online")}
                        className="h-4 w-4 accent-black"
                    />

                    <div>
                        <h3 className="text-sm">Online Payment</h3>

                        <p className="text-xs text-neutral-500">
                            Pay securely using PayPal, Credit Card, Debit Card, or UPI.
                        </p>
                    </div>
                </label>
            </div>

            {/* Online Details */}
            {paymentMethod === "Online" && (
                <div className="mt-8 border border-neutral-300 p-8">
                    <p className="text-sm text-neutral-600">
                        You will be redirected to the secure payment gateway after clicking
                        <strong> Place Order</strong>.
                    </p>
                </div>
            )}

            <button
                type="button"
                className="mt-10 h-13 bg-black px-10 text-[13px] uppercase tracking-[0.08em] text-white transition hover:bg-neutral-800"
            >
                Place Order
            </button>


        </section>
    );
}