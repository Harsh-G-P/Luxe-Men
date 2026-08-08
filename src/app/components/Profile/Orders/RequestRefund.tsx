"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
    orderId: string;
    status: string;
    paymentStatus: string;
    refundStatus: string;
};

export default function RequestRefund({
    orderId,
    status,
    paymentStatus,
    refundStatus,
}: Props) {
    const [showForm, setShowForm] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const isPending = refundStatus === "REQUESTED";
    const isRefunded =
        refundStatus === "REFUNDED" ||
        paymentStatus === "REFUNDED";

    const isCancelled = status === "CANCELLED";

    const notPaid = paymentStatus !== "PAID";

    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast.error("Please provide a refund reason");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`/api/order/${orderId}/refund`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refundReason: reason,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(
                    data.message || "Failed to submit refund request"
                );
                return;
            }

            toast.success("Refund request submitted");

            setShowForm(false);
            setReason("");
            

        } catch {
            toast.error("Failed to submit refund request");
        } finally {
            setLoading(false);
        }
    };

    if (!isCancelled) {
        return null;
    }

    if (isPending) {
        return (
            <div className="border border-neutral-200 bg-white">

                <div className="border-b border-neutral-200 px-6 py-5">
                    <h2 className="text-sm uppercase tracking-[0.18em]">
                        Order Refund
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Your refund request has been submitted.
                    </p>
                </div>

                <div className="px-6 py-6">
                    <div className="border border-amber-200 bg-amber-50 px-5 py-5">

                        <p className="text-xs uppercase tracking-[0.12em] text-amber-700">
                            Refund Requested
                        </p>

                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                            We've received your refund request. Our team will
                            review it and notify you once a decision has been made.
                        </p>

                    </div>
                </div>

            </div>
        );
    }

    if (isRefunded) {
        return (
            <div className="border border-neutral-200 bg-white">

                <div className="border-b border-neutral-200 px-6 py-5">
                    <h2 className="text-sm uppercase tracking-[0.18em]">
                        Order Refund
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Your refund has been processed.
                    </p>
                </div>

                <div className="px-6 py-6">
                    <div className="border border-green-200 bg-green-50 px-5 py-5">

                        <p className="text-xs uppercase tracking-[0.12em] text-green-700">
                            Refund Processed
                        </p>

                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                            Your refund has been successfully processed.
                        </p>

                    </div>
                </div>

            </div>
        );
    }

    if (notPaid) {
        return (
            <div className="border border-neutral-200 bg-white">

                <div className="border-b border-neutral-200 px-6 py-5">
                    <h2 className="text-sm uppercase tracking-[0.18em]">
                        Order Refund
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Refund is unavailable for this order.
                    </p>
                </div>

                <div className="px-6 py-6">
                    <div className="border border-neutral-200 bg-neutral-50 px-5 py-5">

                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                            Refund Unavailable
                        </p>

                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                            This cancelled order was not paid, so a refund cannot be requested.
                        </p>

                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="border border-neutral-200 bg-white">

            <div className="border-b border-neutral-200 px-6 py-5">

                <h2 className="text-sm uppercase tracking-[0.18em]">
                    Order Refund
                </h2>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Need a refund? Submit a request and our team will review it.
                </p>

            </div>

            <div className="px-6 py-6">

                {!showForm ? (
                    <div>

                        <div className="border border-neutral-200 bg-neutral-50 px-5 py-4">

                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                                Refund Request
                            </p>

                            <p className="mt-2 text-xs leading-6 text-neutral-600">
                                Refund requests are reviewed by our team.
                                Your refund will not be processed immediately.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                            className="mt-5 w-full border border-red-800 py-3 text-xs uppercase tracking-[0.12em] text-red-800 transition hover:bg-red-900 hover:text-white"
                        >
                            Request Order Refund
                        </button>

                    </div>
                ) : (
                    <div>

                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                            Request Refund
                        </p>

                        <h3 className="mt-3 text-lg font-medium tracking-[0.04em]">
                            Are you sure you want to request a refund?
                        </h3>

                        <p className="mt-3 text-xs leading-6 text-neutral-500">
                            This will send a refund request to our team.
                            The refund will not be processed immediately.
                        </p>

                        <div className="mt-6">

                            <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
                                Reason
                            </label>

                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Tell us why you would like a refund..."
                                rows={4}
                                disabled={loading}
                                className="w-full resize-none border border-neutral-200 bg-white px-4 py-3 text-xs leading-6 outline-none transition placeholder:text-neutral-400 focus:border-black"
                            />

                        </div>

                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setReason("");
                                }}
                                disabled={loading}
                                className="flex-1 border border-neutral-300 py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-neutral-100"
                            >
                                Keep Order
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 border border-red-800 bg-red-800 py-3 text-xs uppercase tracking-[0.12em] text-white transition hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Request"}
                            </button>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}