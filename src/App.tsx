import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { initialAlerts } from "./data";
import type { DashboardTab } from "./types";
import Login from "./components/Login";
import AppLayout from "./components/AppLayout";
import DashboardView from "./components/DashboardView";
import AgentsView from "./components/AgentsView";
import ListingsView from "./components/ListingsView";
import ReportsView from "./components/ReportsView";
import SubscriptionsView from "./components/SubscriptionsView";
import SettingsView from "./components/SettingsView";
import ProtectedRoute from "./Protectedroute/ProtectedRoute";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("dashboard");
    navigate("/login");
  };
  const handleTriggerViewTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
          <Route
            element={
              <AppLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleTriggerViewTab={handleTriggerViewTab}
                handleLogout={handleLogout}
                searchQuery={searchQuery}
                handleGlobalSearchChange={setSearchQuery}
                alerts={initialAlerts}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                toastMessage={null}
              />
            }
          >
            <Route path="/" element={<DashboardView />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/agents" element={<AgentsView />} />
            <Route path="/listings" element={<ListingsView />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/subscriptions" element={<SubscriptionsView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer autoClose={4000} position="top-right" />
    </>
  );
}
