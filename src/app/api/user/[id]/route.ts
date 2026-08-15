import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { sendAccountDeletionEmail } from "@/app/lib/sendAccountDeletionEmail";
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

        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                image: true,
                role: true,
                accountDeletionStatus: true,
                accountDeletionReason: true,
                accountDeletionRequestedAt: true,
                createdAt: true,
                updatedAt: true,
                emailVerified: true,

                address: {
                    orderBy: {
                        createdAt: "desc"
                    }
                },

                orders: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    select: {
                        id: true,
                        orderNumber: true,
                        status: true,
                        paymentStatus: true,
                        paymentMethod: true,
                        subtotal: true,
                        shipping: true,
                        total: true,
                        createdAt: true,
                    }
                }
            }
        })

        if (!user) {
            return errorResponse("User not found", 404)
        }

        const totalOrders = user.orders.length;

        const totalSpent = user.orders.reduce(
            (sum, order) => sum + Number(order.total),
            0
        );

        const orderSummary = {
            total: totalOrders,

            pending: user.orders.filter(
                (order) => order.status === "PENDING"
            ).length,

            confirmed: user.orders.filter(
                (order) => order.status === "CONFIRMED"
            ).length,

            processing: user.orders.filter(
                (order) => order.status === "PROCESSING"
            ).length,

            shipped: user.orders.filter(
                (order) => order.status === "SHIPPED"
            ).length,

            delivered: user.orders.filter(
                (order) => order.status === "DELIVERED"
            ).length,

            cancelled: user.orders.filter(
                (order) => order.status === "CANCELLED"
            ).length,

            totalSpent,
        };

        const formattedOrders = user.orders.map((order) => ({
            ...order,
            subtotal: Number(order.subtotal),
            shipping: Number(order.shipping),
            total: Number(order.total),
        }));

        return successResponse("User fetched successfully", {
            profile: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                image: user.image,
                role: user.role,
                accountDeletionStatus: user.accountDeletionStatus,
                accountDeletionReason: user.accountDeletionReason,
                accountDeletionRequestedAt: user.accountDeletionRequestedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                emailVerified: user.emailVerified
            },

            statistics: {
                orders: orderSummary.total,
                addresses: user.address.length,
                totalSpent: orderSummary.totalSpent,
            },

            orderSummary,

            addresses: user.address,

            orders: formattedOrders,
        })
    } catch (error) {
        console.error("Admin UserDetail GET API:", error);
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

        if (id === session.user.id) {
            return errorResponse("You cannot change your own role", 400);
        }

        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                accountDeletionStatus: true
            }
        })

        if (!user) {
            return errorResponse("User not found", 404)
        }

        // Account deletion request
        if (
            body.action === "APPROVE" ||
            body.action === "REJECT"
        ) {
            if (user.accountDeletionStatus !== "REQUESTED") {
                return errorResponse(
                    "There is no pending account deletion request",
                    400
                )
            }

            if (body.action === "REJECT") {
                const updated = await prisma.user.update({
                    where: {
                        id,
                    },
                    data: {
                        accountDeletionStatus: "REJECTED",
                    },
                    select: {
                        id: true,
                        accountDeletionStatus: true,
                    },
                });

                
                try {
                    await sendAccountDeletionEmail({
                        email: user.email,
                        name: user.name,
                        type: "REJECTED",
                    });
                } catch (emailError) {
                    console.error(
                        "Failed to send account deletion rejection email:",
                        emailError
                    );
                }

                return successResponse(
                    "Account deletion request rejected",
                    updated
                );
            }


            if (body.action === "APPROVE") {
                await prisma.user.delete({
                    where: {
                        id,
                    },
                });

                
                try {
                    await sendAccountDeletionEmail({
                        email: user.email,
                        name: user.name,
                        type: "DELETED",
                    });
                } catch (emailError) {
                    console.error(
                        "Failed to send account deletion email:",
                        emailError
                    );
                }

                return successResponse(
                    "User account deleted successfully",
                    {
                        userId: id,
                    }
                );
            }
        }

        if (body.role !== "USER" && body.role !== "ADMIN") {
            return errorResponse("Invalid role", 400);
        }

        if (user.role === body.role) {
            return errorResponse("User already has this role", 400);
        }

        const updated = await prisma.user.update({
            where: {
                id
            },
            data: {
                role: body.role
            },
            select: {
                id: true,
                role: true
            }
        })

        return successResponse("User role updated successfully", updated)

    } catch (error) {
        console.error("Admin UserDetail PUT API:", error);
        return errorResponse("Internal Server Error");
    }
}
