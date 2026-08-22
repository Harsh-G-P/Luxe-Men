import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401);
    }

    if (session.user.role !== "ADMIN") {
        return errorResponse("Forbidden", 403);
    }

    try {
        const { searchParams } = new URL(req.url);

        const period = searchParams.get("period") || "30D";

        if (!["7D", "30D", "1Y"].includes(period)) {
            return errorResponse("Invalid sales period", 400);
        }

        const now = new Date();
        const startDate = new Date(now);

        if (period === "7D") {
            startDate.setDate(startDate.getDate() - 6);
        }

        if (period === "30D") {
            startDate.setDate(startDate.getDate() - 29);
        }

        if (period === "1Y") {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

        startDate.setHours(0, 0, 0, 0);

        const totalUsers = await prisma.user.count();

        const totalProducts = await prisma.product.count({
            where: {
                isActive: true,
            },
        });

        const totalOrders = await prisma.order.count();

        const revenueResult = await prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                paymentStatus: "PAID",
            },
        });

        const recentOrders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
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
                        name: true,
                    },
                },

                items: {
                    take: 1,
                    select: {
                        title: true,
                    },
                },
            },
        });

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
                createdAt: "desc",
            },
            take: 4,
            select: {
                id: true,
                title: true,
                price: true,
                images: true,
            },
        });

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
                    gte: startDate,
                    lte: now,
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
            const date = order.createdAt;

            let key: string;

            if (period === "1Y") {
                key = [
                    date.getFullYear(),
                    String(date.getMonth() + 1).padStart(2, "0"),
                ].join("-");
            } else {
                key = date.toISOString().slice(0, 10);
            }

            const current = salesMap.get(key) ?? {
                revenue: 0,
                orders: 0,
            };

            salesMap.set(key, {
                revenue: current.revenue + Number(order.total),
                orders: current.orders + 1,
            });
        });

        let salesOverview;

        if (period === "1Y") {
            salesOverview = Array.from({ length: 12 }, (_, index) => {
                const date = new Date(now);

                date.setMonth(now.getMonth() - (11 - index));
                date.setDate(1);
                date.setHours(0, 0, 0, 0);

                const key = [
                    date.getFullYear(),
                    String(date.getMonth() + 1).padStart(2, "0"),
                ].join("-");

                const data = salesMap.get(key);

                return {
                    date: date.toISOString(),
                    revenue: data?.revenue ?? 0,
                    orders: data?.orders ?? 0,
                };
            });
        } else {
            
            const numberOfDays = period === "7D" ? 7 : 30;

            salesOverview = Array.from(
                { length: numberOfDays },
                (_, index) => {
                    const date = new Date(startDate);

                    date.setDate(startDate.getDate() + index);

                    const dateKey = date.toISOString().slice(0, 10);

                    const data = salesMap.get(dateKey);

                    return {
                        date: dateKey,
                        revenue: data?.revenue ?? 0,
                        orders: data?.orders ?? 0,
                    };
                }
            );
        }

        const salesOverviewTotal = salesOverview.reduce(
            (total, item) => total + item.revenue,
            0
        );

        const salesOverviewOrders = salesOverview.reduce(
            (total, item) => total + item.orders,
            0
        );

        return successResponse(
            "Dashboard data fetched successfully",
            {
                statistics: {
                    users: totalUsers,
                    products: totalProducts,
                    orders: totalOrders,
                    revenue: Number(
                        revenueResult._sum.total ?? 0
                    ),
                },

                recentOrders: formattedRecentOrders,

                bestSellers: formattedBestSellers,

                salesOverview,

                salesOverviewTotal,

                salesOverviewOrders,
            }
        );
    } catch (error) {
        console.error(
            "Admin Dashboard GET API:",
            error
        );

        return errorResponse(
            "Internal Server Error"
        );
    }
}