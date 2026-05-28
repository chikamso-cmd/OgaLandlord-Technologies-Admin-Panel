import { useEffect, type FormEvent } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DashboardTab, OgaAlert, ModalActionType, OgaAgent } from '../types';
import Header from './Header';
import Sidebar from './Sidebar';
import GlobalToast from './GlobalToast';
import ActionModal from './ActionModal';

const validTabs = ['dashboard', 'agents', 'listings', 'reports', 'subscriptions', 'settings'] as const;

type ValidTab = (typeof validTabs)[number];

const normalizeTab = (pathname: string): DashboardTab => {
    const path = pathname.split('/')[1] || 'dashboard';
    return validTabs.includes(path as ValidTab) ? (path as DashboardTab) : 'dashboard';
};

interface AppLayoutProps {
    activeTab: DashboardTab;
    setActiveTab: (tab: DashboardTab) => void;
    handleTriggerViewTab: (tab: DashboardTab, filter?: string) => void;
    handleLogout: () => void;
    searchQuery: string;
    handleGlobalSearchChange: (query: string) => void;
    alerts: OgaAlert[];
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    toastMessage: string | null;
    activeModal: ModalActionType | null;
    modalTargetAgent: OgaAgent | null;
    modalReasonInput: string;
    modalScoreReduction: number;
    modalExtendValue: '1' | '3' | '6' | '12';
    setModalReasonInput: (value: string) => void;
    setModalScoreReduction: (value: number) => void;
    setModalExtendValue: (value: '1' | '3' | '6' | '12') => void;
    handleCloseModal: () => void;
    handleConfirmModalAction: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AppLayout({
    activeTab,
    setActiveTab,
    handleTriggerViewTab,
    handleLogout,
    searchQuery,
    handleGlobalSearchChange,
    alerts,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toastMessage,
    activeModal,
    modalTargetAgent,
    modalReasonInput,
    modalScoreReduction,
    modalExtendValue,
    setModalReasonInput,
    setModalScoreReduction,
    setModalExtendValue,
    handleCloseModal,
    handleConfirmModalAction,
}: AppLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const nextTab = normalizeTab(location.pathname);
        setActiveTab(nextTab);
    }, [location.pathname, setActiveTab]);

    const navigateToTab = (tab: DashboardTab, filter?: string) => {
        handleTriggerViewTab(tab, filter);
        navigate(`/${tab}`);
    };

    const handleAlertClick = (alert: OgaAlert) => {
        handleTriggerViewTab(alert.targetTab, alert.filter);
        navigate(`/${alert.targetTab}`);
    };

    return (
        <>
            <div className="flex h-screen bg-[#f3faf6] overflow-hidden select-none font-sans">
                <div className="hidden md:block shrink-0">
                    <Sidebar
                        activeTab={activeTab}
                        onTabChange={navigateToTab}
                        onLogout={handleLogout}
                    />
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    <Header
                        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
                        searchQuery={searchQuery}
                        onSearchChange={handleGlobalSearchChange}
                        alerts={alerts}
                        onTriggerAlertClick={handleAlertClick}
                        title={activeTab}
                    />

                    <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 relative">
                        <GlobalToast message={toastMessage} />
                        <Outlet />
                    </main>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden flex">
                    <div
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute inset-0 bg-black/55 backdrop-blur-xxs"
                    />
                    <div className="relative animate-slide-in-left">
                        <Sidebar
                            activeTab={activeTab}
                            onTabChange={navigateToTab}
                            onLogout={handleLogout}
                            onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                </div>
            )}

            <ActionModal
                activeModal={activeModal}
                modalTargetAgent={modalTargetAgent}
                modalReasonInput={modalReasonInput}
                modalScoreReduction={modalScoreReduction}
                modalExtendValue={modalExtendValue}
                onReasonChange={setModalReasonInput}
                onScoreReductionChange={setModalScoreReduction}
                onExtendValueChange={setModalExtendValue}
                onClose={handleCloseModal}
                onConfirm={handleConfirmModalAction}
            />
        </>
    );
}
