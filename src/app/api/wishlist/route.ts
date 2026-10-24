import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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
                Number(searchParams.get("limit")) || 10,
                1
            ),
            100
        );

        const skip = (page - 1) * limit;

        const where = {
            userId: session.user.id,
            product: {
                isActive: true,
            },
        };

        const [wishlistItems, totalItems] = await Promise.all([
            prisma.wishlistItem.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    createdAt: true,
                    product: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            price: true,
                            images: true,
                            brand: {
                                select: {
                                    title: true,
                                },
                            },
                        },
                    },
                },
            }),

            prisma.wishlistItem.count({
                where,
            }),
        ]);

        return successResponse(
            "Wishlist fetched successfully",
            {
                wishlistItems,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                },
            }
        );
    } catch (error) {
        console.log("Wishlist GET API:", error);
        return errorResponse("Internal Server Error");
    }
}