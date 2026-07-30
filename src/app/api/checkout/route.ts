import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { sendOrderConfirmationEmail } from "@/app/lib/sendOrderConfirmationEmail";
import { stripe } from "@/app/lib/stripe";
import { checkoutSchema } from "@/app/lib/validations/checkout";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    let body
    try {
        body = await req.json()

        const result = checkoutSchema.safeParse(body)

        if (!result.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(result.error.issues))
        }

        const validated = result.data

        const address = await prisma.address.findFirst({
            where: {
                id: validated.addressId,
                userId: session.user.id
            }
        })

        if (!address) {
            return errorResponse("Address not found", 404)
        }

        const cart = await prisma.cart.findUnique({
            where: {
                userId: session.user.id,
            },
            select: {
                id: true,
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        product: {
                            select: {
                                id: true,
                                title: true,
                                images: true,
                                isActive: true,
                                price: true,
                            },
                        },
                        variant: {
                            select: {
                                id: true,
                                sku: true,
                                stock: true,
                                price: true,
                                attributes: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            return errorResponse("Cart is empty", 400);
        }

        let subtotal = 0;

        for (const item of cart.items) {
            if (!item.product.isActive) {
                return errorResponse(
                    `${item.product.title} is no longer available`,
                    400
                );
            }

            const price = Number(item.variant?.price ?? item.product.price);

            if (item.variant && item.variant.stock < item.quantity) {
                return errorResponse(
                    `Not enough stock for ${item.product.title}`,
                    400
                );
            }

            subtotal += price * item.quantity;
        }

        const shipping = 0;
        const total = subtotal + shipping;

        const orderNumber =
            `ORD-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;

        if (validated.paymentMethod === "COD") {

            const order = await prisma.$transaction(async (tx) => {
                const order = await tx.order.create({
                    data: {
                        userId: session.user.id,
                        addressId: address.id,
                        orderNumber,
                        subtotal,
                        shipping,
                        total,
                        paymentMethod: validated.paymentMethod,
                        notes: validated.notes,
                        packagingOption: validated.packagingOption,
                        giftMessage: validated.giftMessage,
                        removeInvoice: validated.removeInvoice,
                    },
                });

                await tx.orderItem.createMany({
                    data: cart.items.map((item) => {
                        const price = Number(item.variant?.price ?? item.product.price);

                        const image =
                            Array.isArray(item.product.images) &&
                                typeof item.product.images[0] === "string"
                                ? item.product.images[0]
                                : null;

                        return {
                            orderId: order.id,
                            productId: item.product.id,
                            variantId: item.variant?.id ?? null,
                            title: item.product.title,
                            image,
                            attributes: item.variant?.attributes && typeof item.variant.attributes === "object"
                                ? item.variant.attributes
                                : undefined,
                            quantity: item.quantity,
                            price,
                            total: price * item.quantity,
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

                return order

            });

            const user = await prisma.user.findUnique({
                    where:{
                        id:session.user.id
                    },
                    select:{
                        email:true,
                        name:true,
                    }
                })

                if(user){
                    await sendOrderConfirmationEmail({
                        email:user.email,
                        name:user.name ?? "Customer",
                        orderNumber:order.orderNumber,
                        total:Number(order.total),
                        paymentMethod:order.paymentMethod
                    })
                }

            return successResponse("Order placed successfully.", {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
            });
        }

        else if (validated.paymentMethod === "STRIPE") {

            const stripeSession = await stripe.checkout.sessions.create({
                mode: "payment",

                payment_method_types: ["card"],

                line_items: cart.items.map((item) => {
                    const price = Number(
                        item.variant?.price ?? item.product.price
                    );

                    const image =
                        Array.isArray(item.product.images) &&
                            typeof item.product.images[0] === "string"
                            ? item.product.images[0]
                            : undefined;

                    return {
                        quantity: item.quantity,

                        price_data: {
                            currency: "usd",

                            unit_amount: Math.round(price * 100),

                            product_data: {
                                name: item.product.title,
                                images: image ? [image] : [],
                            },
                        },
                    };
                }),

                metadata: {
                    userId: session.user.id,
                    addressId: address.id,

                    subtotal: String(subtotal),
                    shipping: String(shipping),
                    total: String(total),

                    orderNumber,

                    packagingOption:
                        validated.packagingOption ?? "",

                    giftMessage:
                        validated.giftMessage ?? "",

                    removeInvoice:
                        String(validated.removeInvoice),

                    notes:
                        validated.notes ?? "",
                },

                success_url:
                    `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

                cancel_url:
                    `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
            });


            return successResponse(
                "Stripe session created.",
                {
                    url: stripeSession.url,
                }
            );
        }

        else {
            return errorResponse("Invalid payment method", 400)
        }

    } catch (error) {
        console.error("Checkout POST API:", error);
        return errorResponse("Internal Server Error");
    }
}