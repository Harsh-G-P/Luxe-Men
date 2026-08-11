import BrandPage from "@/app/components/Admin/BrandPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Brand() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const brand = await prisma.brand.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    return (
        <div>
            <BrandPage brand={brand} />
        </div>
    );
}