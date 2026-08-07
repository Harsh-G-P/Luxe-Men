"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
    orderId: string;
    status: string;
    cancellationStatus: string;
};

export default function RequestCancellation({ orderId, status,cancellationStatus }: Props) {

    const [showForm, setShowForm] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const cannotCancel =
    status === "SHIPPED" ||
    status === "DELIVERED" ||
    status === "CANCELLED";

const alreadyRequested =
    cancellationStatus === "REQUESTED";

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/order/${orderId}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reason,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to submit cancellation request");
                return;
            }

            toast.success("Cancellation request submitted");

            setShowForm(false);
            setReason("");

        } catch {
            toast.error("Failed to submit cancellation request");
        } finally {
            setLoading(false);
        }
    };

    if (alreadyRequested) {
    return (
        <div className="border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
                <h2 className="text-sm uppercase tracking-[0.18em]">
                    Order Cancellation
                </h2>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Your cancellation request has been submitted.
                </p>
            </div>

            <div className="px-6 py-6">
                <div className="border border-amber-200 bg-amber-50 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.12em] text-amber-700">
                        Cancellation Requested
                    </p>

                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                        We've received your request. Our team will review it and
                        notify you once a decision has been made.
                    </p>
                </div>
            </div>
        </div>
    );
}

if (cannotCancel) {
    return (
        <div className="border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
                <h2 className="text-sm uppercase tracking-[0.18em]">
                    Order Cancellation
                </h2>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Cancellation is unavailable for this order.
                </p>
            </div>

            <div className="px-6 py-6">
                <div className="border border-neutral-200 bg-neutral-50 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                        Cancellation Unavailable
                    </p>

                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                        {status === "SHIPPED" &&
                            "This order has already been shipped and can no longer be cancelled."}

                        {status === "DELIVERED" &&
                            "This order has already been delivered and cannot be cancelled."}

                        {status === "CANCELLED" &&
                            "This order has already been cancelled."}
                    </p>
                </div>
            </div>
        </div>
    );
}

    return (<div className="border border-neutral-200 bg-white">

        <div className="border-b border-neutral-200 px-6 py-5">

            <div>
                <h2 className="text-sm uppercase tracking-[0.18em]">
                    Order Cancellation
                </h2>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Need to cancel this order? Submit a request and our team will review it.
                </p>
            </div>

        </div>

        <div className="px-6 py-6">

            {!showForm ? (
                <div>

                    <div className="border border-neutral-200 bg-neutral-50 px-5 py-4">

                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                            Cancellation Request
                        </p>

                        <p className="mt-2 text-xs leading-6 text-neutral-600">
                            Cancellation requests are reviewed by our team. Your order will
                            remain active until the request is approved.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="mt-5 w-full border border-red-800 py-3 text-xs uppercase tracking-[0.12em] text-red-800 transition hover:bg-red-900 hover:text-white"
                    >
                        Request Order Cancellation
                    </button>

                </div>
            ) : (
                <div>

                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                        Request Cancellation
                    </p>

                    <h3 className="mt-3 text-lg font-medium tracking-[0.04em]">
                        Are you sure you want to request cancellation?
                    </h3>

                    <p className="mt-3 text-xs leading-6 text-neutral-500">
                        This will send a cancellation request to our team. The order will
                        not be cancelled immediately.
                    </p>

                    <div className="mt-6">

                        <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
                            Reason
                        </label>

                        <textarea
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)}
                            placeholder="Tell us why you would like to cancel this order..."
                            rows={4}
                            disabled={loading}
                            className="w-full resize-none border border-neutral-200 bg-white px-4 py-3 text-xs leading-6 outline-none transition placeholder:text-neutral-400 focus:border-black"
                        />

                    </div>

                    <div className="mt-6 flex gap-3">

                        <button
                            type="button"
                            onClick={() => { setShowForm(false); setReason(""); }} disabled={loading}
                            className="flex-1 border border-neutral-300 py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-neutral-100"
                        >
                            Keep Order
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="flex-1 border border-red-800 bg-red-800 py-3 text-xs uppercase tracking-[0.12em] text-white transition hover:bg-red-900"
                        >
                            Submit Request
                        </button>

                    </div>

                </div>
            )}

        </div>

    </div>

    );
}
