import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
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
                status: true,
                paymentStatus: true
            }
        })

        if (!order) {
            return errorResponse("Order not found", 404)
        }

        const hasStatusChange =
            validate.status &&
            validate.status !== order.status;

        const hasPaymentChange =
            validate.paymentStatus &&
            validate.paymentStatus !== order.paymentStatus;


        if (!hasStatusChange && !hasPaymentChange) {
            return errorResponse(
                "Nothing to update",
                400
            );
        }


        const currentStatus = order.status;
        const newStatus = validate.status;


        if (
            newStatus &&
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



        if (
            order.paymentStatus === "PAID" &&
            validate.paymentStatus &&
            validate.paymentStatus !== "PAID" &&
            validate.paymentStatus !== "REFUNDED"
        ) {
            return errorResponse(
                "Paid payment status cannot be changed",
                400
            );
        }

        if (
            order.paymentStatus === "REFUNDED" &&
            validate.paymentStatus &&
            validate.paymentStatus !== "REFUNDED"
        ) {
            return errorResponse(
                "Refunded payment status cannot be changed",
                400
            );
        }

        const updatedOrder = await prisma.order.update({
            where: {
                id
            },
            data: {
                ...(validate.status && {
                    status: validate.status,
                }),

                ...(validate.paymentStatus && {
                    paymentStatus: validate.paymentStatus,
                }),
            },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                paymentStatus: true,
                updatedAt: true,
            },
        })

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
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
} as const;