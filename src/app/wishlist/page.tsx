import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import WishlistPage from "../components/Shop/WishlistPage";


export default async function wishlist() {
     const session = await getServerSession(authOptions)
    
        if (!session) {
            redirect('/login')
        }
    return (
        <div>
            <WishlistPage />
        </div>
    );
}