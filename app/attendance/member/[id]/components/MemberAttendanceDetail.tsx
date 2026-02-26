"use client";

import { useState } from "react";
import {
  UserAttendance,
  AttandanceInfo,
  AttendanceStatusType,
  ATTENDANCE_STATUS_TEXT,
} from "@/app/types/attendance";
import { UserType } from "@/app/types/user";
import { formatDate } from "@/app/utils/date";
import EditAttendanceModal from "./EditAttendanceModal";

const ITEMS_PER_PAGE = 10;

const STATUS_STYLE: Record<AttendanceStatusType, string> = {
  PRESENT: "bg-green-100 text-green-700",
  ABSENT: "bg-red-100 text-red-700",
  LATE: "bg-amber-100 text-amber-700",
  EXCUSED: "bg-gray-100 text-gray-600",
};

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

const LABEL_CELL =
  "px-4 py-3 bg-gray-50 font-medium text-gray-700 whitespace-nowrap";
const VALUE_CELL = "px-4 py-3";

export default function MemberAttendanceDetail({
  attendance,
  member,
}: {
  attendance: UserAttendance;
  member: UserType;
}) {
  const [page, setPage] = useState(1);
  const [editingItem, setEditingItem] = useState<AttandanceInfo | null>(null);

  const totalItems = attendance.attendances.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginatedItems = attendance.attendances.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const thisWeekPenalty = getThisWeekPenalty(attendance.attendances);
  const totalPenalty = attendance.attendances.reduce(
    (sum, a) => sum + a.penaltyAmount,
    0,
  );

  const presentCount = attendance.attendances.filter(
    (a) => a.status === "PRESENT",
  ).length;
  const lateCount = attendance.attendances.filter(
    (a) => a.status === "LATE",
  ).length;
  const absentCount = attendance.attendances.filter(
    (a) => a.status === "ABSENT",
  ).length;

  const pageWindowStart = Math.floor((page - 1) / 5) * 5 + 1;
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages - pageWindowStart + 1) },
    (_, i) => pageWindowStart + i,
  );

  return (
    <>
    <div className="flex flex-col gap-6 p-6">
      {/* 회원 정보 */}
      <section>
        <h2 className="text-sm text-gray-500 mb-2">회원 정보</h2>
        <div className="border rounded-lg divide-y text-sm overflow-hidden">
          <div className="grid grid-cols-2 divide-x">
            <div className="grid grid-cols-[140px_1fr] divide-x">
              <span className={LABEL_CELL}>이름</span>
              <span className={VALUE_CELL}>{attendance.memberName}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] divide-x">
              <span className={LABEL_CELL}>기수</span>
              <span className={VALUE_CELL}>{attendance.generation}기</span>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x">
            <div className="grid grid-cols-[140px_1fr] divide-x">
              <span className={LABEL_CELL}>ID</span>
              <span className={VALUE_CELL}>{member.loginId}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] divide-x">
              <span className={LABEL_CELL}>파트</span>
              <span className={VALUE_CELL}>{attendance.partName}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x">
            <div className="grid grid-cols-[140px_1fr] divide-x">
              <span className={LABEL_CELL}>핸드폰 번호</span>
              <span className={VALUE_CELL}>{member.phone}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] divide-x">
              <span className={LABEL_CELL}>참여팀</span>
              <span className={VALUE_CELL}>{attendance.teamName}</span>
            </div>
          </div>
        </div>
      </section>

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

      {/* 출결 정보 */}
      <section>
        <h2 className="text-sm text-gray-500 mb-2">출결 정보</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full text-sm text-left [&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th>날짜</th>
                <th>출석 여부</th>
                <th>지각 시간</th>
                <th>벌금</th>
                <th>사유</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">
                    출결 정보가 없습니다.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="whitespace-nowrap text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${STATUS_STYLE[item.status]}`}
                      >
                        {ATTENDANCE_STATUS_TEXT[item.status]}
                      </span>
                    </td>
                    <td className="text-gray-500">
                      {item.lateMinutes ? `${item.lateMinutes}분` : "-"}
                    </td>
                    <td className="text-gray-500">
                      {item.penaltyAmount > 0
                        ? `${item.penaltyAmount.toLocaleString()}원`
                        : "-"}
                    </td>
                    <td className="text-gray-500">{item.reason ?? "-"}</td>
                    <td>
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={() => setEditingItem(item)}
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-1 text-sm py-2">
        <button
          className="px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-30"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          |&lt;
        </button>
        <button
          className="px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-30"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          &lt;
        </button>
        {pageNumbers.map((n) => (
          <button
            key={n}
            className={`px-3 py-1 rounded ${n === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
            onClick={() => setPage(n)}
          >
            {n}
          </button>
        ))}
        <button
          className="px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-30"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          &gt;
        </button>
        <button
          className="px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-30"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          &gt;|
        </button>
      </div>
    </div>

    {editingItem && (
      <EditAttendanceModal
        item={editingItem}
        memberId={attendance.memberId}
        onClose={() => setEditingItem(null)}
      />
    )}
    </>
  );
}
