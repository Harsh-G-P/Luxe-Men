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


export async function GET(req: NextRequest,{ params }: Params) {
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

        const product = await prisma.product.findFirst({
            where: {
                id,
                isActive:true,
            },
            select:{
                id:true,
            }
        })

        if(!product){
            return errorResponse("Product not found",404)
        }

        const { searchParams } = new URL(req.url);

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(searchParams.get("limit")) || 5,
                1
            ),
            100
        );

        const skip = (page - 1) * limit;

        const [reviews,totalReviews,ratingSummary]=await Promise.all([
            prisma.review.findMany({
                where: {
                    productId:id,
                },
                skip,
                take:limit,
                orderBy: {
                    createdAt:"desc"
                },
                select:{
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
            }),
            prisma.review.count({
                where:{
                    productId:id,
                }
            }),
            prisma.review.aggregate({
                where:{
                    productId:id,
                },
                _avg:{
                    rating:true,
                },
                _count:{
                    _all:true,
                }
            })
        ])

        return successResponse("Product reviews fetched successfully",
            {
                reviews,
                pagination: {
                    page,
                    limit,
                    totalReviews,
                    totalPages: Math.ceil(totalReviews / limit),
                },
                summary: {
                    averageRating: ratingSummary._avg.rating ?? 0,
                    totalReviews: ratingSummary._count._all,
                },
            }
        )
    }
    catch (error) {

        console.log("Review GET API:", error)
        return errorResponse("Internal Server Error");
    }
}