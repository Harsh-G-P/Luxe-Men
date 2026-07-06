import AddProductPage from "@/app/components/Admin/ProductPages/AddProductPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function New() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const brands = await prisma.brand.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    const categories = (
        await prisma.category.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                attributes: {
                    select: {
                        title: true,
                        values: true,
                    },
                },
            },
        })
    ).map((category) => ({
        ...category,
        attributes: category.attributes.map((attr) => ({
            ...attr,
            values: attr.values as string[],
        })),
    }));

    return (
        <div>
            <AddProductPage brands={brands} categories={categories} />
        </div>
    );
}