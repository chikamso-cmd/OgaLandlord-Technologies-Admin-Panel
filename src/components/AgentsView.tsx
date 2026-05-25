/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Slash, 
  MapPin, 
  Award, 
  CheckCircle, 
  X, 
  ChevronRight, 
  ArrowLeft,
  Activity,
  FileCheck2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { OgaAgent, OgaListing } from '../types';

interface AgentsViewProps {
  agents: OgaAgent[];
  listings: OgaListing[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string | null) => void;
  onTriggerModal: (type: 'ban' | 'reduce' | 'suspend' | 'reject', agentId: string) => void;
  onApproveVerification: (agentId: string) => void;
  onResetTrustScore: (agentId: string) => void;
  initialFilter?: string; // e.g. "Pending"
}

export default function AgentsView({
  agents,
  listings,
  selectedAgentId,
  onSelectAgent,
  onTriggerModal,
  onApproveVerification,
  onResetTrustScore,
  initialFilter = 'all'
}: AgentsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [planFilter, setPlanFilter] = useState('all');

  // Find selected agent
  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  // Clear filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPlanFilter('all');
  };

  // Filtered list
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      agent.phone.includes(searchTerm) || 
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      agent.verificationStatus === statusFilter;
      
    const matchesPlan = 
      planFilter === 'all' || 
      agent.subscriptionPlan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Get active listings for selected agent
  const agentListings = selectedAgent ? listings.filter(l => l.agentId === selectedAgent.id) : [];

  if (selectedAgent) {
    return (
      <div id="agent-detail-wrapper" className="space-y-6">
        
        {/* Back Link Nav */}
        <button
          onClick={() => onSelectAgent(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#004d2c] font-bold text-xs select-none uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>View Agent Profile</span>
        </button>

        {/* Hero Card */}
        <div className="bg-white rounded-xl border border-emerald-950/5 p-6 shadow-xs relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Avatar & Details */}
            <div className="flex items-center gap-5">
              <img
                src={selectedAgent.avatar}
                alt={selectedAgent.name}
                className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border-2 border-slate-100 shadow-inner"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                    {selectedAgent.name}
                  </h3>
                  
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${
                    selectedAgent.verificationStatus === 'Verified'
                      ? 'bg-[#e8f7f0] text-emerald-700'
                      : selectedAgent.verificationStatus === 'Pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedAgent.verificationStatus}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400">{selectedAgent.email}</p>
                <p className="text-xs font-semibold text-slate-700">{selectedAgent.phone}</p>
                
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold select-none pt-1">
                  <span>★ 4.9</span>
                  <span className="text-slate-400 font-medium text-[11px]">(183 reviews)</span>
                </div>
              </div>
            </div>

            {/* Experience & Deals and LARGE Score display */}
            <div className="flex items-center gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
              
              <div className="flex gap-4">
                <div className="bg-[#f4fcf8] border border-emerald-50 rounded-xl p-3 text-center min-w-[100px]">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Experience</span>
                  <span className="text-base font-black text-[#004d2c] mt-1 block">{selectedAgent.experienceYears}+ Years</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">Of active services</span>
                </div>
                <div className="bg-[#f4fcf8] border border-emerald-50 rounded-xl p-3 text-center min-w-[100px]">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Deals Closed</span>
                  <span className="text-base font-black text-[#004d2c] mt-1 block">{selectedAgent.dealsClosed}+</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">Successful listings</span>
                </div>
              </div>

              {/* Trust Score Radial style block */}
              <div className="text-center">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1.5">Trust Score</span>
                <div className="relative inline-flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 ${
                    selectedAgent.trustScore >= 80 
                      ? 'border-emerald-500 bg-emerald-50/50' 
                      : selectedAgent.trustScore >= 50 
                      ? 'border-amber-500 bg-amber-50/50' 
                      : 'border-red-500 bg-red-50/50'
                  }`}>
                    <span className="text-lg font-black text-slate-800 tracking-tighter leading-none">{selectedAgent.trustScore}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Action Panel Buttons (Admin Actions) */}
        <div className="bg-white rounded-xl border border-emerald-950/5 p-5 space-y-3 shadow-xs">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Admin Actions
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {selectedAgent.verificationStatus === 'Pending' && (
              <button
                onClick={() => onApproveVerification(selectedAgent.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-700/10"
              >
                <CheckCircle size={14} />
                <span>Approve Verification</span>
              </button>
            )}

            <button
              onClick={() => onTriggerModal('reject', selectedAgent.id)}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <X size={14} className="text-slate-400" />
              <span>Reject Verification</span>
            </button>

            <button
              onClick={() => onTriggerModal('suspend', selectedAgent.id)}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Clock size={14} className="text-slate-400" />
              <span>Suspend Agent</span>
            </button>

            <button
              onClick={() => onTriggerModal('ban', selectedAgent.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-700/10"
            >
              <Slash size={14} />
              <span>Ban Agent</span>
            </button>

            <button
              onClick={() => onTriggerModal('reduce', selectedAgent.id)}
              className="px-4 py-2 bg-white hover:bg-[#004d2c]/5 text-[#004d2c] border border-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle size={14} className="text-amber-500" />
              <span>Reduce Trust Score</span>
            </button>

            <button
              onClick={() => onResetTrustScore(selectedAgent.id)}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} className="text-slate-400" />
              <span>Reset Trust Score</span>
            </button>
          </div>
        </div>

        {/* Detailed Panels Row: Score details, documents, active listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel breakdown, docs, reports history */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Trust score breakdown */}
            <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 tracking-tight uppercase border-b border-slate-50 pb-2">
                Trust Score Breakdown
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 pb-1">
                    <span>Response Time</span>
                    <span>{selectedAgent.responseTime}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full" 
                      style={{ width: `${selectedAgent.responseTime}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 pb-1">
                    <span>Transaction Success</span>
                    <span>{selectedAgent.transactionSuccess}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full" 
                      style={{ width: `${selectedAgent.transactionSuccess}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 pb-1">
                    <span>Client Satisfaction</span>
                    <span>{selectedAgent.clientSatisfaction}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full" 
                      style={{ width: `${selectedAgent.clientSatisfaction}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Areas of operation */}
            <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Areas of Operation
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.areasOfOperation.map((area, i) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 bg-slate-100 hover:bg-[#e6f4ea] hover:text-[#004d2c] text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1 cursor-default transition-all"
                  >
                    <MapPin size={12} className="text-slate-400" />
                    <span>{area}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Verification Documents */}
            <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Verification Documents
              </h4>
              
              <div className="space-y-3.5">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">Government ID</span>
                  <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" 
                      alt="Govt ID Mockup" 
                      className="w-full h-full object-cover blur-xs opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-3 text-center bg-black/30 backdrop-blur-xxs">
                      <p className="text-[11px] font-bold text-white shadow-xs">
                        Verified Government Identity Document ID: **-4932
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">Selfie Verification</span>
                  <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img 
                      src={selectedAgent.avatar} 
                      alt="Selfie verification" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-[10px] font-bold text-white flex items-center gap-1">
                        <CheckCircle size={11} className="text-emerald-400" />
                        <span>Face Match: 98% Confirmed</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right panel listing grids */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active listings */}
            <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Active Listings ({agentListings.length})
                </h4>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase select-none">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span>Available: {agentListings.filter(l=>l.rentStatus === 'Available').length}</span>
                  </span>
                </div>
              </div>

              {agentListings.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                  No active listings posted by this agent.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agentListings.map((listing) => (
                    <div 
                      key={listing.id} 
                      className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-slate-100">
                        <img 
                          src={listing.image} 
                          alt={listing.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-1 items-center">
                          <span className="px-2 py-0.5 bg-emerald-600/90 text-white text-[9px] font-bold rounded">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-black text-[#004d2c]">
                            {listing.price}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                            listing.rentStatus === 'Available' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {listing.rentStatus}
                          </span>
                        </div>

                        <div>
                          <h5 className="text-xs font-bold text-slate-800 leading-tight truncate">
                            {listing.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                            <MapPin size={10} />
                            <span className="truncate">{listing.area}</span>
                          </p>
                        </div>
                      </div>
                      <div className="px-4 pb-4 flex gap-3 text-[10px] font-bold text-slate-500">
                        <span>{listing.beds} Beds</span>
                        <span>•</span>
                        <span>{listing.baths} Baths</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* History logs card */}
            <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                Report History logs
              </h4>
              <div className="space-y-3">
                <div className="flex items-start justify-between text-xs pb-3 border-b border-slate-100 last:border-b-0">
                  <div>
                    <h5 className="font-bold text-slate-700">Late response to tenant inquiries</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Reported by User123 • Nov 12, 2024</p>
                    <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded">
                      Resolution: Agent warned and coached on platform response guarantees.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded">
                    Resolved
                  </span>
                </div>

                <div className="flex items-start justify-between text-xs pb-3 border-b border-slate-100 last:border-b-0">
                  <div>
                    <h5 className="font-bold text-slate-700">Listing mismatch detail specification</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Reported by User456 • Oct 8, 2024</p>
                    <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded">
                      Resolution: Agent edited incorrect service charge rates. Trust score coached.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded">
                    Resolved
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // Otherwise, default to list of all items
  return (
    <div id="agents-view" className="space-y-6">
      
      {/* Search and control filter line */}
      <div className="bg-white p-4 rounded-xl border border-emerald-950/5 flex flex-col md:flex-row gap-3.5 items-center justify-between">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by agent name, phone, or email..."
            className="w-full pl-4 pr-4 py-1.5 text-xs bg-slate-50/80 hover:bg-slate-50 font-medium text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#004d2c] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 px-3 py-1.5 text-xs border border-slate-200 outline-none rounded-lg focus:border-[#004d2c] font-semibold w-full md:w-36 select-none"
          >
            <option value="all">All Verification</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending Only</option>
            <option value="Blocked">Blocked Only</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 px-3 py-1.5 text-xs border border-slate-200 outline-none rounded-lg focus:border-[#004d2c] font-semibold w-full md:w-32 select-none"
          >
            <option value="all">All Subscriptions</option>
            <option value="Premium">Premium</option>
            <option value="Free">Free</option>
          </select>

          {(searchTerm || statusFilter !== 'all' || planFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-[#004d2c] text-xs font-extrabold hover:underline whitespace-nowrap px-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Agents Table List */}
      <div className="bg-white rounded-xl border border-emerald-950/5 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-5">Agent Name</th>
                <th className="py-3 px-5">Phone Number</th>
                <th className="py-3 px-5">Verification</th>
                <th className="py-3 px-5 text-center">Trust Score</th>
                <th className="py-3 px-5 text-center">Active Listings</th>
                <th className="py-3 px-5">Subscription</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 select-none">
                    No agents matched your specified filters. Click reset above.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr 
                    key={agent.id}
                    className="hover:bg-[#f4fcf8]/50 transition-colors"
                  >
                    <td className="py-3.5 px-5 flex items-center gap-3 min-w-[200px]">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-8 h-8 rounded-full object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-800 hover:text-[#004d2c] block cursor-pointer" onClick={() => onSelectAgent(agent.id)}>
                          {agent.name}
                        </span>
                        <span className="text-[10px] text-slate-400 tracking-wide uppercase font-semibold">
                          {agent.id}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-3 px-5 text-slate-600 font-medium font-mono">
                      {agent.phone}
                    </td>

                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        agent.verificationStatus === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : agent.verificationStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {agent.verificationStatus === 'Verified' ? 'Verified' : agent.verificationStatus === 'Pending' ? 'Pending' : 'Blocked'}
                      </span>
                    </td>

                    <td className="py-3 px-5 text-center font-extrabold">
                      <span className={
                        agent.trustScore >= 80 
                          ? 'text-emerald-600' 
                          : agent.trustScore >= 50 
                          ? 'text-amber-500' 
                          : 'text-red-500'
                      }>
                        {agent.trustScore}/100
                      </span>
                    </td>

                    <td className="py-3 px-5 text-center text-slate-700 font-bold">
                      {agent.activeListingsCount}
                    </td>

                    <td className="py-3 px-5 font-bold text-slate-600">
                      {agent.subscriptionPlan}
                    </td>

                    <td className="py-3 px-5 text-right w-24">
                      <button
                        onClick={() => onSelectAgent(agent.id)}
                        className="p-1 px-3 bg-white hover:bg-[#004d2c] hover:text-white text-[#004d2c] text-[11px] font-bold border border-slate-200 hover:border-[#004d2c] rounded-lg transition-all cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info counts */}
        <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 flex items-center justify-between">
          <span>Showing {filteredAgents.length} of {agents.length} agents</span>
          <div className="flex gap-1.5">
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">Previous</button>
            <button className="px-2.5 py-1 bg-[#004d2c] text-white rounded cursor-pointer">1</button>
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">2</button>
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">Next</button>
          </div>
        </div>

      </div>

    </div>
  );
}
