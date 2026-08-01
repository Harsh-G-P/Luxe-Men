import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";



export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id
            },
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

                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        const formattedOrders = orders.map((order) => ({
            ...order,

            total: Number(order.total),

            items: order.items.map((item) => ({
                ...item,

                price: Number(item.price),
            })),
        }));

        return successResponse("Order fetched successfully", formattedOrders)
    } catch (error) {
        console.error("Order GET API:", error);
        return errorResponse("Internal Server Error");
    }
}