"use client";

import { AttendanceRow, AttendanceStatus } from "@/app/types/attendance";
import { useRouter } from "next/navigation";
import { formatDate } from "@/app/utils/date";

const statusStyle: Record<AttendanceStatus, string> = {
  PRESENT: "bg-green-100 text-green-700",
  ABSENT: "bg-red-100 text-red-700",
  LATE: "bg-amber-100 text-amber-700",
  EXCUSED: "bg-gray-100 text-gray-600",
};

const statusLabel: Record<AttendanceStatus, string> = {
  PRESENT: "출석",
  ABSENT: "결석",
  LATE: "지각",
  EXCUSED: "공결",
};

export default function AttendanceTable({ rows }: { rows: AttendanceRow[] }) {
  const router = useRouter();

  if (rows.length === 0) {
    return (
      <div className="flex justify-center items-center py-16 text-gray-400 text-center">
        해당 데이터가 없습니다.
        <br />
        검색 조건을 선택하고 검색 버튼을 눌러주세요.
      </div>
    );
  }

  return (
    <table className="relative min-w-full text-sm text-left [&_th]:px-4 [&_th]:py-3 [&_th]:whitespace-nowrap [&_td]:px-4 [&_td]:py-3">
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0">
        <tr>
          <th>사용자명</th>
          <th>팀명</th>
          <th>날짜</th>
          <th>출석 여부</th>
          <th>지각 시간</th>
          <th>벌금</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            className="border-b hover:bg-gray-50"
            onClick={() => {
              router.push(`/attendance/member/${row.memberId}`);
            }}
          >
            <td>{row.name}</td>
            <td>{row.teamName}</td>
            <td className="whitespace-nowrap text-gray-500">
              {formatDate(row.date)}
            </td>
            <td>
              <span
                className={`px-2 py-1 rounded-full text-xs ${statusStyle[row.status]}`}
              >
                {statusLabel[row.status]}
              </span>
            </td>
            <td className="text-gray-500">
              {row.lateMinutes > 0 ? `${row.lateMinutes}분` : "-"}
            </td>
            <td className="text-gray-500">
              {row.penaltyAmount > 0
                ? `${row.penaltyAmount.toLocaleString()}원`
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
