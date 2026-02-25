import { apiClient } from "./client";
import { SessionType } from "../types/session";

export const getSessions = (dateFrom: string, dateTo: string) =>
  apiClient.get<SessionType[]>(
    `/api/v1/admin/sessions?dateFrom=${dateFrom}&dateTo=${dateTo}`,
  );
