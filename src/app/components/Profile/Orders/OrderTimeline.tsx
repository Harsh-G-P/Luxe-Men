"use client";

const steps = [
  {
    key: "PENDING",
    title: "Order Placed",
    description: "We've received your order.",
  },
  {
    key: "CONFIRMED",
    title: "Confirmed",
    description: "Your order has been confirmed.",
  },
  {
    key: "PROCESSING",
    title: "Preparing",
    description: "We're preparing your items.",
  },
  {
    key: "SHIPPED",
    title: "Shipped",
    description: "Your package is on the way.",
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    description: "Your order has been delivered.",
  },
];

type Props = {
  status: string;
};

export default function OrderTimeline({ status }: Props) {
  const currentStep = steps.findIndex((step) => step.key === status);

  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">

        <h2 className="text-sm uppercase tracking-[0.18em]">
          Track Your Order
        </h2>

        <p className="mt-1 text-xs text-neutral-500">
          Follow your order from purchase to delivery.
        </p>

      </div>

      <div className="px-6 py-6">

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
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
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

                <div>

                  <p
                    className={`text-sm ${
                      completed || active
                        ? "font-medium text-black"
                        : "text-neutral-400"
                    }`}
                  >
                    {step.title}
                  </p>

                  <p className="mt-1 text-xs leading-6 text-neutral-500">
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