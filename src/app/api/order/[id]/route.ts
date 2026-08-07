import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
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
                userId: session.user.id,
            },

            select: {
                id: true,
                orderNumber: true,

                subtotal: true,
                shipping: true,
                total: true,

                status: true,
                paymentMethod: true,
                paymentStatus: true,

                cancellationStatus: true,
                cancellationReason: true,

                notes: true,
                packagingOption: true,
                giftMessage: true,
                removeInvoice: true,

                createdAt: true,

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
        console.error("OrderDetail GET API:", error);
        return errorResponse("Internal Server Error");
    }
}

