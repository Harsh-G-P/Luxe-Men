import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { refundRequestSchema } from "@/app/lib/validations/order";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


type Params = {
    params: Promise<{
        id: string
    }>
}


export async function POST(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    let body
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

        body = await req.json()

        const bodyresult = refundRequestSchema.safeParse(body)

        if (!bodyresult.success) {
            return errorResponse(
                bodyresult.error.issues[0].message,
                400
            );
        }

        const validated = bodyresult.data
        const { refundReason } = validated;

        const order = await prisma.order.findFirst({
            where: {
                id,
                userId: session.user.id
            },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                paymentStatus: true,
                refundStatus: true
            }
        })

        if (!order) {
            return errorResponse("Order not found", 404)
        }

        if (order.paymentStatus !== "PAID") {
            return errorResponse("Only paid orders can be refunded", 400)
        }

        if (order.status !== "CANCELLED") {
            return errorResponse("Only cancelled orders can be refunded", 400);
        }

        if (order.refundStatus === "REQUESTED") {
            return errorResponse("Refund request already submitted", 400)
        }

        if (order.refundStatus === "REFUNDED") {
            return errorResponse("Order has already been refunded", 400)
        }

        const updateOrder = await prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                refundStatus: "REQUESTED",
                refundReason,
                refundRequestedAt: new Date()
            },
            select: {
                id: true,
                orderNumber: true,
                refundStatus: true,
                refundReason: true,
                refundRequestedAt: true
            }
        })

        return successResponse("Refund request submitted successfully", updateOrder)

    } catch (error) {
        console.error("Order Refund Request POST API:", error);
        return errorResponse("Internal Server Error");
    }
}