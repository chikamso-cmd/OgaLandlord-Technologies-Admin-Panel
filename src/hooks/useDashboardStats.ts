import { useQuery } from "@tanstack/react-query";
import { dashboardStatsApi } from "../services/Agentsapi";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardStatsApi,
  });
