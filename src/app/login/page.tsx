"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            })

            if (res?.error) {
                //Rate-limit
                try {
                    const err = JSON.parse(res.error)

                    if (err.type === "InvalidCredentials") {
                        const remaining = err.remainingAttempts;

                        if (remaining > 0) {
                            setError(
                                `Invalid credentials. ${remaining} attempts remaining.`
                            );
                            return;
                        }

                        if (remaining === 0) {
                            setError(
                                `Invalid credentials. ${remaining} ⚠️ Last login attempt left.`
                            );
                            return;
                        }
                    }

                    //Rate-Limit
                    if (err.type === "RateLimit") {
                        setError(
                            `Too many attempts. Try again in ${err.retryAfter}s`
                        )
                        return
                    }

                    // Brute force
                    if (err.type === "BruteForce") {
                        setError(`Too many failed logins. Try again in ${err.retryAfter}s`
                        )
                        return
                    }

                    // Cooldown
                    if (err.type === "Cooldown") {

                        setError(
                            `Please wait ${err.retryAfter}s before trying again`
                        )

                        return
                    }

                    // Not verified
                    if (err.type === "EmailNotVerified") {
                        setError(
                            "Please verify your email before signing in."
                        )
                        return
                    }

                    //email and password not available
                    if (err.type === "ValidationError") {
                        setError(
                            "Email and password are required"
                        )
                        return
                    }

                } catch (e) { }
            }

            if (res?.ok) {
                toast.success("Login successfully")
                router.push("/");
            }

        } catch (error) {
            console.log(error)
            setError("❌ Network error. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const resendVerification = async () => {
        try {
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            alert("Failed to resend email");
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f6f2] px-5 py-12 text-[#111111] sm:px-8">

            <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">

                <div className="w-full max-w-md">

                    {/* Brand */}
                    <div className="mb-14 text-center">

                        <p className="text-[10px] uppercase tracking-[0.55em] text-black/40">
                            LUXE MEN
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <span className="h-px w-10 bg-black/15" />
                            <span className="text-[8px] uppercase tracking-[0.35em] text-black/30">
                                Private Access
                            </span>
                            <span className="h-px w-10 bg-black/15" />
                        </div>


                        <h1 className="mt-7 font-serif text-4xl tracking-tight sm:text-5xl">
                            Welcome Back
                        </h1>

                        <p className="mt-4 text-sm text-black/45">
                            Sign in to continue your journey.
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-7 border border-red-200 bg-red-50 px-4 py-3 text-center">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Email */}
                        <div>
                            <label className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-black/45">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm text-black outline-none placeholder:text-black/25 transition-colors duration-300 focus:border-black"
                            />
                        </div>

                        {/* Password */}
                        <div>

                            <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase tracking-[0.35em] text-black/45">
                                    Password
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-black/45 transition-colors duration-300 hover:text-black"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <input
                                type="password"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-3 w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm text-black outline-none placeholder:text-black/25 transition-colors duration-300 focus:border-black"
                            />

                        </div>

                        {/* Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#111111] py-4 text-[10px] font-medium uppercase tracking-[0.35em] text-white transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Sign In"}
                        </button>

                        {/* Resend */}
                        <button
                            type="button"
                            onClick={resendVerification}
                            className="w-full text-xs text-black/45 transition-colors duration-300 hover:text-black"
                        >
                            Resend Verification Email
                        </button>

                    </form>

                    {/* Register */}
                    <div className="mt-12 border-t border-black/10 pt-8 text-center">

                        <p className="text-sm text-black/45">
                            Don't have an account?
                        </p>

                        <Link
                            href="/register"
                            className="mt-3 inline-block text-sm text-black transition-all duration-300 hover:underline hover:underline-offset-8"
                        >
                            Create an Account
                        </Link>

                    </div>

                    {/* Bottom Brand */}
                    <div className="mt-16 text-center">
                        <p className="text-[9px] uppercase tracking-[0.5em] text-black/25">
                            Est. 2026 · LUXE MEN
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}
