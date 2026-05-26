import { OgaAgent } from '../../types';

interface AgentTableProps {
  agents: OgaAgent[];
  onSelectAgent: (id: string) => void;
}

export default function AgentTable({ agents, onSelectAgent }: AgentTableProps) {
  return (
    <div className="bg-white rounded-xl border border-emerald-950/5 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider select-none">
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
            {agents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 select-none">
                  No agents matched your specified filters. Click reset above.
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-[#f4fcf8]/50 transition-colors">
                  <td className="py-3.5 px-5 flex items-center gap-3 min-w-[200px]">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-5 h-5 rounded-full object-cover bg-slate-100 shrink-0"
                    />
                    <div>
                      <button
                        type="button"
                        onClick={() => onSelectAgent(agent.id)}
                        className="font-bold text-slate-800 hover:text-[#004d2c] block cursor-pointer text-[10px] text-left"
                      >
                        {agent.name}
                      </button>
                      <span className="text-[10px] text-slate-400 tracking-wide uppercase font-semibold">
                        {agent.id}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-5 text-slate-600 font-bold font-mono text-[9px]">
                    {agent.phone}
                  </td>

                  <td className="py-3 px-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                      agent.verificationStatus === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : agent.verificationStatus === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {agent.verificationStatus}
                    </span>
                  </td>

                  <td className="py-3 px-5 text-center font-bold text-[9px]">
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

                  <td className="py-3 px-5 text-[9px] text-center text-slate-700 font-bold">
                    {agent.activeListingsCount}
                  </td>

                  <td className="py-3 px-5 text-[9px] font-bold text-slate-600">
                    {agent.subscriptionPlan}
                  </td>

                  <td className="py-3 px-5 text-right w-24">
                    <button
                      onClick={() => onSelectAgent(agent.id)}
                      className="p-1 px-3 bg-white hover:bg-[#004d2c] hover:text-white text-[#004d2c] text-[11px] font-bold border border-slate-200 hover:border-[#004d2c] rounded-lg transition-all cursor-pointer text-[9px]"
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
    </div>
  );
}
