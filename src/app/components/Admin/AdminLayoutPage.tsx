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
    <main className="min-h-screen -mt-11 bg-[#f5f4ef] text-[#1b1a18]">
        <div className="flex min-h-screen">

            {/* ================= DESKTOP SIDEBAR ================= */}
            <aside className="hidden w-64 shrink-0 border-r border-[#dedbd4] bg-[#faf9f6] p-6 lg:block">

                {/* Logo */}
                <Link href="/admin" className="mb-12 block border-b border-[#e8e4dc] pb-8">
                    <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#9b8150]">
                        Luxe
                    </p>

                    <h1 className="mt-2 font-serif text-3xl font-normal tracking-[0.18em] text-[#1b1a18]">
                        MEN
                    </h1>

                    <p className="mt-3 text-[8px] uppercase tracking-[0.22em] text-[#aaa49b]">
                        Administration
                    </p>
                </Link>

                {/* Navigation Label */}
                <p className="mb-3 px-3 text-[8px] font-medium uppercase tracking-[0.25em] text-[#aaa49b]">
                    Workspace
                </p>

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
                                className={`group relative flex w-full items-center justify-between border px-3.5 py-3 text-left text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                                    isActive
                                        ? "border-[#ded5c4] bg-[#f0ece3] text-[#6f604e]"
                                        : "border-transparent text-[#817d75] hover:border-[#e8e4dc] hover:bg-[#f5f3ed] hover:text-[#34312c]"
                                }`}
                            >
                                <span>{item.label}</span>

                                {isActive ? (
                                    <span className="h-1 w-1 bg-[#9b8150]" />
                                ) : (
                                    <span className="text-[#b49a6c] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        ↗
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="mt-12 border-t border-[#e8e4dc] pt-5">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa49b]">
                        LUXE MEN
                    </p>
                    <p className="mt-1.5 text-[9px] text-[#817d75]">
                        Store Management
                    </p>
                </div>
            </aside>

            {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-[#1b1a18]/40 lg:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* ================= MOBILE SIDEBAR ================= */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-[#dedbd4] bg-[#faf9f6] p-6 transition-transform duration-300 lg:hidden ${
                    mobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {/* Mobile Logo */}
                <div className="mb-10 flex items-start justify-between border-b border-[#e8e4dc] pb-7">
                    <Link href="/admin" onClick={closeMobileMenu}>
                        <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#9b8150]">
                            Luxe
                        </p>

                        <h1 className="mt-2 font-serif text-3xl font-normal tracking-[0.18em] text-[#1b1a18]">
                            MEN
                        </h1>

                        <p className="mt-3 text-[8px] uppercase tracking-[0.22em] text-[#aaa49b]">
                            Administration
                        </p>
                    </Link>

                    {/* Close */}
                    <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="flex h-9 w-9 items-center justify-center border border-[#dedbd4] text-xl font-light text-[#817d75] transition-colors duration-300 hover:border-[#9b8150] hover:text-[#6f604e]"
                        aria-label="Close menu"
                    >
                        ×
                    </button>
                </div>

                {/* Mobile Navigation */}
                <p className="mb-3 px-3 text-[8px] font-medium uppercase tracking-[0.25em] text-[#aaa49b]">
                    Workspace
                </p>

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
                                className={`group flex w-full items-center justify-between border px-3.5 py-3.5 text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                                    isActive
                                        ? "border-[#ded5c4] bg-[#f0ece3] text-[#6f604e]"
                                        : "border-transparent text-[#817d75] hover:border-[#e8e4dc] hover:bg-[#f5f3ed] hover:text-[#34312c]"
                                }`}
                            >
                                <span>{item.label}</span>

                                {isActive ? (
                                    <span className="h-1 w-1 bg-[#9b8150]" />
                                ) : (
                                    <span className="text-[#b49a6c] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        ↗
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Footer */}
                <div className="mt-10 border-t border-[#e8e4dc] pt-5">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#aaa49b]">
                        LUXE MEN
                    </p>
                    <p className="mt-1.5 text-[9px] text-[#817d75]">
                        Store Management
                    </p>
                </div>
            </aside>

            {/* ================= MAIN ================= */}
            <section className="min-w-0 flex-1">

                {/* ================= HEADER ================= */}
                <header className="border-b border-[#dedbd4] bg-[#faf9f6]">
                    <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10 lg:py-5">

                        {/* Left */}
                        <div className="flex min-w-0 items-center gap-3">

                            {/* Mobile Menu Button */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#dedbd4] bg-[#fdfcf9] text-[#57534c] transition-colors duration-300 hover:border-[#9b8150] hover:text-[#6f604e] lg:hidden"
                                aria-label="Open menu"
                            >
                                <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path
                                        d="M4 6h16M4 12h16M4 18h16"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="hidden h-px w-5 bg-[#b49a6c] sm:block" />
                                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#9b8150] sm:text-[9px] sm:tracking-[0.25em]">
                                        Administration
                                    </p>
                                </div>

                                <h2 className="mt-1 truncate font-serif text-lg font-normal text-[#1b1a18] sm:text-xl">
                                    {currentPage}
                                </h2>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex shrink-0 items-center gap-3 sm:gap-4">

                            {/* Store */}
                            <Link
                                href="/"
                                className="hidden items-center gap-2 border border-[#dedbd4] bg-[#fdfcf9] px-4 py-2.5 text-[9px] uppercase tracking-[0.12em] text-[#57534c] transition-colors duration-300 hover:border-[#9b8150] hover:text-[#6f604e] sm:inline-flex"
                            >
                                <span>View Store</span>
                                <span className="text-[#9b8150]">↗</span>
                            </Link>

                            {/* Avatar */}
                            <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#c8bb94] bg-[#f0ece3] font-serif text-xs text-[#6f604e]"
                                aria-label="Admin profile"
                            >
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ================= PAGE CONTENT ================= */}
                <div className="w-full min-w-0 p-4 sm:p-6 lg:p-10">
                    {children}
                </div>

            </section>
        </div>
    </main>
);

}