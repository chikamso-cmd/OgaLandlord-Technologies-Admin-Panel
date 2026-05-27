/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MapPin,
  User,
  Trash2,
  CheckCheck,
  Eye,
  ArrowLeft,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { OgaListing, OgaAgent } from '../types';
import ListingFilters from './listings/ListingFilters';

interface ListingsViewProps {
  listings: OgaListing[];
  agents: OgaAgent[];
  onApproveListing: (id: string) => void;
  onTriggerRemoveListingModal: (id: string) => void;
  onViewAgentProfile: (agentId: string) => void;
  initialFilter?: string; // e.g. "Pending"
}

export default function ListingsView({
  listings,
  agents,
  onApproveListing,
  onTriggerRemoveListingModal,
  onViewAgentProfile,
  initialFilter = 'all'
}: ListingsViewProps) {
  const location = useLocation();
  const routeState = location.state as { selectedListingId?: string } | null;
  const [selectedListingId, setSelectedListingId] = useState<string | null>(routeState?.selectedListingId ?? null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [areaFilter, setAreaFilter] = useState('all');

  useEffect(() => {
    if (routeState?.selectedListingId) {
      setSelectedListingId(routeState.selectedListingId);
    }
  }, [routeState?.selectedListingId]);

  const handleSelectListing = (id: string | null) => {
    setSelectedListingId(id);
  };

  // Find selected listing
  const selectedListing = listings.find(l => l.id === selectedListingId);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAreaFilter('all');
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
          onClick={() => handleSelectListing(null)}
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
                <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md shadow-md uppercase tracking-wider leading-none ${selectedListing.status === 'Verified'
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
                  <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80" alt="Int Room 1" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <img src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=300&q=80" alt="Int Room 2" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                  <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80" alt="Int Room 3" className="w-full h-full object-cover opacity-60 blur-xxs rounded-lg" />
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
                  <span className="font-semibold text-orange-600">Caution / Damage fee</span>
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
            <div className="p-5 rounded-xl border border-[#e8f7f0] bg-[#f4fbf7]/40 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">
                Listed Agent profile
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 min-w-10 bg-slate-200 rounded-full overflow-hidden border border-[#00bf71]/30">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt={selectedListing.agentName} className="w-full h-full object-cover" />
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
    <div>
      <h1 className="text-lg font-extrabold text-slate-800 tracking-tight leading-none">
         Listings Management
      </h1>
      <span className="text-[10px] text-slate-400 font-normal tracking-wider block mt-1">
        Review and moderate property listings 
      </span>
    </div>

      <ListingFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        areaFilter={areaFilter}
        onSearchTermChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onAreaFilterChange={setAreaFilter}
        onReset={resetFilters}
      />

      <div className="bg-white rounded-xl border border-emerald-950/5 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5">Property</th>
                <th className="py-4 px-5">Area</th>
                <th className="py-4 px-5">Price</th>
                <th className="py-4 px-5">Agent</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No active listings matching your search criterion. Update status filters above.
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-[#f4fcf8]/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-900 font-bold text-sm truncate text-[10px]">{listing.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1 truncate">{listing.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 text-[10px]">{listing.area}</td>
                    <td className="py-4 px-5 text-slate-900 font-bold text-[10px]">{listing.price}</td>
                    <td className="py-4 px-5 text-slate-700 text-[10px]">{listing.agentName}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${listing.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : listing.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleSelectListing(listing.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold text-[#004d2c] transition-colors hover:bg-[#004d2c] hover:text-white"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* <div className="px-5 py-3 text-[11px] text-slate-500 bg-slate-50 border-t border-slate-100">
          Showing {filteredListings.length} of {listings.length} listings
        </div> */}
        <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 flex items-center justify-between">
          <span>Showing {filteredListings.length} of {listings.length} listings</span>
          <div className="flex gap-1.5">
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">Previous</button>
            <button className="px-2.5 py-1 bg-[#004d2c] text-white rounded cursor-pointer">1</button>
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">2</button>
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
