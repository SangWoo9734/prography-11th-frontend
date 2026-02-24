import { useQuery } from "@tanstack/react-query";
import { getGenerationDetail } from "../api/generation";

export function useGetGenerationDetail(generationId: number | null) {
  const { data, isLoading } = useQuery({
    queryKey: ["generation", generationId],
    queryFn: () => getGenerationDetail(generationId!),
    enabled: generationId !== null,
  });

  return {
    parts: data?.parts ?? [],
    teams: data?.teams ?? [],
    isLoading,
  };
}
