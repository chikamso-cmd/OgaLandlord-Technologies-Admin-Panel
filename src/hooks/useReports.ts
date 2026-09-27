import {  useQuery } from "@tanstack/react-query";
import { ReportsApi } from "../services/Reportapi";


export const useReports = () => {
  return useQuery({
    queryFn: ReportsApi,
    queryKey: ["reports"],
  });
}
