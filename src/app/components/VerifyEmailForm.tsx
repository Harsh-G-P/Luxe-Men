"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function VerifyEmailForm() {
    const searchParams = useSearchParams()

    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token")

            if (!token) {
                setLoading(false)
                setMessage("Invalid verification link")
                return
            }

            try {
                const res = await fetch(
                    `/api/auth/verify-email?token=${token}`
                )

                const data = await res.json()

                setSuccess(data.success)
                setMessage(data.message)

            } catch {
                setSuccess(false)
                setMessage("Something went wrong")
            } finally {
                setLoading(false)
            }
        }

        verifyEmail()
    }, [searchParams])

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">

                {loading ? (
                    <>
                        <h1 className="text-2xl font-bold">
                            Verifying Email...
                        </h1>

                        <p className="text-gray-500 mt-3">
                            Please wait
                        </p>
                    </>
                ) : success ? (
                    <>
                        <h1 className="text-2xl font-bold text-green-600">
                            Email Verified
                        </h1>

                        <p className="mt-3 text-gray-600">
                            {message}
                        </p>

                        <Link
                            href="/login"
                            className="inline-block mt-6 bg-black text-white px-5 py-2 rounded-md"
                        >
                            Login
                        </Link>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-red-600">
                            Verification Failed
                        </h1>

                        <p className="mt-3 text-gray-600">
                            {message}
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}