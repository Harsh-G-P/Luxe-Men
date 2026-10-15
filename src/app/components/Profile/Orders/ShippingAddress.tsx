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
    <div
      className=" overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]"
    >
      
      {/* Header */}
      <div className="border-b border-[#eeece7] px-5 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
              Delivery Details
            </p>

            <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
              Shipping Address
            </h2>
          </div>

          <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            Address
          </span>
        </div>
      </div>

      {/* Address */}
      <div className="px-5 py-5 md:px-6">
        <div className="space-y-4">
          
          {/* Customer */}
          <div>
            <p className="font-serif text-[15px] font-normal tracking-[0.01em] text-[#1b1a18]">
              {address.fullname}
            </p>

            {/* Phone */}
            <div className="group mt-1.5 flex items-center gap-2">
              <p className="text-[9px] uppercase tracking-[0.14em] text-[#817d75]">
                {address.countryCode} {address.phone}
              </p>

              <button
                type="button"
                onClick={handleCopyPhone}
                className=" opacity-0 transition-all duration-300 group-hover:opacity-100"
                title={copiedPhone ? "Copied!" : "Copy phone number"}
              >
                {copiedPhone ? (
                  <Check className="h-3 w-3 text-[#9a8a74]" />
                ) : (
                  <Copy className="h-3 w-3 text-[#aaa69e] transition-colors hover:text-[#6f604e]" />
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#eeece7]" />

          {/* Address Details */}
          <div className="space-y-0.5 text-[10px] leading-5 text-[#57534c]">
            <p>{address.addressLine}</p>

            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>

            <p className="text-[#817d75]">{address.country}</p>
          </div>

        </div>
      </div>
      
    </div>
  );
}