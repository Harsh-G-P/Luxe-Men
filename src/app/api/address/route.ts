import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { formatZodErrors } from "@/app/lib/validations/formatZod";
import { addressSchema } from "@/app/lib/validations/user";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    let body
    try {
        body = await req.json()

        const result = addressSchema.safeParse(body)

        if (!result.success) {
            return errorResponse("Validation Error", 400, formatZodErrors(result.error.issues))
        }

        const validated = result.data

        const addressCount = await prisma.address.count({
            where: {
                userId: session.user.id,
            },
        });

        let isDefault = validated.isDefault ?? false;

        // First address becomes default automatically
        if (addressCount === 0) {
            isDefault = true;
        }

        // If user selected a new default address,
        // remove default from existing addresses
        if (isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: session.user.id,
                    isDefault: true,
                },
                data: {
                    isDefault: false,
                },
            });
        }

        const address = await prisma.address.create({
            data: {
                ...validated,
                isDefault,
                userId: session.user.id,
            }
        })

        return successResponse("Address created successfully", address, 201)

    } catch (error) {
        console.log("Addresses Post API:", error)
        return errorResponse("Internal Server Error");
    }
}

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }
    try {
        const addresses = await prisma.address.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return successResponse("Brand fetch successfully", addresses, 200)
    } catch (error) {
        console.log("Address GET API", error)
        return errorResponse("Internal Server Error")
    }
}
