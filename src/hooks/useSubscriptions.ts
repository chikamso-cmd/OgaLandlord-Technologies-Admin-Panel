import { useQuery } from "@tanstack/react-query";
import { SubscriptionsApi } from "../services/Subscriptionsapi";

export const useSubscriptions = () =>
  useQuery({
    queryFn: SubscriptionsApi,
    queryKey: ["subscriptions"],
  });
