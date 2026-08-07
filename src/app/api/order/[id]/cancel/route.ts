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

export async function POST(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401);
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


        const body = await req.json()

        const order = await prisma.order.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
            select: {
                id: true,
                status: true,
                cancellationStatus: true,
            },
        });

        if (!order) {
            return errorResponse("Order not found", 404);
        }

        if (
            order.status === "SHIPPED" ||
            order.status === "DELIVERED" ||
            order.status === "CANCELLED"
        ) {
            return errorResponse(
                "This order can no longer be cancelled",
                400
            );
        }

        if (order.cancellationStatus === "REQUESTED") {
            return errorResponse(
                "Cancellation already requested",
                400
            );
        }

        const cancellationReason =
            typeof body.reason === "string"
                ? body.reason.trim()
                : null;

        const updatedOrder = await prisma.order.update({
            where: {
                id: order.id,
            },
            data: {
                cancellationStatus: "REQUESTED",
                cancellationReason,
            },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                cancellationStatus: true,
                cancellationReason: true,
            },
        });

        return successResponse(
            "Cancellation request submitted",
            updatedOrder
        );
    } catch (error) {
        console.error("Cancellation Request API:", error);
        return errorResponse("Internal Server Error");
    }
}