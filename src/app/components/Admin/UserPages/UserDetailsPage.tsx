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
            <section className="min-h-screen bg-[#f5f4ef]">
                <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
                    <div className="relative mx-auto max-w-2xl border border-[#e2ded4] bg-[#faf9f6] px-8 py-20 text-center md:px-12">

                        {/* Editorial Accent */}
                        <div className="absolute left-1/2 top-0 h-px w-16 -translate-x-1/2 bg-[#9a8a74]" />

                        {/* Brand */}
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-8 bg-[#d1cbc1]" />

                            <span className="text-[7px] font-medium uppercase tracking-[0.45em] text-[#9a8a74]">
                                LUXE MEN
                            </span>

                            <span className="h-px w-8 bg-[#d1cbc1]" />
                        </div>

                        {/* Loading Bar */}
                        <div className="mx-auto mt-7 h-px w-20 overflow-hidden bg-[#ded9d0]">
                            <div className="h-full w-1/2 animate-[luxuryLoading_1.5s_ease-in-out_infinite] bg-[#9a8a74]" />
                        </div>

                        {/* Status */}
                        <p className="mt-6 text-[8px] uppercase tracking-[0.4em] text-[#aaa49b]">
                            Administration
                        </p>

                        {/* Heading */}
                        <h2 className="mt-4 font-serif text-3xl font-normal tracking-[0.01em] text-[#1b1a18] md:text-4xl">
                            Please Wait
                        </h2>

                        {/* Description */}
                        <p className="mx-auto mt-5 max-w-sm text-[11px] leading-6 text-[#817d75]">
                            We're retrieving the requested user details.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="min-h-screen bg-[#f5f4ef]">
                <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
                    <div className="relative mx-auto max-w-2xl overflow-hidden border border-[#e2ded4] bg-[#faf9f6] px-8 py-24 text-center md:px-12 md:py-28">

                        {/* Editorial Accent */}
                        <div className="absolute left-1/2 top-0 h-px w-20 -translate-x-1/2 bg-[#9a8a74]" />

                        {/* Brand Monogram */}
                        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#d4cfc5] bg-[#f5f4ef]">
                            <span className="font-serif text-[21px] font-normal tracking-[-0.08em] text-[#292824]">
                                LM
                            </span>
                        </div>

                        {/* Eyebrow */}
                        <p className="mt-8 text-[8px] font-medium uppercase tracking-[0.4em] text-[#9a8a74]">
                            Admin / User Management
                        </p>

                        {/* Heading */}
                        <h2 className="mt-5 font-serif text-3xl font-normal tracking-[0.01em] text-[#1b1a18] md:text-4xl">
                            User Not Found
                        </h2>

                        {/* Description */}
                        <p className="mx-auto mt-5 max-w-md text-[12px] leading-7 text-[#817d75]">
                            This user could not be found, or you may not have permission to access their administrative details.
                        </p>

                        {/* CTA */}
                        <Link
                            href="/admin/user"
                            className="group relative mt-10 inline-flex items-center gap-5 border border-[#1b1a18] bg-[#1b1a18] px-9 py-4 text-[9px] font-medium uppercase tracking-[0.28em] text-[#faf9f6] transition-all duration-500 hover:border-[#6f604e] hover:bg-[#6f604e]"
                        >
                            <span>Back to Users</span>

                            <span className="text-sm font-light transition-transform duration-500 ease-out group-hover:-translate-x-1">
                                ←
                            </span>
                        </Link>

                        {/* Bottom Detail */}
                        <div className="mx-auto mt-12 flex items-center justify-center gap-4">
                            <span className="h-px w-8 bg-[#d6d2ca]" />

                            <span className="text-[7px] uppercase tracking-[0.32em] text-[#aaa69e]">
                                Administration Portal
                            </span>

                            <span className="h-px w-8 bg-[#d6d2ca]" />
                        </div>
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
        <section className="min-h-screen w-full bg-[#f7f6f2]">
            <div>
                {/* Back */}
                <Link
                    href="/admin/user"
                    className="group inline-flex items-center gap-2 border-b border-[#d9d5cd] pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#171512] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#6f604e]"
                >
                    <span className="text-[13px] leading-none transition-transform duration-300 group-hover:-translate-x-1">
                        ←
                    </span>

                    <span>Back to Users</span>
                </Link>

                {/* User Header */}
                <div className="mt-8 flex flex-col gap-6 border-b border-[#dedbd4] pb-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        {/* Eyebrow */}
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-px w-7 bg-[#9a8a74]" />

                            <p className="text-[8px] uppercase tracking-[0.28em] text-[#aaa69e]">
                                Admin / User Management
                            </p>
                        </div>

                        {/* Profile */}
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-[#dedbd4] bg-[#eeece5] sm:h-18 sm:w-18">
                                {profile.image ? (
                                    <Image
                                        src={profile.image}
                                        alt={profile.name}
                                        width={72}
                                        height={72}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserRound className="h-7 w-7 text-[#aaa49b]" />
                                )}
                            </div>

                            <div className="min-w-0">
                                <h1 className="wrap-break-word font-serif text-2xl font-normal tracking-[0.02em] text-[#1b1a18] sm:text-3xl">
                                    {profile.name}
                                </h1>

                                <p className="mt-2 text-[10px] tracking-[0.06em] text-[#817d75]">
                                    @{profile.username}
                                </p>
                            </div>
                        </div>

                        {/* User Metadata */}
                        <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#dedbd4] pt-6 sm:grid-cols-4 sm:gap-x-8">
                            {/* User ID */}
                            <div className="min-w-0">
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                    User ID
                                </p>

                                <p className="mt-2 break-all text-[10px] leading-5 text-[#57534c]">
                                    {profile.id}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="min-w-0">
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                    Email Address
                                </p>

                                <p className="mt-2 break-all text-[10px] leading-5 text-[#57534c]">
                                    {profile.email}
                                </p>
                            </div>

                            {/* Orders */}
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                    Total Orders
                                </p>

                                <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-[#57534c]">
                                    {statistics.orders}{" "}
                                    {statistics.orders === 1
                                        ? "Order"
                                        : "Orders"}
                                </p>
                            </div>

                            {/* Joined */}
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa69e]">
                                    Member Since
                                </p>

                                <p className="mt-2 text-[10px] leading-5 text-[#57534c]">
                                    {formatDate(profile.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                        <span
                            className={`border px-4 py-2 text-[8px] uppercase tracking-[0.16em] ${roleStyles[profile.role]
                                }`}
                        >
                            Role: {profile.role}
                        </span>

                        <span
                            className={`border px-4 py-2 text-[8px] uppercase tracking-[0.16em] ${isVerified
                                    ? verificationStyles.verified
                                    : verificationStyles.unverified
                                }`}
                        >
                            {isVerified ? "Verified" : "Unverified"}
                        </span>
                    </div>
                </div>

                {/* User Content */}
                <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_0.9fr] lg:gap-10">
                    {/* Main Column */}
                    <div className="min-w-0 space-y-6">
                        {/* Addresses */}
                        <UserAddresses
                            addresses={user.addresses}
                        />

                        {/* Order History */}
                        <UserOrders
                            orders={user.orders}
                        />
                    </div>

                    {/* Admin Sidebar */}
                    <div className="min-w-0 space-y-6">
                        {/* User Information */}
                        <UserInformation user={profile} />

                        {/* Account Statistics */}
                        <AccountStatistics
                            totalOrders={statistics.orders}
                            totalSpent={statistics.totalSpent}
                        />

                        {/* Admin Controls */}
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
            </div>
        </section>
    );
}