export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface AttendanceType {
  memberId: number;
  status: AttendanceStatus;
  lateMinutes: number;
  penaltyAmount: number;
}

export interface AttendanceRow {
  memberId: number;
  name: string;
  teamName: string;
  date: string;
  status: AttendanceStatus;
  lateMinutes: number;
  penaltyAmount: number;
}

export interface AttandanceInfo {
  id: number;
  sessionId: number;
  memberId: number;
  status: AttendanceStatus;
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
