import { useQuery } from "@tanstack/react-query";
import { dashboardStatsApi } from "../services/Agentsapi";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardStatsApi,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
