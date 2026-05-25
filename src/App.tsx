/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
} from './types';
import {
  initialStatCards,
  initialAlerts,
  initialRecentActivities,
  initialAgents,
  initialListings,
  initialReports,
  initialSubscriptions,
  initialAdminUsers
} from './data';

// Import sub components
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AgentsView from './components/AgentsView';
import ListingsView from './components/ListingsView';
import ReportsView from './components/ReportsView';
import SubscriptionsView from './components/SubscriptionsView';
import SettingsView from './components/SettingsView';

import { ShieldAlert, AlertTriangle, CheckCircle, Info, X, DollarSign, CreditCard } from 'lucide-react';

export default function App() {
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
      agent: "agent name",
      time: 'Just now'
    };
    setRecentActivities([newAct, ...recentActivities.slice(0, 4)]);
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
        const val = parseInt(c.value.replace(/,/g, ''));
        return { ...c, value: (val + 1).toLocaleString() };
      }
      if (c.iconType === 'pending') {
        const val = parseInt(c.value);
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
        const val = parseInt(c.value);
        return { ...c, value: String(Math.max(0, val - 1)) };
      }
      return c;
    }));

    insertActivityLog(`Reviewed tenant complaint file: ${target.id}`);
    fireToast(`Complaint report ${selectedReportId} marked Reviewed.`);
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
  const handleConfirmModalAction = (e: React.FormEvent) => {
    e.preventDefault();
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
            const val = parseInt(c.value.replace(/,/g, ''));
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
    setAdminUsers([...adminUsers, freshAdmin]);
  };

  // Tabs switching router triggers
  const handleTriggerViewTab = (tab: DashboardTab, filter?: string) => {
    setActiveTab(tab);
    setSelectedAgentId(null);
    setSelectedListingId(null);
    setSelectedReportId(null);

    // Apply dashboard actions logic
    if (tab === 'agents' && filter === 'Pending') {
      // filters automatically by initial pending props in view
    }
  };

  const handleGlobalSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#f3faf6] overflow-hidden select-none font-sans">
      
      {/* Sidebar navigation panel - Hidden on mobile screen size */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTriggerViewTab}
          onLogout={handleLogout}
        />
      </div>

      {/* Slideout mobile menu drawer component */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-xxs"
          ></div>
          {/* Menu panel content */}
          <div className="relative animate-slide-in-left">
            <Sidebar
              activeTab={activeTab}
              onTabChange={handleTriggerViewTab}
              onLogout={handleLogout}
              onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main app panel wrapper body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Core Top Bar */}
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={handleGlobalSearchChange}
          alerts={alerts}
          onTriggerAlertClick={(al) => handleTriggerViewTab(al.targetTab, al.filter)}
          title={activeTab}
        />

        {/* Content scrolling grid */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 relative">
          
          {/* Toast Notification message block */}
          {toastMessage && (
            <div 
              id="global-panel-toast"
              className="fixed bottom-6 right-6 p-4 py-3 bg-[#0a522f] text-white rounded-xl shadow-xl border border-[#0d6e3f] flex items-center gap-3 animate-slide-up z-50 text-xs font-bold font-sans selection:bg-none"
            >
              <CheckCircle size={15} className="text-emerald-300" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Router switch cases matching tabs */}
          {activeTab === 'dashboard' && (
            <DashboardView
              statCards={statCards}
              alerts={alerts}
              recentActivities={recentActivities}
              onTriggerTabChange={handleTriggerViewTab}
            />
          )}

          {activeTab === 'agents' && (
            <AgentsView
              agents={agents}
              listings={listings}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              onTriggerModal={(type, id) => handleOpenModal(type, id)}
              onApproveVerification={handleApproveAgentVerification}
              onResetTrustScore={handleResetAgentTrustScore}
              initialFilter={selectedAgentId ? 'all' : searchQuery === 'Pending' ? 'Pending' : 'all'}
            />
          )}

          {activeTab === 'listings' && (
            <ListingsView
              listings={listings}
              agents={agents}
              selectedListingId={selectedListingId}
              onSelectListing={setSelectedListingId}
              onApproveListing={handleApproveListing}
              onTriggerRemoveListingModal={(id) => handleOpenModal('remove', id)}
              onViewAgentProfile={(agtId) => {
                setActiveTab('agents');
                setSelectedAgentId(agtId);
              }}
              initialFilter={searchQuery === 'Pending' ? 'Pending' : 'all'}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              reports={reports}
              agents={agents}
              listings={listings}
              selectedReportId={selectedReportId}
              onSelectReport={setSelectedReportId}
              onViewAgentProfile={(agtId) => {
                setActiveTab('agents');
                setSelectedAgentId(agtId);
              }}
              onViewListingDetail={(lstId) => {
                setActiveTab('listings');
                setSelectedListingId(lstId);
              }}
              onMarkReviewed={handleMarkReportReviewed}
              onTriggerModal={(type, agtId) => handleOpenModal(type, agtId)}
            />
          )}

          {activeTab === 'subscriptions' && (
            <SubscriptionsView
              subscriptions={subscriptions}
              onTriggerExtendModal={(sub) => handleOpenExtendSubModal(sub.id)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              adminUsers={adminUsers}
              onInviteAdmin={handleInviteAdmin}
              onShowToast={fireToast}
            />
          )}

        </main>
      </div>

      {/* ACTIVE ACTION MODAL OVERLAY PORTAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 space-y-4 animate-scale-up font-sans selection:bg-emerald-50 text-xs">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                {activeModal === 'ban' && 'Ban Agent Permanently'}
                {activeModal === 'reduce' && 'Reduce Trust Score'}
                {activeModal === 'suspend' && 'Suspend Agent Profile'}
                {activeModal === 'reject' && 'Reject Credentials'}
                {activeModal === 'remove' && 'Remove Property Listing'}
                {activeModal === 'extendSub' && 'Renew Agent License'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-1 px-2 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleConfirmModalAction} className="space-y-4 font-semibold">
              
              {/* Conditional parameters based on action types */}
              {activeModal === 'reduce' && (
                <div>
                  <label className="block text-slate-500 mb-1.5 font-bold">Penalize trust score points by:</label>
                  <select
                    value={modalScoreReduction}
                    onChange={(e) => setModalScoreReduction(parseInt(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800 cursor-pointer"
                  >
                    <option value={5}>- 5 points index penalty</option>
                    <option value={10}>- 10 points index penalty (Default)</option>
                    <option value={20}>- 20 points High penalty</option>
                    <option value={50}>- 50 points Severe penalty</option>
                  </select>
                </div>
              )}

              {activeModal === 'extendSub' && (
                <div>
                  <label className="block text-slate-500 mb-1.5 font-bold">Extension Duration period:</label>
                  <select
                    value={modalExtendValue}
                    onChange={(e) => setModalExtendValue(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="1">Extend by 1 Month (₦ 5,000)</option>
                    <option value="3">Extend by 3 Months (₦ 12,500)</option>
                    <option value="6">Extend by 6 Months (₦ 25,000)</option>
                    <option value="12">Extend by 12 Months (₦ 50,000)</option>
                  </select>
                </div>
              )}

              {/* General narrative justification textbox */}
              <div>
                <label className="block text-slate-500 mb-1.5 font-bold">
                  Reason justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={modalReasonInput}
                  onChange={(e) => setModalReasonInput(e.target.value)}
                  placeholder="Insert secure justification notes verifying compliance rules..."
                  rows={3}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#004d2c] font-medium text-slate-800 transition-all resize-none"
                />
              </div>

              {/* Warnings and compliance confirmations statements */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2.5">
                <AlertTriangle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-amber-700 leading-normal font-medium">
                  Confirming this action immediately commits updates to the database registry and triggers push notifications to the agent.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2 border-t border-slate-50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2 bg-white text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer font-bold transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 text-white rounded-lg cursor-pointer font-black transition-all text-center ${
                    activeModal === 'ban' || activeModal === 'reject' || activeModal === 'remove'
                      ? 'bg-red-600 hover:bg-red-700 shadow-sm shadow-red-700/15'
                      : 'bg-[#004d2c] hover:bg-[#00381e] shadow-sm shadow-emerald-700/15'
                  }`}
                >
                  Confirm action
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
