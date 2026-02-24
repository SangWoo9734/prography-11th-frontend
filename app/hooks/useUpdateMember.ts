import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMember, UpdateMemberBody } from "../api/user";

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateMemberBody }) =>
      updateMember(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
