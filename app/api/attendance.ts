import { apiClient } from "./client";
import {
  AttendanceType,
  AttendanceStatusType,
  UserAttendance,
} from "../types/attendance";

interface CreateAttendanceBody {
  sessionId: number;
  memberId: number;
  status: AttendanceStatusType;
  lateMinutes?: number;
  reason?: string;
}

interface UpdateAttendanceBody {
  status: AttendanceStatusType;
  lateMinutes?: number;
  reason?: string;
}

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

export const createAttendance = (body: CreateAttendanceBody) =>
  apiClient.post<void>("/api/v1/admin/attendances", body);

export const updateAttendance = (id: number, body: UpdateAttendanceBody) =>
  apiClient.put<void>(`/api/v1/admin/attendances/${id}`, body);
