"use client";

export default function ShippingAddress() {
  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">

        <h2 className="text-sm uppercase tracking-[0.18em]">
          Shipping Address
        </h2>

      </div>

      <div className="space-y-4 px-6 py-6">

        <div>

          <p className=" font-medium">
            Saiki Kusuo
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            +91 98765 43210
          </p>

        </div>

        <div className="space-y-1 text-xs leading-5 text-neutral-600">

          <p>
            302, Shree Residency
          </p>

          <p>
            Satellite Road
          </p>

          <p>
            Ahmedabad, Gujarat
          </p>

          <p>
            380015
          </p>

          <p>
            India
          </p>

        </div>

      </div>

    </div>
  );
}