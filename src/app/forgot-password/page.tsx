"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type FieldErrors = {
    email?: string,
}

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error,setError]= useState("")
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("")
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    const seconds = data.retryAfter || 60 

                    setError(
                        `Too many forgot password attempts. Please try again in ${seconds} sec${seconds > 1 ? "s" : ""}.`
                    )

                    return
                }
                setError(data.message || "Something went wrong")
                return
            }
                toast.success(data.message);
        } catch (error) {
            console.log(error)
            setError("❌ Network error. Try again.")
        } finally {
            setLoading(false);
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
                            Account Recovery
                        </span>

                        <span className="h-px w-10 bg-black/15" />
                    </div>

                    <h1 className="mt-7 font-serif text-4xl tracking-tight sm:text-5xl">
                        Forgot Password
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-black/45">
                        Enter your email address and we'll send you
                        a secure link to reset your password.
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

                    <div>
                        <label className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-black/45">
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm text-black outline-none placeholder:text-black/25 transition-colors duration-300 focus:border-black"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#111111] py-4 text-[10px] font-medium uppercase tracking-[0.35em] text-white transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

                {/* Back to Login */}
                <div className="mt-12 border-t border-black/10 pt-8 text-center">

                    <p className="text-sm text-black/45">
                        Remember your password?
                    </p>

                    <Link
                        href="/login"
                        className="mt-3 inline-block text-sm text-black transition-all duration-300 hover:underline hover:underline-offset-8"
                    >
                        Return to Sign In
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