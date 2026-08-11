"use client"

import { Role } from "@/generated/prisma/enums";
import Image from "next/image";
import Link from "next/link"
import UserFilter from "./UserFilter";

type UserProp = {
    users: {
        id: string;
        email: string;
        name: string;
        image: string | null;
        username: string;
        role: Role;
        createdAt: Date;
    }[];
};

const roleStyles = {
    ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
    USER: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function UsersPage({ users }: UserProp) {

    return (
        <div className="max-w-7xl mx-auto p-6">

            {/* Header */}

            <div className="mb-8 flex items-start justify-between gap-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Users
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage users and their account roles.
                    </p>
                </div>


            </div>

            <div className="flex items-center mb-6">

                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                    ← Back to Dashboard
                </Link>

            </div>

            {/* Filters */}
            <UserFilter />

            {/* Users List */}
            <div className="space-y-5">
                {/* Section Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="mt-1 text-sm text-gray-400">
                            All registered users
                        </p>
                    </div>

                    <h1 className="text-sm text-gray-900">
                        Total Users: {users.length}
                    </h1>
                </div>

                {users.length === 0 ? (
                    /* No Users */
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                            <svg
                                className="h-7 w-7 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                />
                            </svg>
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-gray-900">
                            No users found
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
                            There are currently no registered users in your system.
                            New users will appear here once they create an account.
                        </p>
                    </div>
                ) : (
                    /* User List */
                    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

                        {/* Table Header */}
                        <div className="hidden border-b border-gray-100 bg-gray-50/70 px-6 py-4 lg:grid lg:grid-cols-[2fr_2fr_1fr_1.2fr_110px] lg:items-center lg:gap-6">

                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                                User
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                                Email
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                                Role
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                                Joined
                            </span>

                            <span className="text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                                Action
                            </span>
                        </div>

                        {/* Records */}
                        <div className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="group relative px-6 py-6 transition-all duration-300 hover:bg-[#fafaf8]"
                                >
                                    <div className="grid gap-5 lg:grid-cols-[2fr_2fr_1fr_1.2fr_110px] lg:items-center lg:gap-6">

                                        {/* User */}
                                        <div className="flex min-w-0 items-center gap-4">

                                            {/* Avatar */}
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name}
                                                    width={44}
                                                    height={44}
                                                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold uppercase text-white">
                                                    {user.name?.charAt(0)}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-gray-900">
                                                    {user.name}
                                                </p>

                                                <p className="mt-1 truncate text-sm text-gray-400">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="min-w-0">
                                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 lg:hidden">
                                                Email
                                            </p>

                                            <p className="truncate text-sm text-gray-600">
                                                {user.email}
                                            </p>
                                        </div>

                                        {/* Role */}
                                        <div>
                                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 lg:hidden">
                                                Role
                                            </p>

                                            <span
                                                className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${roleStyles[user.role]}`}
                                            >
                                                {user.role}
                                            </span>
                                        </div>

                                        {/* Joined */}
                                        <div>
                                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 lg:hidden">
                                                Joined
                                            </p>

                                            <p className="text-sm text-gray-600">
                                                {new Date(user.createdAt).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </p>
                                        </div>

                                        {/* Action */}
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/admin/user/${user.id}`}
                                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-all duration-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                                            >
                                                View
                                                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                                                    →
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}