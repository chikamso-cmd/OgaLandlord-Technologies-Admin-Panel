import api from "./Axios";

export const agentsApi = async (): Promise<any[]> => {
  const response = await api.get("/auth/agents?role=agent");
  return response.data;
};
export const listingsApi = async (): Promise<any[]> => {
  const response = await api.get("/auth/agents?role=agent");
  return response.data;
};
export const reportsApi = async (): Promise<any[]> => {
  const response = await api.get("/auth/agents?role=agent");
  return response.data;
};
