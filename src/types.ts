/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DashboardTab = 'dashboard' | 'agents' | 'listings' | 'reports' | 'subscriptions' | 'settings';
export type ModalActionType = 'ban' | 'reduce' | 'suspend' | 'reject' | 'remove' | 'extendSub';

export interface OgaStatCard {
  id: string;
  title: string;
  value: string;
  changeText?: string;
  isPositive?: boolean;
  iconType: 'agents' | 'verified' | 'pending' | 'listings' | 'reports' | 'revenue';
}

export interface OgaAlert {
  id: string;
  text: string;
  type: 'danger' | 'warning' | 'info';
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
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  verificationStatus: 'Verified' | 'Pending' | 'Blocked';
  trustScore: number;
  activeListingsCount: number;
  subscriptionPlan: 'Premium' | 'Free';
  experienceYears: number;
  dealsClosed: number;
  responseTime: number; // score out of 100
  transactionSuccess: number; // score out of 100
  clientSatisfaction: number; // score out of 100
  areasOfOperation: string[];
}

export interface OgaListing {
  id: string;
  title: string;
  area: string;
  price: string; // e.g. "₦1.2M/Year" or "₦800,000/yr"
  agentId: string;
  agentName: string;
  status: 'Verified' | 'Pending' | 'Removed';
  beds: number;
  baths: number;
  rentStatus: 'Rented' | 'Available' | 'Removed' | 'Pending';
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
}

export interface OgaReport {
  id: string;
  reporter: string;
  category: string;
  title?: string;
  email: string;
  area?: string;
  agentId: string;
  agentName: string;
  reason: string;
  date: string;
  status: 'Open' | 'Reviewed' | 'Resolved';
  pastReportsCount: number;
  severity: 'High' | 'Medium' | 'Low';
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
    status: 'Resolved' | 'Reviewed' | 'Open';
    actionTaken: string;
  }>;
}

export interface OgaSubscription {
  id: string;
  agentId: string;
  agentName: string;
  plan: 'Premium' | 'Free';
  amount: string; // e.g. "₦ 50,000"
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Expiring soon';
}

export interface OgaAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Moderator' | 'Admin';
}
