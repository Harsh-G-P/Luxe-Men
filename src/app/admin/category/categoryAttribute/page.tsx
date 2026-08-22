import CategoryAttributePage from "@/app/components/Admin/CategoryPages/CategoryAttributePage";
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
        sort?: string;
        date?: string;
    }>;
};

export default async function CategoryAttribute({
    searchParams,
}: Props) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const {
        page: pageParam,
        limit: limitParam,
        search,
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

    const where: Prisma.CategoryAttributeWhereInput = {
        ...(search && {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    category: {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        }),

        ...(date === "today" && {
            createdAt: {
                gte: new Date(
                    new Date().setHours(
                        0,
                        0,
                        0,
                        0
                    )
                ),
            },
        }),

        ...(date === "week" && {
            createdAt: {
                gte: new Date(
                    Date.now() -
                    7 *
                    24 *
                    60 *
                    60 *
                    1000
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

    let orderBy: Prisma.CategoryAttributeOrderByWithRelationInput = {
        createdAt: "desc",
    };

    switch (sort) {
        case "OLDEST":
            orderBy = {
                createdAt: "asc",
            };
            break;

        case "NAME_AZ":
            orderBy = {
                title: "asc",
            };
            break;

        case "NAME_ZA":
            orderBy = {
                title: "desc",
            };
            break;

        default:
            orderBy = {
                createdAt: "desc",
            };
    }

    const [attribute, totalAttributes] =
        await Promise.all([
            prisma.categoryAttribute.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    category: true,
                },
            }),

            prisma.categoryAttribute.count({
                where,
            }),
        ]);

    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    const totalPages = Math.ceil(
        totalAttributes / limit
    );

    return (
        <div>
            <CategoryAttributePage
                attribute={attribute}
                categories={categories}
                pagination={{
                    page,
                    limit,
                    totalAttributes,
                    totalPages,
                    hasNextPage:
                        page < totalPages,
                    hasPreviousPage:
                        page > 1,
                }}
            />
        </div>
    );
}