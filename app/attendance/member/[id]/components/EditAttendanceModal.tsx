"use client";

import Button from "@/app/components/Button";
import { updateAttendance } from "@/app/api/attendance";
import { AttandanceInfo, AttendanceStatusType } from "@/app/types/attendance";
import { formatDate } from "@/app/utils/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createPortal } from "react-dom";

const MAX_LATE_LIMIT = 10;

const LATE_MINUTE_OPTIONS = Array.from({ length: MAX_LATE_LIMIT }, (_, i) => i);

type PenaltyType = "지각" | "결석" | "조퇴" | "기타";

const PENALTY_OPTIONS: PenaltyType[] = ["지각", "결석", "조퇴", "기타"];

function toPenaltyType(
  status: AttendanceStatusType,
  reason: string | null,
): PenaltyType {
  if (status === "LATE") return "지각";
  if (status === "ABSENT") return "결석";
  if (status === "EXCUSED" && reason === "조퇴") return "조퇴";
  return "기타";
}

function toApiFields(
  penaltyType: PenaltyType,
  lateMinutes: number,
  reason: string,
) {
  switch (penaltyType) {
    case "지각":
      return { status: "LATE" as AttendanceStatusType, lateMinutes };
    case "결석":
      return { status: "ABSENT" as AttendanceStatusType };
    case "조퇴":
      return { status: "EXCUSED" as AttendanceStatusType, reason: "조퇴" };
    case "기타":
      return {
        status: "EXCUSED" as AttendanceStatusType,
        ...(reason && { reason }),
      };
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  EXCUSE_LIMIT_EXCEEDED: "공결 가능 횟수(3회)를 초과했습니다.",
  DEPOSIT_INSUFFICIENT: "보증금이 부족합니다.",
};

interface Props {
  item: AttandanceInfo;
  memberId: number;
  onClose: () => void;
}

export default function EditAttendanceModal({
  item,
  memberId,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const initialPenaltyType = toPenaltyType(item.status, item.reason);
  const [penaltyType, setPenaltyType] = useState<PenaltyType>(initialPenaltyType);
  const [lateMinutes, setLateMinutes] = useState(item.lateMinutes ?? 1);
  const [reason, setReason] = useState(
    item.status === "EXCUSED" && item.reason !== "조퇴" ? (item.reason ?? "") : "",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateAttendance(item.id, toApiFields(penaltyType, lateMinutes, reason)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", memberId] });
      onClose();
    },
    onError: (err: Error & { code?: string }) => {
      setErrorMsg(ERROR_MESSAGES[err.code ?? ""] ?? err.message);
    },
  });

  const handleSubmit = () => {
    if (penaltyType === "기타" && !reason.trim()) {
      setErrorMsg("기타 사유를 입력해주세요.");
      return;
    }
    setErrorMsg("");
    mutate();
  };

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
                setPenaltyType(e.target.value as PenaltyType);
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
