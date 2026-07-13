"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const { data: session } = useSession();

    const user = session?.user;

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const closeMenu = () => setProfileOpen(false);

        if (profileOpen) {
            window.addEventListener("click", closeMenu);
        }

        return () => {
            window.removeEventListener("click", closeMenu);
        };
    }, [profileOpen]);

    const active = pathname === "/" ? "home" : pathname.replace("/", "");

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Collections", path: "/collections" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <nav
            className={`fixed top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${scrolled ? "bg-white/80 shadow-sm" : "bg-transparent"
                } ${menuOpen ? "pt-5 pb-5" : "pt-4 pb-4"} md:pt-0 md:pb-0`}
        >
            <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navItems.map(({ name, path }) => {
                        const isActive = active === name.toLowerCase();

                        return (
                            <Link
                                key={name}
                                href={path}
                                className={`text-[15px] font-medium transition ${isActive
                                    ? "rounded-full bg-black px-4 py-2 text-white shadow-sm"
                                    : "text-black hover:text-cyan-600"
                                    }`}
                            >
                                {name}
                            </Link>
                        );
                    })}
                </div>

                {/* Logo */}
                <div
                    onClick={() =>
                        window.innerWidth >= 768
                            ? router.push("/")
                            : setMenuOpen((prev) => !prev)
                    }
                    className="absolute left-1/2 -translate-x-1/2 cursor-pointer select-none transition hover:opacity-80"
                >
                    <div className="flex items-center">
                        <span className="rounded-l-md bg-black px-3 py-1 font-semibold text-white">
                            LUXE
                        </span>

                        <span className="rounded-r-md border border-black bg-white px-3 py-1 font-semibold text-black">
                            MEN
                        </span>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="absolute right-4 text-2xl md:hidden"
                >
                    ☰
                </button>

                {/* Desktop Right */}
                <div className="hidden items-center gap-5 md:flex">
                    {!user ? (
                        <Link
                            href="/login"
                            className="text-[15px] font-medium text-black hover:text-cyan-600"
                        >
                            Login
                        </Link>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setProfileOpen((prev) => !prev);
                                }}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white ring-2 ring-transparent transition hover:ring-gray-300"
                            >
                                {initials}
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                                    <div className="border-b border-gray-100 px-5 py-4">
                                        <p className="font-semibold text-gray-900">
                                            {user.name}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {user.email?.replace(/(.{2}).+(@.+)/, "$1****$2")}
                                        </p>
                                    </div>
                                    {user.role === "ADMIN" && (
                                        <div className="px-5 pt-3">
                                            <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                                                ADMIN
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push("/profile");
                                            setProfileOpen(false);
                                        }}
                                        className="block w-full px-5 py-3 text-left text-sm transition hover:bg-gray-100"
                                    >
                                        Profile
                                    </button>

                                    {user.role === "ADMIN" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push("/admin");
                                                setProfileOpen(false);
                                            }}
                                            className="block w-full px-5 py-3 text-left text-sm transition hover:bg-gray-100"
                                        >
                                            Admin Dashboard
                                        </button>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setProfileOpen(false);
                                            signOut({ callbackUrl: "/login" });
                                        }}
                                        className="block w-full px-5 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mt-4 md:hidden">
                    <div className="rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
                        <div className="flex flex-col gap-2">
                            {navItems.map(({ name, path }) => {
                                const isActive = active === name.toLowerCase();

                                return (
                                    <Link
                                        key={name}
                                        href={path}
                                        onClick={() => setMenuOpen(false)}
                                        className={`rounded-2xl px-4 py-3 text-center text-[16px] font-medium transition-all duration-300 ${isActive
                                            ? "bg-black text-white"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                            }`}
                                    >
                                        {name}
                                    </Link>
                                );
                            })}

                            <div className="my-4 border-t border-gray-200" />

                            {!user ? (
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-2xl border border-black px-4 py-3 text-center font-medium text-black transition hover:bg-black hover:text-white"
                                >
                                    Login
                                </Link>
                            ) : (
                                <>
                                    {/* User Card */}
                                    <div className="mb-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                                                {initials}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-gray-900">
                                                    {user.name}
                                                </p>

                                                <p className="truncate text-xs text-gray-500">
                                                    {user.email?.replace(/(.{2}).+(@.+)/, "$1****$2")}
                                                </p>

                                                {user.role === "ADMIN" && (
                                                    <span className="mt-2 inline-flex rounded-full bg-black px-2.5 py-1 text-[10px] font-medium tracking-wider text-white">
                                                        ADMIN
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href="/profile"
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-2xl px-4 py-3 text-center font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
                                    >
                                        Profile
                                    </Link>

                                    {user.role === "ADMIN" && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setMenuOpen(false)}
                                            className="rounded-2xl px-4 py-3 text-center font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => signOut({ callbackUrl: "/login" })}
                                        className="rounded-2xl border border-red-200 px-4 py-3 text-center font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </nav>
    );
}