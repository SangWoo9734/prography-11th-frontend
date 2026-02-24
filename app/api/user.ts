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

export const getMember = (id: number) =>
  apiClient.get<UserType>(`/api/v1/admin/members/${id}`);

export interface UpdateMemberBody {
  name?: string;
  phone?: string;
  generationId?: number;
  partId?: number;
  teamId?: number;
}

export interface DeleteMemberResponse {
  id: number;
  loginId: string;
  name: string;
  status: "WITHDRAWN";
  updatedAt: string;
}

export const updateMember = (id: number, { generationId, ...rest }: UpdateMemberBody) =>
  apiClient.put<UserType>(`/api/v1/admin/members/${id}`, {
    ...rest,
    ...(generationId !== undefined && { cohortId: generationId }),
  });

export const deleteMember = (id: number) =>
  apiClient.delete<DeleteMemberResponse>(`/api/v1/admin/members/${id}`);

export interface CreateMemberBody {
  loginId: string;
  password: string;
  name: string;
  phone: string;
  cohortId: number;
  partId?: number;
  teamId?: number;
}

export const createMember = ({ generationId, ...rest }: Omit<CreateMemberBody, "cohortId"> & { generationId: number }) =>
  apiClient.post<UserType>("/api/v1/admin/members", { ...rest, cohortId: generationId });
