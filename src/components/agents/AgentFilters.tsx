import { Dispatch, SetStateAction } from 'react';

interface AgentFiltersProps {
  searchTerm: string;
  statusFilter: string;
  planFilter: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  setPlanFilter: Dispatch<SetStateAction<string>>;
  resetFilters: () => void;
}

export default function AgentFilters({
  searchTerm,
  statusFilter,
  planFilter,
  setSearchTerm,
  setStatusFilter,
  setPlanFilter,
  resetFilters,
}: AgentFiltersProps) {
  return (
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
  );
}
