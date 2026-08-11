
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
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Welcome back, {user.name} 👋
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your account and profile settings.
          </p>
        </div>

        <div className="mb-6 h-2 rounded-full bg-linear-to-r from-violet-600 via-indigo-600 to-cyan-500" />

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-200">
          {/* Banner */}
          <div className="relative h-44 bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-500">
            <div>
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute right-20 top-10 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
              <div className="absolute left-20 top-10 h-24 w-24 rounded-full bg-white/20" />
            </div>
          </div>

          {/* Content */}
          <div className="relative px-6 pb-8">
            {/* Avatar */}
            <div className="-mt-16">
              <div className="relative inline-block">
                <Image
                  src={user.image || "/avatar/camel.png"}
                  alt="avatar"
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                />

                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-green-500 border-2 border-white" />
              </div>
            </div>

            {/* Header */}
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {user.name}
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/profile/orders"
                  className="text-center rounded-2xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-900 transition hover:bg-slate-100"
                >
                  My Orders
                </Link>

                <Link
                  href="/profile/addresses"
                  className="text-center rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-black transition hover:bg-slate-300"
                >
                  Addresses
                </Link>

                <Link
                  href="/profile/edit"
                  className="text-center rounded-2xl bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-750"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Info Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Display Name
                </p>

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Username
                </p>

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {user.username}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email
                </p>

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {user.email.replace(/(.{2}).+(@.+)/, "$1****$2")}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Member Since
                </p>

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {user.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* About */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                About
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Welcome to your profile dashboard. Here you can manage your
                account information, update your profile details, and customize
                your experience.
              </p>
            </div>

            {/* Account Deletion */}
            <div className="mt-8 border border-neutral-200 bg-white">
              <div className="border-b border-neutral-200 px-6 py-5">
                <h2 className="text-sm uppercase tracking-[0.18em]">
                  Account Deletion
                </h2>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Need to delete your account? Submit a request and our team
                  will review it.
                </p>
              </div>

              <div className="px-6 py-6">
                {/* Pending */}
                {alreadyRequested && (
                  <div className="border border-amber-200 bg-amber-50 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.12em] text-amber-700">
                      Account Deletion Requested
                    </p>

                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                      Your account deletion request is under review. Your
                      account will remain active while our team carefully
                      reviews your request and reaches a final decision.
                    </p>

                    {user.accountDeletionRequestedAt && (
                      <p className="mt-4 text-xs text-neutral-500">
                        Requested on{" "}
                        {new Date(
                          user.accountDeletionRequestedAt
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Request */}
                {!alreadyRequested && !showForm && (
                  <div>
                    <div className="border border-neutral-200 bg-neutral-50 px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                        Account Deletion Request
                      </p>

                      <p className="mt-2 text-xs leading-6 text-neutral-600">
                        Account deletion requests are reviewed by our team.
                        Your account will remain active until the request is
                        approved.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(true);
                        setReason("");
                      }}
                      className="mt-5 w-full border border-red-800 py-3 text-xs uppercase tracking-[0.12em] text-red-800 transition hover:bg-red-900 hover:text-white"
                    >
                      Request Account Deletion
                    </button>
                  </div>
                )}

                {/* Request Form */}
                {!alreadyRequested && showForm && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                      Request Account Deletion
                    </p>

                    <h3 className="mt-3 text-lg font-medium tracking-[0.04em]">
                      Are you sure you want to request account deletion?
                    </h3>

                    <p className="mt-3 text-xs leading-6 text-neutral-500">
                      This will send a deletion request to our team. Your
                      account will not be deleted immediately.
                    </p>

                    <div className="mt-6">
                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
                        Reason
                      </label>

                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Tell us why you would like to delete your account..."
                        rows={4}
                        disabled={loading}
                        className="w-full resize-none border border-neutral-200 bg-white px-4 py-3 text-xs leading-6 outline-none transition placeholder:text-neutral-400 focus:border-black"
                      />
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setReason("");
                        }}
                        disabled={loading}
                        className="flex-1 border border-neutral-300 py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-neutral-100"
                      >
                        Keep Account
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 border border-red-800 bg-red-800 py-3 text-xs uppercase tracking-[0.12em] text-white transition hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
