"use client";

import { useState } from "react";
import Select from "react-select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const orderStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const paymentStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "46px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#000" : "#e5e7eb",
    boxShadow: "none",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

type Props = {
  orderId: string;
  status: string;
  paymentStatus: string;
  cancellationStatus: "NONE" | "REQUESTED" | "REJECTED";
  cancellationReason: string | null;
  onUpdated: (data: {
    status: string;
    paymentStatus: string;
    cancellationStatus: "NONE" | "REQUESTED" | "REJECTED";
  }) => void;
};

export default function AdminActions({
  orderId,
  status,
  paymentStatus,
  cancellationStatus,
  cancellationReason,
  onUpdated,
}: Props) {

  const [orderStatus, setOrderStatus] = useState(status);
  const [payment, setPayment] = useState(paymentStatus);

  const [editStatus, setEditStatus] = useState(false);
  const [editPayment, setEditPayment] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentCancellationStatus, setCurrentCancellationStatus] =
    useState(cancellationStatus);

  const router = useRouter();


  const hasChanges =
    orderStatus !== status ||
    payment !== paymentStatus;


  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: orderStatus,
          paymentStatus: payment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);

        setOrderStatus(status);
        setPayment(paymentStatus);

        setEditStatus(false);
        setEditPayment(false);

        return;
      }

      toast.success("Order updated");

      onUpdated({
        status: data.data.status,
        paymentStatus: data.data.paymentStatus,
        cancellationStatus: data.data.cancellationStatus,
      });

      setEditStatus(false);
      setEditPayment(false);

      router.refresh();

    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancellation = async (
    action: "APPROVE" | "REJECT"
  ) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          action === "APPROVE"
            ? {
              status: "CANCELLED",
              cancellationStatus: "NONE",
            }
            : {
              cancellationStatus: "REJECTED",
            }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update cancellation request");
        return;
      }

      toast.success(
        action === "APPROVE"
          ? "Order cancellation approved"
          : "Cancellation request rejected"
      );

      onUpdated({
        status: data.data.status,
        paymentStatus: data.data.paymentStatus,
        cancellationStatus: data.data.cancellationStatus,
      });

      setOrderStatus(data.data.status);
      setPayment(data.data.paymentStatus);
      setCurrentCancellationStatus(data.data.cancellationStatus);

      router.refresh();
    } catch {
      toast.error("Failed to update cancellation request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">
        <h2 className="text-sm uppercase tracking-[0.18em]">
          Admin Actions
        </h2>
      </div>


      <div className="space-y-6 px-6 py-6">


        {/* Order Status */}

        <div>

          <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
            Order Status
          </label>


          {!editStatus ? (
            <button
              onClick={() => setEditStatus(true)}
              className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-800">
                {orderStatus}
              </span>

              <span className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                Edit
              </span>
            </button>
          ) : (
            <Select
              autoFocus
              styles={selectStyles}
              options={orderStatusOptions}
              value={orderStatusOptions.find(
                (x) => x.value === orderStatus
              )}
              onChange={(option) =>
                setOrderStatus(option?.value || "")
              }
            />
          )}

        </div>



        {/* Payment Status */}

        <div>

          <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
            Payment Status
          </label>


          {!editPayment ? (
            <button
              onClick={() => setEditPayment(true)}
              className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-800">
                {payment}
              </span>
              <span className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                Edit
              </span>
            </button>
          ) : (
            <Select
              autoFocus
              styles={selectStyles}
              options={paymentStatusOptions}
              value={paymentStatusOptions.find(
                (x) => x.value === payment
              )}
              onChange={(option) =>
                setPayment(option?.value || "")
              }
            />
          )}

        </div>



        {hasChanges && (
          <div className="flex gap-3">

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 border border-black py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-black hover:text-white disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>


            <button
              type="button"
              onClick={() => {
                setOrderStatus(status);
                setPayment(paymentStatus);

                setEditStatus(false);
                setEditPayment(false);
              }}
              className="flex-1 border border-neutral-300 py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-neutral-100"
            >
              Cancel
            </button>

          </div>
        )}

        {/* Cancellation Request */}

        {currentCancellationStatus === "REQUESTED" && (
          <div className="border-t border-neutral-200 pt-6">

            <div className="border border-red-200 bg-red-50/40">

              {/* Header */}
              <div className="border-b border-red-200 px-5 py-5">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-red-700">
                      Customer Request
                    </p>

                    <h3 className="mt-2 text-sm font-medium uppercase tracking-[0.08em] text-neutral-900">
                      Cancellation Requested
                    </h3>
                  </div>

                  <span className="shrink-0 border border-red-200 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-red-700">
                    Pending Review
                  </span>

                </div>

              </div>

              {/* Reason */}
              <div className="px-5 py-5">

                <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                  Customer Reason
                </p>

                <div className="mt-3 border-l-2 border-red-700 pl-4">

                  <p className="text-xs leading-6 text-neutral-600">
                    {cancellationReason || "No reason was provided."}
                  </p>

                </div>

                <p className="mt-5 text-[11px] leading-5 text-neutral-400">
                  Review the request before taking action. Approving the request will
                  permanently cancel this order.
                </p>

              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 border-t border-red-200">

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleCancellation("REJECT")}
                  className="border-r border-red-200 px-4 py-4 text-[10px] uppercase tracking-[0.16em] text-neutral-600 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Reject Request"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleCancellation("APPROVE")}
                  className="bg-red-800 px-4 py-4 text-[10px] uppercase tracking-[0.16em] text-white transition hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Approve Cancellation"}
                </button>

              </div>

            </div>

          </div>
        )}

        {currentCancellationStatus === "REJECTED" && (
          <div className="border-t border-neutral-200 pt-6">

            <div className="border border-neutral-200 bg-neutral-50 px-5 py-5">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    Cancellation Request
                  </p>

                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-neutral-700">
                    Request Rejected
                  </p>
                </div>

                <span className="border border-neutral-200 bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                  Rejected
                </span>

              </div>

              <p className="mt-4 text-[11px] leading-5 text-neutral-400">
                The customer's cancellation request has been rejected. The order
                remains active.
              </p>

            </div>

          </div>
        )}


      </div>

    </div>
  );
}