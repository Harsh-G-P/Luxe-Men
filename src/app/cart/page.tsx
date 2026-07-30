import { getServerSession } from "next-auth";
import CartPage from "../components/Shop/CartPage";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function Cart() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }
    
    return (
        <div>
            <CartPage />
        </div>
    );
}