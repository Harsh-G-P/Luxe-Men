import Link from "next/link";

import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export default async function CheckoutCancel({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>;
}) {
    const { session_id } = await searchParams;

    if (!session_id) {
        notFound();
    }

    if (!session_id.startsWith("cs_")) {
        notFound();
    }

    let session;

    try {
        session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (error) {
        notFound();
    }


    return (
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">

            <div className="w-full border border-neutral-200 p-14 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500 text-2xl text-red-500">
                    ✕
                </div>

                <h1 className="mt-8 text-4xl uppercase tracking-[0.18em]">
                    Payment Cancelled
                </h1>

                <p className="mt-6 text-sm text-neutral-600">
                    Your payment was cancelled and no order has been placed.
                </p>

                <div className="mt-10 border-y border-neutral-200 py-8">

                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                        No Payment Was Charged
                    </p>

                    <p className="mt-3 text-lg font-medium">
                        You can safely return and complete your purchase anytime.
                    </p>

                </div>

                <p className="mt-8 text-sm text-neutral-500">
                    Your cart has been kept intact so you can try again whenever you're ready.
                </p>

                <div className="mt-12 flex justify-center gap-4">

                    <Link
                        href="/checkout"
                        className="bg-black px-8 py-3 text-sm uppercase tracking-[0.08em] text-white"
                    >
                        Try Again
                    </Link>

                    <Link
                        href="/"
                        className="border border-black px-8 py-3 text-sm uppercase tracking-[0.08em]"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </section>
    );
}