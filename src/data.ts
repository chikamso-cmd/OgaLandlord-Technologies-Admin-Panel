/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertCircle, Calendar, DollarSign } from 'lucide-react';
import {
  OgaStatCard,
  OgaAlert,
  OgaRecentActivity,
  OgaAgent,
  OgaListing,
  OgaReport,
  OgaSubscription,
  OgaAdminUser
} from './types';
import { ReactInstance, ReactNode } from 'react';

export const initialStatCards: OgaStatCard[] = [
  {
    id: '1',
    title: 'Total Agents',
    value: '2,847',
    changeText: '+12% from last month',
    isPositive: true,
    iconType: 'agents'
  },
  {
    id: '2',
    title: 'Verified Agents',
    value: '2,103',
    changeText: '+8% from last month',
    isPositive: true,
    iconType: 'verified'
  },
  {
    id: '3',
    title: 'Pending Verifications',
    value: '47',
    iconType: 'pending'
  },
  {
    id: '4',
    title: 'Active Listings',
    value: '8,234',
    changeText: '+12% from last month',
    isPositive: true,
    iconType: 'listings'
  },
  {
    id: '5',
    title: 'Reports Today',
    value: '12',
    iconType: 'reports'
  },
  {
    id: '6',
    title: 'Monthly Revenue',
    value: '₦ 4.2M',
    changeText: '+23% from last month',
    isPositive: true,
    iconType: 'revenue'
  }
];

export const initialAlerts: OgaAlert[] = [
  {
    id: 'alert-1',
    text: '15 agents with 3+ reports require review',
    type: 'danger',
    targetTab: 'reports',
    filter: 'high-severity'
  },
  {
    id: 'alert-2',
    text: '47 pending agent verifications',
    type: 'warning',
    targetTab: 'agents',
    filter: 'Pending'
  },
  {
    id: 'alert-3',
    text: '23 subscriptions expiring this week',
    type: 'info',
    targetTab: 'subscriptions',
    filter: 'Expiring soon'
  }
];

export const initialRecentActivities: OgaRecentActivity[] = [
  {
    id: 'act-1',
    text: 'New agent verification request',
    agent: 'Chukwudi Okonkwo',
    time: '5 minutes ago'
  },
  {
    id: 'act-2',
    text: 'Report filed against agent ',
    agent: 'Amaka Johnson',
    time: '5 minutes ago'
  },
  {
    id: 'act-3',
    text: 'Listing approved',
    agent: 'Tunde Bakare',
    time: '5 minutes ago'
  },
  {
    id: 'act-4',
    text: 'Subscription renewed',
    agent: 'Ngozi Eze',
    time: '5 minutes ago'
  },
  {
    id: 'act-5',
    text: 'Agent suspended',
    agent: 'Ibrahim Musa',
    time: '5 minutes ago'
  }
];

export const initialAgents: OgaAgent[] = [
  {
    id: 'AGT001',
    name: 'Gbenga Yinka',
    email: 'gbengayinka@gmail.com',
    phone: '+234 810 349 5377',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    verificationStatus: 'Verified',
    trustScore: 95,
    activeListingsCount: 24,
    subscriptionPlan: 'Premium',
    experienceYears: 5,
    dealsClosed: 100,
    responseTime: 95,
    transactionSuccess: 92,
    clientSatisfaction: 98,
    areasOfOperation: ['Challenge, IB', 'Akobo, IB']
  },
  {
    id: 'AGT002',
    name: 'Chukwudi Okonkwo',
    email: 'chukwudi@ogalandlord.com',
    phone: '+234 801 234 5678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    verificationStatus: 'Verified',
    trustScore: 92,
    activeListingsCount: 24,
    subscriptionPlan: 'Premium',
    experienceYears: 6,
    dealsClosed: 142,
    responseTime: 90,
    transactionSuccess: 94,
    clientSatisfaction: 92,
    areasOfOperation: ['Lekki Phase 1, Lagos', 'Ikoyi, Lagos']
  },
  {
    id: 'AGT003',
    name: 'Tunde Bakare',
    email: 'tunde.bakare@ogalandlord.com',
    phone: '+234 801 234 5678',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    verificationStatus: 'Pending',
    trustScore: 0,
    activeListingsCount: 0,
    subscriptionPlan: 'Premium',
    experienceYears: 1,
    dealsClosed: 0,
    responseTime: 0,
    transactionSuccess: 0,
    clientSatisfaction: 0,
    areasOfOperation: ['Ikeja, Lagos']
  },
  {
    id: 'AGT004',
    name: 'Ibrahim Musa',
    email: 'ibrahim.musa@yahoo.com',
    phone: '+234 805 678 9012',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    verificationStatus: 'Blocked',
    trustScore: 45,
    activeListingsCount: 8,
    subscriptionPlan: 'Free',
    experienceYears: 3,
    dealsClosed: 18,
    responseTime: 40,
    transactionSuccess: 51,
    clientSatisfaction: 45,
    areasOfOperation: ['Wuse 2, Abuja', 'Gwarinpa, Abuja']
  },
  {
    id: 'AGT005',
    name: 'Amaka Johnson',
    email: 'amaka.j@gmail.com',
    phone: '+234 812 345 6789',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    verificationStatus: 'Verified',
    trustScore: 88,
    activeListingsCount: 15,
    subscriptionPlan: 'Premium',
    experienceYears: 4,
    dealsClosed: 42,
    responseTime: 85,
    transactionSuccess: 90,
    clientSatisfaction: 89,
    areasOfOperation: ['Victoria Island, Lagos']
  }
];

export const initialListings: OgaListing[] = [
  {
    id: 'LST001',
    title: '3 Bedroom Flat',
    area: 'Lekki Phase 1, Lagos State',
    price: '₦1.2M/Year',
    agentId: 'AGT002',
    agentName: 'Chukwudi Okonkwo',
    status: 'Verified',
    beds: 3,
    baths: 2,
    rentStatus: 'Available',
    timeAgo: 'Listed 2 hours ago',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: 'A well-finished 3-bedroom apartment with 2 bathrooms, featuring built-in wardrobes, fully tiled floors, and a modern POP ceiling design. The property is conveniently located close to the main road for easy access.\n\nThe apartment offers a practical layout suitable for families or professionals, with good ventilation and a comfortable living space designed for everyday convenience and easy maintenance.\n\nLocated within Central Park Estate, Lekki Phase 1, the property sits in a secure and well-developed residential area with easy access to major roads, shopping centers, and everyday amenities.',
    specialRequirements: {
      religion: 'Any',
      maritalStatus: 'Married preferable'
    },
    breakdown: {
      rent: '₦1,200,000/year',
      serviceCharge: '₦150,000',
      damageCharge: '₦200,000',
      agentFee: '₦200,000',
      total: '₦1,750,000',
      inspectionFee: '₦10,000'
    }
  },
  {
    id: 'LST002',
    title: '4 bedroom Flat',
    area: 'Lekki Phase 1, Lagos State',
    price: '₦1,000,000/yr',
    agentId: 'AGT001',
    agentName: 'Gbenga Yinka',
    status: 'Verified',
    beds: 4,
    baths: 3,
    rentStatus: 'Available',
    timeAgo: 'Listed 2 hours ago',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'A well-finished 3-bedroom apartment with 2 bathrooms, featuring built-in wardrobes, fully tiled floors, and a modern POP ceiling design. The property is conveniently located close to the main road for easy access.\n\nThe apartment offers a practical layout suitable for families or professionals, with good ventilation and a comfortable living space designed for everyday convenience and easy maintenance.\n\nLocated within Central Park Estate, Lekki Phase 1, the property sits in a secure and well-developed residential area with easy access to major roads, shopping centers, and everyday amenities.',
    specialRequirements: {
      religion: 'Islamic',
      maritalStatus: 'Married'
    },
    breakdown: {
      rent: '₦1,000,000/year',
      serviceCharge: '₦100,000',
      damageCharge: '₦200,000',
      agentFee: '₦200,000',
      total: '₦1,500,000',
      inspectionFee: '₦10,000'
    }
  },
  {
    id: 'LST003',
    title: '3 Bedroom Flat',
    area: 'Lekki Phase 1, Lagos State',
    price: '₦1.2M/Year',
    agentId: 'AGT002',
    agentName: 'Chukwudi Okonkwo',
    status: 'Pending',
    beds: 3,
    baths: 2,
    rentStatus: 'Pending',
    timeAgo: 'Listed 4 hours ago',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description: 'Freshly listed unit in lekki. Security post fully active, compound paved with interlocks. Large living room space.',
    specialRequirements: {
      religion: 'Any',
      maritalStatus: 'Any'
    },
    breakdown: {
      rent: '₦1,200,000/year',
      serviceCharge: '₦120,000',
      damageCharge: '₦100,000',
      agentFee: '₦150,000',
      total: '₦1,570,000',
      inspectionFee: '₦5,000'
    }
  },
  {
    id: 'LST004',
    title: '4 Bedroom Flat',
    area: 'Lekki Phase 1, Lagos State',
    price: '₦1.2M/Year',
    agentId: 'AGT002',
    agentName: 'Chukwudi Okonkwo',
    status: 'Pending',
    beds: 3,
    baths: 2,
    rentStatus: 'Pending',
    timeAgo: 'Listed 1 day ago',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    description: 'High ceiling penthouse with panoramic view of the lagoon. Fully gated flat with private parking access.',
    specialRequirements: {
      religion: 'Christian preferable',
      maritalStatus: 'Single okay'
    },
    breakdown: {
      rent: '₦1,200,000/year',
      serviceCharge: '₦300,000',
      damageCharge: '₦200,000',
      agentFee: '₦200,000',
      total: '₦1,900,000',
      inspectionFee: '₦15,000'
    }
  },
  {
    id: 'LST005',
    title: '3 Bedroom Flat',
    area: 'Lekki Phase 1, Lagos State',
    price: '₦1.2M/Year',
    agentId: 'AGT002',
    agentName: 'Chukwudi Okonkwo',
    status: 'Removed',
    beds: 3,
    baths: 2,
    rentStatus: 'Removed',
    timeAgo: 'Listed 3 days ago',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Duplicate listing reported by multiple tenants. Removed for validation.',
    specialRequirements: {
      religion: 'Any',
      maritalStatus: 'Any'
    },
    breakdown: {
      rent: '₦1,200,000/year',
      serviceCharge: '₦100,000',
      damageCharge: '₦100,000',
      agentFee: '₦100,000',
      total: '₦1,500,000',
      inspectionFee: '₦5,000'
    }
  }
];

export const initialReports: OgaReport[] = [
  {
    id: 'RPT001',
    category: 'Frudulent Listing',
    email: 'tenant456@mail.com',
    reporter: 'Tenant_User456',
    agentId: 'AGT004',
    agentName: 'Ibrahim Musa',
    reason: 'Fraudulent listing',
    date: 'Jan 16, 2025',
    status: 'Open',
    pastReportsCount: 5,
    severity: 'High',
    description: 'Agent requested money transfer before showing property. When I asked to view the property first, he became aggressive and said I must pay a "commitment fee" of ₦100,000 before viewing. This seems like a scam. The property photos also look like they were taken from the internet.',
    relatedListingId: 'LST005',
    relatedListingName: '4 Bedroom Duplex',
    relatedListingPrice: '₦5M/Year',
    evidenceImages: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80'
    ],
    previousOffenses: [
      {
        id: 'PREV-1',
        reportedby: 'Tenant_user123',
        reason: 'Listing mismatch',
        date: 'Nov 12, 2024',
        status: 'Reviewed',
        actionTaken: 'Warning issued to agent'
      },
      {
        id: 'PREV-2',
        reportedby: 'Tenant_user789',
        reason: 'Property unavailable',
        date: 'Dec 15, 2024',
        status: 'Resolved',
        actionTaken: 'Trust score reduced by 5 points'
      },
      {
        id: 'PREV-3',
        reportedby: 'Tenant_user456',
        reason: 'Unprofessional behavior',
        date: 'Nov 8, 2024',
        status: 'Open',
        actionTaken: 'Agent warned and coached'
      },
      {
        id: 'PREV-4',
        reportedby: 'Tenant_user234',
        reason: 'Late response',
        date: 'Oct 22, 2024',
        status: 'Resolved',
        actionTaken: 'No action required'
      },
      {
        id: 'PREV-5',
        reportedby: 'Tenant_user678',
        reason: 'Misleading information',
        date: 'Sep 5, 2024',
        status: 'Resolved',
        actionTaken: 'Trust score reduced by 10 points'
      }
    ]
  },
  {
    id: 'RPT002',
    category: 'Frudulent Listing',
    email: 'tenant123@mail.com',
    reporter: 'Tenant_User123',
    agentId: 'AGT002',
    agentName: 'Chukwudi Okonkwo',
    reason: 'Late response to inquiries',
    date: 'Jan 20, 2025',
    status: 'Reviewed',
    pastReportsCount: 2,
    severity: 'Low',
    description: 'Agent took 3 days to call back or reply to Whatsapp messages regarding a 3 Bedroom Flat listing.',
    evidenceImages: [],
    previousOffenses: [
      {
        id: 'PRE-C-1',
        reportedby: 'Tenant_user133',
        reason: 'Late response to inquiries',
        date: 'Jan 10, 2025',
        status: 'Resolved',
        actionTaken: 'Warning issued'
      }
    ]
  },
  {
    id: 'RPT003',
    category: 'Frudulent Listing',
    email: 'tenant789@mail.com',
    reporter: 'Tenant_User789',
    agentId: 'AGT002',
    agentName: 'Chukwudi Okonkwo',
    reason: 'Property unavailable but active',
    date: 'Jan 20, 2025',
    status: 'Resolved',
    pastReportsCount: 2,
    severity: 'Medium',
    description: 'The flat listed has already been rented but remains posted online as active. When contacted, the agent recommended another tier-2 property.',
    evidenceImages: [],
    previousOffenses: []
  }
];

export const initialSubscriptions: OgaSubscription[] = [
  {
    id: 'SUB001',
    agentId: 'AGT001',
    agentName: 'Gbenga Yinka',
    plan: 'Premium',
    amount: '₦ 50,000',
    startDate: 'Jan 1, 2024',
    endDate: 'Dec 31, 2024',
    status: 'Active'
  },
  {
    id: 'SUB002',
    agentId: 'AGT002',
    agentName: 'Chukwudi Okonkwo',
    plan: 'Premium',
    amount: '₦ 50,000',
    startDate: 'Jan 1, 2024',
    endDate: 'Dec 31, 2024',
    status: 'Active'
  },
  {
    id: 'SUB003',
    agentId: 'AGT003',
    agentName: 'Tunde Bakare',
    plan: 'Premium',
    amount: '₦ 50,000',
    startDate: 'Jan 1, 2024',
    endDate: 'Feb 1, 2024',
    status: 'Expired'
  },
  {
    id: 'SUB004',
    agentId: 'AGT005',
    agentName: 'Amaka Johnson',
    plan: 'Premium',
    amount: '₦ 50,000',
    startDate: 'May 1, 2024',
    endDate: 'Jun 1, 2024',
    status: 'Expiring soon'
  }
];

export const initialAdminUsers: OgaAdminUser[] = [
  {
    id: 'ADM001',
    name: 'Admin Officer',
    email: 'admin@ogalandlord.com',
    role: 'Super Admin'
  },
  {
    id: 'ADM002',
    name: 'Support Lead',
    email: 'support@ogalandlord.com',
    role: 'Moderator'
  },
  {
    id: 'ADM003',
    name: 'Operations Manager',
    email: 'ops@ogalandlord.com',
    role: 'Admin'
  }
];
type SubscriptionCard = {
  id: number;
  title: string;
  count: string;
  label: string;
  iconType: 'agents' | 'verified' | 'pending' | 'listings';
}
export const subscriptionCard:SubscriptionCard[] = [
  {
    id: 1,
    title: "Active Licences",
    count: "1,847",
    label: "Active subscriptions",
    iconType: "agents",
  },
  {
    id: 1,
    title: "Expired Plans",
    count: "141",
    label: "Needs attention",
    iconType: "verified",
  },
  {
    id: 3,
    title: "Expiring this week",
    count: "47",
    label: "Alert Sent",
     iconType: "pending",
  },
  {
    id: 4,
    title: "Premium revenue",
    count: "₦47.8M",
    label: "Total YTD value",
     iconType: "listings",
  },

]
