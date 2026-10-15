
"use client";

const steps = [
  {
    key: "PENDING",
    title: "Order Placed",
    description: "Customer has placed a new order.",
  },
  {
    key: "CONFIRMED",
    title: "Order Confirmed",
    description: "The order has been confirmed.",
  },
  {
    key: "PROCESSING",
    title: "Processing",
    description: "Items are being prepared for shipment.",
  },
  {
    key: "SHIPPED",
    title: "Shipped",
    description: "The order has been dispatched.",
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    description: "The order has been successfully delivered.",
  },
];

type Props = {
  status: string;
};

export default function AdminOrderTimeline({ status }: Props) {
  const isCancelled = status === "CANCELLED";

  const currentStep = steps.findIndex((step) => step.key === status);

  return (
    <div className="overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">
      {/* Header */}
      <div className="border-b border-[#eeece7] px-5 py-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
              Admin / Order Management
            </p>

            <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
              Order Timeline
            </h2>
          </div>

          <span
            className={`shrink-0 text-[8px] uppercase tracking-[0.22em] ${
              isCancelled ? "text-[#9a6f63]" : "text-[#aaa69e]"
            }`}
          >
            {isCancelled
              ? "Cancelled"
              : currentStep >= 0
                ? `${String(currentStep + 1).padStart(2, "0")} / ${String(
                    steps.length
                  ).padStart(2, "0")}`
                : "Unknown Status"}
          </span>
        </div>
      </div>

      {/* Cancelled State */}
      {isCancelled ? (
        <div className="px-5 py-6 md:px-6">
          <div className="flex items-start gap-4">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#9a6f63]">
              <span className="h-px w-2 bg-[#9a6f63]" />
            </div>

            <div className="min-w-0">
              <p className="font-serif text-[14px] text-[#1b1a18]">
                Order Cancelled
              </p>

              <p className="mt-1 text-[9px] leading-5 text-[#817d75]">
                This order was cancelled and will not proceed through fulfillment.
              </p>

              <div className="mt-3 h-px w-8 bg-[#d9d5cd]" />
            </div>
          </div>
        </div>
      ) : currentStep === -1 ? (
        <div className="px-5 py-6 md:px-6">
          <p className="font-serif text-[14px] text-[#1b1a18]">
            Unrecognized Order Status
          </p>

          <p className="mt-1 text-[9px] leading-5 text-[#817d75]">
            Current status: {status}. Check the order record for valid status information.
          </p>
        </div>
      ) : (
        /* Timeline */
        <div className="px-5 py-5 md:px-6">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const completed = index < currentStep;
              const active = index === currentStep;

              return (
                <div key={step.key} className="group relative flex gap-4">
                  {/* Connecting Line */}
                  {index !== steps.length - 1 && (
                    <div
                      className={`absolute left-2.25 top-6 h-[calc(100%+1.5rem)] w-px transition-colors duration-500 ${
                        completed ? "bg-[#9a8a74]" : "bg-[#dedbd4]"
                      }`}
                    />
                  )}

                  {/* Indicator */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-500 ${
                        completed
                          ? "border-[#1b1a18] bg-[#1b1a18]"
                          : active
                            ? "border-[#9a8a74] bg-[#fdfcf9]"
                            : "border-[#d9d5cd] bg-[#fdfcf9]"
                      }`}
                    >
                      {completed ? (
                        <svg
                          viewBox="0 0 12 12"
                          className="h-2.5 w-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            d="M2.5 6.2 5 8.5 9.5 3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <span
                          className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                            active ? "bg-[#9a8a74]" : "bg-[#d9d5cd]"
                          }`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="-mt-0.5 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`font-serif text-[14px] font-normal tracking-[0.01em] transition-colors duration-300 ${
                            completed || active
                              ? "text-[#1b1a18]"
                              : "text-[#aaa69e]"
                          }`}
                        >
                          {step.title}
                        </p>

                        <p
                          className={`mt-0.5 text-[9px] leading-5 transition-colors duration-300 ${
                            active ? "text-[#817d75]" : "text-[#aaa69e]"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>

                      {/* Current Status Label */}
                      {active && (
                        <span className="mt-0.5 shrink-0 text-[7px] uppercase tracking-[0.22em] text-[#9a8a74]">
                          Current Status
                        </span>
                      )}
                    </div>

                    {/* Active Accent */}
                    {active && (
                      <div className="mt-2 h-px w-8 bg-[#d9d5cd] transition-all duration-500 group-hover:w-12 group-hover:bg-[#9a8a74]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
