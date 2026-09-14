import { useQuery } from "@tanstack/react-query";
import { agentsApi } from "../services/Agentsapi";

const useProperties = () => {
  return useQuery({
    queryFn: () => {agentsApi()},
    queryKey: ["agent"]
  });
};


export default useProperties;
