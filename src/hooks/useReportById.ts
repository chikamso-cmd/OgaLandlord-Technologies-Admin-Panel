import { useQuery } from "@tanstack/react-query";
import { ReportByIdApi } from "../services/Reportapi";

export const useReportById = (reportId: string | null) =>
  useQuery({
    queryFn: () => ReportByIdApi(reportId!),
    queryKey: ["report", reportId],
    enabled: reportId !== null,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
