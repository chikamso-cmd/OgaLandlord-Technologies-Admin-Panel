import { ArrowLeft, CheckCircle } from 'lucide-react';
import { OgaAgent } from '../../types';

interface AgentDetailHeaderProps {
  agent: OgaAgent;
  onBack: () => void;
}

export default function AgentDetailHeader({ agent, onBack }: AgentDetailHeaderProps) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-[#004d2c] font-bold text-xs select-none uppercase tracking-wider cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>View Agent Profile</span>
      </button>

      <div className="bg-white rounded-xl border border-emerald-950/5 p-6 shadow-xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border-2 border-slate-100 shadow-inner"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                  {agent.name}
                </h3>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${
                  agent.verificationStatus === 'Verified'
                    ? 'bg-[#e8f7f0] text-emerald-700'
                    : agent.verificationStatus === 'Pending'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {agent.verificationStatus}
                </span>
              </div>

              <p className="text-xs text-slate-400">{agent.email}</p>
              <p className="text-xs font-semibold text-slate-700">{agent.phone}</p>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold select-none pt-1">
                <span>★ 4.9</span>
                <span className="text-slate-400 font-medium text-[11px]">(183 reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="flex gap-4">
              <div className="bg-[#f4fcf8] border border-emerald-50 rounded-xl p-3 text-center min-w-25">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Experience</span>
                <span className="text-base font-black text-[#004d2c] mt-1 block">{agent.experienceYears}+ Years</span>
                <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">Of active services</span>
              </div>
              <div className="bg-[#f4fcf8] border border-emerald-50 rounded-xl p-3 text-center min-w-25">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Deals Closed</span>
                <span className="text-base font-black text-[#004d2c] mt-1 block">{agent.dealsClosed}+</span>
                <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">Successful listings</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1.5">Trust Score</span>
              <div className="relative inline-flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 ${
                  agent.trustScore >= 80 
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : agent.trustScore >= 50 
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-red-500 bg-red-50/50'
                }`}>
                  <span className="text-lg font-black text-slate-800 tracking-tighter leading-none">{agent.trustScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
