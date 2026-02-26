import { AttandanceInfo, UserAttendance } from "@/app/types/attendance";
import { cn } from "@/app/utils/cn";

function getThisWeekPenalty(attendances: AttandanceInfo[]) {
  const today = new Date();
  const diff = today.getDay() === 0 ? -6 : 1 - today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return attendances
    .filter((a) => new Date(a.createdAt) >= monday)
    .reduce((sum, a) => sum + a.penaltyAmount, 0);
}

interface Props {
  attendance: UserAttendance;
}

export default function AttendanceSummary({ attendance }: Props) {
  const { attendances } = attendance;

  const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
  const lateCount = attendances.filter((a) => a.status === "LATE").length;
  const absentCount = attendances.filter((a) => a.status === "ABSENT").length;
  const thisWeekPenalty = getThisWeekPenalty(attendances);
  const totalPenalty = attendances.reduce((sum, a) => sum + a.penaltyAmount, 0);

  const LABEL_CELL =
    "px-4 py-3 bg-gray-50/50 font-bold text-gray-700 whitespace-nowrap text-xs uppercase tracking-wider";
  const VALUE_CELL = "px-4 py-3 text-gray-900";

  return (
    <>
      {/* 출결 현황 */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3 ml-1">출결 현황</h2>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-gray-50">
            <div className="flex flex-col items-center py-5 gap-1 hover:bg-gray-50/50 transition-colors">
              <span className="text-xs font-medium text-gray-500">출석</span>
              <span className="text-2xl font-bold text-green-600">
                {presentCount}
              </span>
            </div>
            <div className="flex flex-col items-center py-5 gap-1 hover:bg-gray-50/50 transition-colors">
              <span className="text-xs font-medium text-gray-500">지각</span>
              <span className="text-2xl font-bold text-amber-500">
                {lateCount}
              </span>
            </div>
            <div className="flex flex-col items-center py-5 gap-1 hover:bg-gray-50/50 transition-colors">
              <span className="text-xs font-medium text-gray-500">결석</span>
              <span className="text-2xl font-bold text-red-500">
                {absentCount}
              </span>
            </div>
            <div className="flex flex-col items-center py-5 gap-1 hover:bg-gray-50/50 transition-colors">
              <span className="text-xs font-medium text-gray-500">공결</span>
              <span className="text-2xl font-bold text-gray-500">
                {attendance.excuseCount}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 벌금 현황 */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3 ml-1">벌금 현황</h2>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-50 text-sm overflow-hidden">
          <div className="grid grid-cols-[200px_1fr] divide-x divide-gray-50">
            <span className={LABEL_CELL}>이번주 지각비</span>
            <span className={cn(VALUE_CELL, "font-medium text-gray-900")}>
              {thisWeekPenalty.toLocaleString()}원
            </span>
          </div>
          <div className="grid grid-cols-[200px_1fr] divide-x divide-gray-50">
            <span className={LABEL_CELL}>누적 지각비</span>
            <span className={cn(VALUE_CELL, "font-medium text-gray-900")}>
              {totalPenalty.toLocaleString()}원
            </span>
          </div>
          <div className="grid grid-cols-[200px_1fr] divide-x divide-gray-50">
            <span className={LABEL_CELL}>잔여 보증금</span>
            <span className={cn(VALUE_CELL, "font-bold text-blue-600")}>
              {attendance.deposit.toLocaleString()}원
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
