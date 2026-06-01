import { ArrowLeft, CalendarCheck, CheckCircle } from 'lucide-react';
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-300 pb-5">
          <div className="flex items-center gap-5">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border-2 border-slate-100 shadow-inner"
            />
            <div className="space-y-1">
              <span className={`px-2 py-0.5 mb-3 text-[8px] font-medium rounded-md tracking-wider ${agent.verificationStatus === 'Verified'
                ? 'bg-emerald-600 text-white'
                : agent.verificationStatus === 'Pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-red-600 text-white'
                }`}>
                {agent.verificationStatus}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <h3 className="text-md font-medium text-slate-800 tracking-tight leading-none">
                  {agent.name}
                </h3>

              </div>

              <p className="text-[10px] text-slate-400">{agent.email}</p>
              <p className="text-[10px] font-semibold text-slate-700">{agent.phone}</p>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold select-none pt-1">
                <p>★ <span className="text-slate-500">4.9</span></p>
                <span className="text-slate-400 font-medium text-[8px]">(183 reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1.5">Trust Score</span>
              <span className="text-lg font-black text-green-600 tracking-tighter leading-none">{agent.trustScore}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <div className="flex items-center ">
            <div className="bg-green-100 text-green-700 p-2 rounded-sm"><CalendarCheck size={13} /></div>
            <div className="  rounded-xl p-3  min-w-25">
              <span className="text-xs font-medium text-[#004d2c] mt-1 block">{agent.experienceYears}+</span>
              <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">Years of experience</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-amber-100 text-amber-700 p-2 rounded-sm"><CheckCircle size={13} /></div>
            <div className=" rounded-xl p-3 min-w-25">
              <span className="text-xs font-medium text-[#004d2c] mt-1 block">{agent.dealsClosed}+</span>
              <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">Deals closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
