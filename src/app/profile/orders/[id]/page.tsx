import OrderDetailPage from "@/app/components/Profile/OrderDetailPage";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetail({ params }: Props) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const { id } = await params;

    return (
        <div>
            <OrderDetailPage id={id} />
        </div>
    );
}