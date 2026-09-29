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
        <div className="min-h-screen bg-[#f7f6f2] px-5 py-12 text-[#111111] sm:px-8">

            <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">

                <div className="w-full max-w-md text-center">

                    {/* Brand */}
                    <div className="mb-14">

                        <p className="text-[10px] uppercase tracking-[0.55em] text-black/40">
                            LUXE MEN
                        </p>

                        <div className="mt-6 flex items-center justify-center gap-4">
                            <span className="h-px w-10 bg-black/15" />

                            <span className="text-[8px] uppercase tracking-[0.35em] text-black/30">
                                Account Verification
                            </span>

                            <span className="h-px w-10 bg-black/15" />
                        </div>

                    </div>

                    {/* Loading */}
                    {loading ? (
                        <>

                            <div className="mx-auto mb-8 h-px w-16 bg-black/20" />

                            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
                                Verifying Email
                            </h1>

                            <p className="mt-5 text-sm leading-6 text-black/45">
                                Please wait while we verify your email address.
                            </p>

                            <div className="mx-auto mt-10 h-px w-8 animate-pulse bg-black/30" />

                        </>

                    ) : success ? (
                        <>

                            <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center border border-black/15">
                                <span className="text-lg">✓</span>
                            </div>

                            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
                                Email Verified
                            </h1>

                            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-black/45">
                                {message}
                            </p>

                            <Link
                                href="/login"
                                className="mt-10 inline-block bg-[#111111] px-10 py-4 text-[10px] font-medium uppercase tracking-[0.35em] text-white transition-colors duration-300 hover:bg-black"
                            >
                                Continue to Sign In
                            </Link>

                        </>

                    ) : (
                        <>

                            <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center border border-red-200">
                                <span className="text-sm text-red-500">×</span>
                            </div>

                            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
                                Verification Failed
                            </h1>

                            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-black/45">
                                {message}
                            </p>

                            <Link
                                href="/login"
                                className="mt-10 inline-block text-sm text-black transition-all duration-300 hover:underline hover:underline-offset-8"
                            >
                                Return to Sign In
                            </Link>

                        </>
                    )}

                    {/* Bottom Brand */}
                    <div className="mt-20">

                        <div className="mx-auto mb-5 h-px w-12 bg-black/10" />

                        <p className="text-[9px] uppercase tracking-[0.5em] text-black/25">
                            Est. 2026 · LUXE MEN
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}