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
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">

        <h2 className="text-sm uppercase tracking-[0.18em]">
          Customer
        </h2>

      </div>

      <div className="space-y-5 px-6 py-6">

        <div>

          <p className="font-medium">
            {customer.name}
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            {customer.email}
          </p>

          <div className="group">
            <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-neutral-400">
              Customer ID
            </p>

            <div className="mt-1 flex items-center gap-2">
              <p className="break-all text-xs text-neutral-700">
                {customer.id}
              </p>

              <button
                type="button"
                onClick={handleCopy}
                className="opacity-0 transition-opacity group-hover:opacity-100"
                title={copied ? "Copied!" : "Copy Customer ID"}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-neutral-500 hover:text-neutral-900" />
                )}
              </button>
            </div>
          </div>

        </div>

        <div className="space-y-4">

          <div className="flex justify-between">

            <span className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              Role
            </span>

            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase ${customer.role === "ADMIN"
                ? "bg-purple-100 text-purple-700"
                : "bg-slate-100 text-slate-700"
                }`}
            >
              {customer.role}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              Joined
            </span>

            <span className="text-xs">
              {new Date(customer.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>

          </div>

        </div>

        <div className="border-t border-neutral-200 pt-5">

          <Link
            href={`/admin/user/${customer.id}`}
            className="block w-full border border-black px-5 py-3 text-center text-xs uppercase tracking-[0.12em] transition hover:bg-black hover:text-white"
          >
            View Customer
          </Link>

        </div>

      </div>

    </div>
  );
}