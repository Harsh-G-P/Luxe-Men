"use client"

import Image from "next/image";
import Link from "next/link";

type UserProps = {
  user: {
    id: string,
    name: string,
    username: string,
    email: string,
    image: string | null,
    createdAt: Date
  }
}

export default function UserProfile({ user }: UserProps) {
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

              <div
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Display Name
                </p>

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
              </div>
              <div
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Username
                </p>

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {user.username}
                </p>
              </div>
              <div
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md"
              >
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

            {/* Additional Section */}
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

          </div>

        </div>

      </div>
    </div>
  );
}