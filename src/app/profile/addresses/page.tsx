
import AddressesPage from "@/app/components/Profile/AddressPage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Addresses() {
    const session = await getServerSession(authOptions)

    if(!session){
        redirect('/login')
    }

    const addresses = await prisma.address.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: [
            {
                isDefault: "desc"
            },
            {
                createdAt : "desc"
            }
        ]
    })

    return (
        <div>
            <AddressesPage address={addresses}/>
        </div>
    );
}