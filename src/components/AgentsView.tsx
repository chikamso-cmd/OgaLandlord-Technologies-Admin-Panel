/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { OgaAgent, OgaListing } from "../types";
import { initialAgents, initialListings } from "../data";
import ActionModal from "./ActionModal";
import AgentFilters from "./agents/AgentFilters";
import AgentTable from "./agents/AgentTable";
import AgentDetailHeader from "./agents/AgentDetailHeader";
import AgentActionPanel from "./agents/AgentActionPanel";
import AgentDetailBody from "./agents/AgentDetailBody";

export default function AgentsView() {
  const [agents, setAgents] = useState<OgaAgent[]>(initialAgents);
  const [listings] = useState<OgaListing[]>(initialListings);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [activeModal, setActiveModal] = useState<
    "ban" | "reduce" | "suspend" | "reject" | null
  >(null);
  const [modalTargetId, setModalTargetId] = useState<string | null>(null);
  const [modalReason, setModalReason] = useState("");
  const [scoreReduction, setScoreReduction] = useState(10);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPlanFilter("all");
  };

  const openModal = (
    type: "ban" | "reduce" | "suspend" | "reject",
    agentId: string,
  ) => {
    setActiveModal(type);
    setModalTargetId(agentId);
    setModalReason("");
    setScoreReduction(10);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalTargetId(null);
  };

  const confirmModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeModal || !modalTargetId) return;
    setAgents((current) =>
      current.map((agent) => {
        if (agent.id !== modalTargetId) return agent;
        if (
          activeModal === "ban" ||
          activeModal === "suspend" ||
          activeModal === "reject"
        ) {
          return {
            ...agent,
            verificationStatus: "Blocked",
            ...(activeModal === "ban"
              ? { trustScore: 0, activeListingsCount: 0 }
              : {}),
          };
        }
        return {
          ...agent,
          trustScore: Math.max(0, agent.trustScore - scoreReduction),
          responseTime: Math.max(
            0,
            agent.responseTime - Math.round(scoreReduction / 2),
          ),
          clientSatisfaction: Math.max(
            0,
            agent.clientSatisfaction - Math.round(scoreReduction / 2),
          ),
        };
      }),
    );
    closeModal();
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || agent.verificationStatus === statusFilter;
    const matchesPlan =
      planFilter === "all" || agent.subscriptionPlan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const agentListings = selectedAgent
    ? listings.filter((l) => l.agentId === selectedAgent.id)
    : [];

  if (selectedAgent) {
    return (
      <div id="agent-detail-wrapper" className="space-y-6">
        <AgentDetailHeader
          agent={selectedAgent}
          onBack={() => setSelectedAgentId(null)}
        />
        <AgentActionPanel
          agent={selectedAgent}
          onTriggerModal={openModal}
          onApproveVerification={(agentId) =>
            setAgents((current) =>
              current.map((agent) =>
                agent.id === agentId
                  ? { ...agent, verificationStatus: "Verified", trustScore: 90 }
                  : agent,
              ),
            )
          }
          onResetTrustScore={(agentId) =>
            setAgents((current) =>
              current.map((agent) =>
                agent.id === agentId
                  ? {
                      ...agent,
                      trustScore: 95,
                      responseTime: 95,
                      transactionSuccess: 92,
                      clientSatisfaction: 98,
                    }
                  : agent,
              ),
            )
          }
        />
        <AgentDetailBody agent={selectedAgent} listings={agentListings} />
      </div>
    );
  }

  return (
    <div id="agents-view" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Management</h1>
        <p className="text-xs text-slate-400 pt-2">
          View and manage all registered agents
        </p>
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

      <AgentTable agents={filteredAgents} onSelectAgent={setSelectedAgentId} />

      <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 flex items-center justify-between">
        <span>
          Showing {filteredAgents.length} of {agents.length} agents
        </span>
        <div className="flex gap-1.5">
          <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">
            Previous
          </button>
          <button className="px-2.5 py-1 bg-[#004d2c] text-white rounded cursor-pointer">
            1
          </button>
          <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">
            2
          </button>
          <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">
            Next
          </button>
        </div>
      </div>
      <ActionModal
        activeModal={activeModal}
        modalTargetAgent={
          agents.find((agent) => agent.id === modalTargetId) ?? null
        }
        modalReasonInput={modalReason}
        modalScoreReduction={scoreReduction}
        modalExtendValue="3"
        onReasonChange={setModalReason}
        onScoreReductionChange={setScoreReduction}
        onExtendValueChange={() => undefined}
        onClose={closeModal}
        onConfirm={confirmModal}
      />
    </div>
  );
}
