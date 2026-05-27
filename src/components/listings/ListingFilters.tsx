interface ListingFiltersProps {
    searchTerm: string;
    statusFilter: string;
    areaFilter: string;
    onSearchTermChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onAreaFilterChange: (value: string) => void;
    onReset: () => void;
}

export default function ListingFilters({
    searchTerm,
    statusFilter,
    areaFilter,
    onSearchTermChange,
    onStatusFilterChange,
    onAreaFilterChange,
    onReset,
}: ListingFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-xl border border-emerald-950/5 flex flex-col md:flex-row gap-3.5 items-center justify-between">
            <div className="flex-1 w-full relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    placeholder="Search by flat title, location, neighborhood, or agent name..."
                    className="w-full pl-4 pr-4 py-1.5 text-xs bg-slate-50/80 hover:bg-slate-50 font-medium text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#004d2c] transition-all"
                />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    className="bg-slate-50 text-slate-700 px-3 py-1.5 text-xs border border-slate-200 outline-none rounded-lg focus:border-[#004d2c] font-semibold w-full md:w-36"
                >
                    <option value="all">All Statuses</option>
                    <option value="Verified">Verified Only</option>
                    <option value="Pending">Pending Only</option>
                    <option value="Removed">Removed Only</option>
                </select>

                <select
                    value={areaFilter}
                    onChange={(e) => onAreaFilterChange(e.target.value)}
                    className="bg-slate-50 text-slate-700 px-3 py-1.5 text-xs border border-slate-200 outline-none rounded-lg focus:border-[#004d2c] font-semibold w-full md:w-32"
                >
                    <option value="all">All Areas</option>
                    <option value="Lekki">Lekki Phase 1</option>
                    <option value="Challenge">Challenge, IB</option>
                    <option value="Akobo">Akobo, IB</option>
                </select>

                {(searchTerm || statusFilter !== 'all' || areaFilter !== 'all') && (
                    <button
                        onClick={onReset}
                        className="text-[#004d2c] text-xs font-extrabold hover:underline whitespace-nowrap px-1 cursor-pointer"
                        type="button"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
