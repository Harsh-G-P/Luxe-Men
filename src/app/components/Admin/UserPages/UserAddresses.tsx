
"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Address = {
  id: string;
  fullname: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  countryCode: string;
};

type Props = {
  addresses: Address[];
};

function AddressCard({ address }: { address: Address }) {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = async () => {
    await navigator.clipboard.writeText(
      `${address.countryCode} ${address.phone}`
    );

    setCopiedPhone(true);

    setTimeout(() => {
      setCopiedPhone(false);
    }, 1500);
  };


  return (
    <div className="group border border-[#e2ded4] bg-[#f5f4ef] p-4 transition-all duration-300 hover:border-[#c8bb94] hover:bg-[#fdfcf9] hover:shadow-[0_10px_30px_rgba(45,40,30,0.05)] sm:p-5">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-lg font-normal text-[#272522]">
            {address.fullname}
          </p>

          {/* PHONE */}
          <div className="mt-2 flex items-center gap-2">
            <p className="text-[10px] tracking-wide text-[#817d75]">
              {address.countryCode} {address.phone}
            </p>

            <button
              type="button"
              onClick={handleCopyPhone}
              className="shrink-0 opacity-60 transition-opacity duration-200 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              title={copiedPhone ? "Copied!" : "Copy phone number"}
              aria-label={
                copiedPhone
                  ? "Phone number copied"
                  : "Copy phone number"
              }
            >
              {copiedPhone ? (
                <Check className="h-3.5 w-3.5 text-[#7d8b69]" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-[#99948b] transition-colors hover:text-[#272522]" />
              )}
            </button>
          </div>
        </div>

        {/* STATUS */}
        <span className="shrink-0 border border-[#dedbd4] bg-[#faf9f6] px-2.5 py-1 text-[7px] uppercase tracking-[0.2em] text-[#9b8150]">
          Saved
        </span>
      </div>

      {/* ADDRESS DETAILS */}
      <div className="mt-5 space-y-1 border-t border-[#dedbd4] pt-4 text-[10px] leading-5 text-[#817d75]">
        <p className="text-[#57534c]">
          {address.addressLine}
        </p>

        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>

        <p>{address.country}</p>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center gap-2 border-t border-[#e8e4dc] pt-3">
        <span className="h-px w-5 bg-[#c8bb94]" />
        <span className="text-[7px] uppercase tracking-[0.25em] text-[#aaa49b]">
          Delivery Destination
        </span>
      </div>
    </div>
  );
}

export default function UserAddresses({ addresses }: Props) {


  return (
    <div className="overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">
      {/* HEADER */}
      <div className="border-b border-[#e2ded4] px-5 py-4 md:px-6">
        <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
          Admin / Customer Management
        </p>

        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
            Saved Addresses
          </h2>

          <span className="text-[8px] uppercase tracking-[0.2em] text-[#817d75]">
            {String(addresses.length).padStart(2, "0")}{" "}
            {addresses.length === 1 ? "Address" : "Addresses"}
          </span>
        </div>

        <p className="mt-2 text-[10px] leading-5 tracking-[0.02em] text-[#817d75]">
          Saved customer delivery destinations and address details.
        </p>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5 md:p-6">
        {addresses.length === 0 ? (
          /* EMPTY STATE */
          <div className="border border-[#dedbd4] bg-[#f3f0e9] px-5 py-12 text-center transition-colors duration-300 hover:bg-[#faf8f3] sm:py-16">
            <div className="mx-auto mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#cec8bc]" />

              <span className="font-serif text-2xl text-[#9b8150]">
                ⌂
              </span>

              <span className="h-px w-8 bg-[#cec8bc]" />
            </div>

            <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
              Delivery Collection
            </p>

            <h3 className="mt-3 font-serif text-2xl font-normal text-[#1b1a18]">
              No Addresses Saved
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-[10px] leading-6 tracking-[0.02em] text-[#817d75]">
              This customer hasn&apos;t added any saved delivery
              addresses yet. Address details will appear here once
              they have been added.
            </p>

            <div className="mx-auto mt-6 h-px w-12 bg-[#cfc6b6]" />
          </div>
        ) : (
          <>
            {/* SECTION LABEL */}
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#e2ded4] pb-3">
              <p className="text-[8px] uppercase tracking-[0.24em] text-[#9b8150]">
                Customer Destinations
              </p>

              <span className="text-[8px] uppercase tracking-[0.15em] text-[#aaa69e]">
                Saved Records
              </span>
            </div>

            {/* ADDRESS GRID */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {addresses.map((address, index) => (
                <div
                  key={address.id}
                  className="group relative border border-[#e2ded4] bg-[#f5f4ef] p-4 transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#fdfcf9] hover:shadow-[0_10px_30px_rgba(45,40,30,0.05)] sm:p-5"
                >
                  {/* CARD HEADER */}
                  <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#dedbd4] pb-3">
                    <span className="font-serif text-lg italic text-[#c0b7a5]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[7px] uppercase tracking-[0.22em] text-[#9b8150]">
                      Saved Address
                    </span>
                  </div>

                  {/* ADDRESS DETAILS */}
                  <AddressCard address={address} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

}
