import OrdersPage from "@/app/components/Profile/OrdersPage";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Orders() {
    const session = await getServerSession(authOptions)
    
        if(!session){
            redirect('/login')
        }
    return (
        <div>
            <OrdersPage />
        </div>
    );
}