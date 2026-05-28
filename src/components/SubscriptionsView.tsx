/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CreditCard, Search, ArrowRight, ShieldAlert, CheckCircle2, RotateCcw, DollarSign, AlertCircle, Calendar } from 'lucide-react';
import { OgaSubscription } from '../types';
import { subscriptionCard } from '../data';

interface SubscriptionsViewProps {
  subscriptions: OgaSubscription[];
  onTriggerExtendModal: (subscription: OgaSubscription) => void;
  onRefreshSubscriptions?: () => void;
}

export default function SubscriptionsView({
  subscriptions,
  onTriggerExtendModal,
  onRefreshSubscriptions
}: SubscriptionsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSubs = subscriptions.filter((sub) => {
    const matchesSearch = sub.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper to map icons
    const renderIcon = (type: string) => {
      switch (type) {
        case 'agents':
          return <DollarSign size={14} className="text-[#004d2c]" />;
        case 'verified':
          return <AlertCircle size={14} className="text-red-600" />;
        case 'pending':
          return <Calendar size={14} className="text-amber-500" />;
        case 'listings':
          return <DollarSign size={14} className="text-blue-600" />;
      }
    };
  
    const getIconBackground = (type: string) => {
      switch (type) {
        case 'agents':
          return 'bg-emerald-50 border border-emerald-100';
        case 'verified':
          return 'bg-red-50 border border-red-100';
        case 'pending':
          return 'bg-amber-50 border border-amber-100';
        case 'listings':
          return 'bg-blue-50 border border-blue-100';
        default:
          return 'bg-slate-50 border border-slate-100';
      }
    };
  

  return (
    <div id="subscriptions-view" className="space-y-6">
      <div className="w-full ">
        <h1 className=" text-xl font-bold pb-1">Subscription Management</h1>
        <p className="text-[10px] text-slate-400">Manage agent subscription and payments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {
          subscriptionCard.map((card) => (
            <div key={card.id} className=" p-2 border border-gray-200   bg-white rounded-md shadow">
              <div className="">

                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconBackground(card.iconType)}`}>
                  {renderIcon(card.iconType)}
                </div>
              </div>
              <h1 className="pt-2 text-sm font-bold text-green-800">{card.count}</h1>
              <p className="text-[10px] text-slate-400 pt-2 ">{card.label}</p>
            </div>
          ))
        }
      </div>

      {/* Table control filters */}
      <div className="bg-white p-4 rounded-xl border border-emerald-950/5 flex flex-col md:flex-row gap-3.5 items-center justify-between">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search active subscriptions by agent name..."
            className="w-full pl-4 pr-4 py-1.5 text-xs bg-slate-50/80 hover:bg-slate-50 font-medium text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#004d2c] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 px-3 py-1.5 text-xs border border-slate-200 outline-none rounded-lg focus:border-[#004d2c] font-semibold w-full md:w-44 select-none"
          >
            <option value="all">All Plan Statuses</option>
            <option value="Active">Active Plans</option>
            <option value="Expired">Expired Licenses</option>
            <option value="Expiring soon">Expiring soon</option>
          </select>

          {onRefreshSubscriptions && (
            <button
              onClick={onRefreshSubscriptions}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Sync Subscriptions"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Subscriptions registry list table */}
      <div className="bg-white rounded-xl border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Agent Name</th>
                <th className="py-3 px-5">Subscription Plan</th>
                <th className="py-3 px-5">Amount</th>
                <th className="py-3 px-5">Start Date</th>
                <th className="py-3 px-5">End Date</th>
                <th className="py-3 px-5">Verification</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No active licenses matching search filter query.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#f4fcf8]/50 transition-all">

                    <td className="py-3.5 px-5 font-bold text-slate-800 text-[10px]">
                      {sub.agentName}
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">{sub.id}</span>
                    </td>

                    <td className="py-3 px-5 text-slate-600 font-normal">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700  border border-indigo-100 text-[9px] rounded">
                        {sub.plan}
                      </span>
                    </td>

                    <td className="py-3 px-5 text-green-800 font-normal text-[10px]">
                      {sub.amount}
                    </td>

                    <td className="py-3 px-5 text-slate-500 font-mono text-[10px]">
                      {sub.startDate}
                    </td>

                    <td className="py-3 px-5 text-slate-500 font-mono text-[10px]">
                      {sub.endDate}
                    </td>

                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-normal  tracking-wide border ${sub.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                          : sub.status === 'Expiring soon'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {sub.status === 'Active' ? 'Active' : sub.status === 'Expiring soon' ? 'Expiring soon' : 'Expired'}
                      </span>
                    </td>

                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => onTriggerExtendModal(sub)}
                        className="px-3 py-1 bg-white hover:bg-[#004d2c] hover:text-white text-[#004d2c] font-semibold border border-slate-200 hover:border-[#004d2c] rounded-lg transition-colors cursor-pointer text-[10px]"
                      >
                        view
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 flex items-center justify-between">
            <span>Showing {filteredSubs.length} of {subscriptions.length} subscriptions</span>
            <div className="flex gap-1.5">
              <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">Previous</button>
              <button className="px-2.5 py-1 bg-[#004d2c] text-white rounded cursor-pointer">1</button>
              <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">2</button>
              <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">Next</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
