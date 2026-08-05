"use client";

const steps = [
  {
    key: "PENDING",
    title: "Order Placed",
    description: "Customer successfully placed the order.",
  },
  {
    key: "CONFIRMED",
    title: "Order Confirmed",
    description: "Payment verified and order accepted.",
  },
  {
    key: "PROCESSING",
    title: "Processing",
    description: "Items are being prepared for shipment.",
  },
  {
    key: "SHIPPED",
    title: "Shipped",
    description: "Order has left the warehouse.",
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    description: "Customer received the order.",
  },
];

type Props = {
  status: string;
};

export default function AdminOrderTimeline({ status }: Props) {
  const currentStep = steps.findIndex((step) => step.key === status);

  return (
    <div className="border border-neutral-200 bg-white">

      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">

        <div>
          <h2 className="text-sm uppercase tracking-[0.18em]">
            Fulfillment Timeline
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            Current progress of this order.
          </p>
        </div>

        <span className="rounded-full border border-black px-3 py-1 text-[11px] uppercase tracking-[0.12em]">
          {status}
        </span>

      </div>

      <div className="px-6 py-7">

        <div className="space-y-8">

          {steps.map((step, index) => {
            const completed = index < currentStep;
            const active = index === currentStep;

            return (
              <div
                key={step.key}
                className="relative flex gap-5"
              >
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute left-[11px] top-7 h-14 w-px ${
                      completed
                        ? "bg-black"
                        : "bg-neutral-300"
                    }`}
                  />
                )}

                <div
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    completed
                      ? "border-black bg-black text-white"
                      : active
                      ? "border-black bg-white"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {completed ? (
                    <span className="text-[10px]">✓</span>
                  ) : (
                    <span
                      className={`h-2 w-2 rounded-full ${
                        active
                          ? "bg-black"
                          : "bg-neutral-300"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <h3
                      className={`text-sm tracking-[0.05em] ${
                        completed || active
                          ? "font-semibold text-black"
                          : "text-neutral-400"
                      }`}
                    >
                      {step.title}
                    </h3>

                    {completed && (
                      <span className="text-[11px] uppercase tracking-[0.08em] text-green-600">
                        Completed
                      </span>
                    )}

                    {active && (
                      <span className="text-[11px] uppercase tracking-[0.08em] text-blue-600">
                        Current
                      </span>
                    )}

                  </div>

                  <p className="mt-2 text-xs leading-6 text-neutral-500">
                    {step.description}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}