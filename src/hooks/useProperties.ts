import { useQuery } from "@tanstack/react-query";
import { agentsApi, listingsApi, reportsApi } from "../services/Agentsapi";

const useProperties = () => {
  return useQuery({
    queryFn: () => {agentsApi(), listingsApi(), reportsApi()},
    queryKey: ["agent", "listings", "reports"],
  });
};


export default useProperties;
