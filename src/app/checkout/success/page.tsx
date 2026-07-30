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


        order = await prisma.order.findFirst({
            where: {
                paymentId: stripeSession.id,
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

                        paymentId: stripeSession.id,

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