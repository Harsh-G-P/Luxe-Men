import CategoryPage from "@/app/components/Admin/CategoryPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Category() {

    const session = await getServerSession(authOptions)

    if(!session){
        redirect("/login")
    }
    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    return (
        <div>
            <CategoryPage categories={categories} />
        </div>
    );
}