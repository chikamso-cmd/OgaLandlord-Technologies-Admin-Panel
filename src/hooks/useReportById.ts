import { useQuery } from "@tanstack/react-query";
import { ReportByIdApi } from "../services/Reportapi";

export const useReportById = (reportId: string | null) =>
  useQuery({
    queryFn: () => ReportByIdApi(reportId!),
    queryKey: ["report", reportId],
    enabled: reportId !== null,
  });
