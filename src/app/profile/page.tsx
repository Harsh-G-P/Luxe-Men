import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import prisma from "../lib/prisma";
import UserProfile from "../components/Profile/UserProfile";



export default async function Profile() {

    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
            createdAt: true,
            accountDeletionStatus: true,
            accountDeletionReason: true,
            accountDeletionRequestedAt: true,
        }
    })

    if (!user) {
        redirect('/')
    }

    return (
        <div>
            <UserProfile user={user} />
        </div>
    );
}