/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Users, 
  UserCheck, 
  Clock, 
  HomeIcon, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  Flag,
  Eye
} from 'lucide-react';
import { OgaStatCard, OgaAlert, OgaRecentActivity, DashboardTab } from '../types';
import { Link } from 'react-router-dom';

interface DashboardViewProps {
  statCards: OgaStatCard[];
  alerts: OgaAlert[];
  recentActivities: OgaRecentActivity[];
  onTriggerTabChange: (tab: DashboardTab, filter?: string) => void;
}

export default function DashboardView({
  statCards,
  alerts,
  recentActivities,
  onTriggerTabChange
}: DashboardViewProps) {

  // Helper to map icons
  const renderIcon = (type: string) => {
    switch (type) {
      case 'agents':
        return <Users size={14} className="text-[#004d2c]" />;
      case 'verified':
        return <UserCheck size={14} className="text-emerald-600" />;
      case 'pending':
        return <Clock size={14} className="text-amber-500" />;
      case 'listings':
        return <HomeIcon size={14} className="text-blue-600" />;
      case 'reports':
        return <Flag size={14} className="text-red-500" />;
      case 'revenue':
        return <DollarSign size={14} className="text-emerald-700" />;
      default:
        return <Users size={14} className="text-slate-600" />;
    }
  };

  const getIconBackground = (type: string) => {
    switch (type) {
      case 'agents':
        return 'bg-emerald-50 border border-emerald-100';
      case 'verified':
        return 'bg-green-50 border border-green-100';
      case 'pending':
        return 'bg-amber-50 border border-amber-100';
      case 'listings':
        return 'bg-blue-50 border border-blue-100';
      case 'reports':
        return 'bg-red-50 border border-red-100';
      case 'revenue':
        return 'bg-teal-50 border border-teal-100';
      default:
        return 'bg-slate-50 border border-slate-100';
    }
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Title block */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
          Dashboard
        </h2>
        <p className="text-xs text-slate-500">
          Overview of platform activity and pending actions
        </p>
      </div>

      {/* 6 Grid layout KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div 
            key={card.id} 
            className="bg-white p-4 rounded-xl border border-emerald-950/5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="">
              
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconBackground(card.iconType)}`}>
                {renderIcon(card.iconType)}
              </div>
            </div>
            
            <div className="mt-3">
              <span className="text-md font-black text-emerald-800 tracking-tight">
                {card.value}
              </span>
              
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider block">
                  {card.title}
                </span>
                {card.changeText && (
                  <div className="flex items-center gap-1 mt-1 text-[10px]">
                    <span className={`flex items-center gap-0.5 font-semibold ${
                      card.isPositive ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {card.isPositive ? <TrendingUp size={10} /> : null}
                      {card.changeText.split(' ')[0]}
                    </span>
                    <span className="text-emerald-600">
                      {card.changeText.substring(card.changeText.indexOf(' '))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts & Flags colored borders */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-1">
          Alerts & Flags
        </h3>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3.5 pr-4 rounded-lg flex items-center justify-between border  transition-all shadow-xs ${
              alert.type === 'danger'
                ? 'bg-[#fdf2f2] border-red-600/7 text-red-900 shadow-red-100/10'
                : alert.type === 'warning'
                ? 'bg-[#fffbeb] border-amber-600/7 text-amber-900 shadow-amber-100/10'
                : 'bg-[#eff6ff] border-blue-600/8 text-blue-900 shadow-blue-100/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {alert.type === 'danger' && <ShieldAlert size={16} className="text-red-500 shrink-0" />}
              {alert.type === 'warning' && <AlertCircle size={16} className="text-amber-500 shrink-0" />}
              {alert.type === 'info' && <Info size={16} className="text-blue-500 shrink-0" />}
              <span className="text-[10px] font-semibold leading-none">{alert.text}</span>
            </div>
            <button
              onClick={() => onTriggerTabChange(alert.targetTab, alert.filter)}
              className="flex items-center gap-1 text-[10px] font-bold tracking-wider hover:underline hover:opacity-85 cursor-pointer shrink-0"
            >
              <span>Review</span>
              <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Responsive Row of Quick Actions and Recent Events */}
      <div className="grid grid-cols-1  gap-5">
        
        {/* Quick Actions Card */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link to="/agents">
              <button
                className="w-full max-w-75 flex items-center gap-3 px-4 py-2.5 bg-[#004d2c] hover:bg-[#00381e] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Verify Agents</span>
              </button>
            </Link>

            <Link to="/reports">
              <button
                className="w-full max-w-75 flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 text-[#004d2c] border border-slate-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Eye size={15} className="text-amber-500" />
                <span>Review Reports</span>
              </button>
            </Link>

            <Link to="/listings">
              <button
                className="w-full max-w-75 flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 text-[#004d2c] border border-slate-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                <FileCheck2 size={15} />
                <span>Approve Listings</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity List Card */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Recent Activity
          </h3>
          <div className="space-y-3.5">
            {recentActivities.map((act) => (
              <div 
                key={act.id} 
                className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 last:border-none last:pb-0 font-medium"
              >
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full shrink-0"></span>
                  <div className='flex  flex-col gap-2'>
                    <p className="text-slate-700 leading-normal font-bold text-[10px]">
                      {act.text}
                    </p>
                    <p className="text-[10px] text-slate-500">Agent: { act.agent}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
