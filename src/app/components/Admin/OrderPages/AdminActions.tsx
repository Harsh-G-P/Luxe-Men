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
  onUpdated: (data: {
    status: string;
    paymentStatus: string;
  }) => void;
};

export default function AdminActions({
  orderId,
  status,
  paymentStatus,
  onUpdated,
}: Props) {

  const [orderStatus, setOrderStatus] = useState(status);
  const [payment, setPayment] = useState(paymentStatus);

  const [editStatus, setEditStatus] = useState(false);
  const [editPayment, setEditPayment] = useState(false);

  const [loading, setLoading] = useState(false);

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
        status: orderStatus,
        paymentStatus: payment,
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


      </div>

    </div>
  );
}