import { AttendanceStatusType } from "@/app/types/attendance";

export const MAX_LATE_LIMIT = 10;

export const LATE_MINUTE_OPTIONS = Array.from(
  { length: MAX_LATE_LIMIT },
  (_, i) => i,
);

export type PenaltyType = "지각" | "결석" | "조퇴" | "기타";

export const PENALTY_OPTIONS: PenaltyType[] = ["지각", "결석", "조퇴", "기타"];

export function toApiFields(
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

export function toPenaltyType(
  status: AttendanceStatusType,
  reason: string | null,
): PenaltyType {
  if (status === "LATE") return "지각";
  if (status === "ABSENT") return "결석";
  if (status === "EXCUSED" && reason === "조퇴") return "조퇴";
  return "기타";
}

export const ERROR_MESSAGES: Record<string, string> = {
  ATTENDANCE_ALREADY_CHECKED: "이미 출결 기록이 존재합니다.",
  EXCUSE_LIMIT_EXCEEDED: "공결 가능 횟수(3회)를 초과했습니다.",
  DEPOSIT_INSUFFICIENT: "보증금이 부족합니다.",
};
