
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

type UserProps = {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string | null;
    createdAt: Date;

    accountDeletionStatus: "NONE" | "REQUESTED" | "REJECTED";
    accountDeletionReason: string | null;
    accountDeletionRequestedAt: Date | null;
  };
};

export default function UserProfile({ user }: UserProps) {

  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const [deletionStatus, setDeletionStatus] = useState(
    user.accountDeletionStatus
  );



  useEffect(() => {
    let stopped = false;
    let redirecting = false;

    const checkDeletionStatus = async () => {
      if (stopped || redirecting) return;

      try {
        const res = await fetch("/api/user/delete-request", {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        // User was deleted OR session is no longer valid
        if (res.status === 404 || res.status === 401) {
          redirecting = true;
          stopped = true;

          await signOut({
            redirect: false,
          });

          window.location.replace("/");
          return;
        }

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        const status = data.data?.accountDeletionStatus;

        // Keep UI updated without page refresh
        if (
          status === "REQUESTED" ||
          status === "NONE" ||
          status === "REJECTED"
        ) {
          setDeletionStatus(status);
        }
      } catch (error) {
        if (!stopped) {
          console.error("Deletion status check failed:", error);
        }
      }
    };

    // Check immediately when page loads
    checkDeletionStatus();

    // Check every 2 seconds
    const interval = setInterval(checkDeletionStatus, 2000);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/user/delete-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.message || "Failed to submit account deletion request"
        );
        return;
      }

      toast.success("Account deletion request submitted");

      setDeletionStatus("REQUESTED");
      setShowForm(false);
      setReason("");
    } catch {
      toast.error("Failed to submit account deletion request");
    } finally {
      setLoading(false);
    }
  };

  const alreadyRequested = deletionStatus === "REQUESTED";

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#272522]">
      
      <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-12">

        {/* PAGE HEADER */}
        <div className="mb-8 border-b border-[#d8d4cb] pb-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="mb-2 text-[8px] uppercase tracking-[0.42em] text-[#9b8150]">
                Private Account
              </p>

              <h1 className="font-serif text-4xl font-normal tracking-tight text-[#201f1c] md:text-5xl">
                Welcome back, {user.name}
              </h1>

              <p className="mt-3 max-w-lg text-[10px] leading-5 text-[#77736b]">
                Manage your account, personal details, orders and delivery
                preferences from your private account.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#cfc7b7]" />

              <span className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                Member Account
              </span>
            </div>

          </div>
        </div>

        {/* PROFILE FRAME */}
        <div className=" overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">

          {/* TOP ACCENT */}
          <div className="h-px w-full bg-[#bda875]" />

          {/* PROFILE INTRO */}
          <div className="border-b border-[#d8d4cb] px-6 py-7 md:px-8">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              {/* IDENTITY */}
              <div className="flex items-center gap-5">

                <div className="relative shrink-0">
                  <Image
                    src={user.image || "/avatar/camel.png"}
                    alt="avatar"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full border border-[#c9c1b2] bg-[#e8e4db] object-cover p-1"
                  />

                  <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-[#f1efe9] bg-[#75836c]" />
                </div>

                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.32em] text-[#9b8150]">
                    Account Holder
                  </p>

                  <h2 className="font-serif text-3xl font-normal text-[#272522]">
                    {user.name}
                  </h2>

                  <p className="mt-2 text-[9px] tracking-[0.08em] text-[#858078]">
                    @{user.username}
                  </p>
                </div>

              </div>


              {/* ACTIONS */}
              <div className="flex flex-wrap items-center gap-2">

                <Link
                  href="/profile/orders"
                  className="group relative border border-[#cbc5b9] bg-[#f8f6f1] px-5 py-3 text-[8px] uppercase tracking-[0.25em] text-[#4f4b44] transition-all duration-300 hover:border-[#9b8150] hover:bg-[#eeebe3]"
                >
                  Orders

                  <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#9b8150] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>

                <Link
                  href="/profile/addresses"
                  className="group relative border border-[#cbc5b9] bg-[#f8f6f1] px-5 py-3 text-[8px] uppercase tracking-[0.25em] text-[#4f4b44] transition-all duration-300 hover:border-[#9b8150] hover:bg-[#eeebe3]"
                >
                  Addresses

                  <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#9b8150] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>

                <Link
                  href="/profile/edit"
                  className="group relative overflow-hidden bg-[#171614] px-5 py-3 text-[8px] uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-[#292722]"
                >
                  <span className="relative z-10">
                    Edit Profile
                  </span>

                  <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>

              </div>

            </div>

          </div>

          {/* ACCOUNT DETAILS */}
          <div className="px-6 py-7 md:px-8">

            <div className="mb-5 flex items-end justify-between border-b border-[#d8d4cb] pb-4">

              <div>
                <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                  Personal Information
                </p>

                <h3 className="mt-1.5 font-serif text-2xl font-normal text-[#272522]">
                  Account Details
                </h3>
              </div>

              <span className="font-serif text-lg italic text-[#c2b9a7]">
                ☆
              </span>

            </div>


            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 border border-[#d8d4cb] sm:grid-cols-2 lg:grid-cols-4">

              {/* NAME */}
              <div className="group border-b border-[#d8d4cb] p-5 transition-colors hover:bg-[#eeece6] sm:border-r lg:border-b-0">
                <div className="flex items-start justify-between">

                  <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                    Display Name
                  </p>

                  <span className="font-serif text-sm italic text-[#c7bfae]">
                    01
                  </span>

                </div>

                <p className="mt-6 font-serif text-xl font-normal text-[#302e2a]">
                  {user.name}
                </p>

                <div className="mt-4 h-px w-7 origin-left bg-[#bda875] transition-all duration-500 group-hover:w-14" />

              </div>


              {/* USERNAME */}
              <div className="group border-b border-[#d8d4cb] p-5 transition-colors hover:bg-[#eeece6] lg:border-b-0 lg:border-r">
                <div className="flex items-start justify-between">

                  <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                    Username
                  </p>

                  <span className="font-serif text-sm italic text-[#c7bfae]">
                    02
                  </span>

                </div>

                <p className="mt-6 break-all font-serif text-xl font-normal text-[#302e2a]">
                  @{user.username}
                </p>

                <div className="mt-4 h-px w-7 origin-left bg-[#bda875] transition-all duration-500 group-hover:w-14" />
              </div>


              {/* EMAIL */}
              <div className="group border-b border-[#d8d4cb] p-5 transition-colors hover:bg-[#eeece6] sm:border-r lg:border-b-0">
                <div className="flex items-start justify-between">

                  <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                    Email
                  </p>

                  <span className="font-serif text-sm italic text-[#c7bfae]">
                    03
                  </span>

                </div>

                <p className="mt-6 break-all text-[11px] tracking-[0.03em] text-[#4f4b44]">
                  {user.email.replace(/(.{2}).+(@.+)/, "$1****$2")}
                </p>

                <div className="mt-4 h-px w-7 origin-left bg-[#bda875] transition-all duration-500 group-hover:w-14" />
              </div>


              {/* MEMBER SINCE */}
              <div className="group p-5 transition-colors hover:bg-[#eeece6]">
                <div className="flex items-start justify-between">

                  <p className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                    Member Since
                  </p>

                  <span className="font-serif text-sm italic text-[#c7bfae]">
                    04
                  </span>

                </div>

                <p className="mt-6 font-serif text-xl font-normal text-[#302e2a]">
                  {user.createdAt.toLocaleDateString()}
                </p>

                <div className="mt-4 h-px w-7 origin-left bg-[#bda875] transition-all duration-500 group-hover:w-14" />
              </div>

            </div>


            {/* ABOUT */}
            <div className="mt-7 border-t border-[#d8d4cb] pt-6">

              <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr]">

                <div>
                  <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                    About
                  </p>

                  <p className="mt-2 font-serif text-xl text-[#302e2a]">
                    Your Account
                  </p>
                </div>

                <div className="border-l border-[#d8d4cb] pl-5">
                  <p className="max-w-2xl text-[10px] leading-6 text-[#77736b]">
                    Welcome to your private account. Here you can manage your
                    personal information, update your profile details, review
                    your orders and maintain your delivery preferences.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* ACCOUNT DELETION */}
          <div className="border-t border-[#d8d4cb]">

            <div className="px-6 py-6 md:px-8">

              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>
                  <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                    Account Management
                  </p>

                  <h3 className="mt-2 font-serif text-2xl font-normal text-[#302e2a]">
                    Account Deletion
                  </h3>

                  <p className="mt-2 max-w-xl text-[9px] leading-5 text-[#858078]">
                    If you no longer wish to use your account, you may submit a
                    deletion request for review by our team.
                  </p>
                </div>

                <span className="font-serif text-xl italic text-[#c2b9a7]">
                  ☆
                </span>

              </div>


              {/* PENDING */}
              {alreadyRequested && (
                <div className="mt-6 border border-[#cbbd9d] bg-[#eeece5] p-5">

                  <div className="flex items-start gap-3">

                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9b8150]" />

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.25em] text-[#806a3e]">
                        Deletion Request Under Review
                      </p>

                      <p className="mt-3 max-w-2xl text-[10px] leading-6 text-[#706b63]">
                        Your account deletion request has been received and is
                        currently under review. Your account will remain active
                        while our team reviews the request.
                      </p>

                      {user.accountDeletionRequestedAt && (
                        <p className="mt-4 text-[8px] uppercase tracking-[0.15em] text-[#99948b]">
                          Requested on{" "}
                          {new Date(
                            user.accountDeletionRequestedAt
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>

                  </div>

                </div>
              )}


              {/* DELETE REQUEST */}
              {!alreadyRequested && !showForm && (
                <div className="mt-6 border-t border-[#d8d4cb] pt-5">

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.25em] text-[#77736b]">
                        Request Account Deletion
                      </p>

                      <p className="mt-2 max-w-xl text-[9px] leading-5 text-[#99948b]">
                        Requests are reviewed manually. Your account will remain
                        active until the request has been approved.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(true);
                        setReason("");
                      }}
                      className="group relative shrink-0 border border-[#9c6b63] px-6 py-3 text-[8px] uppercase tracking-[0.25em] text-[#8c655e] transition-all duration-300 hover:bg-[#8c655e] hover:text-white"
                    >
                      Request Deletion

                      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
                    </button>

                  </div>

                </div>
              )}


              {/* DELETE FORM */}
              {!alreadyRequested && showForm && (
                <div className="mt-6 border-t border-[#d8d4cb] pt-6">

                  <div className="mb-6">

                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#8c655e]">
                      Confirmation Required
                    </p>

                    <h4 className="mt-2 font-serif text-2xl font-normal text-[#302e2a]">
                      Are you certain?
                    </h4>

                    <p className="mt-2 max-w-xl text-[9px] leading-5 text-[#858078]">
                      This will submit a request to our team. Your account will
                      not be deleted immediately.
                    </p>

                  </div>


                  {/* REASON */}
                  <div>

                    <label className="mb-2 block text-[8px] uppercase tracking-[0.25em] text-[#5f5b54]">
                      Reason for Leaving
                    </label>

                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Tell us why you would like to delete your account..."
                      rows={4}
                      disabled={loading}
                      className="w-full resize-none border border-[#d3cec3] bg-[#faf9f6] px-4 py-3 text-[10px] leading-5 text-[#302e2a] outline-none transition-all placeholder:text-[#aaa59b] focus:border-[#9b8150] focus:bg-[#f8f6f0] disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>


                  {/* FORM ACTIONS */}
                  <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setReason("");
                      }}
                      disabled={loading}
                      className="border border-[#d0cbc1] bg-[#f8f6f0] px-6 py-3 text-[8px] uppercase tracking-[0.25em] text-[#5f5b54] transition-all duration-300 hover:border-[#9b8150] hover:bg-[#eeebe3] disabled:opacity-50"
                    >
                      Keep Account
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="border border-[#8c655e] bg-[#8c655e] px-6 py-3 text-[8px] uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-[#754f49] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Submit Request"}
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>


        {/* FOOTER DETAIL */}
        <div className="mt-8 grid grid-cols-1 border-y border-[#d8d4cb] sm:grid-cols-3">

          {/* 01 */}
          <div className="flex items-start gap-5 px-5 py-5 sm:block sm:border-r sm:border-[#d8d4cb]">
            <p className="shrink-0 font-serif text-lg text-[#302e2a]">
              01
            </p>

            <div>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.25em] text-[#5f5b54] sm:mt-2">
                Private Account
              </p>

              <p className="mt-2 text-[9px] leading-5 text-[#99948b]">
                Your personal account information remains securely managed.
              </p>
            </div>
          </div>


          {/* 02 */}
          <div className="flex items-start gap-5 border-t border-[#d8d4cb] px-5 py-5 sm:block sm:border-y-0 sm:border-r">
            <p className="shrink-0 font-serif text-lg text-[#302e2a]">
              02
            </p>

            <div>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.25em] text-[#5f5b54] sm:mt-2">
                Order History
              </p>

              <p className="mt-2 text-[9px] leading-5 text-[#99948b]">
                Review previous orders and manage your delivery destinations.
              </p>
            </div>
          </div>


          {/* 03 */}
          <div className="flex items-start gap-5 border-t border-[#d8d4cb] px-5 py-5 sm:block sm:border-t-0">
            <p className="shrink-0 font-serif text-lg text-[#302e2a]">
              03
            </p>

            <div>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.25em] text-[#5f5b54] sm:mt-2">
                Account Control
              </p>

              <p className="mt-2 text-[9px] leading-5 text-[#99948b]">
                Update your details or manage your account preferences anytime.
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );

}
