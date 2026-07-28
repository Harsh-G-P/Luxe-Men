import { notFound } from "next/navigation";
import prisma from "@/app/lib/prisma";
import CartRefresh from "@/app/components/Shop/CartRefresh";

type Props = {
    searchParams: Promise<{
        session_id?: string;
        order?: string;
    }>;
};

export default async function CheckoutSuccess({ searchParams }: Props) {
    const params = await searchParams;

    let order;

    // =========================
    // COD SUCCESS
    // =========================
    if (params.order) {

        order = await prisma.order.findUnique({
            where: {
                orderNumber: params.order,
            },
            include: {
                items: true,
            },
        });


        if (!order) {
            notFound();
        }

    }


    else {
        notFound();
    }

    return (
        <>
        <CartRefresh />
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">

            <div className="w-full border border-neutral-200 p-14 text-center">


                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white">
                    ✓
                </div>


                <h1 className="mt-8 text-4xl uppercase tracking-[0.18em]">
                    Thank You
                </h1>


                <p className="mt-6 text-sm text-neutral-600">
                    Your order has been placed successfully.
                </p>



                <div className="mt-10 border-y border-neutral-200 py-8">

                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                        Order Number
                    </p>


                    <p className="mt-3 text-lg font-medium">
                        {order.orderNumber}
                    </p>

                </div>



                <p className="mt-8 text-sm text-neutral-500">
                    We've sent your order confirmation to your email.
                </p>



                <div className="mt-12 flex justify-center gap-4">

                    <a
                        href="/profile/orders"
                        className="bg-black px-8 py-3 text-sm uppercase tracking-[0.08em] text-white"
                    >
                        View Orders
                    </a>


                    <a
                        href="/"
                        className="border border-black px-8 py-3 text-sm uppercase tracking-[0.08em]"
                    >
                        Continue Shopping
                    </a>


                </div>


            </div>

        </section>
        </>
    );
}