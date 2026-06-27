import AddAddressPage from "@/app/components/Profile/AddAddressPage";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function New() {
    const session = await getServerSession(authOptions)

    if(!session){
        redirect('/login')
    }

    return (
        <div>
            <AddAddressPage/>
        </div>
    );
}