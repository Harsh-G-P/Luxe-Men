"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  orderId: string;
  status: string;
  cancellationStatus: string;
};

export default function RequestCancellation({ orderId, status, cancellationStatus }: Props) {

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
      <div className="overflow-hidden border border-[#eeece7] bg-[#fdfcf9]">
        {/* Header */}
        <div className="border-b border-[#eeece7] px-5 py-4 md:px-6">
          <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
            Order Options
          </p>

          <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
            Order Cancellation
          </h2>

          <p className="mt-1.5 text-[9px] leading-5 text-[#817d75]">
            Your cancellation request has been submitted.
          </p>
        </div>

        {/* Status */}
        <div className="px-5 py-5 md:px-6">
          <div className="border-l border-[#b39a73] bg-[#faf9f6] px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b39a73]" />

              <p className="text-[8px] uppercase tracking-[0.22em] text-[#8c7656]">
                Cancellation Requested
              </p>
            </div>

            <p className="mt-2.5 text-[10px] leading-5 text-[#57534c]">
              We've received your request. Our team will review it and notify
              you once a decision has been made.
            </p>

            <div className="mt-3 h-px w-8 bg-[#d9d5cd]" />
          </div>
        </div>
      </div>
    );
  }

  if (cannotCancel) {
    return (
      <div className="overflow-hidden border border-[#eeece7] bg-[#fdfcf9]">
        {/* Header */}
        <div className="border-b border-[#eeece7] px-5 py-4 md:px-6">
          <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
            Order Options
          </p>

          <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
            Order Cancellation
          </h2>

          <p className="mt-1.5 text-[9px] leading-5 text-[#817d75]">
            Cancellation is unavailable for this order.
          </p>
        </div>

        {/* Status */}
        <div className="px-5 py-5 md:px-6">
          <div className="border-l border-[#b9b3aa] bg-[#faf9f6] px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9b958c]" />

              <p className="text-[8px] uppercase tracking-[0.22em] text-[#817d75]">
                Cancellation Unavailable
              </p>
            </div>

            <p className="mt-2.5 text-[10px] leading-5 text-[#57534c]">
              {status === "SHIPPED" &&
                "This order has already been shipped and can no longer be cancelled."}

              {status === "DELIVERED" &&
                "This order has already been delivered and cannot be cancelled."}

              {status === "CANCELLED" &&
                "This order has already been cancelled."}
            </p>

            <div className="mt-3 h-px w-8 bg-[#d9d5cd]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className=" overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]"
    >
      
      {/* Header */}
      <div className="border-b border-[#eeece7] px-5 py-4 md:px-6">
        <div>
          <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
            Order Options
          </p>

          <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
            Order Cancellation
          </h2>

          <p className="mt-1.5 max-w-xl text-[9px] leading-5 text-[#817d75]">
            Need to cancel this order? Submit a request and our team will review
            it.
          </p>
        </div>
      </div>

      <div className="px-5 py-5 md:px-6">
        {!showForm ? (
          <div>
            
            {/* Information */}
            <div className="border-l border-[#d9d5cd] bg-[#faf9f6] px-4 py-3.5">
              <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                Cancellation Request
              </p>

              <p className="mt-1.5 text-[9px] leading-5 text-[#57534c]">
                Cancellation requests are reviewed by our team. Your order will
                remain active until the request is approved.
              </p>
            </div>

            {/* Request Button */}
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className=" group mt-4 flex w-full items-center justify-center gap-2 border border-[#9a6f63] py-3 text-[8px] uppercase tracking-[0.2em] text-[#8a6258] transition-all duration-500 hover:bg-[#8a6258] hover:text-white"
            >
              Request Order Cancellation

              <span className="h-px w-4 bg-current transition-all duration-500 group-hover:w-6" />
            </button>

          </div>
        ) : (
          <div>

            {/* Form Header */}
            <div>
              <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                Request Cancellation
              </p>

              <h3 className="mt-2 font-serif text-[17px] font-normal tracking-[0.01em] text-[#1b1a18]">
                Are you sure you want to request cancellation?
              </h3>

              <p className="mt-1.5 text-[9px] leading-5 text-[#817d75]">
                This will send a cancellation request to our team. The order
                will not be cancelled immediately.
              </p>
            </div>

            {/* Reason */}
            <div className="mt-5">
              <label className="mb-2 block text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                Reason
              </label>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us why you would like to cancel this order..."
                rows={4}
                disabled={loading}
                className=" w-full resize-none border border-[#dedbd4] bg-[#fdfcf9] px-4 py-3 text-[10px] leading-5 text-[#57534c] outline-none transition-all duration-300 placeholder:text-[#aaa69e] focus:border-[#9a8a74]"
              />
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setReason("");
                }}
                disabled={loading}
                className=" flex-1 border border-[#d9d5cd] py-3 text-[8px] uppercase tracking-[0.2em] text-[#57534c] transition-all duration-500 hover:border-[#9a8a74] hover:text-[#6f604e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Order
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className=" flex-1 border border-[#8a6258] bg-[#8a6258] py-3 text-[8px] uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-[#745249] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
