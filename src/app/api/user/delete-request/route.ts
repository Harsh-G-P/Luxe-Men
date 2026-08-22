import { errorResponse, successResponse } from "@/app/lib/apiResponse";
import { authOptions } from "@/app/lib/auth";
import { idSchema } from "@/app/lib/id";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return errorResponse("Unauthorized", 401)
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id:session.user.id
            },
            select: {
                id: true,
                accountDeletionStatus: true
            }
        })

        if (!user) {
            return errorResponse("User not found", 404)
        }

        if (user.accountDeletionStatus === "REQUESTED") {
            return errorResponse(
                "Account deletion already requested",
                400
            );
        }

        const body = await req.json();

        const reason =
            typeof body.reason === "string"
                ? body.reason.trim()
                : null;

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                accountDeletionStatus: "REQUESTED",
                accountDeletionReason: reason,
                accountDeletionRequestedAt: new Date(),
            },
            select: {
                id: true,
                accountDeletionStatus: true,
                accountDeletionReason: true,
                accountDeletionRequestedAt: true,
            },
        });

        return successResponse("Account deletion request submitted", updatedUser)
    } catch (error) {
        console.error("Account deletion Request API:", error);
        return errorResponse("Internal Server Error");
    }

}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        accountDeletionStatus: true,
        accountDeletionReason: true,
        accountDeletionRequestedAt: true,
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse("Deletion status fetched", {
      accountDeletionStatus: user.accountDeletionStatus,
      accountDeletionReason: user.accountDeletionReason,
      accountDeletionRequestedAt: user.accountDeletionRequestedAt,
    });
  } catch (error) {
    console.error("Deletion status GET:", error);

    return errorResponse("Internal Server Error", 500);
  }
}
