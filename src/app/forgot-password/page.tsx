"use client";

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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

                <h1 className="text-2xl font-bold text-center mb-2">
                    Forgot Password
                </h1>

                {error &&
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                    </div>
                }

                <p className="text-gray-600 text-center mb-6">
                    Enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-md"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

            </div>
        </div>
    );
}