import ProfilePage from "@/app/components/Profile/ProfilePage";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";



export default async function Edit() {

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
            image:true,
            createdAt: true
        }
    })

    if(!user) {
        redirect('/login')
    }

    return (
        <div>
            <ProfilePage user={user} />
        </div>
    );
}