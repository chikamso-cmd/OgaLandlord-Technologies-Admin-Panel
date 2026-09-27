import type { AgentSubscription } from "../types";
import api from "./Axios";

interface SubscriptionsResponse {
  data?: {
    subscriptions?: AgentSubscription[];
  };
}

export const SubscriptionsApi = async (): Promise<AgentSubscription[]> => {
  const response = await api.get<SubscriptionsResponse>("/agent/subscription");
  const subscriptions = response.data?.data?.subscriptions;
  return Array.isArray(subscriptions) ? subscriptions : [];
};
