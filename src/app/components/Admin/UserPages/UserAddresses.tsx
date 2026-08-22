
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
    <div className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md">

  <div className="flex items-start justify-between gap-4">

    <div>
      <p className="font-medium text-neutral-900">
        {address.fullname}
      </p>

      <div className="mt-1 flex items-center gap-2">
        <p className="text-xs text-neutral-500">
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
            <Copy className="h-3.5 w-3.5 text-neutral-400 transition-colors hover:text-black" />
          )}
        </button>
      </div>
    </div>

    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] uppercase tracking-widest text-neutral-500">
      Saved
    </span>

  </div>

  <div className="mt-5 border-t border-neutral-100 pt-5 space-y-1 text-xs leading-5 text-neutral-600">
    <p>{address.addressLine}</p>

    <p>
      {address.city}, {address.state} {address.postalCode}
    </p>

    <p>{address.country}</p>
  </div>

</div>
  );
}

export default function UserAddresses({ addresses }: Props) {
  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-8 py-5">

        <h2 className="text-sm uppercase tracking-[0.18em]">
          Addresses
        </h2>

        <p className="mt-1 text-xs text-neutral-500">
          Saved customer addresses.
        </p>

      </div>

      <div className="p-8">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <span className="text-xl text-neutral-400">⌂</span>
            </div>

            <h3 className="mt-4 text-sm font-medium text-neutral-800">
              No saved addresses
            </h3>

            <p className="mt-1 max-w-sm text-xs text-neutral-500">
              This user hasn&apos;t added any saved addresses yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
