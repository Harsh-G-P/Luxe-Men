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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Create Your Account
                </h2>

                {error &&
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                    </div>
                }

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border px-3 py-2 rounded-md"
                        />
                        {fieldErrors.name && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full border px-3 py-2 rounded-md"
                        />
                        {fieldErrors.username && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="text"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border px-3 py-2 rounded-md"
                        />
                        {fieldErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full border px-3 py-2 rounded-md"
                        />
                        {fieldErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
