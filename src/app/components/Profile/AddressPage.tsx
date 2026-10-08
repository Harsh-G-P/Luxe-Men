"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

  const router = useRouter()

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/address/${id}`, {
        method: "DELETE"
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message)
        return
      }

      toast.success(data.message)
      router.refresh()

    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/address/${id}`, {
        method: "PATCH",
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message)
        return
      }

      toast.success(data.message)
      router.refresh()

    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#171614]">

      {/* HEADER */}
      <section className="border-b border-[#e4e0d7]">
        <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <Link
                href="/profile"
                className=" group mb-5 inline-flex items-center gap-2.5 border-b border-[#d9d5cd] pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#171512] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#1b1a18]"
              >
                <span className="text-[13px] leading-none transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>

                <span>Back to Profile</span>
              </Link>

              <p className="mb-1.5 text-[8px] uppercase tracking-[0.38em] text-[#9b8150]">
                Private Account
              </p>

              <h1 className="font-serif text-3xl font-normal tracking-tight text-[#201f1c] md:text-4xl">
                My Addresses
              </h1>

              <p className="mt-3 max-w-md text-[11px] leading-5 text-[#77736b]">
                Manage your preferred delivery destinations and select the
                address you would like us to use for your orders.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden h-px w-8 bg-[#cfc9bc] sm:block" />

              <span className="text-[8px] uppercase tracking-[0.28em] text-[#9b8150]">
                {address.length.toString().padStart(2, "0")} Saved
              </span>

              <Link
                href="/profile/addresses/new"
                className="group relative overflow-hidden bg-[#171614] px-5 py-3.5 text-[8px] font-medium uppercase tracking-[0.28em] text-white transition-colors duration-500 hover:bg-[#292722]"
              >
                <span className="relative z-10">Add Address</span>

                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-5 py-7 md:px-8 md:py-9">
        <div className="grid grid-cols-1 border-y border-[#d9d5cc] sm:grid-cols-3">

          {/* TOTAL */}
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[7px] uppercase tracking-[0.32em] text-[#9b8150]">
                  Collection
                </p>

                <p className="mt-3 font-serif text-2xl text-[#272522]">
                  {address.length.toString().padStart(2, "0")}
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#858078]">
                  Saved Addresses
                </p>
              </div>

              <span className="font-serif text-base italic text-[#c0b7a5]">
                01
              </span>
            </div>
          </div>

          {/* DEFAULT */}
          <div className="border-y border-[#d9d5cc] px-4 py-5 sm:border-x sm:border-y-0 sm:px-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[7px] uppercase tracking-[0.32em] text-[#9b8150]">
                  Preferred Destination
                </p>

                <p className="mt-3 font-serif text-lg text-[#272522]">
                  {defaultAddress?.city || "Not Selected"}
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#858078]">
                  Default Address
                </p>
              </div>

              <span className="font-serif text-base italic text-[#c0b7a5]">
                02
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[7px] uppercase tracking-[0.32em] text-[#9b8150]">
                  Service
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#75836c]" />

                  <span className="font-serif text-lg text-[#272522]">
                    Active
                  </span>
                </div>

                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#858078]">
                  Delivery Ready
                </p>
              </div>

              <span className="font-serif text-base italic text-[#c0b7a5]">
                03
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ADDRESSES */}
      <section className="mx-auto max-w-6xl px-5 pb-14 md:px-8 md:pb-18">

        <div className="mb-5 flex items-end justify-between border-b border-[#d8d4cb] pb-3">
          <div>
            <p className="text-[8px] uppercase tracking-[0.36em] text-[#9b8150]">
              Your Destinations
            </p>

            <h2 className="mt-1.5 font-serif text-2xl text-[#272522]">
              Saved Addresses
            </h2>
          </div>

          <span className="text-[7px] uppercase tracking-[0.23em] text-[#99948b]">
            {address.length === 1 ? "1 Address" : `${address.length} Addresses`}
          </span>
        </div>

        {address.length === 0 ? (
          /* EMPTY STATE */
          <div className="border border-[#d8d4cb] bg-[#eeece6] px-5 py-16 text-center md:px-8 md:py-20">
            <div className="mx-auto mb-7 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#cec8bc]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#9b8150]" />
              <span className="h-px w-10 bg-[#cec8bc]" />
            </div>

            <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
              Delivery Collection
            </p>

            <h2 className="mt-4 font-serif text-3xl text-[#272522] md:text-4xl">
              No Addresses Saved
            </h2>

            <p className="mx-auto mt-4 max-w-sm text-[11px] leading-6 text-[#77736b]">
              Add a delivery destination to make your next order effortless.
              Your saved addresses can be managed from your private account.
            </p>

            <Link
              href="/profile/addresses/new"
              className="group relative mt-7 inline-flex overflow-hidden bg-[#171614] px-8 py-3.5 text-[8px] uppercase tracking-[0.28em] text-white"
            >
              <span className="relative z-10">Add First Address</span>

              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
          </div>
        ) : (
          <div className="relative">
            {/* Scroll indicator */}
            <div className="mb-4 flex items-center justify-center gap-2.5">
              <span className="h-px w-6 bg-[#d5d0c5]" />

              <span className="text-[7px] uppercase tracking-[0.28em] text-[#aaa49a]">
                Scroll to explore
              </span>

              <span className="h-px w-6 bg-[#d5d0c5]" />
            </div>

            <div className="max-h-120 overflow-y-auto pr-1.5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {address.map((addresses, index) => (
                  <div
                    key={addresses.id}
                    className={`group relative overflow-hidden border p-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(40,36,28,0.06)] ${addresses.isDefault
                      ? "border-[#bca875] bg-[#eeece5]"
                      : "border-[#d8d4cb] bg-[#f1efe9]"
                      }`}
                  >

                    <div className="relative">
                      {/* TOP */}
                      <div className="flex items-start justify-between">
                        <span className="font-serif text-lg italic text-[#c2b9a7]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {addresses.isDefault ? (
                          <span className="flex items-center gap-1.5 text-[7px] font-medium uppercase tracking-[0.23em] text-[#75836c]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#75836c]" />
                            Preferred
                          </span>
                        ) : (
                          <span className="text-[7px] uppercase tracking-[0.23em] text-[#aaa49a]">
                            Secondary
                          </span>
                        )}
                      </div>

                      {/* NAME */}
                      <div className="mt-5 border-b border-[#d6d1c7] pb-4">
                        <p className="text-[7px] uppercase tracking-[0.28em] text-[#9b8150]">
                          Recipient
                        </p>

                        <h3 className="mt-1.5 font-serif text-xl text-[#272522]">
                          {addresses.fullname}
                        </h3>

                        <p className="mt-1.5 text-[8px] tracking-[0.07em] text-[#77736b]">
                          {addresses.countryCode} {addresses.phone}
                        </p>
                      </div>

                      {/* ADDRESS */}
                      <div className="mt-4">
                        <p className="mb-2.5 text-[7px] uppercase tracking-[0.28em] text-[#9b8150]">
                          Delivery Destination
                        </p>

                        <div className="space-y-1 text-[11px] leading-5 text-[#5f5b54]">
                          <p>{addresses.addressLine}</p>

                          <p>
                            {addresses.city}, {addresses.state}
                          </p>

                          <p>
                            {addresses.country}{" "}
                            <span className="text-[#9d978d]">—</span>{" "}
                            {addresses.postalCode}
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-5 flex items-center justify-between border-t border-[#d6d1c7] pt-4">
                        <div className="flex items-center gap-2">
                          {!addresses.isDefault && (
                            <button
                              onClick={() => handleUpdate(addresses.id)}
                              className="group/action relative inline-flex items-center gap-2 border border-[#bfb7a5] bg-[#f8f6f0] px-3 py-2 text-[7px] font-medium uppercase tracking-[0.18em] text-[#302e2a] transition-all duration-300 hover:border-[#9b8150] hover:bg-[#eee9dd]"
                            >
                              <span className="h-1 w-1 rounded-full bg-[#9b8150] transition-transform duration-300 group-hover/action:scale-125" />

                              <span>Set Default</span>

                              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#9b8150] transition-transform duration-300 group-hover/action:scale-x-100" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(addresses.id)}
                            className="group/delete inline-flex items-center gap-2 border border-[#d2c5c0] bg-[#f8f4f1] px-3 py-2 text-[7px] uppercase tracking-[0.18em] text-[#8c655e] transition-all duration-300 hover:border-[#a8786f] hover:bg-[#f0e5e1]"
                          >
                            <span className="text-[9px] leading-none transition-transform duration-300 group-hover/delete:rotate-90">
                              ×
                            </span>

                            <span>Delete</span>
                          </button>
                        </div>

                        {addresses.isDefault && (
                          <span className="flex items-center gap-1.5 text-[7px] uppercase tracking-[0.18em] text-[#9b8150]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#9b8150]" />
                            Default
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER DETAILS */}
        <div className="mt-12 grid grid-cols-1 border-t border-[#d8d4cb] pt-5 sm:grid-cols-3">

          {/* 01 */}
          <div className="flex items-start gap-4 border-b border-[#d8d4cb] px-2 py-4 sm:block sm:border-b-0 sm:px-4 sm:py-2">
            <p className="shrink-0 font-serif text-base text-[#272522]">
              01
            </p>

            <div>
              <p className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                Secure Delivery
              </p>

              <p className="mt-1.5 text-[8px] leading-4 text-[#99948b]">
                Your saved destinations are used securely for order fulfillment.
              </p>
            </div>
          </div>

          {/* 02 */}
          <div className="flex items-start gap-4 border-b border-[#d8d4cb] px-2 py-4 sm:block sm:border-x sm:border-b-0 sm:px-4 sm:py-2">
            <p className="shrink-0 font-serif text-base text-[#272522]">
              02
            </p>

            <div>
              <p className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                Preferred Address
              </p>

              <p className="mt-1.5 text-[8px] leading-4 text-[#99948b]">
                Set one destination as your default for a faster checkout.
              </p>
            </div>
          </div>

          {/* 03 */}
          <div className="flex items-start gap-4 px-2 py-4 sm:block sm:px-4 sm:py-2">
            <p className="shrink-0 font-serif text-base text-[#272522]">
              03
            </p>

            <div>
              <p className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                Effortless Checkout
              </p>

              <p className="mt-1.5 text-[8px] leading-4 text-[#99948b]">
                Keep your delivery details ready whenever you return.
              </p>
            </div>
          </div>
        </div>

      </section>

    </main>
  );
}