import { useQuery } from "@tanstack/react-query";
import { agentsApi } from "../services/Agentsapi";

const useProperties = () => {
  return useQuery({
    queryFn: agentsApi,
    queryKey: ["agent"],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
};

export default useProperties;
