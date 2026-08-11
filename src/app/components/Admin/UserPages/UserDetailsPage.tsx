"use client";

import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import UserInformation from "./UserInformation";
import UserAddresses from "./UserAddresses";
import AccountStatistics from "./AccountStatistics";
import UserAdminActions from "./UserAdminActions";
import UserOrders from "./UserOrder";

type Props = {
    id: string;
};

type UserProfile = {
    id: string;
    email: string;
    name: string;
    username: string;
    image: string | null;
    role: "USER" | "ADMIN";

    accountDeletionStatus: "NONE" | "REQUESTED" | "REJECTED";
    accountDeletionReason: string | null;
    accountDeletionRequestedAt: string | null;

    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;

};

type UserAddress = {
    id: string;
    fullname: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    countryCode: string;
};

type UserOrder = {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    total: number;
    createdAt: string;
};

type UserStatistics = {
    orders: number;
    addresses: number;
    totalSpent: number;
};

type OrderSummary = {
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalSpent: number;
};

type UserDetail = {
    profile: UserProfile;
    statistics: UserStatistics;
    orderSummary: OrderSummary;
    addresses: UserAddress[];
    orders: UserOrder[];
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

export default function UserDetailPage({ id }: Props) {
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserDetail = async () => {
        try {
            const res = await fetch(`/api/user/${id}`);

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to load user");
                return;
            }

            setUser(data.data);
        } catch {
            toast.error("Failed to load user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetail();

        const interval = setInterval(() => {
            fetchUserDetail();
        }, 10000);

        return () => clearInterval(interval);
    }, [id]);


    if (!user) {
        return (
            <section className="mx-auto max-w-7xl px-6 py-14">
                <Link
                    href="/admin/user"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                    ← Back to Users
                </Link>

                <div className="mt-10">
                    <p className="text-sm text-neutral-500">
                        User not found.
                    </p>
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="mx-auto max-w-2xl border border-neutral-200 bg-white px-12 py-20 text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />

                    <p className="mt-8 text-xs uppercase tracking-[0.35em] text-neutral-500">
                        Loading User
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em]">
                        Please Wait
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm text-neutral-500">
                        We're retrieving your User details.
                    </p>

                </div>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="mx-auto max-w-2xl border border-neutral-200 bg-white px-12 py-20 text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neutral-200 text-3xl">
                        !
                    </div>

                    <p className="mt-8 text-xs uppercase tracking-[0.35em] text-neutral-500">
                        User
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em]">
                        User Not Found
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm text-neutral-500">
                        The User you're looking for doesn't exist or you don't have
                        permission to view it.
                    </p>

                    <Link
                        href="/admin/user"
                        className="mt-10 inline-flex border border-black px-8 py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-black hover:text-white"
                    >
                        Back to User
                    </Link>

                </div>
            </section>
        );
    }

    const profile = user.profile;
    const statistics = user.statistics;

    return (
        <section className="mx-auto max-w-7xl px-6 py-14">

            {/* Back */}

            <Link
                href="/admin/user"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
                ← Back to Users
            </Link>


            {/* HEADER */}

            <div className="mt-8 flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">

                <div>

                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                        User
                    </p>

                    <div className="mt-4 flex items-center gap-5">

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">

                            {profile.image ? (
                                <Image
                                    src={profile.image}
                                    alt={profile.name}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <UserRound className="h-7 w-7 text-neutral-400" />
                            )}

                        </div>

                        <div>

                            <h1 className="text-2xl font-medium tracking-[0.08em]">
                                {profile.name}
                            </h1>

                            <p className="mt-1 text-sm text-neutral-500">
                                @{profile.username}
                            </p>

                        </div>

                    </div>


                    {/* User Stats */}

                    <div className="mt-6 grid grid-cols-2 gap-8 border-t border-neutral-200 pt-6 md:grid-cols-4">

                        <div>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                                User ID
                            </p>

                            <p className="mt-2 break-all text-xs text-neutral-800">
                                {profile.id}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                                Orders
                            </p>

                            <p className="mt-2 text-xs text-neutral-800">
                                {statistics.orders}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                                Total Spent
                            </p>

                            <p className="mt-2 text-xs text-neutral-800">
                                {formatCurrency(statistics.totalSpent)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                                Joined
                            </p>

                            <p className="mt-2 text-xs text-neutral-800">
                                {formatDate(profile.createdAt)}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Status */}

                <div className="flex gap-3">

                    <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${profile.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                    >
                        {profile.role}
                    </span>

                    <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${profile.emailVerified
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                    >
                        {profile.emailVerified
                            ? "Verified"
                            : "Unverified"}
                    </span>

                </div>

            </div>


            {/* CONTENT */}

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_0.9fr]">

                {/* LEFT */}

                <div className="space-y-8">

                    <UserAddresses addresses={user.addresses} />

                    <UserOrders orders={user.orders} />


                </div>


                {/* RIGHT */}

                <div className="space-y-8">

                    <UserInformation user={profile} />

                    <AccountStatistics
                        totalOrders={statistics.orders}
                        totalSpent={statistics.totalSpent}
                    />

                    <UserAdminActions
                        userId={profile.id}
                        role={profile.role}
                        accountDeletionStatus={profile.accountDeletionStatus}
                        accountDeletionReason={profile.accountDeletionReason}
                        accountDeletionRequestedAt={profile.accountDeletionRequestedAt}
                    />

                </div>

            </div>

        </section>
    );
}