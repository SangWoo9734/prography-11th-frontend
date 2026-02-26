import { useQuery } from "@tanstack/react-query";
import { GetMemberParams, getMembers } from "../api/user";

export function useGetMembers(
  params: GetMemberParams,
  options?: { enabled?: boolean },
) {
  const { data, isInitialLoading } = useQuery({
    queryKey: ["members", params.page, params.searchType, params.searchValue],
    queryFn: () => getMembers(params),
    enabled: options?.enabled,
  });

  return {
    userList: data?.content ?? [],
    totalPage: data?.totalPages ?? 0,
    isLoading: isInitialLoading,
  };
}
