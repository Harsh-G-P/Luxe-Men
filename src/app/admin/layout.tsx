import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import AdminLayoutPage from "../components/Admin/AdminLayoutPage";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    const adminName = session?.user?.name ?? "Admin";

    return (
        <AdminLayoutPage adminName={adminName}>
            {children}
        </AdminLayoutPage>
    );
}