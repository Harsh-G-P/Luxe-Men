"use client";

import Link from "next/link";

type AddressProps = {
  address: {
    id: string;
    fullname: string;
    countryCode: string;
    phone: string;
    addressLine: string;
    city: string;
    isDefault: boolean;
    state: string;
    country: string;
    postalCode: string;
    createdAt: Date;
  }[]
}


export default function AddressesPage({ address }: AddressProps) {

  const defaultAddress = address.find(
    (addr) => addr.isDefault
  );


  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="mx-auto max-w-5xl w-full">

        <div className="flex items-center mb-5">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            ← Back to Profile
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              My Addresses 📍
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your delivery addresses and default location.
            </p>
          </div>

          <Link
            href="/profile/addresses/new"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-center font-medium text-white transition hover:bg-slate-800"
          >
            Add Address
          </Link>
        </div>

        {/* Gradient Divider */}
        <div className="mb-6 h-2 rounded-full bg-linear-to-r from-violet-600 via-indigo-600 to-cyan-500" />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">

          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Addresses
              </p>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {address.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Default Address
              </p>

              <p className="mt-3 text-sm font-semibold text-slate-900">
                {defaultAddress?.city || "No Default Address"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Delivery Ready
              </p>

              <p className="mt-3 text-sm font-semibold text-green-600">
                Active
              </p>
            </div>

          </div>

          {/* Section Header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Saved Addresses
              </h2>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {address.length} Saved
            </span>
          </div>

          {address.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="text-xl font-semibold text-slate-900">
                No addresses found
              </h2>

              <p className="mt-2 text-slate-500">
                Add your first delivery address to continue shopping.
              </p>

              <Link
                href="/profile/addresses/new"
                className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
              >
                Add Address
              </Link>
            </div>
          ) : (
            <div>
              {/* Scroll Hint */}
              <p className="mb-4 text-center text-sm text-slate-500 animate-pulse">
                ↓ Scroll down to view more addresses
              </p>

              <div className="max-h-82.5 overflow-y-auto pr-2">
                <div className="grid gap-6 md:grid-cols-2">
                  {address.map((addresses) => (
                    <div
                      key={addresses.id}
                      className={`rounded-3xl p-6 shadow-sm transition hover:shadow-xl ${addresses.isDefault
                        ? "border-2 border-green-300 bg-green-50/40"
                        : "border border-slate-200 bg-slate-50"
                        }`}
                    >
                      {/* Badge */}
                      <div className="mb-5 flex items-center justify-between">
                        {addresses.isDefault ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            ✓ Default Address
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Secondary Address
                          </span>
                        )}
                      </div>

                      {/* User Info */}
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {addresses.fullname}
                        </h2>

                        <p className="mt-2 text-slate-600">
                          {addresses.countryCode} {addresses.phone}
                        </p>
                      </div>

                      {/* Address */}
                      <div className="mt-4 border-t border-slate-200 pt-4">
                        <div className="space-y-1 text-sm text-slate-600">
                          <p>{addresses.addressLine}</p>

                          <p>
                            {addresses.city}, {addresses.state}
                          </p>

                          <p>
                            {addresses.country} - {addresses.postalCode}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        {!addresses.isDefault && (
                          <button
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                            Set Default
                          </button>
                        )}

                        <button
                          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                          Delete
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}