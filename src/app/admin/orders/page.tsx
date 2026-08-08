import OrdersPage from "@/app/components/Admin/OrderPages/OrdersPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


type Props = {
    searchParams: Promise<{
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

    if (!session) {
        redirect("/login");
    }

    const {
        search,
        status,
        payment,
        method,
        sort,
        date,
    } = await searchParams;


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

    const orders = await prisma.order.findMany({

        where,

        orderBy,

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
                }
            },


            items: {
                select: {
                    id: true,
                    title: true,
                    quantity: true,
                }
            }

        }

    });

    const formattedOrders = orders.map((order) => ({

        ...order,

        total: Number(order.total),

    }));


    return (
        <OrdersPage orders={formattedOrders} />
    );
}