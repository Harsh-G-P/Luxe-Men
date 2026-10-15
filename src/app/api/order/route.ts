import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401);
    }

    try {
        const { searchParams } = new URL(req.url);

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(searchParams.get("limit")) || 6,
                1
            ),
            20
        );

        const skip = (page - 1) * limit;

        const where = {
            userId: session.user.id,
        };

        const [orders, totalOrders] = await Promise.all([
            prisma.order.findMany({
                where,
                select: {
                    id: true,
                    orderNumber: true,
                    total: true,
                    status: true,
                    createdAt: true,

                    items: {
                        select: {
                            id: true,
                            title: true,
                            quantity: true,
                            price: true,
                            image: true,
                            attributes: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),

            prisma.order.count({
                where,
            }),
        ]);

        const totalPages = Math.ceil(totalOrders / limit);

        const formattedOrders = orders.map((order) => ({
            ...order,

            total: Number(order.total),

            createdAt: order.createdAt.toISOString(),

            items: order.items.map((item) => ({
                ...item,
                price: Number(item.price),
            })),
        }));

        return successResponse(
            "Orders fetched successfully",
            {
                orders: formattedOrders,
                pagination: {
                    page,
                    limit,
                    totalOrders,
                    totalPages,
                    hasPreviousPage: page > 1,
                    hasNextPage: page < totalPages,
                },
            }
        );
    } catch (error) {
        console.error("Order GET API:", error);

        return errorResponse("Internal Server Error");
    }
}
