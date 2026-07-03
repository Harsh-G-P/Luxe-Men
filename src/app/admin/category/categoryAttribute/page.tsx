import CategoryAttributePage from "@/app/components/Admin/CategoryAttributePage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function CategoryAttribute() {
    const session = await getServerSession(authOptions);

    if(!session){
        redirect("/login")
    }

    const attribute = await prisma.categoryAttribute.findMany({
        orderBy: {
            createdAt:"desc"
        },
        include: {
            category: true
        }
    })

    const categories = await prisma.category.findMany({
         orderBy: {
            createdAt:"desc"
        }
    })

    return (
        <div>
            <CategoryAttributePage attribute={attribute} categories={categories} />
        </div>
    );
}