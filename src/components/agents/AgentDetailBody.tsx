import { CheckCircle, MapPin } from 'lucide-react';
import { OgaAgent, OgaListing } from '../../types';

interface AgentDetailBodyProps {
  agent: OgaAgent;
  listings: OgaListing[];
}

export default function AgentDetailBody({ agent, listings }: AgentDetailBodyProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
          <h4 className="text-xs font-extrabold text-slate-800 tracking-tight uppercase border-b border-slate-50 pb-2">
            Trust Score Breakdown
          </h4>
          {/* trust score demographic */}
          <div className="flex items-center gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="text-center">
              <div className="relative flex gap-3 items-center ">
                <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 ${agent.trustScore >= 80
                    ? 'border-emerald-800 bg-emerald-50/50 text-green-800'
                    : agent.trustScore >= 50
                      ? 'border-amber-500 bg-amber-50/50 text-amber-500'
                      : 'border-red-500 bg-red-50/50 text-red-500'
                  } `} style={{ border: `${agent.trustScore}%` }}>
                  <p className="text-lg flex flex-col font-black  tracking-tighter leading-none">{agent.trustScore} <span className="text-[9px] pt-1">/100</span> </p>
                </div>
                <div>
                  <h1 className="text-left font-medium text-green-800">Excellent </h1>
                  <p className="text-left text-[9px] font-medium">Based on 3 factors</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ScoreRow label="Response Time" value={agent.responseTime} />
            <ScoreRow label="Transaction Success" value={agent.transactionSuccess} />
            <ScoreRow label="Client Satisfaction" value={agent.clientSatisfaction} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Areas of Operation
          </h4>
          <div className="flex flex-wrap gap-2">
            {agent.areasOfOperation.map((area, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-slate-100 hover:bg-[#e6f4ea] hover:text-[#004d2c] text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1 cursor-default transition-all"
              >
                <MapPin size={12} className="text-slate-400" />
                <span>{area}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Verification Documents
          </h4>
          <div className="space-y-3.5">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">Government ID</span>
              <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                  alt="Govt ID Mockup"
                  className="w-full h-full object-cover blur-xs opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center p-3 text-center bg-black/30 backdrop-blur-xxs">
                  <p className="text-[11px] font-bold text-white shadow-xs">
                    Verified Government Identity Document ID: **-4932
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">Selfie Verification</span>
              <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={agent.avatar}
                  alt="Selfie verification"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-[10px] font-bold text-white flex items-center gap-1">
                    <CheckCircle size={11} className="text-emerald-400" />
                    <span>Face Match: 98% Confirmed</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <AgentListingSection listings={listings} />
        <AgentHistoryLogs />
      </div>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-slate-700 pb-1">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className="bg-emerald-800 h-full rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AgentListingSection({ listings }: { listings: OgaListing[] }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
          Active Listings ({listings.length})
        </h4>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase select-none">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span>Available: {listings.filter((l) => l.rentStatus === 'Available').length}</span>
          </span>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
          No active listings posted by this agent.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-100">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-1 items-center">
                  <span className="px-2 py-0.5 bg-emerald-600/90 text-white text-[9px] font-bold rounded">
                    Verified
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-[#004d2c]">{listing.price}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                    listing.rentStatus === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {listing.rentStatus}
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-800 leading-tight truncate">{listing.title}</h5>
                  <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                    <MapPin size={10} />
                    <span className="truncate">{listing.area}</span>
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 flex gap-3 text-[10px] font-bold text-slate-500">
                <span>{listing.beds} Beds</span>
                <span>•</span>
                <span>{listing.baths} Baths</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AgentHistoryLogs() {
  return (
    <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
        Report History logs
      </h4>
      <div className="space-y-3">
        <HistoryLogItem
          title="Late response to tenant inquiries"
          meta="Reported by User123 • Nov 12, 2024"
          resolution="Resolution: Agent warned and coached on platform response guarantees."
          status="Resolved"
        />
        <HistoryLogItem
          title="Listing mismatch detail specification"
          meta="Reported by User456 • Oct 8, 2024"
          resolution="Resolution: Agent edited incorrect service charge rates. Trust score coached."
          status="Resolved"
        />
      </div>
    </div>
  );
}

function HistoryLogItem({
  title,
  meta,
  resolution,
  status,
}: {
  title: string;
  meta: string;
  resolution: string;
  status: string;
}) {
  return (
    <div className="flex items-start justify-between text-xs pb-3 border-b border-slate-100 last:border-b-0">
      <div>
        <h5 className="font-bold text-slate-700">{title}</h5>
        <p className="text-[10px] text-slate-400 mt-0.5">{meta}</p>
        <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded">{resolution}</p>
      </div>
      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded">{status}</span>
    </div>
  );
}
