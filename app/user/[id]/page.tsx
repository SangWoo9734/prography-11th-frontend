import { getMember } from "@/app/api/user";
import EditUserForm from "../components/EditUserForm";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const user = await getMember(id);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full px-4 py-3 border-b-2 flex items-center justify-between">
        <h1 className="text-2xl">회원 관리 / 회원 상세</h1>
      </div>
      <div className="flex justify-center items-center">
        <EditUserForm userInfo={user} />
      </div>
    </div>
  );
}
