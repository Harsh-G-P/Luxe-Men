import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import AdminPage from "../components/Admin/AdminPage";

export default async function Admin() {
    const session = await getServerSession(authOptions)
    
        if (!session || session.user.role !== "ADMIN") {
            redirect("/login");
        }
    return (
        <div>
            <AdminPage adminName={session.user.name || "Admin"} />
        </div>
    );
}