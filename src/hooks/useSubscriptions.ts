import { useQuery } from "@tanstack/react-query";
import { SubscriptionsApi } from "../services/Subscriptionsapi";

export const useSubscriptions = () =>
  useQuery({
    queryFn: SubscriptionsApi,
    queryKey: ["subscriptions"],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
