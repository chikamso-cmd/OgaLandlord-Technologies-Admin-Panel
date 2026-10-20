import { useQuery } from "@tanstack/react-query";
import { ListingsApi } from "../services/Listingsapi";

const useListings = () => {
  return useQuery({
    queryFn: ListingsApi,
    queryKey: ["listings"],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    // Keep statuses in sync with the backend while the page is open.
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
};

export default useListings;
