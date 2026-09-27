import { useQuery } from "@tanstack/react-query";
import { ListingsApi } from "../services/Listingsapi";

const useListings = () => {
  return useQuery({
    queryFn: ListingsApi,
    queryKey: ["listings"],
  });
};

export default useListings;



