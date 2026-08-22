import UserDetailPage from "@/app/components/Admin/UserPages/UserDetailsPage";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetail({ params }: Props) {
    const { id } = await params;
    return (
        <div>
            <UserDetailPage id={id} />
        </div>
    );
}