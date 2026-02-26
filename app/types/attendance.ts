export const AttendanceStatus = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "EXCUSED",
] as const;

export type AttendanceStatusType = (typeof AttendanceStatus)[number];

export const AttendanceStatusText: Record<AttendanceStatusType, string> = {
  PRESENT: "출석",
  ABSENT: "결석",
  LATE: "지각",
  EXCUSED: "공결",
} as const;

export interface AttendanceType {
  memberId: number;
  status: AttendanceStatusType;
  lateMinutes: number;
  penaltyAmount: number;
}

export interface AttendanceRow {
  memberId: number;
  name: string;
  teamName: string;
  date: string;
  status: AttendanceStatusType;
  lateMinutes: number;
  penaltyAmount: number;
}

export interface AttandanceInfo {
  id: number;
  sessionId: number;
  memberId: number;
  status: AttendanceStatusType;
  lateMinutes: number | null;
  penaltyAmount: number;
  reason: string | null;
  checkedInAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserAttendance {
  memberId: number;
  memberName: string;
  generation: number;
  partName: string;
  teamName: string;
  deposit: number;
  excuseCount: number;
  attendances: AttandanceInfo[];
}
