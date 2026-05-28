/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Users, 
  HomeIcon,  
  CreditCard, 
  Settings, 
  X, 
  LogOut,
  LayoutGrid,
  Flag
} from 'lucide-react';
import { DashboardTab } from '../types';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
  onCloseMobileDrawer?: () => void;
  pendingVerificationsCount?: number;
  openReportsCount?: number;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onLogout,
  onCloseMobileDrawer,
  pendingVerificationsCount = 47,
  openReportsCount = 12
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard' as DashboardTab, label: 'Dashboard', icon: LayoutGrid },
    { id: 'agents' as DashboardTab, label: 'Agents', icon: Users, badge: pendingVerificationsCount },
    { id: 'listings' as DashboardTab, label: 'Listings', icon: HomeIcon },
    { id: 'reports' as DashboardTab, label: 'Reports', icon: Flag, badge: openReportsCount },
    { id: 'subscriptions' as DashboardTab, label: 'Subscriptions', icon: CreditCard },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings }
  ];

  const handleTabClick = (tabId: DashboardTab) => {
    onTabChange(tabId);
    if (onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <div className="w-50 max-w-60 h-screen bg-[#004d2c] text-slate-100 flex flex-col justify-between border-r border-[#003d22]">
      <div>
        {/* Sidebar Header Logo */}
        <div className="p-5 border-b border-[#005e36] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white">
              <img src="/housekey.png" alt="Ogalandlord logo" className="w-6 object-fit"  />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white leading-none">
                OgaLandlord
              </h2>
              <span className="text-[10px] text-white font-normal tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>
          {onCloseMobileDrawer && (
            <button 
              onClick={onCloseMobileDrawer}
              className="p-1 px-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 hover:text-white md:hidden cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Navigation items list */}
        <nav className="p-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-[10px]  transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#eaefec] text-[#004d2c] font-semibold shadow-sm'
                    : 'hover:bg-white/10 text-green-100 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent 
                    size={14} 
                    className={isActive ? 'text-[#004d2c]' : 'text-green-300 group-hover:text-white transition-colors'} 
                  />
                  <span>{item.label}</span>
                </div>
                {/* {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive 
                      ? 'bg-[#004d2c] text-white' 
                      : 'bg-[#00bf71]/20 text-[#2eff9a]'
                  }`}>
                    {item.badge}
                  </span>
                )} */}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer account details */}
      <div className="p-4 border-t border-[#005e36] bg-[#003d22]/40">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-6 h-6 min-w-6 bg-[#00a86b]/20 border border-[#00bf71]/30 rounded-full flex items-center justify-center text-emerald-300 font-bold text-[10px] uppercase shadow-sm">
              AO
            </div>
            <div className="overflow-hidden">
              <h4 className="text-[10px] font-bold text-white leading-tight truncate">
                Admin Officer
              </h4>
              <p className="text-[10px] text-green-300 leading-tight truncate">
                admin@ogalandlord.com
              </p>
            </div>
          </div>
          <Link to="/login">
            <button
              title="Log out session"
              className="p-1.5 text-green-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
