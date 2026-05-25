import React, { useState } from 'react';
import {
  DashboardTab,
  OgaAgent,
  OgaListing,
  OgaReport,
  OgaSubscription,
  OgaAdminUser,
  OgaStatCard,
  OgaAlert,
  OgaRecentActivity
} from '../types';
import {
  initialStatCards,
  initialAlerts,
  initialRecentActivities,
  initialAgents,
  initialListings,
  initialReports,
  initialSubscriptions,
  initialAdminUsers
} from '../data';

export default function useAppState() {
  // Session Access
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [sessionUserMail, setSessionUserMail] = useState('admin@ogalandlord.com');

  // Active view routing
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');

  // Database collection states
  const [statCards, setStatCards] = useState<OgaStatCard[]>(initialStatCards);
  const [alerts, setAlerts] = useState<OgaAlert[]>(initialAlerts);
  const [recentActivities, setRecentActivities] = useState<OgaRecentActivity[]>(initialRecentActivities);
  const [agents, setAgents] = useState<OgaAgent[]>(initialAgents);
  const [listings, setListings] = useState<OgaListing[]>(initialListings);
  const [reports, setReports] = useState<OgaReport[]>(initialReports);
  const [subscriptions, setSubscriptions] = useState<OgaSubscription[]>(initialSubscriptions);
  const [adminUsers, setAdminUsers] = useState<OgaAdminUser[]>(initialAdminUsers);

  // Drilldown Selected IDs (Agent profile detail, listing detail, complaint detail)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Global search input
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active action modals state
  const [activeModal, setActiveModal] = useState<'ban' | 'reduce' | 'suspend' | 'reject' | 'remove' | 'extendSub' | null>(null);
  const [modalTargetAgentId, setModalTargetAgentId] = useState<string | null>(null);
  const [modalTargetListingId, setModalTargetListingId] = useState<string | null>(null);
  const [modalTargetSubscriptionId, setModalTargetSubscriptionId] = useState<string | null>(null);

  // Modal input variables
  const [modalReasonInput, setModalReasonInput] = useState('');
  const [modalScoreReduction, setModalScoreReduction] = useState(10);
  const [modalExtendValue, setModalExtendValue] = useState<'1' | '3' | '6' | '12'>('3');

  // Status Toast HUD state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper: Trigger quick status toast
  const fireToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogin = (email: string) => {
    setSessionUserMail(email);
    setIsLoggedIn(true);
    fireToast('Administrative workspace session authenticated.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedAgentId(null);
    setSelectedListingId(null);
    setSelectedReportId(null);
    setActiveTab('dashboard');
  };

  // Helper: append to chronological events timeline
  const insertActivityLog = (text: string) => {
    const newAct: OgaRecentActivity = {
      id: `act-gen-${Date.now()}`,
      text,
      time: 'Just now'
    };
    setRecentActivities(prev => [newAct, ...prev.slice(0, 4)]);
  };

  // Actions: Approve Agent Verification directly
  const handleApproveAgentVerification = (agentId: string) => {
    const target = agents.find(a => a.id === agentId);
    if (!target) return;

    // Update Agent Model
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return { ...a, verificationStatus: 'Verified', trustScore: 90 };
      }
      return a;
    }));

    // Update Stats Card total verified count
    setStatCards(prev => prev.map(c => {
      if (c.iconType === 'verified') {
        const val = parseInt(String(c.value).replace(/,/g, '')) || 0;
        return { ...c, value: (val + 1).toLocaleString() };
      }
      if (c.iconType === 'pending') {
        const val = parseInt(String(c.value)) || 0;
        return { ...c, value: String(Math.max(0, val - 1)) };
      }
      return c;
    }));

    // Remove matching warning alert
    setAlerts(prev => prev.filter(al => !(al.type === 'warning' && al.text.includes('pending'))));

    insertActivityLog(`Admin approved agent verification folder: ${target.name}`);
    fireToast(`Agent "${target.name}" has been certified verification documents.`);
  };

  // Actions: Reset Agent Trust Score to default
  const handleResetAgentTrustScore = (agentId: string) => {
    const target = agents.find(a => a.id === agentId);
    if (!target) return;

    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return { ...a, trustScore: 95, responseTime: 95, transactionSuccess: 92, clientSatisfaction: 98 };
      }
      return a;
    }));

    fireToast(`Agent "${target.name}" trust score indexes restored.`);
    insertActivityLog(`Audit log: Reset trust score metrics for ${target.name}`);
  };

  // Actions: Approve property listing
  const handleApproveListing = (listingId: string) => {
    const target = listings.find(l => l.id === listingId);
    if (!target) return;

    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        return { ...l, status: 'Verified', rentStatus: 'Available' };
      }
      return l;
    }));

    insertActivityLog(`Approved listing submission: ${target.title}`);
    fireToast(`Property "${target.title}" is verified and listed on feed.`);
  };

  // Actions: Mark report as reviewed
  const handleMarkReportReviewed = (reportId: string) => {
    const target = reports.find(r => r.id === reportId);
    if (!target) return;

    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status: 'Reviewed' };
      }
      return r;
    }));

    // Decrement Reports count in stat cards
    setStatCards(prev => prev.map(c => {
      if (c.iconType === 'reports') {
        const val = parseInt(String(c.value)) || 0;
        return { ...c, value: String(Math.max(0, val - 1)) };
      }
      return c;
    }));

    insertActivityLog(`Reviewed tenant complaint file: ${target.id}`);
    fireToast(`Complaint report ${reportId} marked Reviewed.`);
  };

  // Modal Launcher Trigger
  const handleOpenModal = (type: typeof activeModal, targetId: string) => {
    setModalReasonInput('');
    setModalScoreReduction(10);
    setModalExtendValue('3');
    
    if (type === 'ban' || type === 'reduce' || type === 'suspend' || type === 'reject') {
      setModalTargetAgentId(targetId);
    } else if (type === 'remove') {
      setModalTargetListingId(targetId);
    }
    setActiveModal(type);
  };

  const handleOpenExtendSubModal = (subId: string) => {
    setModalTargetSubscriptionId(subId);
    setModalReasonInput('');
    setModalExtendValue('3');
    setActiveModal('extendSub');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setModalTargetAgentId(null);
    setModalTargetListingId(null);
    setModalTargetSubscriptionId(null);
  };

  // Submit modal execution forms
  const handleConfirmModalAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeModal) return;

    // BAN ACTION
    if (activeModal === 'ban' && modalTargetAgentId) {
      const target = agents.find(a => a.id === modalTargetAgentId);
      if (target) {
        setAgents(prev => prev.map(a => {
          if (a.id === modalTargetAgentId) {
            return { ...a, verificationStatus: 'Blocked', trustScore: 0, activeListingsCount: 0 };
          }
          return a;
        }));
        setListings(prev => prev.map(l => {
          if (l.agentId === modalTargetAgentId) {
            return { ...l, status: 'Removed', rentStatus: 'Removed' };
          }
          return l;
        }));

        insertActivityLog(`Banned and blacklisted malicious agent: ${target.name}`);
        fireToast(`Agent profile "${target.name}" and listings restricted.`);
      }
    }

    // REDUCE TRUST ACTION
    if (activeModal === 'reduce' && modalTargetAgentId) {
      const target = agents.find(a => a.id === modalTargetAgentId);
      if (target) {
        setAgents(prev => prev.map(a => {
          if (a.id === modalTargetAgentId) {
            const dec = Math.max(0, a.trustScore - modalScoreReduction);
            return {
              ...a,
              trustScore: dec,
              responseTime: Math.max(0, a.responseTime - Math.round(modalScoreReduction / 2)),
              clientSatisfaction: Math.max(0, a.clientSatisfaction - Math.round(modalScoreReduction / 2))
            };
          }
          return a;
        }));

        insertActivityLog(`Reduced agent trust index score: ${target.name} (-${modalScoreReduction}pts)`);
        fireToast(`Agent "${target.name}" trust score index penalized.`);
      }
    }

    // SUSPEND ACTION
    if (activeModal === 'suspend' && modalTargetAgentId) {
      const target = agents.find(a => a.id === modalTargetAgentId);
      if (target) {
        setAgents(prev => prev.map(a => {
          if (a.id === modalTargetAgentId) {
            return { ...a, verificationStatus: 'Blocked' };
          }
          return a;
        }));

        insertActivityLog(`Suspended agent account temporary: ${target.name}`);
        fireToast(`Account suspended for "${target.name}".`);
      }
    }

    // REJECT VERIFICATION ACTION
    if (activeModal === 'reject' && modalTargetAgentId) {
      const target = agents.find(a => a.id === modalTargetAgentId);
      if (target) {
        setAgents(prev => prev.map(a => {
          if (a.id === modalTargetAgentId) {
            return { ...a, verificationStatus: 'Blocked' };
          }
          return a;
        }));

        insertActivityLog(`Rejected agent verification credentials: ${target.name}`);
        fireToast(`Verification credentials rejected for "${target.name}".`);
      }
    }

    // REMOVE LISTING ACTION
    if (activeModal === 'remove' && modalTargetListingId) {
      const target = listings.find(l => l.id === modalTargetListingId);
      if (target) {
        setListings(prev => prev.map(l => {
          if (l.id === modalTargetListingId) {
            return { ...l, status: 'Removed', rentStatus: 'Removed' };
          }
          return l;
        }));

        // Adjust active listings count in stats
        setStatCards(prev => prev.map(c => {
          if (c.iconType === 'listings') {
            const val = parseInt(String(c.value).replace(/,/g, '')) || 0;
            return { ...c, value: (val - 1).toLocaleString() };
          }
          return c;
        }));

        insertActivityLog(`Removed listed property index: ${target.title}`);
        fireToast(`Listing "${target.title}" successfully removed.`);
        setSelectedListingId(null); // return back
      }
    }

    // EXTEND SUBSCRIPTION ACTION
    if (activeModal === 'extendSub' && modalTargetSubscriptionId) {
      const target = subscriptions.find(s => s.id === modalTargetSubscriptionId);
      if (target) {
        setSubscriptions(prev => prev.map(s => {
          if (s.id === modalTargetSubscriptionId) {
            const extraMonths = parseInt(modalExtendValue);
            const currentYear = new Date().getFullYear();
            return { 
              ...s, 
              status: 'Active', 
              endDate: `Dec 31, ${currentYear + 1}` // simulate renewal
            };
          }
          return s;
        }));

        insertActivityLog(`Renewed agent licensing subscription: ${target.agentName}`);
        fireToast(`Extended license subscription for "${target.agentName}" successfully.`);
      }
    }

    handleCloseModal();
  };

  // Actions: Add new admin users
  const handleInviteAdmin = (email: string, role: typeof adminUsers[0]['role']) => {
    const freshAdmin: OgaAdminUser = {
      id: `ADM00${adminUsers.length + 1}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role
    };
    setAdminUsers(prev => [...prev, freshAdmin]);
  };

  // Tabs switching router triggers
  const handleTriggerViewTab = (tab: DashboardTab, filter?: string) => {
    setActiveTab(tab);
    setSelectedAgentId(null);
    setSelectedListingId(null);
    setSelectedReportId(null);

    // Apply dashboard actions logic (left intentionally minimal)
    if (tab === 'agents' && filter === 'Pending') {
      // filters automatically by initial pending props in view
    }
  };

  const handleGlobalSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return {
    // session
    isLoggedIn,
    sessionUserMail,
    handleLogin,
    handleLogout,
    // routing
    activeTab,
    setActiveTab,
    handleTriggerViewTab,
    // data
    statCards,
    alerts,
    recentActivities,
    agents,
    listings,
    reports,
    subscriptions,
    adminUsers,
    // selections
    selectedAgentId,
    setSelectedAgentId,
    selectedListingId,
    setSelectedListingId,
    selectedReportId,
    setSelectedReportId,
    // search & mobile
    searchQuery,
    handleGlobalSearchChange,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    // modals
    activeModal,
    modalTargetAgentId,
    modalTargetListingId,
    modalTargetSubscriptionId,
    modalReasonInput,
    setModalReasonInput,
    modalScoreReduction,
    setModalScoreReduction,
    modalExtendValue,
    setModalExtendValue,
    handleOpenModal,
    handleOpenExtendSubModal,
    handleCloseModal,
    handleConfirmModalAction,
    // actions
    fireToast,
    handleApproveAgentVerification,
    handleResetAgentTrustScore,
    handleApproveListing,
    handleMarkReportReviewed,
    handleInviteAdmin,
    // stat editors
    setStatCards,
    setAlerts,
    setRecentActivities,
    setAgents,
    setListings,
    setReports,
    setSubscriptions,
    setAdminUsers
  };
}
