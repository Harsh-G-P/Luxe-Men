import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { sendOrderCancellationEmail } from "@/app/lib/sendOrderCancellationEmail";
import { sendRefundEmail } from "@/app/lib/sendRefundEmail";
import { stripe } from "@/app/lib/stripe";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { updateOrderSchema } from "@/app/lib/validations/order";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    const isAdmin = session.user.role === "ADMIN"

    if (!isAdmin) {
        return errorResponse("Forbidden", 403)
    }

    try {
        const routeParams = await params
        const result = idSchema.safeParse(routeParams)

        if (!result.success) {
            console.log(
                result.error.flatten()
            );
            return errorResponse("Invalid ID", 400)
        }

        const { id } = result.data

        const order = await prisma.order.findFirst({
            where: {
                id,
            },

            select: {
                id: true,
                orderNumber: true,

                subtotal: true,
                shipping: true,
                total: true,

                status: true,

                paymentId: true,
                paymentMethod: true,
                paymentStatus: true,

                cancellationStatus: true,
                cancellationReason: true,

                refundStatus: true,
                refundReason: true,
                refundRequestedAt: true,
                refundedAt: true,

                notes: true,
                packagingOption: true,
                giftMessage: true,
                removeInvoice: true,

                createdAt: true,
                updatedAt: true,

                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                },

                address: {
                    select: {
                        fullname: true,
                        phone: true,
                        addressLine: true,
                        countryCode: true,
                        city: true,
                        state: true,
                        postalCode: true,
                        country: true,
                    },
                },

                items: {
                    orderBy: {
                        createdAt: "asc",
                    },

                    select: {
                        id: true,
                        title: true,
                        image: true,
                        attributes: true,
                        quantity: true,
                        price: true,
                        total: true,
                    },
                },
            },
        });

        if (!order) {
            return errorResponse("Order not found", 404)
        }

        const formattedOrder = {
            ...order,

            subtotal: Number(order.subtotal),
            shipping: Number(order.shipping),
            total: Number(order.total),

            items: order.items.map((item) => ({
                ...item,
                price: Number(item.price),
                total: Number(item.total),
            })),
        };

        return successResponse("Order fetched successfully", formattedOrder)
    } catch (error) {
        console.error("Admin OrderDetail GET API:", error);
        return errorResponse("Internal Server Error");
    }
}


export async function PUT(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    const isAdmin = session.user.role === "ADMIN"

    if (!isAdmin) {
        return errorResponse("Forbidden", 403)
    }
    let body
    try {
        body = await req.json()
        const routeParams = await params
        const result = idSchema.safeParse(routeParams)

        if (!result.success) {
            console.log(
                result.error.flatten()
            );
            return errorResponse("Invalid ID", 400)
        }

        const { id } = result.data

        const bodyResult = updateOrderSchema.safeParse(body)

        if (!bodyResult.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(bodyResult.error.issues))
        }

        const validate = bodyResult.data

        const order = await prisma.order.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                orderNumber: true,

                total: true,

                status: true,
                paymentStatus: true,
                paymentMethod: true,

                cancellationStatus: true,

                refundStatus: true,
                refundReason: true,
                refundRequestedAt: true,
                refundedAt: true,

                paymentId: true,

                user: {
                    select: {
                        email: true,
                        name: true,
                    },
                },
            }
        });

        if (!order) {
            return errorResponse("Order not found", 404)
        }

        // Change detection

        const hasStatusChange =
            validate.status &&
            validate.status !== order.status;

        const hasPaymentChange =
            validate.paymentStatus &&
            validate.paymentStatus !== order.paymentStatus;

        const hasCancellationChange =
            validate.cancellationStatus !== undefined &&
            validate.cancellationStatus !== order.cancellationStatus;

        const hasRefundChange =
            validate.refundStatus !== undefined &&
            validate.refundStatus !== order.refundStatus;


        if (
            !hasStatusChange &&
            !hasPaymentChange &&
            !hasCancellationChange &&
            !hasRefundChange
        ) {
            return errorResponse("Nothing to update", 400);
        }

        // Payment status validation

        if (
            validate.paymentStatus === "REFUNDED" &&
            validate.paymentStatus !== order.paymentStatus
        ) {
            return errorResponse(
                "Payment can only be marked as refunded through the refund process",
                400
            );
        }

        if (
            order.paymentStatus === "PAID" &&
            validate.paymentStatus !== undefined &&
            validate.paymentStatus !== "PAID"
        ) {
            return errorResponse(
                "Paid payment status cannot be changed manually",
                400
            );
        }

        if (
            order.paymentStatus === "REFUNDED" &&
            validate.paymentStatus !== undefined &&
            validate.paymentStatus !== "REFUNDED"
        ) {
            return errorResponse(
                "Refunded payment status cannot be changed",
                400
            );
        }

        // Order status validation

        const currentStatus = order.status;
        const newStatus = validate.status;


        if (
            newStatus !== undefined &&
            newStatus !== currentStatus
        ) {
            const allowedNextStatuses =
                allowedStatusTransitions[
                currentStatus as keyof typeof allowedStatusTransitions
                ];


            if (
                !allowedNextStatuses.includes(
                    newStatus as never
                )
            ) {
                return errorResponse(
                    `Cannot change order status from ${currentStatus} to ${newStatus}`,
                    400
                );
            }
        }


        /* Cancellation request validation */

        if (
            validate.cancellationStatus !== undefined &&
            validate.cancellationStatus !== order.cancellationStatus
        ) {
            if (
                order.cancellationStatus !== "REQUESTED"
            ) {
                return errorResponse(
                    "There is no pending cancellation request",
                    400
                );
            }

            if (
                validate.cancellationStatus === "NONE" &&
                validate.status !== "CANCELLED"
            ) {
                return errorResponse(
                    "Approved cancellation must set order status to CANCELLED",
                    400
                );
            }

            if (
                validate.cancellationStatus === "REJECTED" &&
                validate.status === "CANCELLED"
            ) {
                return errorResponse(
                    "Rejected cancellation cannot cancel the order",
                    400
                );
            }
        }

        /* Cancellation approval */

        if (
            validate.status === "CANCELLED" &&
            order.cancellationStatus === "REQUESTED" &&
            validate.cancellationStatus !== "NONE"
        ) {
            return errorResponse(
                "Cancellation approval must clear the cancellation request",
                400
            );
        }

        // Refund validation

        if (
            validate.refundStatus !== undefined &&
            validate.refundStatus !== order.refundStatus
        ) {
            // There must be an actual refund request.
            if (
                order.refundStatus !== "REQUESTED"
            ) {
                return errorResponse(
                    "There is no pending refund request",
                    400
                );
            }


            // REJECT REFUND

            if (
                validate.refundStatus === "REJECTED"
            ) {
                const updatedOrder = await prisma.order.update({
                    where: {
                        id,
                    },

                    data: {
                        refundStatus: "REJECTED",

                        ...(validate.refundReason !== undefined && {
                            refundReason: validate.refundReason,
                        }),
                    },

                    select: {
                        id: true,
                        orderNumber: true,

                        status: true,
                        paymentStatus: true,

                        cancellationStatus: true,

                        refundStatus: true,
                        refundReason: true,
                        refundRequestedAt: true,
                        refundedAt: true,

                        updatedAt: true,
                    },
                });

                try {
    await sendRefundEmail({
        email: order.user.email,
        name: order.user.name ?? "Customer",
        orderNumber: order.orderNumber,
        total: Number(order.total),
        type: "REJECTED",
        reason:
            validate.refundReason ??
            order.refundReason,
    });
} catch (emailError) {
    console.error(
        "Refund rejection email error:",
        emailError
    );
}

                return successResponse(
                    "Refund request rejected",
                    updatedOrder
                );
            }


            // APPROVE REFUND

            if (
                validate.refundStatus === "REFUNDED"
            ) {
                if (order.paymentStatus !== "PAID") {
                    return errorResponse(
                        "Only paid orders can be refunded",
                        400
                    );
                }

                if (!order.paymentId) {
                    return errorResponse(
                        "Stripe payment information not found",
                        400
                    );
                }

                try {
                    // Stripe refund
                    const refund = await stripe.refunds.create({
                        payment_intent: order.paymentId,
                    });

                    if (
                        refund.status !== "succeeded"
                    ) {
                        return errorResponse(
                            "Stripe refund was not successful",
                            400
                        );
                    }

                    // Only update DB after Stripe succeeds
                    const updatedOrder =
                        await prisma.order.update({
                            where: {
                                id,
                            },

                            data: {
                                refundStatus: "REFUNDED",
                                paymentStatus: "REFUNDED",
                                refundedAt: new Date(),

                                ...(validate.refundReason !== undefined && {
                                    refundReason:
                                        validate.refundReason,
                                }),
                            },

                            select: {
                                id: true,
                                orderNumber: true,

                                status: true,
                                paymentStatus: true,

                                cancellationStatus: true,

                                refundStatus: true,
                                refundReason: true,
                                refundRequestedAt: true,
                                refundedAt: true,

                                updatedAt: true,
                            },
                        });

                        try {
    await sendRefundEmail({
        email: order.user.email,
        name: order.user.name ?? "Customer",
        orderNumber: order.orderNumber,
        total: Number(order.total),
        type: "REFUNDED",
        reason:
            validate.refundReason ??
            order.refundReason,
    });
} catch (emailError) {
    console.error(
        "Refund success email error:",
        emailError
    );
}

                    return successResponse(
                        "Refund processed successfully",
                        updatedOrder
                    );

                } catch (stripeError) {
                    console.error(
                        "Stripe refund error:",
                        stripeError
                    );

                    return errorResponse(
                        "Failed to process Stripe refund",
                        500
                    );
                }
            }

            // Do not allow NONE from REQUESTED.
            if (
                validate.refundStatus === "NONE"
            ) {
                return errorResponse(
                    "A pending refund request cannot be changed to NONE",
                    400
                );
            }
        }


        const updatedOrder = await prisma.order.update({
            where: {
                id,
            },

            data: {
                ...(validate.status !== undefined && {
                    status: validate.status,
                }),

                ...(validate.paymentStatus !== undefined && {
                    paymentStatus: validate.paymentStatus,
                }),

                ...(validate.cancellationStatus !== undefined && {
                    cancellationStatus: validate.cancellationStatus,
                }),
            },

            select: {
                id: true,
                orderNumber: true,
                status: true,
                paymentStatus: true,
                cancellationStatus: true,
                cancellationReason: true,
                refundStatus: true,
                refundReason: true,
                refundRequestedAt: true,
                refundedAt: true,
                updatedAt: true,
            },
        });

        const cancellationApproved =
            validate.status === "CANCELLED" &&
            order.cancellationStatus === "REQUESTED" &&
            validate.cancellationStatus === "NONE";

        if (cancellationApproved) {
            try {
                await sendOrderCancellationEmail({
                    email: order.user.email,
                    name: order.user.name ?? "Customer",
                    orderNumber: order.orderNumber,
                    total: Number(order.total),
                    paymentMethod: order.paymentMethod,
                });
            } catch (emailError) {
                console.error(
                    "Order cancellation email error:",
                    emailError
                );
            }
        }

        return successResponse(
            "Order updated successfully",
            updatedOrder
        );

    } catch (error) {
        console.error("Admin OrderDetail UPDATE API:", error);
        return errorResponse("Internal Server Error");
    }
}


const allowedStatusTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
} as const;