import { CheckCircle, Clock, Slash, AlertTriangle, RotateCcw, X } from 'lucide-react';
import { OgaAgent } from '../../types';

interface AgentActionPanelProps {
  agent: OgaAgent;
  onTriggerModal: (type: 'ban' | 'reduce' | 'suspend' | 'reject', agentId: string) => void;
  onApproveVerification: (agentId: string) => void;
  onResetTrustScore: (agentId: string) => void;
}

export default function AgentActionPanel({
  agent,
  onTriggerModal,
  onApproveVerification,
  onResetTrustScore,
}: AgentActionPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-emerald-950/5 p-5 space-y-3 shadow-xs">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Admin Actions
      </h4>
      <div className="flex flex-wrap gap-2.5 w-[410px]">
        {agent.verificationStatus === 'Pending' && (
          <button
            onClick={() => onApproveVerification(agent.id)}
            className="w-fit px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-700/10"
          >
            <CheckCircle size={12} />
            <span>Approve Verification</span>
          </button>
        )}

        <button
          onClick={() => onTriggerModal('reject', agent.id)}
          className="w-fit px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <X size={14} className="text-slate-400" />
          <span>Reject Verification</span>
        </button>

        <button
          onClick={() => onTriggerModal('suspend', agent.id)}
          className="w-fit px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <Clock size={14} className="text-slate-400" />
          <span>Suspend Agent</span>
        </button>

        <button
          onClick={() => onTriggerModal('ban', agent.id)}
          className="w-fit px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-700/10"
        >
          <Slash size={14} />
          <span>Ban Agent</span>
        </button>

        <button
          onClick={() => onTriggerModal('reduce', agent.id)}
          className="w-fit px-4 py-2 bg-white hover:bg-[#004d2c]/5 text-[#004d2c] border border-slate-200 text-[10px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <AlertTriangle size={14} className="text-amber-500" />
          <span>Reduce Trust Score</span>
        </button>

        <button
          onClick={() => onResetTrustScore(agent.id)}
          className="w-fit px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={13} className="text-slate-400" />
          <span>Reset Trust Score</span>
        </button>
      </div>
    </div>
  );
}
