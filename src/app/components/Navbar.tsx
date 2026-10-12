
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
                <div className="relative mx-auto grid h-17 max-w-400 grid-cols-3 items-center px-5 md:h-19 md:px-10 lg:px-14">

                    {/* LEFT: NAVIGATION */}
                    <div className="flex items-center justify-start">
                        <button
                            type="button"
                            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="
                                group flex items-center gap-2.5
                                text-[#242321] transition-opacity
                                hover:opacity-60
                            "
                        >
                            {menuOpen ? (
                                <X size={20} strokeWidth={1.3} />
                            ) : (
                                <Menu size={20} strokeWidth={1.3} />
                            )}

                            <span className="hidden text-[10px] uppercase tracking-[0.2em] sm:inline">
                                {menuOpen ? "Close" : "Menu"}
                            </span>
                        </button>
                    </div>

                    {/* CENTER: LOGO */}
                    <Link
                        href="/"
                        aria-label="Luxe Men home"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center"
                    >

                        <span className="flex items-baseline text-[16px] font-medium tracking-[0.24em] text-[#191918] sm:text-[18px]">
                            LUXE
                            <span className="ml-2 font-light tracking-[0.28em]">
                                MEN
                            </span>
                        </span>

                    </Link>

                    {/* RIGHT: CART + PROFILE */}
                    <div className="flex items-center justify-end gap-3 sm:gap-5">


                        <button
                            type="button"
                            onClick={handleCartClick}
                            aria-label={`Shopping bag${cartCount ? `, ${cartCount} items` : ""}`}
                            className=" group relative flex h-9 w-9 items-center justify-center text-[#242321] transition-opacity duration-300 hover:opacity-55"
                        >
                            <BriefcaseBusiness
                                size={19}
                                strokeWidth={1.15}
                                className="transition-transform duration-300 group-hover:-translate-y-0.5"
                            />

                            {cartCount > 0 && (
                                <span
                                    className=" absolute right-0 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#242321] px-0.75 text-[8px] font-medium leading-none text-[#faf9f6]"
                                >
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </button>


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
                                    className="
                                        flex h-8 w-8 items-center justify-center
                                        rounded-full border border-black/15
                                        text-[10px] font-medium text-[#242321]
                                        transition-colors hover:bg-black hover:text-white
                                    "
                                >
                                    {initials}
                                </button>

                                {profileOpen && (
                                    <div
                                        onClick={(event) => event.stopPropagation()}
                                        className="
                                            absolute right-0 top-full mt-4
                                            w-64 border border-black/10
                                            bg-[#faf9f6] py-2
                                            shadow-[0_15px_50px_rgba(0,0,0,0.10)]
                                        "
                                    >
                                        <div className="border-b border-black/10 px-5 py-4">
                                            <p className="truncate text-sm font-medium text-[#242321]">
                                                {user.name}
                                            </p>
                                            <p className="mt-1 truncate text-xs text-black/50">
                                                {user.email}
                                            </p>
                                            {user.role === "ADMIN" && (
                                                <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-black/50">
                                                    Administrator
                                                </p>
                                            )}
                                        </div>

                                        <Link
                                            href="/profile"
                                            onClick={() => setProfileOpen(false)}
                                            className="block px-5 py-3 text-xs tracking-wide text-[#242321] transition-colors hover:bg-black/4"
                                        >
                                            My Account
                                        </Link>

                                        {user.role === "ADMIN" && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setProfileOpen(false)}
                                                className="block px-5 py-3 text-xs tracking-wide text-[#242321] transition-colors hover:bg-black/4"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileOpen(false);
                                                signOut({ callbackUrl: "/login" });
                                            }}
                                            className="w-full px-5 py-3 text-left text-xs tracking-wide text-black/60 transition-colors hover:bg-black/4 hover:text-black"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                aria-label="Login"
                                className="p-1 text-[#242321] transition-opacity hover:opacity-60"
                            >
                                <UserRound size={20} strokeWidth={1.3} />
                            </Link>
                        )}
                    </div>
                </div>

                {/* NAVIGATION PANEL */}
                <div
                    className={`
                        grid overflow-hidden transition-[grid-template-rows,opacity]
                        duration-300 ease-out
                        ${menuOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }
                    `}
                    aria-hidden={!menuOpen}
                >
                    <div className="min-h-0 overflow-hidden">
                        <div className="mx-auto max-w-400 px-6 pb-8 pt-3 md:px-14 md:pb-10">
                            <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-black/40">
                                Discover Luxe Men
                            </p>

                            <nav className="grid grid-cols-1 md:grid-cols-2">
                                {navItems.map(({ name, path }, index) => {
                                    const isActive = pathname === path;

                                    return (
                                        <Link
                                            key={name}
                                            href={path}
                                            tabIndex={menuOpen ? 0 : -1}
                                            onClick={() => setMenuOpen(false)}
                                            className="
                                                group flex items-center justify-between
                                                border-b border-black/10
                                                py-4 pr-3
                                                transition-colors
                                                hover:text-black/50
                                                md:mr-10
                                            "
                                        >
                                            <span className={`
                                                text-sm tracking-wide md:text-base
                                                ${isActive ? "text-black" : "text-black/75"}
                                            `}>
                                                <span className="mr-4 text-[9px] text-black/30">
                                                    0{index + 1}
                                                </span>
                                                {name}
                                            </span>

                                            <ChevronDown
                                                size={15}
                                                strokeWidth={1}
                                                className="-rotate-90 text-black/30 transition-transform group-hover:translate-x-1"
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
