interface ReportFiltersProps {
    statusFilter: string;
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onReset: () => void;
}

export default function ReportFilters({
    statusFilter,
    searchTerm,
    onSearchTermChange,
    onStatusChange,
    onReset,

}: ReportFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-xl border border-emerald-950/5 flex gap-5 items-center justify-between">
            
            <div className="flex-1 w-full relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    placeholder="Search by reporter name or agent name..."
                    className="w-full max-w-100 pl-4 pr-4 py-1.5 text-xs bg-slate-50/80 hover:bg-slate-50 font-medium text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#004d2c] transition-all"
                />
            </div>
            <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="bg-slate-50 text-slate-700 px-3 py-1.5 text-xs border border-slate-200 outline-none rounded-lg focus:border-[#004d2c] font-semibold w-36 select-none"
            >
                <option value="all">All statuses</option>
                <option value="Open">Open cases</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Resolved">Resolved</option>
            </select>

            {(searchTerm || statusFilter !== 'all') && (
                <button
                    onClick={onReset}
                    className="text-[#004d2c] text-xs font-extrabold hover:underline whitespace-nowrap px-1 cursor-pointer"
                    type="button"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
