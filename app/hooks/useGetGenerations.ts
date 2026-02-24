import { useQuery } from "@tanstack/react-query";
import { getGenerations } from "../api/generation";

export function useGetGenerations() {
  const { data, isLoading } = useQuery({
    queryKey: ["generations"],
    queryFn: getGenerations,
    staleTime: Infinity,
  });

  return {
    generations: data ?? [],
    isLoading,
  };
}
