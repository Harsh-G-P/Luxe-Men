import OrdersPage from "@/app/components/Admin/OrderPages/OrdersPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


type Props = {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        status?: string;
        payment?: string;
        method?: string;
        sort?: string;
        date?: string
    }>;
};


export default async function Orders({ searchParams }: Props) {

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const {
        page: pageParam,
        limit: limitParam,
        search,
        status,
        payment,
        method,
        sort,
        date,
    } = await searchParams;

    const page = Math.max(
        Number(pageParam) || 1,
        1
    );

    const limit = Math.min(
        Math.max(Number(limitParam) || 10, 1),
        100
    );

    const skip = (page - 1) * limit;


    const where: Prisma.OrderWhereInput = {

        ...(search && {
            OR: [
                {
                    orderNumber: {
                        contains: search,
                        mode: "insensitive",
                    },
                },

                {
                    user: {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },

                {
                    items: {
                        some: {
                            title: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        }),


        ...(status && status !== "ALL" && {
            status: status as any,
        }),


        ...(payment && payment !== "ALL" && {
            paymentStatus: payment as any,
        }),

        ...(method && method !== "ALL" && {
            paymentMethod: method as any,
        }),

        ...(date === "today" && {
            createdAt: {
                gte: new Date(
                    new Date().setHours(0, 0, 0, 0)
                )
            }
        }),

        ...(date === "week" && {
            createdAt: {
                gte: new Date(
                    Date.now() - 7 * 24 * 60 * 60 * 1000
                ),
            },
        }),


        ...(date === "month" && {
            createdAt: {
                gte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                ),
            },
        }),

    };


    let orderBy: Prisma.OrderOrderByWithRelationInput = {
        createdAt: "desc",
    };


    switch (sort) {

        case "OLDEST":
            orderBy = {
                createdAt: "asc",
            };
            break;


        case "HIGH":
            orderBy = {
                total: "desc",
            };
            break;


        case "LOW":
            orderBy = {
                total: "asc",
            };
            break;


        default:
            orderBy = {
                createdAt: "desc",
            };

    }

    const [orders, totalOrders] =
        await Promise.all([
            prisma.order.findMany({
                where,

                orderBy,

                skip,
                take: limit,

                select: {
                    id: true,
                    orderNumber: true,
                    total: true,
                    status: true,
                    paymentStatus: true,
                    cancellationStatus: true,
                    refundStatus: true,
                    refundReason: true,
                    createdAt: true,

                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },

                    items: {
                        select: {
                            id: true,
                            title: true,
                            quantity: true,
                        },
                    },
                },
            }),

            prisma.order.count({
                where,
            }),
        ]);

    const formattedOrders = orders.map((order) => ({
        ...order,
        total: Number(order.total),
    }));

    const totalPages = Math.ceil(
        totalOrders / limit
    );

    const pagination = {
        page,
        limit,
        totalOrders,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };

    return (
        <OrdersPage
            orders={formattedOrders}
            pagination={pagination}
        />
    );


}