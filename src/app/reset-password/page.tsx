"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPasswordPage() {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        {message && (
          <p className="text-center text-sm text-red-500 mb-4">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="New password"
            className="w-full border px-3 py-2 rounded-md"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>

      </div>
    </div>
  );
}