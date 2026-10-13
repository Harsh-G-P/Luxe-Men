"use client";

import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { useState } from "react";



type Props = {
  customer: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
  };
};

export default function CustomerInformation({ customer }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(customer.id);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">

      {/* Header */}
      <div className="border-b border-[#eeece7] px-5 py-4 md:px-6">
        <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
          Admin / Customer Management
        </p>

        <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
          Customer Details
        </h2>
      </div>

      <div className="space-y-5 px-5 py-5 md:px-6">

        {/* Customer Information */}
        <div>
          <p className="font-serif text-[15px] font-normal tracking-[0.01em] text-[#1b1a18]">
            {customer.name}
          </p>

          <p className="mt-1 break-all text-[10px] tracking-[0.02em] text-[#817d75]">
            {customer.email}
          </p>

          {/* Customer ID */}
          <div className="group mt-4">
            <p className="text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]">
              Customer ID
            </p>

            <div className="mt-1 flex items-center gap-2">
              <p className="min-w-0 break-all text-[10px] tracking-[0.02em] text-[#57534c]">
                {customer.id}
              </p>

              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 text-[#aaa69e] transition-colors duration-300 hover:text-[#1b1a18] focus-visible:outline-1 focus-visible:outline-[#9a8a74]"
                title={copied ? "Copied!" : "Copy Customer ID"}
                aria-label={copied ? "Customer ID copied" : "Copy Customer ID"}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-[#6f8068]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Customer Metadata */}
        <div className="space-y-4 border-t border-[#e2ded4] pt-4">

          {/* Role */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
              Account Role
            </span>

            <span
              className={`text-[8px] uppercase tracking-[0.2em] ${customer.role === "ADMIN"
                  ? "text-[#806c94]"
                  : "text-[#817d75]"
                }`}
            >
              {customer.role}
            </span>
          </div>

          {/* Joined Date */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
              Member Since
            </span>

            <span className="text-right text-[10px] tracking-[0.02em] text-[#57534c]">
              {new Date(customer.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

        </div>

        {/* View Customer */}
        <div className="border-t border-[#e2ded4] pt-5">
          <Link
            href={`/admin/user/${customer.id}`}
            className="group inline-flex h-11 w-full items-center justify-center gap-3 border border-[#d9d5cd] bg-[#fdfcf9] px-5 text-center text-[9px] font-medium uppercase tracking-[0.2em] text-[#1b1a18] transition-all duration-300 hover:border-[#1b1a18] hover:bg-[#1b1a18] hover:text-white focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#9a8a74]"
          >
            <span className="text-base font-light leading-none transition-transform duration-300 group-hover:rotate-90">
              +
            </span>

            View Customer Profile
          </Link>
        </div>

      </div>
    </div>
  );
}