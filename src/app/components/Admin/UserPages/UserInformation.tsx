
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
    <div className="overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">
      {/* HEADER */}
      <div className="border-b border-[#e2ded4] px-5 py-4 md:px-6">
        <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
          Admin / User Management
        </p>

        <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
          User Information
        </h2>
      </div>

      <div className="space-y-5 px-5 py-5 md:px-6">
        {/* USER INFORMATION */}
        <div>
          <p className="font-serif text-[15px] font-normal tracking-[0.01em] text-[#1b1a18]">
            {user.name}
          </p>

          {/* EMAIL */}
          <div className="group mt-1 flex items-center gap-2">
            <p className="min-w-0 break-all text-[10px] tracking-[0.02em] text-[#817d75]">
              {user.email}
            </p>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="shrink-0 text-[#aaa69e] opacity-60 transition-colors duration-300 hover:text-[#1b1a18] focus-visible:outline-1 focus-visible:outline-[#9a8a74] sm:opacity-0 sm:group-hover:opacity-100"
              title={copiedEmail ? "Copied!" : "Copy email"}
              aria-label={
                copiedEmail ? "Email copied" : "Copy email"
              }
            >
              {copiedEmail ? (
                <Check className="h-3.5 w-3.5 text-[#6f8068]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* USER ID */}
          <div className="group mt-4">
            <p className="text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]">
              User ID
            </p>

            <div className="mt-1 flex items-start gap-2">
              <p className="min-w-0 break-all text-[10px] tracking-[0.02em] text-[#57534c]">
                {user.id}
              </p>

              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 text-[#aaa69e] opacity-60 transition-colors duration-300 hover:text-[#1b1a18] focus-visible:outline-1 focus-visible:outline-[#9a8a74] sm:opacity-0 sm:group-hover:opacity-100"
                title={copied ? "Copied!" : "Copy User ID"}
                aria-label={
                  copied ? "User ID copied" : "Copy User ID"
                }
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

        {/* USER METADATA */}
        <div className="space-y-4 border-t border-[#e2ded4] pt-4">
          {/* USERNAME */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
              Username
            </span>

            <span className="break-all text-right text-[10px] tracking-[0.02em] text-[#57534c]">
              @{user.username}
            </span>
          </div>

          {/* ROLE */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
              Account Role
            </span>

            <span
              className={`text-[8px] uppercase tracking-[0.2em] ${user.role === "ADMIN"
                  ? "text-[#806c94]"
                  : "text-[#817d75]"
                }`}
            >
              {user.role}
            </span>
          </div>

          {/* EMAIL VERIFICATION */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
              Email Verification
            </span>

            <span
              className={`flex items-center gap-1.5 text-[8px] uppercase tracking-[0.16em] ${user.emailVerified
                  ? "text-[#6f8068]"
                  : "text-[#a07858]"
                }`}
            >
              <Mail className="h-3 w-3" />
              {user.emailVerified ? "Verified" : "Unverified"}
            </span>
          </div>

          {/* JOINED DATE */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
              Member Since
            </span>

            <span className="text-right text-[10px] tracking-[0.02em] text-[#57534c]">
              {formatDate(user.createdAt)}
            </span>
          </div>

          {/* UPDATED DATE */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
              Last Updated
            </span>

            <span className="text-right text-[10px] tracking-[0.02em] text-[#57534c]">
              {formatDate(user.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
