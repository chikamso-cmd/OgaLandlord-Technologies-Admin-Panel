import {  useQuery } from "@tanstack/react-query";
import { ReportsApi } from "../services/Reportapi";


export const useReports = () => {
  return useQuery({
    queryFn: ReportsApi,
    queryKey: ["reports"],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
}
