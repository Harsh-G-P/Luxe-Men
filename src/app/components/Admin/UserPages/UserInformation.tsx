
"use client";

import { Copy, Check, Mail } from "lucide-react";
import { useState } from "react";

type Props = {
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    role: "USER" | "ADMIN";
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
  };
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function UserInformation({ user }: Props) {
  const [copied, setCopied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(user.id);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };


  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(user.email);

    setCopiedEmail(true);

    setTimeout(() => {
      setCopiedEmail(false);
    }, 1500);
  };

  

  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">
        <h2 className="text-sm uppercase tracking-[0.18em]">
          User Information
        </h2>
      </div>

      <div className="space-y-5 px-6 py-6">

        <div>
          <p className="font-medium">
            {user.name}
          </p>
          <div className="group flex items-center gap-2">
          <p className="mt-1 text-xs text-neutral-500">
            {user.email}
          </p>
          <button
              type="button"
              onClick={handleCopyEmail}
              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              title={copiedEmail ? "Copied!" : "Copy email"}
            >
              {copiedEmail ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-neutral-500 hover:text-black" />
              )}
            </button>
            </div>

        </div>

        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              Username
            </span>

            <span className="text-xs font-medium">
              @{user.username}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              Role
            </span>

            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase ${
                user.role === "ADMIN"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {user.role}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              Email
            </span>
              <span className="flex items-center gap-1 text-xs font-medium">
              <Mail className="h-3 w-3 text-neutral-400" />
              {user.emailVerified ? "Verified" : "Unverified"}
            </span>
            
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              Joined
            </span>

            <span className="text-xs">
              {formatDate(user.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              Updated
            </span>

            <span className="text-xs">
              {formatDate(user.updatedAt)}
            </span>
          </div>

        </div>

        <div className="border-t border-neutral-200 pt-5">

          <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">
            User ID
          </p>

          <div className="group mt-2 flex items-start gap-2">

            <p className="break-all text-xs text-neutral-700">
              {user.id}
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              title={copied ? "Copied!" : "Copy User ID"}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-neutral-500 hover:text-black" />
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
