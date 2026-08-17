import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401);
    }

    if (session.user.role !== "ADMIN") {
        return errorResponse("Forbidden", 403);
    }

    try {

        const thirtyDaysAgo = new Date();

        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const totalUsers = await prisma.user.count();

        const totalProducts = await prisma.product.count({
            where: {
                isActive: true
            }
        })

        const totalOrders = await prisma.order.count();

        const revenueResult = await prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                paymentStatus: "PAID"
            },
        })

        const recentOrders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 4,
            select: {
                id: true,
                orderNumber: true,
                total: true,
                status: true,
                createdAt: true,

                user: {
                    select: {
                        name: true
                    }
                },
                items: {
                    take: 1,
                    select: {
                        title: true,
                    }
                }
            }
        })

        const formattedRecentOrders = recentOrders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            total: Number(order.total),
            status: order.status,
            createdAt: order.createdAt.toISOString(),

            user: {
                name: order.user?.name ?? "Guest",
            },

            product: order.items[0]?.title ?? "-",
        }));


        const bestSellers = await prisma.product.findMany({
            where: {
                bestseller: true,
                isActive: true,
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 4,
            select: {
                id: true,
                title: true,
                price: true,
                images: true
            }
        })

        const formattedBestSellers = bestSellers.map((product) => ({
            id: product.id,
            title: product.title,
            price: Number(product.price),
            images: product.images,
        }));

        const salesOrders = await prisma.order.findMany({
    where: {
        paymentStatus: "PAID",
        createdAt: {
            gte: thirtyDaysAgo,
        },
    },
    orderBy: {
        createdAt: "asc",
    },
    select: {
        total: true,
        createdAt: true,
    },
});

const salesMap = new Map<
    string,
    {
        revenue: number;
        orders: number;
    }
>();

salesOrders.forEach((order) => {
    const date = order.createdAt.toISOString().slice(0, 10);

    const current = salesMap.get(date) ?? {
        revenue: 0,
        orders: 0,
    };

    salesMap.set(date, {
        revenue: current.revenue + Number(order.total),
        orders: current.orders + 1,
    });
});

const salesOverview = Array.from(
    { length: 30 },
    (_, index) => {
        const date = new Date(thirtyDaysAgo);

        date.setDate(
            thirtyDaysAgo.getDate() + index
        );

        const dateKey = date.toISOString().slice(0, 10);

        const data = salesMap.get(dateKey);

        return {
            date: dateKey,
            revenue: data?.revenue ?? 0,
            orders: data?.orders ?? 0,
        };
    }
);

const salesOverviewTotal = salesOverview.reduce(
    (total, item) => total + item.revenue,
    0
);

const salesOverviewOrders = salesOverview.reduce(
    (total, item) => total + item.orders,
    0
);

        return successResponse("Dashboard data fetched successfully", {
            statistics: {
                users: totalUsers,
                products: totalProducts,
                orders: totalOrders,
                revenue: Number(revenueResult._sum.total ?? 0),
            },
            recentOrders: formattedRecentOrders,
            bestSellers:formattedBestSellers,
            salesOverview,
    salesOverviewTotal,
    salesOverviewOrders,
        });

    } catch (error) {
        console.error("Admin Dashboard GET API:", error);
        return errorResponse("Internal Server Error");
    }
}