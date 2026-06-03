/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Image as ImageIcon,
  Copy
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-700/15"
              >
                {/* <CheckCheck size={14} /> */}
                <span>Approve Listing</span>
              </button>
            )}

            <button
              onClick={() => onTriggerRemoveListingModal(selectedListing.id)}
              className="px-4 py-2 bg-red-50  text-red-600 border border-red-200 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              {/* <Trash2 size={14} /> */}
              <span>Remove Listing</span>
            </button>
          </div>
        </div>

        {/* Graphic Hero, price overlay panel, and information structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left panel interior showcase & general parameters */}
          <div className="lg:col-span-8 space-y-6">

            {/* details overlay */}

            {/* Hero Property Frame */}
            <div className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden border border-emerald-950/5 shadow-xs">
              <div className="bg-white p-3 w-40 rounded-lg absolute z-50 top-12 left-6 shadow-xs ">
                <span className={`px-2.5 py-1  text-[10px] font-medium rounded-md shadow-md tracking-wider leading-none ${selectedListing.status === 'Verified'
                  ? 'bg-emerald-500 text-white'
                  : selectedListing.status === 'Pending'
                    ? 'bg-amber-500 text-white'
                    : 'bg-red-500 text-white'
                  }`}>
                  {selectedListing.status}
                </span>
                <div className="flex gap-3 flex-col mt-2 mb-4 ">
                  <div className="text-[10px] ">
                    <h2 className="font-bold ">{selectedListing.price}</h2>
                    <p className="text-slate-400 ">Price</p>
                  </div>
                  <div className="text-[10px] border-t border-slate-200 pt-2 ">
                    <h2 className="font-bold ">{selectedListing.agentName}</h2>
                    <p className="text-slate-400 ">Agent</p>
                  </div>
                  <div className="text-[10px] border-t border-slate-200 pt-2">
                    <h2 className="font-bold ">{selectedListing.timeAgo}</h2>
                    <p className="text-slate-400 ">Date Posted</p>
                  </div>
                </div>

                <button
                  onClick={() => onViewAgentProfile(selectedListing.agentId)}
                  className="w-full py-2 bg-[#004d2c] hover:bg-[#00381e] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center block shadow-xs"
                >
                  View Agent Profile
                </button>
              </div>
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
              <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">
                Property Description
              </h4>
              <p className="text-[10px] text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {selectedListing.description}
              </p>

              <div className="mt-3">
                <h4 className="text-[10px] font-medium text-slate-800  tracking-widest">
                  Special Requirement
                </h4>
                <div className="flex flex-col gap-2 ">
                  <div className="pt-3 flex items-start gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block mb-1 ">Religion </span>
                      <p className="text-xs font-medium text-slate-700 leading-tight">
                        {selectedListing.specialRequirements.religion}
                      </p>
                    </div>
                  </div>

                  <div className="  gap-3">

                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block mb-1 ">Marital Status</span>
                      <p className="text-[10px] font-medium text-slate-700 leading-tight">
                        {selectedListing.specialRequirements.maritalStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image gallery placeholders */}
            <div className=" p-6 rounded-xl space-y-4">
              <h4 className="text-[10px] font-bold text-green-800  tracking-widest">
                <span> Gallery </span>
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
              <div className=" space-y-3">
                <div className="flex flex-col text-[10px]">
                  <span className="text-slate-400 font-medium">Rent Amount</span>
                  <span className="font-bold text-slate-700">{selectedListing.breakdown.rent}</span>
                </div>

                <div className="flex flex-col text-xs">
                  <span className="text-slate-400 font-medium">Service Charge</span>
                  <span className="font-bold text-slate-700">{selectedListing.breakdown.serviceCharge}</span>
                </div>

                <div className="flex flex-col text-[10px]">
                  <span className="font-semibold text-slate-400">Damage Charge</span>
                  <span className="font-bold text-slate-700">{selectedListing.breakdown.damageCharge}</span>
                </div>

                <div className="flex flex-col text-[10px]">
                  <span className="text-slate-400 font-medium">Agency / Agreement fee</span>
                  <span className="font-bold text-slate-700">{selectedListing.breakdown.agentFee}</span>
                </div>

                <div className="flex flex-col border-t  border-slate-200 pt-3 text-[10px]">
                  <span className="font-extrabold text-[#004d2c] ">Total Package</span>
                  <span className="font-black text-slate-800 text-[10px] leading-none pt-1">{selectedListing.breakdown.total}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg">
              <div>
                <span className="text-[10px] font-medium tracking-tight block">
                  Inspection Fee
                </span>
                <span className="text-[10px] font-bold mt-1 block">{selectedListing.breakdown.inspectionFee}</span>

                <p className="pt-3 text-[10px] text-slate-500">
                  A one time fee required to inspect the property, this fee is non-refundable and does count towards rent or other charges
                </p>
              </div>
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
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold  tracking-wide ${listing.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : listing.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className=" flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleSelectListing(listing.id)}
                          className="inline-flex items-center gap-2 rounded-lg  px-3 py-1 text-[10px] font-bold text-red-400 transition-colors   cursor-pointer"
                        >
                          <Copy size={12} />

                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectListing(listing.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold text-[#004d2c] transition-colors hover:bg-[#004d2c] hover:text-white cursor-pointer"
                        >
                          {/* <Eye size={12} /> */}
                          View
                        </button>
                      </div>
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
