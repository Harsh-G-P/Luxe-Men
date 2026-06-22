import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import prisma from "../lib/prisma";
import UserProfile from "../components/UserProfile";



export default async function Profile() {

    const session = await getServerSession(authOptions)

    if(!session){
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: {
            id:session.user.id
        },
        select:{
            id: true,
            name: true,
            username: true,
            email : true,
            createdAt: true
        }
    })

    if(!user) {
        redirect('/login')
    }

    return (
        <div>
            <UserProfile user={user} />
        </div>
    );
}