import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember } from "../api/user";
import { useRouter } from "next/navigation";

export function useDeleteMember() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      router.back();
    },
  });
}
