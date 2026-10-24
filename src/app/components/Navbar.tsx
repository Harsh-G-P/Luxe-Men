
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import MiniCart from "./MiniCart";
import {
    Menu,
    X,
    UserRound,
    ChevronDown,
    BriefcaseBusiness,
    Heart,
} from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [miniCartOpen, setMiniCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
        : "?";

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Collections", path: "/collections" },
        { name: "Lookbook", path: "/lookbook" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!user) {
            setCartCount(0);
            return;
        }

        const fetchCart = async () => {
            try {
                const res = await fetch("/api/cart");
                const data = await res.json();

                if (res.ok && data.success) {
                    setCartCount(data.data.items.length);
                }
            } catch (error) {
                console.error("Failed to fetch cart:", error);
            }
        };

        fetchCart();
        window.addEventListener("cartUpdated", fetchCart);

        return () => window.removeEventListener("cartUpdated", fetchCart);
    }, [user]);

    useEffect(() => {
        const handleOpenMiniCart = () => setMiniCartOpen(true);

        window.addEventListener("openMiniCart", handleOpenMiniCart);

        return () =>
            window.removeEventListener("openMiniCart", handleOpenMiniCart);
    }, []);

    useEffect(() => {
        const closeProfile = () => setProfileOpen(false);

        if (profileOpen) {
            window.addEventListener("click", closeProfile);
        }

        return () => window.removeEventListener("click", closeProfile);
    }, [profileOpen]);

    const handleCartClick = () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (cartCount === 0) {
            toast.error("Your shopping bag is empty");
            return;
        }

        setMiniCartOpen(true);
        setMenuOpen(false);
    };

    return pathname.startsWith("/admin") ? null : (
        <>
            <header
                className={`
                    fixed inset-x-0 top-0 z-50
                    border-b transition-all duration-300
                    ${scrolled || menuOpen
                        ? "border-black/10 bg-[#faf9f6]/95 shadow-[0_4px_24px_rgba(0,0,0,0.03)] backdrop-blur-xl"
                        : "border-transparent bg-[#faf9f6]/80 backdrop-blur-md"
                    }
                `}
            >

                <div className="relative mx-auto grid h-16 max-w-400 grid-cols-[1fr_auto_1fr] items-center px-3 min-[380px]:px-4 sm:px-5 md:h-19 md:px-10 lg:px-14">


                    {/* LEFT: NAVIGATION */}
                    <div className="flex items-center justify-start">
                        <button
                            type="button"
                            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className=" group relative flex items-center gap-2.5 py-2 text-[#302923] transition-colors duration-300 hover:text-[#a58a62] "
                        >
                            <span className="relative flex h-5 w-5 items-center justify-center">
                                <Menu
                                    size={19}
                                    strokeWidth={1}
                                    className={` absolute transition-all duration-300 ${menuOpen
                                        ? "rotate-90 scale-75 opacity-0"
                                        : "rotate-0 scale-100 opacity-100"
                                        } `}
                                />
                                <X
                                    size={19}
                                    strokeWidth={1}
                                    className={` absolute transition-all duration-300 ${menuOpen
                                        ? "rotate-0 scale-100 opacity-100"
                                        : "-rotate-90 scale-75 opacity-0"
                                        } `}
                                />
                            </span>

                            <span className="hidden text-[9px] font-medium uppercase tracking-[0.24em] sm:inline">
                                {menuOpen ? "Close" : "Menu"}
                            </span>

                            <span
                                aria-hidden="true"
                                className=" absolute bottom-0 left-0 h-px w-0 bg-[#b9a17e] transition-all duration-300 group-hover:w-full "
                            />
                        </button>
                    </div>

                    {/* CENTER: LOGO */}
                    <Link
                        href="/"
                        aria-label="Luxe Men home"
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center justify-center"
                    >
                        <span className="relative flex items-baseline text-[17px] font-medium tracking-[0.22em] text-[#302923] sm:text-[19px]">
                            LUXE

                            <span className="ml-2 font-light tracking-[0.28em] transition-colors duration-500 group-hover:text-[#a58a62]">
                                MEN
                            </span>

                            <span
                                aria-hidden="true"
                                className=" absolute -bottom-2 left-0 h-px w-full origin-center scale-x-0 bg-[#b9a17e] transition-transform duration-500 ease-out group-hover:scale-x-100 "
                            />
                        </span>
                    </Link>

                    {/* RIGHT: CART + PROFILE */}

                    <div className="flex min-w-0 items-center justify-end gap-0.5 min-[380px]:gap-1.5 sm:gap-5">

                        <button
                            type="button"
                            onClick={handleCartClick}
                            aria-label={`Shopping bag${cartCount ? `, ${cartCount} items` : ""}`}
                            className=" group relative flex h-9 w-9 items-center justify-center text-[#302923] transition-colors duration-300 hover:text-[#a58a62] "
                        >
                            <BriefcaseBusiness
                                size={19}
                                strokeWidth={1}
                                className=" transition-all duration-500 ease-out group-hover:-translate-y-0.5 "
                            />

                            {cartCount > 0 && (
                                <span
                                    className=" absolute right-0 top-0 flex h-3.5 min-w-3.5 items-center justify-center border border-[#faf9f6] bg-[#b9a17e] px-0.75 text-[8px] font-medium leading-none text-white "
                                >
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}

                            <span
                                aria-hidden="true"
                                className=" absolute bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b9a17e] transition-all duration-300 group-hover:w-4 "
                            />
                        </button>

                        <Link
                            href="/wishlist"
                            aria-label="Wishlist"
                            className=" group relative flex h-9 w-9 items-center justify-center text-[#302923] transition-colors duration-300 hover:text-[#a58a62] "
                        >
                            <Heart
                                size={19}
                                strokeWidth={1}
                                className=" transition-all duration-500 ease-out group-hover:scale-110 group-hover:fill-[#b9a17e]/15 "
                            />

                            <span
                                aria-hidden="true"
                                className=" absolute bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b9a17e] transition-all duration-300 group-hover:w-4 "
                            />
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    aria-label="Open account menu"
                                    aria-expanded={profileOpen}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setProfileOpen((prev) => !prev);
                                    }}
                                    className=" group relative flex h-8 w-8 items-center justify-center rounded-full border border-[#302923]/20 text-[10px] font-medium tracking-[0.08em] text-[#302923] transition-all duration-300 hover:border-[#b9a17e] hover:text-[#a58a62] "
                                >
                                    {initials}
                                    <span
                                        className=" absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#b9a17e] opacity-0 transition-opacity duration-300 group-hover:opacity-100 "
                                    />
                                </button>

                                {profileOpen && (
                                    <div
                                        onClick={(event) => event.stopPropagation()}
                                        className=" absolute right-0 top-full z-50 mt-4 w-72 border border-[#302923]/10 bg-[#faf9f6] py-2 shadow-[0_18px_55px_rgba(48,41,35,0.12)] animate-in fade-in slide-in-from-top-1 duration-200 "
                                    >
                                        {/* Account details */}
                                        <div className="px-5 pb-5 pt-4">
                                            <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.28em] text-[#a58a62]">
                                                Your Account
                                            </p>

                                            <p className="truncate font-serif text-lg font-normal text-[#302923]">
                                                {user.name || "Valued Customer"}
                                            </p>

                                            <p className="mt-1.5 truncate text-[11px] tracking-wide text-[#81776d]">
                                                {user.email}
                                            </p>

                                            {user.role === "ADMIN" && (
                                                <span className="mt-3 inline-block border border-[#b9a17e]/40 px-2 py-1 text-[8px] uppercase tracking-[0.2em] text-[#8b714b]">
                                                    Administrator
                                                </span>
                                            )}
                                        </div>

                                        <div className="mx-5 h-px bg-[#302923]/10" />

                                        {/* Account navigation */}
                                        <div className="py-2">
                                            <Link
                                                href="/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className=" group flex items-center justify-between px-5 py-3.5 text-[11px] tracking-[0.04em] text-[#51483f] transition-colors duration-200 hover:bg-[#f1eee6] hover:text-[#a58a62] "
                                            >
                                                <span>My Account</span>
                                                <span className="-translate-x-1 text-[#b9a17e] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                                                    →
                                                </span>
                                            </Link>

                                            {user.role === "ADMIN" && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setProfileOpen(false)}
                                                    className=" group flex items-center justify-between px-5 py-3.5 text-[11px] tracking-[0.04em] text-[#51483f] transition-colors duration-200 hover:bg-[#f1eee6] hover:text-[#a58a62] "
                                                >
                                                    <span>Admin Dashboard</span>
                                                    <span className="-translate-x-1 text-[#b9a17e] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                                                        →
                                                    </span>
                                                </Link>
                                            )}
                                        </div>

                                        <div className="mx-5 h-px bg-[#302923]/10" />

                                        {/* Sign out */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileOpen(false);
                                                signOut({ callbackUrl: "/login" });
                                            }}
                                            className=" group flex w-full items-center justify-between px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-[#81776d] transition-colors duration-200 hover:text-[#9a5145] "
                                        >
                                            <span>Sign Out</span>
                                            <span className="text-base font-light transition-transform duration-200 group-hover:translate-x-1">
                                                →
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                aria-label="Login"
                                className=" group relative flex h-9 w-9 items-center justify-center text-[#302923] transition-colors duration-300 hover:text-[#a58a62] "
                            >
                                <UserRound
                                    size={19}
                                    strokeWidth={1}
                                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                                />

                                <span
                                    aria-hidden="true"
                                    className=" absolute bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b9a17e] transition-all duration-300 group-hover:w-4 "
                                />
                            </Link>
                        )}

                    </div>
                </div>

                {/* NAVIGATION PANEL */}
                <div
                    className={` grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${menuOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                        }`}
                    aria-hidden={!menuOpen}
                >
                    <div className="min-h-0 overflow-hidden">
                        <div className="mx-auto max-w-400 px-6 pb-6 pt-3 md:px-14 md:pb-7">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="h-px w-5 bg-[#b9a17e]" />
                                <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-[#81776d]">
                                    Discover LUXE MEN
                                </p>
                            </div>

                            <nav className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10">
                                {navItems.map(({ name, path }, index) => {
                                    const isActive = pathname === path;

                                    return (
                                        <Link
                                            key={name}
                                            href={path}
                                            tabIndex={menuOpen ? 0 : -1}
                                            aria-current={isActive ? "page" : undefined}
                                            onClick={() => setMenuOpen(false)}
                                            className={` group flex items-center justify-between border-b py-3 pr-3 transition-colors duration-300 ${isActive
                                                ? "border-[#b9a17e]/60 text-[#a58a62]"
                                                : "border-[#302923]/10 text-[#302923] hover:text-[#a58a62]"
                                                }`}
                                        >
                                            <span className="flex items-center gap-4">
                                                <span className="text-[8px] tracking-[0.12em] text-[#a69a8b]">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>

                                                <span className="text-[12px] font-normal tracking-[0.04em] sm:text-[13px]">
                                                    {name}
                                                </span>
                                            </span>

                                            <ChevronDown
                                                size={13}
                                                strokeWidth={1}
                                                className={` -rotate-90 transition-all duration-300 ${isActive
                                                    ? "text-[#a58a62]"
                                                    : "-translate-x-1 text-[#a69a8b] group-hover:translate-x-0 group-hover:text-[#a58a62]"
                                                    }`}
                                            />
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>

            </header>

            <MiniCart
                open={miniCartOpen}
                onClose={() => setMiniCartOpen(false)}
            />

        </>
    );
}
