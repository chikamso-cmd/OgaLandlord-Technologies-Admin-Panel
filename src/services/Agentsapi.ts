import api from "./Axios";
import { OgaAgent } from "../types";

type ApiCollection = Record<string, unknown>;

const getCollection = (payload: unknown): ApiCollection[] => {
  if (Array.isArray(payload)) return payload as ApiCollection[];
  if (!payload || typeof payload !== "object") return [];

  const response = payload as ApiCollection;
  for (const key of ["data", "users", "agents", "listings", "results"]) {
    if (Array.isArray(response[key])) return response[key] as ApiCollection[];
  }

  return [];
};

const getNumericValue = (value: unknown): number | null => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const agentsApi = async (): Promise<any[]> => {
  const response = await api.get("/admin/all_users?role=agent");
  const users = Array.isArray(response.data)
    ? response.data
    : (response.data?.data ?? []);

  return users.map(
    (user: ApiCollection): OgaAgent => ({
      data: {
        id: Number(user.id),
        name: String(user.name ?? "Unnamed agent"),
        email: String(user.email ?? ""),
        phone: String(user.phoneNo ?? ""),
        avatar: String(user.imageUrl ?? ""),
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

export const dashboardStatsApi = async () => {
  const [usersResponse, pendingResponse] = await Promise.all([
    api.get("/admin/all_users?role=agent"),
    api.get("/admin/agents_pending_verification"),
  ]);

  const users = getCollection(usersResponse.data);
  const pendingItems = getCollection(pendingResponse.data);
  const pendingPayload =
    pendingResponse.data && typeof pendingResponse.data === "object"
      ? (pendingResponse.data as ApiCollection)
      : {};
  const pendingCount =
    getNumericValue(
      pendingPayload.count ??
        pendingPayload.total ??
        pendingPayload.pendingCount,
    ) ?? pendingItems.length;

  let listingItems: ApiCollection[] = [];
  try {
    const listingsResponse = await api.get("/admin/agents/");
    listingItems = getCollection(listingsResponse.data);
  } catch {}
  const activeListingsFromAgents = users.reduce((total, user) => {
    const count =
      getNumericValue(user.activeListingsCount) ??
      getNumericValue(user.activeListings) ??
      (Array.isArray(user.listings) ? user.listings.length : 0);
    return total + count;
  }, 0);
  const activeListings =
    activeListingsFromAgents ||
    listingItems.filter((listing) => {
      const status = String(listing.status ?? listing.listingStatus ?? "")
        .toLowerCase()
        .replace(/[_-]/g, " ");
      return ["active", "verified", "available", "published"].includes(status);
    }).length;

  return {
    totalAgents: users.length,
    verifiedAgents: users.filter(
      (user) =>
        user.isVerified === true ||
        String(user.verificationStatus ?? "").toLowerCase() === "verified",
    ).length,
    pendingVerification: pendingCount,
    activeListings,
  };
};

// export const listingsApi = async (): Promise<any[]> => {
//   const response = await api.get("/admin/agents/");
//   return response.data;
// };
// export const reportsApi = async (): Promise<any[]> => {
//   const response = await api.get("/auth/agents/");
//   return response.data;
// };
