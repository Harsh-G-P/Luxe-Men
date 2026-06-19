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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Login to Continue
                </h2>

                {error &&
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                    </div>
                }

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border px-3 py-2 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded-md"
                        />

                        <div className="mt-2 text-right">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-black hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                    >{loading ? "Logging in..." : "Login"}
                    </button>

                    <button
                        type="button"
                        onClick={resendVerification}
                        className="w-full mt-3 text-sm text-black hover:underline"
                    >
                        Resend Verification Email
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-black font-semibold">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
