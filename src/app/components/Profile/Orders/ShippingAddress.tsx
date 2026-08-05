"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Address = {
  fullname: string;
  phone: string;
  addressLine: string;
  countryCode: string
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Props = {
  address: Address;
};

export default function ShippingAddress({ address }: Props) {

  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = async () => {
    await navigator.clipboard.writeText(
      `${address.countryCode} ${address.phone}`
    );

    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 1500);
  };
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
            {address.fullname}
          </p>

          <div className="group mt-1 flex items-center gap-2">
            <p className="block text-xs text-neutral-500">
              {address.countryCode} {address.phone}
            </p>

            <button
              type="button"
              onClick={handleCopyPhone}
              className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              title={copiedPhone ? "Copied!" : "Copy phone number"}
            >
              {copiedPhone ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-neutral-400 hover:text-black" />
              )}
            </button>
          </div>

        </div>

        <div className="space-y-1 text-xs leading-5 text-neutral-600">

          <p>{address.addressLine}</p>

          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>

          <p>{address.country}</p>
        </div>

      </div>

    </div>
  );
}