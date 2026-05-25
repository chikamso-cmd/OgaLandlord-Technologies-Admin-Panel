/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  MapPin, 
  User, 
  Trash2, 
  CheckCheck, 
  Copy, 
  Eye, 
  ArrowLeft, 
  Clock, 
  Info,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { OgaListing, OgaAgent } from '../types';

interface ListingsViewProps {
  listings: OgaListing[];
  agents: OgaAgent[];
  selectedListingId: string | null;
  onSelectListing: (id: string | null) => void;
  onApproveListing: (id: string) => void;
  onTriggerRemoveListingModal: (id: string) => void;
  onViewAgentProfile: (agentId: string) => void;
  initialFilter?: string; // e.g. "Pending"
}

export default function ListingsView({
  listings,
  agents,
  selectedListingId,
  onSelectListing,
  onApproveListing,
  onTriggerRemoveListingModal,
  onViewAgentProfile,
  initialFilter = 'all'
}: ListingsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [areaFilter, setAreaFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Find selected listing
  const selectedListing = listings.find(l => l.id === selectedListingId);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAreaFilter('all');
  };

  // Copy listing link simulation
  const handleCopyLink = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter listings
  const filteredListings = listings.filter(l => {
    const matchesSearch = 
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.area.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.agentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      l.status === statusFilter;

    const matchesArea = 
      areaFilter === 'all' || 
      (areaFilter === 'Lekki' && l.area.includes('Lekki')) || 
      (areaFilter === 'Challenge' && l.area.includes('Challenge')) || 
      (areaFilter === 'Akobo' && l.area.includes('Akobo'));

    return matchesSearch && matchesStatus && matchesArea;
  });

  if (selectedListing) {
    return (
      <div id="listing-detail-wrapper" className="space-y-6">
        
        {/* Navigation Breadcrumb Back link */}
        <button
          onClick={() => onSelectListing(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#004d2c] font-bold text-xs select-none uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Central Park Estate Lekki Phase 1, Lagos City</span>
        </button>

        {/* Action Header bar (Approve / Remove layout control) */}
        <div className="bg-white p-4 rounded-xl border border-emerald-950/5 flex items-center justify-between shadow-xs">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none truncate max-w-sm md:max-w-xl">
              {selectedListing.title}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">{selectedListing.id}</span>
          </div>

          <div className="flex gap-2.5">
            {selectedListing.status !== 'Verified' && (
              <button
                onClick={() => onApproveListing(selectedListing.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-700/15"
              >
                <CheckCheck size={14} />
                <span>Approve Listing</span>
              </button>
            )}

            <button
              onClick={() => onTriggerRemoveListingModal(selectedListing.id)}
              className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Remove Listing</span>
            </button>
          </div>
        </div>

        {/* Graphic Hero, price overlay panel, and information structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel interior showcase & general parameters */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Hero Property Frame */}
            <div className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden border border-emerald-950/5 shadow-xs">
              <img 
                src={selectedListing.image} 
                alt="Property main view" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md shadow-md uppercase tracking-wider leading-none ${
                  selectedListing.status === 'Verified'
                    ? 'bg-emerald-500 text-white'
                    : selectedListing.status === 'Pending'
                    ? 'bg-amber-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {selectedListing.status}
                </span>
                
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded-md leading-none">
                  {selectedListing.timeAgo}
                </span>
              </div>
            </div>

            {/* General Property Text Description Card */}
            <div className="bg-white p-6 rounded-xl border border-emerald-950/5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">
                Property Description
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {selectedListing.description}
              </p>
            </div>

            {/* Extra requirements & Tenant qualifications criteria */}
            <div className="bg-white p-6 rounded-xl border border-emerald-950/5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">
                Tenant Eligibility specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50/50 rounded-lg border border-slate-100 flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-[#004d2c] rounded-md"><Building size={14} /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Religion Constraint</span>
                    <p className="text-xs font-bold text-slate-700 leading-tight">
                      {selectedListing.specialRequirements.religion}
                    </p>
                    <span className="text-[9px] text-[#004d2c] font-semibold block mt-1 leading-tight">Verified requirement</span>
                  </div>
                </div>

                <div className="p-1.5 px-3 bg-slate-50/50 rounded-lg border border-slate-100 flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-[#004d2c] rounded-md"><User size={14} /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Marital Status preferential</span>
                    <p className="text-xs font-bold text-slate-700 leading-tight">
                      {selectedListing.specialRequirements.maritalStatus}
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-1 leading-tight">Admin compliance approved</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image gallery placeholders */}
            <div className="bg-white p-6 rounded-xl border border-emerald-950/5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={14} className="text-slate-400" />
                <span>Media gallery uploads</span>
              </h4>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80" alt="Int Room 1" className="w-[100%] h-full object-cover rounded-lg" />
                </div>
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <img src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=300&q=80" alt="Int Room 2" className="w-[100%] h-full object-cover rounded-lg" />
                </div>
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                  <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80" alt="Int Room 3" className="w-[100%] h-full object-cover opacity-60 blur-xxs rounded-lg" />
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center rounded-lg">
                    <span className="text-[11px] font-extrabold text-white uppercase tracking-wider text-center px-1">
                      + 4 photos
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right panel side status, direct price and contract fee layout */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Rental Fee Breakdown Column */}
            <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-5">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase tracking-wider">Lekki Rent Valuation</span>
                <span className="text-xl font-black text-[#004d2c] tracking-tight block">
                  {selectedListing.price}
                </span>
                <span className="text-[10px] text-[#00a86b] font-semibold mt-1 block">Inspect fee: {selectedListing.breakdown.inspectionFee}</span>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Rent Amount</span>
                  <span className="font-bold text-slate-700">{selectedListing.breakdown.rent}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Service Charge</span>
                  <span className="font-bold text-slate-700">{selectedListing.breakdown.serviceCharge}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium font-semibold text-orange-600">Caution / Damage fee</span>
                  <span className="font-bold text-slate-700">{selectedListing.breakdown.damageCharge}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Agency / Agreement fee</span>
                  <span className="font-bold text-slate-700">{selectedListing.breakdown.agentFee}</span>
                </div>

                <div className="flex justify-between items-center border-t border-dashed border-slate-200 pt-3 text-xs">
                  <span className="font-extrabold text-[#004d2c] uppercase">Total Package</span>
                  <span className="font-black text-slate-800 text-sm leading-none">{selectedListing.breakdown.total}</span>
                </div>
              </div>
            </div>

            {/* Direct Agent assignment detail profile card */}
            <div className="bg-white p-5 rounded-xl border border-[#e8f7f0] bg-[#f4fbf7]/40 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">
                Listed Agent profile
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 min-w-[40px] bg-slate-200 rounded-full overflow-hidden border border-[#00bf71]/30">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt={selectedListing.agentName} className="w-[100%] h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <h5 className="text-xs font-bold text-slate-800 leading-tight truncate">
                    {selectedListing.agentName}
                  </h5>
                  <span className="text-[10px] text-[#004d2c] font-semibold block mt-0.5">Trust Score: 95/100</span>
                </div>
              </div>

              <button
                onClick={() => onViewAgentProfile(selectedListing.agentId)}
                className="w-full py-2 bg-[#004d2c] hover:bg-[#00381e] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center block shadow-xs"
              >
                View Agent Profile
              </button>
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div id="listings-view" className="space-y-6">
      
      {/* Listings Table Control Search bar */}
      <div className="bg-white p-4 rounded-xl border border-emerald-950/5 flex flex-col md:flex-row gap-3.5 items-center justify-between">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by flat title, location, neighborhood, or agent name..."
            className="w-full pl-4 pr-4 py-1.5 text-xs bg-slate-50/80 hover:bg-slate-50 font-medium text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#004d2c] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 px-3 py-1.5 text-xs border border-slate-200 outline-none rounded-lg focus:border-[#004d2c] font-semibold w-full md:w-36"
          >
            <option value="all">All Statuses</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending Only</option>
            <option value="Removed">Removed Only</option>
          </select>

          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 px-3 py-1.5 text-xs border border-slate-200 outline-none rounded-lg focus:border-[#004d2c] font-semibold w-full md:w-32"
          >
            <option value="all">All Areas</option>
            <option value="Lekki">Lekki Phase 1</option>
            <option value="Challenge">Challenge, IB</option>
            <option value="Akobo">Akobo, IB</option>
          </select>

          {(searchTerm || statusFilter !== 'all' || areaFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-[#004d2c] text-xs font-extrabold hover:underline whitespace-nowrap px-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-slate-400 text-xs border border-slate-200 rounded-xl">
            No active listings matching your search criterion. Update status filters above.
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div 
              key={listing.id}
              className="bg-white rounded-xl border border-emerald-950/5 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Card Image segment */}
              <div className="relative aspect-video bg-slate-100">
                <img 
                  src={listing.image} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5 items-center">
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider text-white shadow-sm shadow-black/10 ${
                    listing.status === 'Verified' 
                      ? 'bg-emerald-600' 
                      : listing.status === 'Pending' 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                  }`}>
                    {listing.status}
                  </span>
                </div>
                
                <button
                  onClick={() => handleCopyLink(listing.id)}
                  title="Copy Listing Code Reference"
                  className="absolute bottom-2.5 right-2 bg-black/60 hover:bg-slate-800/80 p-1.5 text-white rounded-lg transition-colors cursor-pointer"
                >
                  {copiedId === listing.id ? <CheckCheck size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>

              {/* Card Detail metrics */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-[#004d2c] tracking-tight">
                      {listing.price}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      {listing.id}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1 hover:text-[#004d2c] cursor-pointer" onClick={() => onSelectListing(listing.id)}>
                      {listing.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-1 font-medium">
                      <MapPin size={11} className="text-slate-300" />
                      <span className="truncate">{listing.area}</span>
                    </p>
                  </div>
                </div>

                {/* Foot bar info */}
                <div className="border-t border-slate-50 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-600 font-mono flex-shrink-0">
                      {listing.agentName[0]}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[90px]">
                      {listing.agentName}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectListing(listing.id)}
                    className="p-1 px-3 bg-white hover:bg-[#004d2c] hover:text-white text-[#004d2c] text-[10px] font-bold border border-slate-200 hover:border-[#004d2c] rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Eye size={11} />
                    <span>View Detail</span>
                  </button>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
