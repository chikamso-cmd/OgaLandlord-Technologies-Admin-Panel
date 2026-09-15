import api from "./Axios";

export const agentsApi = async (): Promise<any[]> => {
  const response = await api.get("/admin/all_users?role=agent");
  const users = Array.isArray(response.data)
    ? response.data
    : (response.data?.data ?? []);

  return users.map(
    (user): OgaAgent => ({
      data: {
        id: String(user.id),
        name: user.name ?? "Unnamed agent",
        email: user.email ?? "",
        phone: user.phoneNo ?? "",
        avatar: user.imageUrl ?? "",
        verificationStatus: user.isVerified
          ? "Verified"
          : user.verificationStatus === "pending"
            ? "Pending"
            : "not_started",
        trustScore: Number(user.trustScore ?? 0),
        activeListingsCount: 0,
        subscriptionPlan: "Free",
        experienceYears: 0,
        dealsClosed: 0,
        responseTime: 0,
        transactionSuccess: 0,
        clientSatisfaction: 0,
        areasOfOperation: [],
      },
    }),
  );
};
export const listingsApi = async (): Promise<any[]> => {
  const response = await api.get("/admin/agents/");
  return response.data;
};
export const reportsApi = async (): Promise<any[]> => {
  const response = await api.get("/auth/agents/");
  return response.data;
};
