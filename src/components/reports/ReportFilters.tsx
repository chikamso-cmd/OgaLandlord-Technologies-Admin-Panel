interface ReportFiltersProps {
    statusFilter: string;
    onStatusChange: (value: string) => void;
}

export default function ReportFilters({
    statusFilter,
    onStatusChange,
}: ReportFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-xl border border-emerald-950/5 flex items-center justify-between">
            <div>
                <h2 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase">
                    Reports & Complaints
                </h2>
                <p className="text-[11px] text-slate-400 block mt-1 hover:underline">
                    Review and manage user reports against agent
                </p>
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
        </div>
    );
}
