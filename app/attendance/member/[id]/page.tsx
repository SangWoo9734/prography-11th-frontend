import { getAttendanceByMember } from "@/app/api/attendance";
import { getMember } from "@/app/api/user";
import MemberAttendanceDetail from "./components/MemberAttendanceDetail";

export default async function MemberAttendancePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const [attendance, member] = await Promise.all([
    getAttendanceByMember(id),
    getMember(id),
  ]);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full px-4 py-3 border-b-2">
        <h1 className="text-2xl">출결 관리 / 출결 내역 상세</h1>
      </div>
      <div className="flex-1 overflow-scroll">
        <MemberAttendanceDetail attendance={attendance} member={member} />
      </div>
    </div>
  );
}
