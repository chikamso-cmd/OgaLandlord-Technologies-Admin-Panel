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

const toNullableString = (value: unknown): string | null =>
  value === null || value === undefined || value === "" ? null : String(value);

type VerificationStatus =OgaAgent["data"]["verificationStatus"];

const verificationStatuses: VerificationStatus[] = [
  "not_started",
  "verified",
  "pending",
  "banned",
  "blocked",
];

const getVerificationStatus = (user: ApiCollection): VerificationStatus => {
  const status = String(
    user.verificationStatus ?? user.verification_status ?? user.status ?? "",
  )
    .trim()
    .toLowerCase()
    .replace(/[ -]/g, "_");
  if (verificationStatuses.includes(status as VerificationStatus)) {
    return status as VerificationStatus;
  }

  const isVerified = user.isVerified ?? user.is_verified;
  if (isVerified === true || String(isVerified).toLowerCase() === "true") {
    return "verified";
  }
  return "not_started";
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
        agentId: String(user.id),
        name: String(user.name ?? "Unnamed agent"),
        email: String(user.email ?? ""),
        phone: String(user.phoneNo ?? ""),
        avatar: String(user.imageUrl ?? ""),
        verificationStatus: getVerificationStatus(user),
        trustScore: Number(user.trustScore ?? 0),
        activeListingsCount: 0,
        subscriptionPlan: "Free",
        experienceYears: 0,
        dealsClosed: 0,
        responseTime: 0,
        transactionSuccess: 0,
        clientSatisfaction: 0,
        areasOfOperation: user.city ? [String(user.city)] : [],
        username: toNullableString(user.username),
        role: toNullableString(user.role),
        isVerified: user.isVerified === true,
        status: toNullableString(user.status),
        address: toNullableString(user.address),
        adminLevel: toNullableString(user.adminLevel),
        businessName: toNullableString(user.businessName),
        rcNumber: toNullableString(user.rcNumber),
        businessAddress: toNullableString(user.businessAddress),
        idType: toNullableString(user.idType),
        idNumber: toNullableString(user.idNumber),
        idExpiry: toNullableString(user.idExpiry),
        idFrontUrl: toNullableString(user.idFrontUrl),
        idBackUrl: toNullableString(user.idBackUrl),
        city: toNullableString(user.city),
        imagePublicId: toNullableString(user.imagePublicId),
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
