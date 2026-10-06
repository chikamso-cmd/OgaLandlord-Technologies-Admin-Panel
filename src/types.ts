/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DashboardTab =
  | "dashboard"
  | "agents"
  | "listings"
  | "reports"
  | "subscriptions"
  | "settings";
export type ModalActionType =
  | "ban"
  | "reduce"
  | "suspend"
  | "reject"
  | "remove"
  | "extendSub";

export interface OgaStatCard {
  id: string;
  title: string;
  value: string;
  changeText?: string;
  isPositive?: boolean;
  iconType:
    | "agents"
    | "verified"
    | "pending"
    | "listings"
    | "reports"
    | "revenue";
}

export interface OgaAlert {
  id: string;
  text: string;
  type: "danger" | "warning" | "info";
  targetTab: DashboardTab;
  filter?: string;
}

export interface OgaRecentActivity {
  id: string;
  text: string;
  time: string;
  agent: string;
}

export interface OgaAgent {
  data: {
    id: number;
    agentId: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    verificationStatus:
      | "not_started"
      | "verified"
      | "pending"
      | "banned"
      | "blocked";
    trustScore: number;
    activeListingsCount: number;
    subscriptionPlan: "Premium" | "Free";
    experienceYears: number;
    dealsClosed: number;
    responseTime: number; // score out of 100
    transactionSuccess: number; // score out of 100
    clientSatisfaction: number; // score out of 100
    areasOfOperation: string[];
    username?: string | null;
    role?: string | null;
    isVerified?: boolean;
    status?: string | null;
    address?: string | null;
    adminLevel?: string | null;
    businessName?: string | null;
    rcNumber?: string | null;
    businessAddress?: string | null;
    idType?: string | null;
    idNumber?: string | null;
    idExpiry?: string | null;
    idFrontUrl?: string | null;
    idBackUrl?: string | null;
    city?: string | null;
    imagePublicId?: string | null;
  };
}

export interface OgaListing {
  id: number;
  title: string;
  area: string;
  price: string; // e.g. "₦1.2M/Year" or "₦800,000/yr"
  agentId: number;
  agentName: string;
  status: "published" | "Pending" | "Removed" | "rented";
  beds: number;
  baths: number;
  rentStatus: "rented" | "Available" | "Removed" | "Pending";
  timeAgo: string;
  image: string;
  description: string;
  specialRequirements: {
    religion: string;
    maritalStatus: string;
  };
  breakdown: {
    rent: string;
    serviceCharge: string;
    damageCharge: string;
    agentFee: string;
    total: string;
    inspectionFee: string;
  };
  propertyType?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  rawStatus?: string | null;
  createdAt?: string | null;
  images?: string[];
  units?: OgaListingUnit[];
  agent?: {
    id: number;
    name: string;
    email: string | null;
    username: string | null;
    trustScore: number;
    verificationStatus: string | null;
    imageUrl: string | null;
  };
  ratings?: OgaListingRating[];
  averageRating?: number | null;
  viewsCount?: number;
  favoritesCount?: number;
  reportsCount?: number;
  commentsCount?: number;
}

export interface OgaListingUnit {
  id: number;
  unitNumber: string | null;
  rentPrice: number;
  bedrooms: number;
  bathrooms: number;
  isAvailable: boolean;
  agentFee: number;
  damageDeposit: number;
  inspectionFee: number;
  serviceCharge: number;
  totalPackage: number;
}

export interface OgaListingRating {
  id: number;
  tenantId: number;
  stars: number;
  comment: string | null;
  createdAt: string | null;
}

export interface OgaReport {
  id: string;
  reporter: string;
  category: string;
  title?: string;
  email: string;
  createdAt?: string;
  reportedAgent?: {
    email: string;
    id: number | string;
    name: string;
  };
  area?: string;
  agentId: string;
  agentName: string;
  reason: string;
  date: string;
  status: "Open" | "Reviewed" | "Resolved";
  pastReportsCount: number;
  severity: "High" | "Medium" | "Low";
  description: string;
  relatedListingId?: string;
  relatedListingName?: string;
  relatedListingPrice?: string;
  evidenceImages: string[];
  previousOffenses: Array<{
    id: string;
    reason: string;
    reportedby: string;
    date: string;
    status: "Resolved" | "Reviewed" | "Open";
    actionTaken: string;
  }>;
}

export interface OgaSubscription {
  id: string;
  agentId: string;
  agentName: string;
  plan: "Premium" | "Free";
  amount: string; // e.g. "₦ 50,000"
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Expiring soon";
}

export interface AgentSubscription {
  id: number;
  agentId: number;
  planId: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  plan: {
    id: number;
    name: string;
    price: string;
    durationDays: number;
  };
}

export interface OgaAdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Moderator" | "Admin";
}
export interface ActionHistory {
  id: string;
  title: string;
  reporter: string;
  date: string;
  time: string;
}
