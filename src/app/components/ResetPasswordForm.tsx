"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid or missing token");
      return;
    }

    console.log({
      token,
      password,
    });

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const text = await res.text();
console.log("RESPONSE:", text);

let data;
try {
  data = JSON.parse(text);
} catch {
  setMessage(text);
  return;
}

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      toast.success("Password updated successfully");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.log(err)
      setMessage("Network error");
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
                            Secure Access
                        </span>

                        <span className="h-px w-10 bg-black/15" />
                    </div>

                    <h1 className="mt-7 font-serif text-4xl tracking-tight sm:text-5xl">
                        Create New Password
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-black/45">
                        Choose a new password to secure your LUXE MEN account.
                    </p>

                </div>

                {/* Message */}
                {message && (
                    <div className="mb-7 border border-black/10 bg-black/[0.02] px-4 py-3 text-center">
                        <p className="text-sm text-black/60">
                            {message}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    <div>
                        <label className="mb-3 block text-[10px] uppercase tracking-[0.35em] text-black/45">
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm text-black outline-none placeholder:text-black/25 transition-colors duration-300 focus:border-black"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#111111] py-4 text-[10px] font-medium uppercase tracking-[0.35em] text-white transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>

                </form>

                {/* Login */}
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