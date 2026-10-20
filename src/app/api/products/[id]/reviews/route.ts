import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { reviewSchema } from "@/app/lib/validations/review";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";



type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return errorResponse("Unauthrozied", 401)
    }
    let body
    try {
        const routeParams = await params
        const id_result = idSchema.safeParse(routeParams)

        if (!id_result.success) {
            console.log(
                id_result.error.flatten()
            );
            return errorResponse("Invalid ID", 400)
        }

        const { id } = id_result.data

        body = await req.json()

        const result = reviewSchema.safeParse(body)

        if (!result.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(result.error.issues))
        }

        const validate = result.data

        const exisitingProduct = await prisma.product.findFirst({
            where: {
                id,
                isActive: true
            },
            select: {
                id: true
            }
        })

        if (!exisitingProduct) {
            return errorResponse("Product not found ", 404)
        }

        const deliveredOrder = await prisma.order.findFirst({
            where: {
                userId: session.user.id,
                status: 'DELIVERED',
                items: {
                    some: {
                        productId: id
                    }
                }
            },
            select: {
                id: true
            }
        })

        if (!deliveredOrder) {
            return errorResponse("You can review this product only after it has been delivered", 403)
        }

        const review = await prisma.review.create({
            data: {
                rating: validate.rating,
                comment: validate.comment || null,
                userId: session.user.id,
                productId: id
            },
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            }
        })

        return successResponse("Thank you for sharing your experience!", review, 201);

    } catch (error) {

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return errorResponse(
                "You have already reviewed this product",
                409
            );
        }

        console.log("Review POST API:", error)
        return errorResponse("Internal Server Error");
    }
}