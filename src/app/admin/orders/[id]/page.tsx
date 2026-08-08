import AdminOrderDetail from "@/app/components/Admin/OrderPages/OrderDetailsPage";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetails({ params }: Props) {
    const { id } = await params;
    return (
        <div>
            <AdminOrderDetail id={id}/>
        </div>
    );
}