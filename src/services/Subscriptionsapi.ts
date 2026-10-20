import type { AgentSubscription } from "../types";
import api from "./Axios";

interface SubscriptionsResponse {
  data?: {
    subscriptions?: AgentSubscription[];
  };
}

export const SubscriptionsApi = async (): Promise<AgentSubscription[]> => {
  const response = await api.get<SubscriptionsResponse>(
    "/admin/all_agents_subscriptions",
  );
  const subscriptions = response.data?.data?.subscriptions;
  return Array.isArray(subscriptions) ? subscriptions : [];
};
