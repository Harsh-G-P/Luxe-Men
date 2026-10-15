"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormData = {
    name: string,
    username: string,
    email: string,
    password: string
}

type FieldErrors = {
    name?: string,
    username?: string,
    email?: string,
    password?: string
}

export default function Register() {

    const [formData, setFormData] = useState<FormData>({
        name: "",
        username: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        setFieldErrors({})
        try {
            const res = await fetch('/api/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (data.success) {
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    username: ""
                })
            }

            if (!res.ok) {
                if (res.status === 429) {
                    const seconds = data.retryAfter || 60

                    setError(
                        `Too many registration attempts. Please try again in ${seconds} sec${seconds > 1 ? "s" : ""}.`
                    )

                    return
                }
                if (data.errors && typeof data.errors === "object") {
                    const errors: FieldErrors = {}

                    Object.entries(data.errors).forEach(([key, message]) => {
                        errors[key as keyof FieldErrors] = message as string
                    })

                    setFieldErrors(errors)
                    return
                }
                setError("❌ " + (data.message || "Something went wrong"))
                return
            }

            toast.success(data.message)
            router.push('/login')

        } catch (error) {
            console.log(error)
            setError("❌ Network error. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f6f2] px-5 py-12 text-[#111111] sm:px-8">

            <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">

                <div className="w-full max-w-md">

                    {/* Brand */}
                    <div className="mb-12 text-center">

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
                            Create Your Account
                        </h1>

                        <p className="mt-4 text-sm text-black/45">
                            Begin your LUXE MEN experience.
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
                    <form onSubmit={handleSubmit} className="space-y-7">

                        {/* Name */}
                        <div>
                            <label className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-black/45">
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm text-black outline-none placeholder:text-black/25 transition-colors duration-300 focus:border-black"
                            />

                            {fieldErrors.name && (
                                <p className="mt-2 text-xs text-red-600">
                                    {fieldErrors.name}
                                </p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-black/45">
                                Username
                            </label>

                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm text-black outline-none placeholder:text-black/25 transition-colors duration-300 focus:border-black"
                            />

                            {fieldErrors.username && (
                                <p className="mt-2 text-xs text-red-600">
                                    {fieldErrors.username}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-black/45">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm text-black outline-none placeholder:text-black/25 transition-colors duration-300 focus:border-black"
                            />

                            {fieldErrors.email && (
                                <p className="mt-2 text-xs text-red-600">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-black/45">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm text-black outline-none placeholder:text-black/25 transition-colors duration-300 focus:border-black"
                            />

                            {fieldErrors.password && (
                                <p className="mt-2 text-xs text-red-600">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Register */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#111111] py-4 text-[10px] font-medium uppercase tracking-[0.35em] text-white transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                    </form>

                    {/* Login */}
                    <div className="mt-10 border-t border-black/10 pt-8 text-center">

                        <p className="text-sm text-black/45">
                            Already have an account?
                        </p>

                        <Link
                            href="/login"
                            className="mt-3 inline-block text-sm text-black transition-all duration-300 hover:underline hover:underline-offset-8"
                        >
                            Sign In
                        </Link>

                    </div>

                    {/* Bottom Brand */}
                    <div className="mt-14 text-center">
                        <p className="text-[9px] uppercase tracking-[0.5em] text-black/25">
                            Est. 2026 · LUXE MEN
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}
