"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

type AdminLayoutProps = {
    children: ReactNode;
    adminName: string;
};

const navItems = [
    {
        label: "Overview",
        href: "/admin",
    },
    {
        label: "Customers",
        href: "/admin/user",
    },
    {
        label: "Orders",
        href: "/admin/orders",
    },
    {
        label: "Products",
        href: "/admin/products",
    },
    {
        label: "Category",
        href: "/admin/category",
    },
    {
        label: "Brand",
        href: "/admin/brand",
    },
];

export default function AdminLayoutPage({
    children,
    adminName
}: AdminLayoutProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const initials = adminName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const currentPage =
        pathname === "/admin"
            ? "Overview"
            : navItems.find((item) =>
                  pathname.startsWith(item.href)
              )?.label ?? "Administration";

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#111111]">
            <div className="flex min-h-screen">

                {/* ================= DESKTOP SIDEBAR ================= */}
                <aside className="hidden w-64 shrink-0 border-r border-black/10 bg-white p-6 lg:block">

                    {/* Logo */}
                    <div className="mb-12">
                        <p className="text-xs uppercase tracking-[0.35em] text-black/40">
                            Luxe
                        </p>

                        <h1 className="mt-2 text-2xl font-light tracking-[0.2em]">
                            MEN
                        </h1>
                        
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive =
                                item.href === "/admin"
                                    ? pathname === "/admin"
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                                        isActive
                                            ? "bg-[#111111] text-white"
                                            : "text-black/50 hover:bg-black/5 hover:text-black"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                        onClick={closeMobileMenu}
                    />
                )}

                {/* ================= MOBILE SIDEBAR ================= */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-xl transition-transform duration-300 lg:hidden ${
                        mobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }`}
                >
                    {/* Mobile Logo */}
                    <div className="mb-10 flex items-start justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-black/40">
                                Luxe
                            </p>

                            <h1 className="mt-2 text-2xl font-light tracking-[0.2em]">
                                MEN
                            </h1>
                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            onClick={closeMobileMenu}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-xl text-black/60 hover:bg-black/5"
                            aria-label="Close menu"
                        >
                            ×
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive =
                                item.href === "/admin"
                                    ? pathname === "/admin"
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className={`block w-full rounded-xl px-4 py-3 text-sm transition ${
                                        isActive
                                            ? "bg-[#111111] text-white"
                                            : "text-black/50 hover:bg-black/5 hover:text-black"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* ================= MAIN ================= */}
                <section className="min-w-0 flex-1">

                    {/* ================= HEADER ================= */}
                    <header className="border-b border-black/10 bg-white">

                        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10 lg:py-5">

                            {/* Left */}
                            <div className="flex items-center gap-3">

                                {/* Mobile Menu Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileMenuOpen(true)
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-black/70 hover:bg-black/5 lg:hidden"
                                    aria-label="Open menu"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            d="M4 6h16M4 12h16M4 18h16"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-black/30 sm:text-xs sm:tracking-[0.3em]">
                                        Administration
                                    </p>

                                    <h2 className="mt-1 text-lg font-medium sm:text-xl">
                                        {currentPage}
                                    </h2>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="flex items-center gap-2 sm:gap-4">

                                {/* Store */}
                                <Link
                                    href="/"
                                    className="hidden rounded-full border border-black/10 px-4 py-2 text-xs text-black/60 transition hover:border-black/30 hover:text-black sm:block"
                                >
                                    View Store
                                </Link>

                                {/* Avatar */}
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs text-white">
                                    {initials}
                                </div>
                            </div>
                        </div>

                    </header>

                    {/* ================= PAGE CONTENT ================= */}
                    <div className="w-full p-4 sm:p-6 lg:p-10">
                        {children}
                    </div>

                </section>
            </div>
        </main>
    );
}