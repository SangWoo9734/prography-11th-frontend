import { UserType } from "../types/user";
import { apiClient } from "./client";

export interface GetMemberParams {
  page?: number;
  size?: number;
  // searchType: string; searchValue: string, generation, partName, teamName, status
}

export interface MembersResponse {
  content: UserType[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const getMembers = async ({ page = 0, size = 10 }: GetMemberParams) => {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  return await apiClient.get<MembersResponse>(`/api/v1/admin/members?${query}`);
};
