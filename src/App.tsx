/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import useAppState from './hooks/useAppState';
import Login from './components/Login';
import AppLayout from './components/AppLayout';
import DashboardView from './components/DashboardView';
import AgentsView from './components/AgentsView';
import ListingsView from './components/ListingsView';
import ReportsView from './components/ReportsView';
import SubscriptionsView from './components/SubscriptionsView';
import SettingsView from './components/SettingsView';

export default function App() {
  const {
    isLoggedIn,
    handleLogin,
    handleLogout,
    activeTab,
    setActiveTab,
    handleTriggerViewTab,
    statCards,
    alerts,
    recentActivities,
    agents,
    listings,
    reports,
    subscriptions,
    adminUsers,
    selectedAgentId,
    setSelectedAgentId,
    searchQuery,
    handleGlobalSearchChange,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeModal,
    modalTargetAgentId,
    modalTargetSubscriptionId,
    modalReasonInput,
    modalScoreReduction,
    modalExtendValue,
    setModalReasonInput,
    setModalScoreReduction,
    setModalExtendValue,
    handleOpenModal,
    handleOpenExtendSubModal,
    handleCloseModal,
    handleConfirmModalAction,
    toastMessage,
    fireToast,
    handleApproveAgentVerification,
    handleResetAgentTrustScore,
    handleApproveListing,
    handleMarkReportReviewed,
    handleInviteAdmin,
  } = useAppState();

  const navigate = useNavigate();

  const modalTargetAgent = modalTargetAgentId
    ? agents.find((agent) => agent.id === modalTargetAgentId) ?? null
    : null;

  const modalTargetSubscription = modalTargetSubscriptionId
    ? subscriptions.find((sub) => sub.id === modalTargetSubscriptionId) ?? null
    : null;

  const handleViewAgentProfile = (agtId: string) => {
    setSelectedAgentId(agtId);
    setActiveTab('agents');
    navigate('/agents');
  };

  const handleViewListingDetail = (lstId: string) => {
    setActiveTab('listings');
    navigate('/listings', { state: { selectedListingId: lstId } });
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/"
        element={
          <AppLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleTriggerViewTab={handleTriggerViewTab}
            handleLogout={handleLogout}
            searchQuery={searchQuery}
            handleGlobalSearchChange={handleGlobalSearchChange}
            alerts={alerts}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            toastMessage={toastMessage}
            activeModal={activeModal}
            modalTargetAgent={modalTargetAgent}
            modalTargetSubscription={modalTargetSubscription}
            modalReasonInput={modalReasonInput}
            modalScoreReduction={modalScoreReduction}
            modalExtendValue={modalExtendValue}
            setModalReasonInput={setModalReasonInput}
            setModalScoreReduction={setModalScoreReduction}
            setModalExtendValue={setModalExtendValue}
            handleCloseModal={handleCloseModal}
            handleConfirmModalAction={handleConfirmModalAction}
          />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <DashboardView
              statCards={statCards}
              alerts={alerts}
              recentActivities={recentActivities}
              onTriggerTabChange={handleTriggerViewTab}
            />
          }
        />
        <Route
          path="agents"
          element={
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
          }
        />
        <Route
          path="listings"
          element={
            <ListingsView
              listings={listings}
              agents={agents}
              onApproveListing={handleApproveListing}
              onTriggerRemoveListingModal={(id) => handleOpenModal('remove', id)}
              onViewAgentProfile={handleViewAgentProfile}
              initialFilter={searchQuery === 'Pending' ? 'Pending' : 'all'}
            />
          }
        />
        <Route
          path="reports"
          element={
            <ReportsView
              reports={reports}
              agents={agents}
              listings={listings}
              onViewAgentProfile={handleViewAgentProfile}
              onViewListingDetail={handleViewListingDetail}
              onMarkReviewed={handleMarkReportReviewed}
              onTriggerModal={(type, agtId) => handleOpenModal(type, agtId)}
            />
          }
        />
        <Route
          path="subscriptions"
          element={
            <SubscriptionsView
              subscriptions={subscriptions}
              onTriggerExtendModal={(sub) => handleOpenExtendSubModal(sub.id)}
            />
          }
        />
        <Route
          path="settings"
          element={
            <SettingsView
              adminUsers={adminUsers}
              onInviteAdmin={handleInviteAdmin}
              onShowToast={fireToast}
            />
          }
        />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
