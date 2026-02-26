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
    <div className="w-full flex flex-col min-h-full bg-gray-50/50">
      <div className="w-full px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm shrink-0">
        <h1 className="text-xl font-bold text-gray-800">
          <span className="text-gray-400 font-normal">회원 관리 /</span> 회원 상세
        </h1>
      </div>
      <div className="flex-1 flex justify-center p-8 overflow-auto text-gray-800">
        <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 h-fit">
          <EditUserForm userInfo={user} />
        </div>
      </div>
    </div>
  );
}
