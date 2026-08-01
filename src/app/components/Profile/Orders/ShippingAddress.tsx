"use client";

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

          <p className="mt-1 text-xs text-neutral-500">
            {address.countryCode} {address.phone}
          </p>

        </div>

        <div className="space-y-1 text-xs leading-5 text-neutral-600">

          <p>{address.addressLine}</p>

          <p>
            {address.city}, {address.state}
          </p>

          <p>{address.postalCode}</p>

          <p>{address.country}</p>

        </div>

      </div>

    </div>
  );
}