import { notFound } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { stripe } from "@/app/lib/stripe";
import CartRefresh from "@/app/components/Shop/CartRefresh";
import { sendOrderConfirmationEmail } from "@/app/lib/sendOrderConfirmationEmail";

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

    // =========================
    // STRIPE SUCCESS
    // =========================
    else if (params.session_id) {

        if (!params.session_id.startsWith("cs_")) {
            notFound();
        }

        let stripeSession;

        try {
            stripeSession = await stripe.checkout.sessions.retrieve(
                params.session_id
            );
        } catch {
            notFound();
        }


        if (stripeSession.payment_status !== "paid") {
            notFound();
        }

        if (
            !stripeSession.payment_intent ||
            typeof stripeSession.payment_intent !== "string"
        ) {
            notFound();
        }


        const paymentIntentId = stripeSession.payment_intent;


        order = await prisma.order.findFirst({
            where: {
                paymentId: paymentIntentId,
            },
            include: {
                items: true,
            },
        });



        // Create order after successful payment
        if (!order) {

            const metadata = stripeSession.metadata;


            if (
                !metadata?.userId ||
                !metadata?.addressId ||
                !metadata?.orderNumber
            ) {
                notFound();
            }



            const cart = await prisma.cart.findUnique({
                where: {
                    userId: metadata.userId,
                },
                include: {
                    items: {
                        include: {
                            product: true,
                            variant: true,
                        },
                    },
                },
            });

            if (!cart || cart.items.length === 0) {
                notFound();
            }


            order = await prisma.$transaction(async (tx) => {


                const newOrder = await tx.order.create({
                    data: {

                        userId: metadata.userId,

                        addressId: metadata.addressId,

                        orderNumber: metadata.orderNumber,


                        subtotal: Number(metadata.subtotal),

                        shipping: Number(metadata.shipping),

                        total: Number(metadata.total),


                        paymentMethod: "STRIPE",

                        paymentStatus: "PAID",

                        paymentId: paymentIntentId,

                        status: "CONFIRMED",

                        notes:
                            metadata.notes || null,


                        packagingOption:
                            metadata.packagingOption || null,


                        giftMessage:
                            metadata.giftMessage || null,


                        removeInvoice:
                            metadata.removeInvoice === "true",
                    },
                });



                await tx.orderItem.createMany({
                    data: cart.items.map((item) => {

                        const price = Number(
                            item.variant?.price ??
                            item.product.price
                        );


                        const image =
                            Array.isArray(item.product.images) &&
                                typeof item.product.images[0] === "string"
                                ? item.product.images[0]
                                : null;


                        return {

                            orderId: newOrder.id,


                            productId:
                                item.product.id,


                            variantId:
                                item.variant?.id ?? null,


                            title:
                                item.product.title,


                            image,


                            attributes:
                                item.variant?.attributes &&
                                    typeof item.variant.attributes === "object"
                                    ? item.variant.attributes
                                    : undefined,


                            quantity:
                                item.quantity,


                            price,


                            total:
                                price * item.quantity,
                        };
                    }),
                });



                for (const item of cart.items) {

                    if (!item.variant) continue;


                    await tx.productVariant.update({

                        where: {
                            id: item.variant.id,
                        },

                        data: {

                            stock: {
                                decrement: item.quantity,
                            },

                        },

                    });

                }



                await tx.cartItem.deleteMany({

                    where: {
                        cartId: cart.id,
                    },

                });



                return tx.order.findUniqueOrThrow({

                    where: {
                        id: newOrder.id,
                    },

                    include: {
                        items: true,
                    },

                });

            });

            const user = await prisma.user.findUnique({
                where: {
                    id: metadata.userId,
                },
                select: {
                    email: true,
                    name: true,
                },
            });

            if (user) {
                await sendOrderConfirmationEmail({
                    email: user.email,
                    name: user.name ?? "Customer",
                    orderNumber: order.orderNumber,
                    total: Number(order.total),
                    paymentMethod: order.paymentMethod,
                });
            }

        }

    }

    else {
        notFound();
    }

    return (
    <>
        <CartRefresh />

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
                {/* SUCCESS CARD                                           */}
                {/* ===================================================== */}

                <div className="relative overflow-hidden border border-[#d8d3c9] bg-[#faf9f6] px-8 py-14 text-center sm:px-14">

                    {/* GOLD ACCENTS */}

                    <span className="absolute left-0 top-0 h-full w-[2px] bg-[#9b8150]" />

                    <span className="absolute right-0 top-0 h-full w-[1px] bg-[#eeeae2]" />


                    {/* ================================================= */}
                    {/* SUCCESS ICON                                        */}
                    {/* ================================================= */}

                    <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#9b8150] text-[17px] text-[#9b8150]">
                        ✓
                    </div>


                    {/* ================================================= */}
                    {/* HEADING                                            */}
                    {/* ================================================= */}

                    <p className="mt-8 text-[8px] uppercase tracking-[0.45em] text-[#9b8150]">
                        Order Confirmed
                    </p>

                    <h1 className="mt-3 font-serif text-[38px] leading-none tracking-tight text-[#25231f] max-md:text-[32px]">
                        Thank You
                    </h1>

                    <p className="mx-auto mt-5 max-w-md text-[10px] leading-5 text-[#8b867d]">
                        Your order has been placed successfully and is now
                        being prepared with the care and attention of our
                        atelier.
                    </p>


                    {/* ================================================= */}
                    {/* ORDER NUMBER                                       */}
                    {/* ================================================= */}

                    <div className="mx-auto mt-10 max-w-md border-y border-[#ded9d0] py-7">

                        <p className="text-[7px] uppercase tracking-[0.4em] text-[#9b8150]">
                            Order Number
                        </p>

                        <p className="mt-3 font-serif text-[22px] tracking-[0.08em] text-[#25231f]">
                            {order.orderNumber}
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* EMAIL MESSAGE                                      */}
                    {/* ================================================= */}

                    <div className="mx-auto mt-8 flex max-w-md items-start gap-3 text-left">

                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 bg-[#9b8150]" />

                        <p className="text-[9px] leading-5 text-[#99938a]">
                            We've sent your order confirmation to your email.
                            You'll receive further updates as your order
                            progresses.
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* ACTIONS                                            */}
                    {/* ================================================= */}

                    <div className="mt-10 flex justify-center gap-3 max-sm:flex-col">

                        <a
                            href="/profile/orders"
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
                                View Orders
                            </span>

                            <span className="relative z-10 ml-3 translate-x-1 text-[#c4a66a] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                                →
                            </span>

                            <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-700 group-hover:scale-x-100" />

                        </a>


                        <a
                            href="/"
                            className="
                                group
                                relative
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
                        </a>

                    </div>

                </div>


                {/* ===================================================== */}
                {/* FOOTER DETAIL                                          */}
                {/* ===================================================== */}

                <div className="mt-10 flex items-center justify-center gap-4">

                    <span className="h-px w-10 bg-[#d1cbc1]" />

                    <span className="text-[7px] uppercase tracking-[0.4em] text-[#aaa49a]">
                        Crafted With Care
                    </span>

                    <span className="h-px w-10 bg-[#d1cbc1]" />

                </div>

            </div>

        </section>
    </>
);

}