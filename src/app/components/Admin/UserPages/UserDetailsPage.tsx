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

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const roleStyles = {
    ADMIN: "bg-purple-100 text-purple-700",
    USER: "bg-slate-200 text-slate-700",
} as const;

const verificationStyles = {
    verified: "bg-green-100 text-green-700",
    unverified: "bg-amber-100 text-amber-700",
} as const;

export default function UserDetailPage({ id }: Props) {
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserDetail = async () => {
        try {
            const res = await fetch(`/api/user/${id}`);

            const data = await res.json();

            if (!res.ok) {
                toast.error(
                    data.message || "Failed to load user"
                );
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

    if (loading) {
        return (
            <section className="w-full px-6 py-20">

                <div className="mx-auto max-w-2xl border border-slate-200 bg-white px-12 py-20 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50">

                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />

                    </div>

                    <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                        User
                    </p>

                    <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.16em] text-slate-900">
                        Please Wait
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
                        We're processing your request.
                        Please wait while we're retrieving
                        your user details.
                    </p>

                </div>

            </section>
        );
    }

    if (!user) {
        return (
            <section className="w-full px-6 py-20">

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
                        The user you're looking for doesn't
                        exist or you don't have permission
                        to view it.
                    </p>

                    <div className="mt-9 flex items-center justify-center">

                        <Link
                            href="/admin/user"
                            className="group inline-flex h-11 items-center justify-center gap-3 border border-black bg-black px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-white hover:text-black"
                        >
                            <span className="text-lg font-light leading-none transition-transform duration-300 group-hover:rotate-90">
                                +
                            </span>

                            Back to Users
                        </Link>

                    </div>

                </div>

            </section>
        );
    }

    const profile = user.profile;
    const statistics = user.statistics;

    const isVerified = Boolean(
        profile.emailVerified
    );

    return (
        <section className="w-full px-6">

            {/* Back */}

            <Link
                href="/admin/user"
                className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >

                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition group-hover:-translate-x-0.5 group-hover:border-slate-300">
                    ←
                </span>

                Back to Users

            </Link>

            {/* HEADER */}

            <div className="mb-10 flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">

                <div className="min-w-0">

                    {/* Breadcrumb */}

                    <div className="mb-3 flex items-center gap-3">

                        <span className="h-px w-8 bg-slate-950" />

                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                            Store / Users
                        </p>

                    </div>


                    {/* Profile */}

                    <div className="flex items-center gap-5">

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-sm">

                            {profile.image ? (

                                <Image
                                    src={profile.image}
                                    alt={profile.name}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                />

                            ) : (

                                <UserRound className="h-7 w-7 text-slate-400" />

                            )}

                        </div>


                        <div className="min-w-0">

                            <h1 className="truncate text-2xl font-light uppercase tracking-[0.08em] text-slate-950 sm:text-3xl">
                                {profile.name}
                            </h1>

                            <p className="mt-2 text-xs text-slate-500">
                                @{profile.username}
                            </p>

                        </div>

                    </div>


                    {/* Metadata */}

                    <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-slate-200 pt-6 sm:grid-cols-4">

                        {/* User ID */}

                        <div className="min-w-0">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                User ID
                            </p>

                            <p className="mt-2 break-all text-xs text-slate-700">
                                {profile.id}
                            </p>

                        </div>


                        {/* Email */}

                        <div className="min-w-0">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Email
                            </p>

                            <p className="mt-2 break-all text-xs text-slate-700">
                                {profile.email}
                            </p>

                        </div>


                        {/* Orders */}

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Orders
                            </p>

                            <p className="mt-2 text-xs text-slate-700">
                                {statistics.orders} Products
                            </p>

                        </div>


                        {/* Joined */}

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Joined
                            </p>

                            <p className="mt-2 text-xs text-slate-700">
                                {formatDate(
                                    profile.createdAt
                                )}
                            </p>

                        </div>

                    </div>

                </div>


                {/* Status */}

                <div className="flex flex-wrap gap-3">

                    <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${roleStyles[
                            profile.role
                        ]}`}
                    >
                        {profile.role}
                    </span>

                    <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${isVerified
                                ? verificationStyles.verified
                                : verificationStyles.unverified
                            }`}
                    >
                        {isVerified
                            ? "Verified"
                            : "Unverified"}
                    </span>

                </div>

            </div>


            {/* CONTENT */}

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_0.9fr]">

                {/* LEFT */}

                <div className="space-y-8">

                    <UserAddresses
                        addresses={user.addresses}
                    />

                    <UserOrders
                        orders={user.orders}
                    />

                </div>


                {/* RIGHT */}

                <div className="space-y-8">

                    <UserInformation
                        user={profile}
                    />

                    <AccountStatistics
                        totalOrders={
                            statistics.orders
                        }
                        totalSpent={
                            statistics.totalSpent
                        }
                    />

                    <UserAdminActions
                        userId={profile.id}
                        role={profile.role}
                        accountDeletionStatus={
                            profile.accountDeletionStatus
                        }
                        accountDeletionReason={
                            profile.accountDeletionReason
                        }
                        accountDeletionRequestedAt={
                            profile.accountDeletionRequestedAt
                        }
                    />

                </div>

            </div>

        </section>
    );
}