import UsersPage from "@/app/components/Admin/UserPages/UsersPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


type Props = {
    searchParams: Promise<{
        search?: string;
        role?: string;
        sort?: string;
        date?: string
    }>;
};


export default async function User({ searchParams }: Props) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const {
        search,
        role,
        sort,
        date,
    } = await searchParams;

    const where: Prisma.UserWhereInput = {
        // Search
        ...(search && {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    username: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        }),

        // Role filter
        ...(role && role !== "ALL" && {
            role: role as Prisma.EnumRoleFilter,
        }),

        // Today
        ...(date === "today" && {
            createdAt: {
                gte: new Date(
                    new Date().setHours(0, 0, 0, 0)
                ),
            },
        }),

        // Last 7 days
        ...(date === "week" && {
            createdAt: {
                gte: new Date(
                    Date.now() - 7 * 24 * 60 * 60 * 1000
                ),
            },
        }),

        // Current month
        ...(date === "month" && {
            createdAt: {
                gte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                ),
            },
        }),
        ...(date === "year" && {
    createdAt: {
        gte: new Date(new Date().getFullYear(), 0, 1),
    },
}),
    };

    let orderBy: Prisma.UserOrderByWithRelationInput ={
        createdAt: "desc",
    };

     switch (sort) {
        case "OLDEST":
            orderBy = {
                createdAt: "asc",
            };
            break;

        case "NAME_ASC":
            orderBy = {
                name: "asc",
            };
            break;

        case "NAME_DESC":
            orderBy = {
                name: "desc",
            };
            break;

        case "NEWEST":
        default:
            orderBy = {
                createdAt: "desc",
            };
            break;
    }

    const users = await prisma.user.findMany({
        where,
        orderBy,
        select: {
            id: true,
            email: true,
            name: true,
            image: true,
            username: true,
            role: true,
            createdAt: true,
        },
    })


    return (
        <div>
            <UsersPage users={users} />
        </div>
    );
}