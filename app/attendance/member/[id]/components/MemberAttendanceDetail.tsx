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
import { cn } from "@/app/utils/cn";
import EditAttendanceModal from "./EditAttendanceModal";
import AttendanceSummary from "./AttendanceSummary";
import Pagination from "@/app/components/Pagination";
import { usePagination } from "@/app/hooks/usePagination";

const ITEMS_PER_PAGE = 10;

const STATUS_STYLE: Record<AttendanceStatusType, string> = {
  PRESENT: "bg-green-50 text-green-600 border border-green-100",
  ABSENT: "bg-red-50 text-red-600 border border-red-100",
  LATE: "bg-amber-50 text-amber-600 border border-amber-100",
  EXCUSED: "bg-gray-50 text-gray-500 border border-gray-100",
};

const LABEL_CELL =
  "px-4 py-3 bg-gray-50/50 font-bold text-gray-700 whitespace-nowrap text-xs uppercase tracking-wider";
const VALUE_CELL = "px-4 py-3 text-gray-900";

export default function MemberAttendanceDetail({
  attendance,
  member,
}: {
  attendance: UserAttendance;
  member: UserType;
}) {
  const [editingItem, setEditingItem] = useState<AttandanceInfo | null>(null);

  const { page, setPage, totalPages, paginatedItems } = usePagination(
    attendance.attendances,
    ITEMS_PER_PAGE,
  );

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        {/* 회원 정보 */}
        <section>
          <h2 className="text-sm font-bold text-gray-700 mb-3 ml-1">회원 정보</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-50 text-sm overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-50">
              <div className="grid grid-cols-[140px_1fr] divide-x divide-gray-50">
                <span className={LABEL_CELL}>이름</span>
                <span className={VALUE_CELL}>{attendance.memberName}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] divide-x divide-gray-50">
                <span className={LABEL_CELL}>기수</span>
                <span className={VALUE_CELL}>{attendance.generation}기</span>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-50">
              <div className="grid grid-cols-[140px_1fr] divide-x divide-gray-50">
                <span className={LABEL_CELL}>ID</span>
                <span className={VALUE_CELL}>{member.loginId}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] divide-x divide-gray-50">
                <span className={LABEL_CELL}>파트</span>
                <span className={VALUE_CELL}>{attendance.partName}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-50">
              <div className="grid grid-cols-[140px_1fr] divide-x divide-gray-50">
                <span className={LABEL_CELL}>핸드폰 번호</span>
                <span className={VALUE_CELL}>{member.phone}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] divide-x divide-gray-50">
                <span className={LABEL_CELL}>참여팀</span>
                <span className={VALUE_CELL}>{attendance.teamName}</span>
              </div>
            </div>
          </div>
        </section>

        <AttendanceSummary attendance={attendance} />

        {/* 출결 정보 */}
        <section>
          <h2 className="text-sm font-bold text-gray-700 mb-3 ml-1">출결 정보</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="min-w-full text-sm text-left [&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3">
              <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                <tr>
                  <th>날짜</th>
                  <th>출석 여부</th>
                  <th>지각 시간</th>
                  <th>벌금</th>
                  <th>사유</th>
                  <th className="text-right">관리</th>
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
                          className={cn("px-2 py-1 rounded-full text-xs", STATUS_STYLE[item.status])}
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
                      <td className="text-right">
                        <button
                          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
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

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
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
