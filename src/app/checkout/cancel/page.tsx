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
    <section className="flex min-h-[75vh] items-center justify-center px-6 py-16 text-[#1c1b18]">

        <div className="w-full max-w-3xl">

            {/* ===================================================== */}
            {/* TOP DETAIL                                             */}
            {/* ===================================================== */}

            <div className="mb-8 flex items-center justify-center gap-4">

                <span className="h-px w-12 bg-[#d1cbc1]" />

                <span className="text-[7px] uppercase tracking-[0.45em] text-[#9b8150]">
                    LUXE MEN
                </span>

                <span className="h-px w-12 bg-[#d1cbc1]" />

            </div>


            {/* ===================================================== */}
            {/* CANCELLED CARD                                         */}
            {/* ===================================================== */}

            <div className="relative overflow-hidden border border-[#d8d3c9] bg-[#faf9f6] px-8 py-14 text-center sm:px-14">

                {/* GOLD ACCENT */}

                <span className="absolute left-0 top-0 h-full w-[2px] bg-[#9b8150]" />


                {/* ================================================= */}
                {/* CANCEL ICON                                        */}
                {/* ================================================= */}

                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#b7aa91] text-[17px] text-[#9b8150]">
                    ×
                </div>


                {/* ================================================= */}
                {/* HEADING                                            */}
                {/* ================================================= */}

                <p className="mt-8 text-[8px] uppercase tracking-[0.45em] text-[#9b8150]">
                    Payment Not Completed
                </p>

                <h1 className="mt-3 font-serif text-[38px] leading-none tracking-tight text-[#25231f] max-md:text-[31px]">
                    Payment Cancelled
                </h1>

                <p className="mx-auto mt-5 max-w-md text-[10px] leading-5 text-[#8b867d]">
                    Your payment was cancelled and no order has been placed.
                    Your selection remains available should you wish to
                    complete your purchase.
                </p>


                {/* ================================================= */}
                {/* PAYMENT STATUS                                    */}
                {/* ================================================= */}

                <div className="mx-auto mt-10 max-w-md border-y border-[#ded9d0] py-7">

                    <p className="text-[7px] uppercase tracking-[0.4em] text-[#9b8150]">
                        Payment Status
                    </p>

                    <p className="mt-3 font-serif text-[21px] tracking-tight text-[#25231f]">
                        No Payment Was Charged
                    </p>

                    <p className="mt-3 text-[9px] leading-5 text-[#99938a]">
                        You can safely return and complete your purchase
                        whenever you are ready.
                    </p>

                </div>


                {/* ================================================= */}
                {/* CART MESSAGE                                      */}
                {/* ================================================= */}

                <div className="mx-auto mt-8 flex max-w-md items-start gap-3 text-left">

                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 bg-[#9b8150]" />

                    <p className="text-[9px] leading-5 text-[#99938a]">
                        Your cart has been kept intact so you can return to
                        checkout and try again.
                    </p>

                </div>


                {/* ================================================= */}
                {/* ACTIONS                                            */}
                {/* ================================================= */}

                <div className="mt-10 flex justify-center gap-3 max-sm:flex-col">

                    <Link
                        href="/checkout"
                        className="
                            group
                            relative
                            flex
                            h-12
                            items-center
                            justify-center
                            overflow-hidden
                            bg-[#181714]
                            px-8
                            text-[8px]
                            uppercase
                            tracking-[0.3em]
                            text-white
                            transition-colors
                            duration-500
                            hover:bg-[#292721]
                        "
                    >

                        <span className="relative z-10">
                            Return to Checkout
                        </span>

                        <span className="relative z-10 ml-3 translate-x-1 text-[#c4a66a] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                            →
                        </span>

                        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-700 group-hover:scale-x-100" />

                    </Link>


                    <Link
                        href="/"
                        className="
                            flex
                            h-12
                            items-center
                            justify-center
                            border
                            border-[#cfc9bf]
                            bg-transparent
                            px-8
                            text-[8px]
                            uppercase
                            tracking-[0.3em]
                            text-[#4f4b44]
                            transition-all
                            duration-500
                            hover:border-[#9b8150]
                            hover:text-[#9b8150]
                        "
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>


            {/* ===================================================== */}
            {/* FOOTER DETAIL                                          */}
            {/* ===================================================== */}

            <div className="mt-10 flex items-center justify-center gap-4">

                <span className="h-px w-10 bg-[#d1cbc1]" />

                <span className="text-[7px] uppercase tracking-[0.4em] text-[#aaa49a]">
                    LUXE MEN
                </span>

                <span className="h-px w-10 bg-[#d1cbc1]" />

            </div>

        </div>

    </section>
);

}