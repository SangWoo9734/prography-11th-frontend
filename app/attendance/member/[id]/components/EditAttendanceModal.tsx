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
    <div className="fixed top-0 h-screen w-screen bg-gray-700/50 z-100">
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-lg p-8 min-w-80 max-w-4/5 w-96">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          닫기
        </Button>

        <div className="text-xl mb-2">출결 정보 수정</div>
        <p className="text-sm text-gray-400 mb-6">{formatDate(item.createdAt)}</p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="w-20 text-sm text-gray-500 shrink-0">패널티 종류</p>
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
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
              <p className="w-20 text-sm text-gray-500 shrink-0">지각 시간</p>
              <select
                className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
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
              <p className="w-20 text-sm text-gray-500 shrink-0">사유</p>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
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
