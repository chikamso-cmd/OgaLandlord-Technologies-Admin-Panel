import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OgaAgent } from "../types";
import { initialAgents } from "../data";
import AgentFilters from "./agents/AgentFilters";
import AgentTable from "./agents/AgentTable";
import useProperties from "../hooks/useProperties";
import { AlertTriangle, Loader } from "lucide-react";

export default function AgentsView() {
  const navigate = useNavigate();
  const { data: fetchedAgents, isLoading, isError, error } = useProperties();
  const [agents, setAgents] = useState<OgaAgent[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  useEffect(() => {
    if (fetchedAgents) setAgents(fetchedAgents);
  }, [fetchedAgents]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPlanFilter("all");
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.data?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.data?.phone.includes(searchTerm) ||
      agent.data?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || agent.data?.verificationStatus === statusFilter;
    const matchesPlan =
      planFilter === "all" || agent.data?.subscriptionPlan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center font-bold flex items-center gap-3 justify-center text-emerald-800 mt-50 mb-50">
        <Loader size={20} className="animate-spin" /> Loading agents...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center font-bold text-red-800 flex items-center gap-3 justify-center mt-50 mb-50">
        <AlertTriangle size={20} /> {error.message}
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

      <AgentTable
        agents={filteredAgents}
        onSelectAgent={(agentId) =>
          navigate(`/agents/${encodeURIComponent(agentId)}`)
        }
      />

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
    </div>
  );
}
