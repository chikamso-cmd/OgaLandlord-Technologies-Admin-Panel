/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { OgaAgent, OgaListing } from '../types';
import AgentFilters from './agents/AgentFilters';
import AgentTable from './agents/AgentTable';
import AgentDetailHeader from './agents/AgentDetailHeader';
import AgentActionPanel from './agents/AgentActionPanel';
import AgentDetailBody from './agents/AgentDetailBody';

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
  initialFilter = 'all',
}: AgentsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [planFilter, setPlanFilter] = useState('all');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPlanFilter('all');
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || agent.verificationStatus === statusFilter;
    const matchesPlan = planFilter === 'all' || agent.subscriptionPlan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const agentListings = selectedAgent ? listings.filter((l) => l.agentId === selectedAgent.id) : [];

  if (selectedAgent) {
    return (
      <div id="agent-detail-wrapper" className="space-y-6">
        <AgentDetailHeader agent={selectedAgent} onBack={() => onSelectAgent(null)} />
        <AgentActionPanel
          agent={selectedAgent}
          onTriggerModal={onTriggerModal}
          onApproveVerification={onApproveVerification}
          onResetTrustScore={onResetTrustScore}
        />
        <AgentDetailBody agent={selectedAgent} listings={agentListings} />
      </div>
    );
  }

  return (
    <div id="agents-view" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Management</h1>
        <p className="text-xs text-slate-400 pt-2">View and manage all registered agents</p>
      </div>

      <AgentFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        planFilter={planFilter}
        setSearchTerm={setSearchTerm}
        setStatusFilter={setStatusFilter}
        setPlanFilter={setPlanFilter}
        resetFilters={resetFilters}
      />

      <AgentTable agents={filteredAgents} onSelectAgent={(id) => onSelectAgent(id)} />

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
  );
}
