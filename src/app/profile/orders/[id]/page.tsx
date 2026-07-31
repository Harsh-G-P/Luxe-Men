import OrderDetailPage from "@/app/components/Profile/OrderDetailPage";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function OrderDetail() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    return (
        <div>
            <OrderDetailPage />
        </div>
    );
}