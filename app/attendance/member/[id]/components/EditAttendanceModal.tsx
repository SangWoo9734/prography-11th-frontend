"use client";

import Button from "@/app/components/Button";
import { AttandanceInfo } from "@/app/types/attendance";
import { formatDate } from "@/app/utils/date";
import { createPortal } from "react-dom";
import { LATE_MINUTE_OPTIONS, MAX_LATE_LIMIT, PENALTY_OPTIONS } from "./attendanceFormUtils";
import { useEditAttendanceForm } from "./useEditAttendanceForm";

interface Props {
  item: AttandanceInfo;
  memberId: number;
  onClose: () => void;
}

export default function EditAttendanceModal({ item, memberId, onClose }: Props) {
  const {
    penaltyType,
    setPenaltyType,
    lateMinutes,
    setLateMinutes,
    reason,
    setReason,
    errorMsg,
    isPending,
    handleSubmit,
  } = useEditAttendanceForm(item, memberId, onClose);

  return createPortal(
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          닫기
        </Button>

        <div className="text-xl font-bold text-gray-800 mb-2">출결 정보 수정</div>
        <p className="text-sm font-medium text-blue-500 mb-8 border-b border-gray-50 pb-4">{formatDate(item.createdAt)}</p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="w-20 text-sm font-bold text-gray-700 shrink-0">패널티 종류</p>
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              value={penaltyType}
              onChange={(e) => {
                setPenaltyType(e.target.value as typeof penaltyType);
                setReason("");
              }}
            >
              {PENALTY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {penaltyType === "지각" && (
            <div className="flex items-center gap-4">
              <p className="w-20 text-sm font-bold text-gray-700 shrink-0">지각 시간</p>
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                value={lateMinutes}
                onChange={(e) => setLateMinutes(Number(e.target.value))}
              >
                {LATE_MINUTE_OPTIONS.map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}분
                  </option>
                ))}
                <option value={MAX_LATE_LIMIT}>{MAX_LATE_LIMIT}분 이상</option>
              </select>
            </div>
          )}

          {penaltyType === "기타" && (
            <div className="flex items-center gap-4">
              <p className="w-20 text-sm font-bold text-gray-700 shrink-0">사유</p>
              <input
                type="text"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="사유를 직접 입력해주세요"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}

          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button variant="outline" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "수정 중..." : "수정"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
