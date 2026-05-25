/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Bell, Menu, CheckCircle2, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { OgaAlert } from '../types';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  alerts: OgaAlert[];
  onTriggerAlertClick: (alert: OgaAlert) => void;
  title: string;
}

export default function Header({
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  alerts,
  onTriggerAlertClick,
  title
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = alerts;

  return (
    <header className="h-16 bg-white border-b border-emerald-950/5 flex items-center justify-between px-6 z-20 select-none relative">
      
      {/* Left section: Hamburger (Mobile) and Mobile Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-1 px-2 text-[#004d2c] hover:bg-[#004d2c]/10 rounded-lg md:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-bold text-slate-800 md:hidden">
          Oga Landlord
        </h1>
        <div className="hidden md:block">
          <span className="text-xs font-semibold text-[#004d2c] tracking-wider uppercase bg-[#e6f4ea] px-2.5 py-1 rounded-md">
            OgaLandlord Workspace
          </span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-lg mx-6 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={15} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search agents, listings, reports..."
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-800 border border-slate-200/80 rounded-lg outline-none focus:border-[#004d2c] focus:ring-1 focus:ring-[#004d2c] transition-all"
        />
      </div>

      {/* Right Notifications bell and session widget */}
      <div className="flex items-center gap-4" ref={notificationRef}>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors cursor-pointer relative"
          >
            <Bell size={18} />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Quick Notification Dropdown Portal */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl shadow-green-950/10 border border-slate-100 p-4 shrink-0 z-30 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <h3 className="text-xs font-bold text-slate-800">
                  Critical Notifications ({unreadAlerts.length})
                </h3>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {unreadAlerts.length === 0 ? (
                  <p className="text-center py-4 text-xs text-slate-400">No pending alerts</p>
                ) : (
                  unreadAlerts.map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => {
                        onTriggerAlertClick(alert);
                        setShowNotifications(false);
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#f4fcf8] rounded-lg border border-slate-100 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <div className="mt-0.5">
                        {alert.type === 'danger' && <ShieldAlert size={14} className="text-red-500" />}
                        {alert.type === 'warning' && <AlertTriangle size={14} className="text-amber-500" />}
                        {alert.type === 'info' && <Info size={14} className="text-blue-500" />}
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-700 leading-tight">
                          {alert.text}
                        </p>
                        <span className="text-[9px] text-[#004d2c] font-semibold mt-0.5 block hover:underline">
                          Review now &rarr;
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Small profile status */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <span className="text-xs font-bold text-[#004d2c]">AO</span>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-none">Admin Officer</p>
            <p className="text-[10px] text-[#00a86b] font-medium leading-none mt-1">Status: Active</p>
          </div>
        </div>
      </div>
    </header>
  );
}
