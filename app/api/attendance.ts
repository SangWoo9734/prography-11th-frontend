import { apiClient } from "./client";
import { AttendanceType, UserAttendance } from "../types/attendance";

interface AttendanceBySessionResponse {
  attendances: AttendanceType[];
}

export const getAttendanceBySession = (sessionId: number) =>
  apiClient.get<AttendanceBySessionResponse>(
    `/api/v1/admin/attendances/sessions/${sessionId}`,
  );

export const getAttendanceByMember = (memberId: number) =>
  apiClient.get<UserAttendance>(
    `/api/v1/admin/attendances/members/${memberId}`,
  );
