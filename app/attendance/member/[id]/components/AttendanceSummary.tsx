import { AttandanceInfo, UserAttendance } from "@/app/types/attendance";

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
    "px-4 py-3 bg-gray-50 font-medium text-gray-700 whitespace-nowrap";
  const VALUE_CELL = "px-4 py-3";

  return (
    <>
      {/* 출결 현황 */}
      <section>
        <h2 className="text-sm text-gray-500 mb-2">출결 현황</h2>
        <div className="border rounded-lg text-sm overflow-hidden">
          <div className="grid grid-cols-4 divide-x">
            <div className="flex flex-col items-center py-4 gap-1">
              <span className="text-xs text-gray-500">출석</span>
              <span className="text-lg font-semibold text-green-600">
                {presentCount}
              </span>
            </div>
            <div className="flex flex-col items-center py-4 gap-1">
              <span className="text-xs text-gray-500">지각</span>
              <span className="text-lg font-semibold text-amber-500">
                {lateCount}
              </span>
            </div>
            <div className="flex flex-col items-center py-4 gap-1">
              <span className="text-xs text-gray-500">결석</span>
              <span className="text-lg font-semibold text-red-500">
                {absentCount}
              </span>
            </div>
            <div className="flex flex-col items-center py-4 gap-1">
              <span className="text-xs text-gray-500">공결</span>
              <span className="text-lg font-semibold text-gray-500">
                {attendance.excuseCount}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 벌금 현황 */}
      <section>
        <h2 className="text-sm text-gray-500 mb-2">벌금 현황</h2>
        <div className="border rounded-lg divide-y text-sm overflow-hidden">
          <div className="grid grid-cols-[200px_1fr] divide-x">
            <span className={LABEL_CELL}>이번주 지각비</span>
            <span className={VALUE_CELL}>
              {thisWeekPenalty.toLocaleString()}원
            </span>
          </div>
          <div className="grid grid-cols-[200px_1fr] divide-x">
            <span className={LABEL_CELL}>누적 지각비</span>
            <span className={VALUE_CELL}>{totalPenalty.toLocaleString()}원</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] divide-x">
            <span className={LABEL_CELL}>잔여 보증금</span>
            <span className={VALUE_CELL}>
              {attendance.deposit.toLocaleString()}원
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
