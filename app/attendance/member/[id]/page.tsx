import { getAttendanceByMember } from "@/app/api/attendance";
import { getMember } from "@/app/api/user";
import MemberAttendanceDetail from "./components/MemberAttendanceDetail";
import ModalProvider from "@/app/components/ModalProvider";
import AddAttendanceModal from "./components/AddAttendanceModal";
import AttendanceHeader from "./components/AttendanceHeader";

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
    <ModalProvider modal={<AddAttendanceModal memberId={Number(id)} />}>
      <div className="w-full h-full flex flex-col">
        <AttendanceHeader />
        <div className="flex-1 overflow-scroll">
          <MemberAttendanceDetail attendance={attendance} member={member} />
        </div>
      </div>
    </ModalProvider>
  );
}
