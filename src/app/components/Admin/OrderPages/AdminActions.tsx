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
  refundStatus: "NONE" | "REQUESTED" | "REJECTED" | "REFUNDED";
  refundReason: string | null;
  refundRequestedAt: string | null;
  onUpdated: (data: {
    status: string;
    paymentStatus: string;
    cancellationStatus: "NONE" | "REQUESTED" | "REJECTED";
    refundStatus?: "NONE" | "REQUESTED" | "REJECTED" | "REFUNDED";
  }) => void;
};

export default function AdminActions({
  orderId,
  status,
  paymentStatus,
  cancellationStatus,
  cancellationReason,
  refundStatus,
  refundReason,
  refundRequestedAt,
  onUpdated,
}: Props) {

  const [orderStatus, setOrderStatus] = useState(status);
  const [payment, setPayment] = useState(paymentStatus);

  const [editStatus, setEditStatus] = useState(false);
  const [editPayment, setEditPayment] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentCancellationStatus, setCurrentCancellationStatus] =
    useState(cancellationStatus);

  const [currentRefundStatus, setCurrentRefundStatus] =
    useState(refundStatus);

  const isOrderLocked =
    orderStatus === "CANCELLED" ||
    orderStatus === "DELIVERED";

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

  const handleRefund = async (
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
              refundStatus: "REFUNDED",
            }
            : {
              refundStatus: "REJECTED",
            }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(
        action === "APPROVE"
          ? "Refund processed successfully"
          : "Refund request rejected"
      );

      setCurrentRefundStatus(data.data.refundStatus);
      setOrderStatus(data.data.status);
      setPayment(data.data.paymentStatus);
      setEditStatus(false);
      setEditPayment(false);

      onUpdated({
        status: data.data.status,
        paymentStatus: data.data.paymentStatus,
        cancellationStatus: data.data.cancellationStatus,
        refundStatus: data.data.refundStatus,
      });

      router.refresh();

    } catch {
      toast.error("Refund update failed");
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "44px",
      height: "44px",
      borderRadius: 0,
      border: state.isFocused
        ? "1px solid #9b8150"
        : "1px solid #d4cfc5",
      backgroundColor: "#faf9f6",
      boxShadow: "none",
      cursor: "pointer",
      paddingLeft: "8px",
      transition: "border-color 300ms ease",

      "&:hover": {
        borderColor: "#9b8150",
      },
    }),

    valueContainer: (base: any) => ({
      ...base,
      padding: "0 12px",
    }),

    placeholder: (base: any) => ({
      ...base,
      color: "#aaa49b",
      fontSize: "9px",
      textTransform: "uppercase",
      letterSpacing: "0.25em",
    }),

    singleValue: (base: any) => ({
      ...base,
      color: "#34312c",
      fontSize: "10px",
      letterSpacing: "0.08em",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (base: any, state: any) => ({
      ...base,
      color: "#9b8150",
      paddingRight: "16px",
      transition: "transform 300ms ease",

      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",

      "&:hover": {
        color: "#9b8150",
      },
    }),

    menu: (base: any) => ({
      ...base,
      marginTop: "4px",
      borderRadius: 0,
      border: "1px solid #d4cfc5",
      backgroundColor: "#faf9f6",
      boxShadow: "0 15px 35px rgba(28, 27, 24, 0.08)",
      overflow: "hidden",
      zIndex: 50,
    }),

    menuList: (base: any) => ({
      ...base,

      /*
       * Four options visible.
       * Additional options scroll vertically.
       */
      maxHeight: "135px",
      overflowY: "auto",
      padding: "6px 0",

      /* Firefox */
      scrollbarWidth: "thin",
      scrollbarColor: "#c8b78e transparent",

      /* Chrome / Edge / Safari */
      "&::-webkit-scrollbar": {
        width: "4px",
      },

      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },

      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c8b78e",
      },

      "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#9b8150",
      },
    }),

    option: (base: any, state: any) => ({
      ...base,

      minHeight: "41px",
      padding: "14px 18px",

      backgroundColor: state.isSelected
        ? "#f1eee7"
        : state.isFocused
          ? "#f5f2eb"
          : "#faf9f6",

      color: state.isSelected
        ? "#9b8150"
        : "#34312c",

      fontSize: "9px",
      lineHeight: "13px",
      letterSpacing: "0.16em",
      textTransform: "uppercase",

      cursor: "pointer",
      transition: "all 200ms ease",

      "&:active": {
        backgroundColor: "#eee9df",
      },
    }),
  };


  return (
    <div className="overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">

      {/* Header */}
      <div className="border-b border-[#eeece7] px-5 py-4 md:px-6">
        <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
          Admin / Order Management
        </p>

        <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
          Order Actions
        </h2>

        <p className="mt-1.5 max-w-xl text-[9px] leading-5 text-[#817d75]">
          Manage order fulfillment, payment records, and customer requests.
        </p>
      </div>

      <div className="space-y-6 px-5 py-5 md:px-6">

        {/* Order Status */}
        <div>
          <label className="mb-2 block text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Order Status
          </label>

          {!editStatus || isOrderLocked ? (
            <button
              type="button"
              onClick={() => {
                if (!isOrderLocked) {
                  setEditStatus(true);
                }
              }}
              disabled={isOrderLocked}
              className={`flex w-full items-center justify-between gap-3 border border-[#dedbd4] bg-[#fdfcf9] px-4 py-3.5 text-left transition-all duration-300 ${isOrderLocked
                  ? "cursor-not-allowed opacity-60"
                  : "hover:border-[#9a8a74]"
                }`}
            >
              <span className="text-[9px] uppercase tracking-[0.16em] text-[#34312c]">
                {orderStatus}
              </span>

              <span className="shrink-0 text-[8px] uppercase tracking-[0.2em] text-[#9a8a74]">
                {isOrderLocked ? "Locked" : "Edit"}
              </span>
            </button>
          ) : (
            <div>
              <Select
                instanceId="admin-order-status"
                autoFocus
                options={orderStatusOptions}
                styles={selectStyles}
                isSearchable={false}
                placeholder="Select order status"
                value={
                  orderStatusOptions.find(
                    (option) => option.value === orderStatus
                  ) ?? null
                }
                onChange={(option) =>
                  setOrderStatus(option?.value ?? "")
                }
              />

              <p className="mt-2 text-[8px] leading-4 text-[#aaa69e]">
                Select the next appropriate fulfillment status.
              </p>
            </div>
          )}
        </div>

        {/* Payment Status */}
        <div>
          <label className="mb-2 block text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Payment Status
          </label>

          {!editPayment ? (
            <button
              type="button"
              disabled={
                payment === "REFUNDED" ||
                orderStatus === "CANCELLED"
              }
              onClick={() => {
                if (
                  payment !== "REFUNDED" &&
                  orderStatus !== "CANCELLED"
                ) {
                  setEditPayment(true);
                }
              }}
              className={`flex w-full items-center justify-between gap-3 border border-[#dedbd4] bg-[#fdfcf9] px-4 py-3.5 text-left transition-all duration-300 ${payment === "REFUNDED" ||
                  orderStatus === "CANCELLED"
                  ? "cursor-not-allowed opacity-60"
                  : "hover:border-[#9a8a74]"
                }`}
            >
              <span className="text-[9px] uppercase tracking-[0.16em] text-[#34312c]">
                {payment}
              </span>

              <span className="shrink-0 text-[8px] uppercase tracking-[0.2em] text-[#9a8a74]">
                {payment === "REFUNDED" ||
                  orderStatus === "CANCELLED"
                  ? "Locked"
                  : "Edit"}
              </span>
            </button>
          ) : (
            <div>

              <Select
                instanceId="admin-payment-status"
                autoFocus
                options={paymentStatusOptions}
                styles={{
                  ...selectStyles,
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : undefined
                }
                menuPosition="fixed"
                isSearchable={false}
                placeholder="Select payment status"
                value={
                  paymentStatusOptions.find(
                    (option) => option.value === payment
                  ) ?? null
                }
                onChange={(option) =>
                  setPayment(option?.value ?? "")
                }
              />

              <p className="mt-2 text-[8px] leading-4 text-[#aaa69e]">
                Update the recorded payment status.
              </p>
            </div>
          )}
        </div>

        {/* Save / Cancel Changes */}
        {hasChanges && (
          <div className="flex gap-2.5 border-t border-[#eeece7] pt-5">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 border border-[#1b1a18] bg-[#1b1a18] py-3 text-[8px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-[#6f604e] hover:bg-[#6f604e] disabled:cursor-not-allowed disabled:opacity-50"
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
              disabled={loading}
              className="flex-1 border border-[#d9d5cd] bg-[#fdfcf9] py-3 text-[8px] uppercase tracking-[0.2em] text-[#57534c] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#6f604e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Discard Changes
            </button>
          </div>
        )}

        {/* Cancellation Request — Pending */}
        {currentCancellationStatus === "REQUESTED" && (
          <div className="border-t border-[#eeece7] pt-6">
            <div className="overflow-hidden border border-[#ddc8bf] bg-[#f8f2ee]">

              {/* Request Header */}
              <div className="border-b border-[#e8d8d0] px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.24em] text-[#9a6f63]">
                      Customer Request
                    </p>

                    <h3 className="mt-2 font-serif text-base font-normal tracking-[0.01em] text-[#1b1a18]">
                      Cancellation Review
                    </h3>
                  </div>

                  <span className="shrink-0 border border-[#ddc8bf] bg-[#fdfaf7] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.16em] text-[#9a6f63]">
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Request Reason */}
              <div className="px-5 py-5">
                <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                  Customer Reason
                </p>

                <div className="mt-3 border-l border-[#b78d7f] pl-3">
                  <p className="whitespace-pre-line wrap-break-word text-[10px] leading-5 text-[#57534c]">
                    {cancellationReason ||
                      "No reason was provided."}
                  </p>
                </div>

                <p className="mt-4 text-[9px] leading-5 text-[#817d75]">
                  Review the request carefully. Approving will
                  cancel the order.
                </p>
              </div>

              {/* Request Actions */}
              <div className="grid grid-cols-2 border-t border-[#e8d8d0]">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleCancellation("REJECT")}
                  className="border-r border-[#e8d8d0] px-3 py-4 text-[8px] uppercase tracking-[0.16em] text-[#57534c] transition-all duration-300 hover:bg-[#fdfaf7] hover:text-[#1b1a18] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Reject Request"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleCancellation("APPROVE")}
                  className="bg-[#8a6258] px-3 py-4 text-[8px] uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#745249] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Approve Cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Request — Rejected */}
        {currentCancellationStatus === "REJECTED" && (
          <div className="border-t border-[#eeece7] pt-6">
            <div className="border border-[#e2ded4] bg-[#faf9f6] px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                    Cancellation Request
                  </p>

                  <h3 className="mt-2 font-serif text-sm font-normal text-[#1b1a18]">
                    Request Rejected
                  </h3>
                </div>

                <span className="border border-[#d9d5cd] bg-[#fdfcf9] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.16em] text-[#817d75]">
                  Rejected
                </span>
              </div>

              <p className="mt-4 text-[9px] leading-5 text-[#817d75]">
                The cancellation request has been rejected. The
                order remains active.
              </p>
            </div>
          </div>
        )}

        {/* Refund Request — Pending */}
        {currentRefundStatus === "REQUESTED" && (
          <div className="border-t border-[#eeece7] pt-6">
            <div className="overflow-hidden border border-[#e2ded4] bg-[#faf9f6]">

              {/* Refund Header */}
              <div className="border-b border-[#e2ded4] px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]">
                      Customer Request
                    </p>

                    <h3 className="mt-2 font-serif text-base font-normal tracking-[0.01em] text-[#1b1a18]">
                      Refund Review
                    </h3>
                  </div>

                  <span className="shrink-0 border border-[#d9d0bd] bg-[#fdfcf9] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.16em] text-[#9a8060]">
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Refund Reason */}
              <div className="px-5 py-5">
                <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                  Customer Reason
                </p>

                <div className="mt-3 border-l border-[#9a8a74] pl-3">
                  <p className="whitespace-pre-line wrap-break-word text-[10px] leading-5 text-[#57534c]">
                    {refundReason || "No reason provided."}
                  </p>
                </div>

                {refundRequestedAt && (
                  <p className="mt-4 text-[9px] leading-5 text-[#aaa69e]">
                    Requested on{" "}
                    {new Date(
                      refundRequestedAt
                    ).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Refund Actions */}
              <div className="grid grid-cols-2 border-t border-[#e2ded4]">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleRefund("REJECT")}
                  className="border-r border-[#e2ded4] px-3 py-4 text-[8px] uppercase tracking-[0.16em] text-[#57534c] transition-all duration-300 hover:bg-white hover:text-[#1b1a18] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Reject Refund"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleRefund("APPROVE")}
                  className="bg-[#1b1a18] px-3 py-4 text-[8px] uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#6f604e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Approve Refund"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}