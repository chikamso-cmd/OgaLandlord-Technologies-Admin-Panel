/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Image as ImageIcon,
  Copy,
  Loader,
  AlertTriangle,
} from "lucide-react";
import { OgaListing, OgaAgent } from "../types";
import { initialAgents, initialListings } from "../data";
import ListingFilters from "./listings/ListingFilters";
import ActionModal from "./ActionModal";
import useListings from "../hooks/useListings";
import {
  formatNaira,
  updateListingStatus,
  type ListingStatusUpdate,
} from "../services/Listingsapi";

function ListingInfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-2">
      <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">
        {title}
      </h4>
      <div>{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const isEmpty = value === null || value === undefined || value === "";
  return (
    <div className="flex justify-between gap-4 text-[10px] py-1.5 border-b border-slate-50 last:border-b-0">
      <span className="text-slate-400 font-medium shrink-0">{label}</span>
      <span
        className={`text-right wrap-break-word capitalize ${
          isEmpty ? "text-slate-300 italic" : "text-slate-700 font-bold"
        }`}
      >
        {isEmpty ? "Not provided" : value}
      </span>
    </div>
  );
}

export default function ListingsView() {
  const navigate = useNavigate();
  const { data: fetchedListings, isLoading, isError, error } = useListings();
  const listings: OgaListing[] = fetchedListings ?? initialListings;
  const [agents] = useState<OgaAgent[]>(initialAgents);
  const location = useLocation();
  const routeState = location.state as { selectedListingId?: number } | null;
  const [selectedListingId, setSelectedListingId] = useState<number | null>(
    routeState?.selectedListingId ?? null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [activeModal, setActiveModal] = useState<"remove" | null>(null);
  const [modalReason, setModalReason] = useState("");
  const [pendingAction, setPendingAction] = useState<
    "approve" | "remove" | "rented" | null
  >(null);
  const queryClient = useQueryClient();

  // Write the status the backend returned into the cached listings so every
  // view reading ["listings"] updates immediately.
  const applyStatusUpdate = (
    propertyID: number,
    update: ListingStatusUpdate,
  ) => {
    queryClient.setQueryData<OgaListing[]>(["listings"], (current) =>
      current?.map((listing) =>
        listing.id === propertyID
          ? {
              ...listing,
              status: update.status,
              rawStatus: update.rawStatus,
              rentStatus:
                update.status === "Removed"
                  ? "Removed"
                  : update.status === "rented"
                    ? "rented"
                    : listing.rentStatus,
            }
          : listing,
      ),
    );
  };

  useEffect(() => {
    if (routeState?.selectedListingId) {
      setSelectedListingId(routeState.selectedListingId);
    }
  }, [routeState?.selectedListingId]);

  const handleSelectListing = (id: number | null) => {
    setSelectedListingId(id);
  };

  // Find selected listing
  const selectedListing = listings.find((l) => l.id === selectedListingId);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setAreaFilter("all");
  };

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.agentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || l.status === statusFilter;

    const matchesArea =
      areaFilter === "all" ||
      (areaFilter === "Lekki" && l.area.includes("Lekki")) ||
      (areaFilter === "Challenge" && l.area.includes("Challenge")) ||
      (areaFilter === "Akobo" && l.area.includes("Akobo"));

    return matchesSearch && matchesStatus && matchesArea;
  });
  const handleStatusChange = async (
    propertyID: number,
    action: "approve" | "remove" | "rented",
  ) => {
    setPendingAction(action);
    try {
      const update = await updateListingStatus(
        propertyID,
        action === "approve"
          ? "published"
          : action === "rented"
            ? "rented"
            : "removed",
      );
      applyStatusUpdate(propertyID, update);
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success(
        update.message ||
          (action === "approve"
            ? "Listing approved successfully"
            : action === "rented"
              ? "Listing set as rented successfully"
              : "Listing removed successfully"),
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${action} listing.`;
      toast.error(message);
    } finally {
      setPendingAction(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center font-bold flex items-center gap-3 justify-center text-emerald-800">
        <Loader size={20} className="animate-spin" /> Loading listings...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center font-bold text-red-800 flex items-center gap-3 justify-center">
        <AlertTriangle size={20} /> {error.message}
      </div>
    );
  }

  if (selectedListing) {
    return (
      <div id="listing-detail-wrapper" className="space-y-6">
        {/* Navigation Breadcrumb Back link */}
        <button
          onClick={() => handleSelectListing(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#004d2c] font-bold text-xs select-none uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{selectedListing.area}</span>
        </button>

        {/* Action Header bar (Approve / Remove layout control) */}
        <div className="bg-white p-4 rounded-xl border border-emerald-950/5 flex items-center justify-between shadow-xs">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none truncate max-w-sm md:max-w-xl">
              {selectedListing.title}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">
              {selectedListing.id}
            </span>
          </div>

          <div className="flex gap-2.5">
            {selectedListing.status !== "published" && (
              <button
                onClick={() =>
                  handleStatusChange(selectedListing.id, "approve")
                }
                disabled={pendingAction !== null}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-700/15"
              >
                {/* <CheckCheck size={14} /> */}
                {pendingAction === "approve" && (
                  <Loader size={14} className="animate-spin" />
                )}
                <span>
                  {pendingAction === "approve"
                    ? "Approving..."
                    : "Approve Listing"}
                </span>
              </button>
            )}

            {selectedListing.status !== "Removed" && (
              <button
                onClick={() => handleStatusChange(selectedListing.id, "remove")}
                disabled={pendingAction !== null}
                className="px-4 py-2 bg-red-50  text-red-600 border border-red-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                {/* <Trash2 size={14} /> */}
                {pendingAction === "remove" && (
                  <Loader size={14} className="animate-spin" />
                )}
                <span>
                  {pendingAction === "remove"
                    ? "Removing..."
                    : "Remove Listing"}
                </span>
              </button>
            )}
            {/* rented status */}
            {selectedListing.status !== "rented" && (
              <button
                onClick={() => handleStatusChange(selectedListing.id, "rented")}
                disabled={pendingAction !== null}
                className="px-4 py-2 bg-sky-50 text-sky-700 border border-sky-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                {/* <Trash2 size={14} /> */}
                {pendingAction === "rented" && (
                  <Loader size={14} className="animate-spin" />
                )}
                <span>
                  {pendingAction === "rented"
                    ? "Setting as Rented..."
                    : "Set as Rented"}
                </span>
              </button>
            )}
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
                <span
                  className={`px-2.5 py-1  text-[10px] font-medium rounded-md shadow-md tracking-wider leading-none ${
                    selectedListing.status === "published" ? "bg-green-50 text-green-700"
                    : selectedListing.status === "Pending" ? "bg-amber-50 text-amber-700"
                    : selectedListing.status === "Removed" ? "bg-red-50 text-red-700"
                    : selectedListing.status === "rented" ? "bg-sky-50 text-sky-700"
                    : "bg-gray-50 text-gray-700"
                  }`}
                >
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
                  onClick={() =>
                    navigate(
                      selectedListing.agentId
                        ? `/agents/${selectedListing.agentId}`
                        : "/agents",
                    )
                  }
                  className="w-full py-2 bg-[#004d2c] hover:bg-[#00381e] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center block shadow-xs"
                >
                  View Agent Profile
                </button>
              </div>
              {selectedListing.image ? (
                <img
                  src={selectedListing.image}
                  alt="Property main view"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md shadow-md uppercase tracking-wider leading-none ${
                    selectedListing.status === "published"
                      ? "bg-emerald-500 text-white"
                      : selectedListing.status === "Pending"
                        ? "bg-amber-500 text-white"
                        : selectedListing.status === "rented"
                          ? "bg-sky-500 text-white"
                          : "bg-red-500 text-white"
                  }`}
                >
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
                      <span className="text-[10px] text-slate-400 font-medium block mb-1 ">
                        Religion{" "}
                      </span>
                      <p className="text-xs font-medium text-slate-700 leading-tight">
                        {selectedListing.specialRequirements.religion}
                      </p>
                    </div>
                  </div>

                  <div className="  gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block mb-1 ">
                        Marital Status
                      </span>
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

              {(selectedListing.images ?? []).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-[10px] border border-dashed border-slate-200 rounded-lg">
                  No photos uploaded for this listing.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {(selectedListing.images ?? []).map((url, index) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 block"
                    >
                      <img
                        src={url}
                        alt={`${selectedListing.title} photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel side status, direct price and contract fee layout */}
          <div className="lg:col-span-4 space-y-6">
            {/* Rental Fee Breakdown Column */}
            <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-5">
              <div className=" space-y-3">
                <div className="flex flex-col text-[10px]">
                  <span className="text-slate-400 font-medium">
                    Rent Amount
                  </span>
                  <span className="font-bold text-slate-700">
                    {selectedListing.breakdown.rent}
                  </span>
                </div>

                <div className="flex flex-col text-xs">
                  <span className="text-slate-400 font-medium">
                    Service Charge
                  </span>
                  <span className="font-bold text-slate-700">
                    {selectedListing.breakdown.serviceCharge}
                  </span>
                </div>

                <div className="flex flex-col text-[10px]">
                  <span className="font-semibold text-slate-400">
                    Damage Charge
                  </span>
                  <span className="font-bold text-slate-700">
                    {selectedListing.breakdown.damageCharge}
                  </span>
                </div>

                <div className="flex flex-col text-[10px]">
                  <span className="text-slate-400 font-medium">
                    Agency / Agreement fee
                  </span>
                  <span className="font-bold text-slate-700">
                    {selectedListing.breakdown.agentFee}
                  </span>
                </div>

                <div className="flex flex-col border-t  border-slate-200 pt-3 text-[10px]">
                  <span className="font-extrabold text-[#004d2c] ">
                    Total Package
                  </span>
                  <span className="font-black text-slate-800 text-[10px] leading-none pt-1">
                    {selectedListing.breakdown.total}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg">
              <div>
                <span className="text-[10px] font-medium tracking-tight block">
                  Inspection Fee
                </span>
                <span className="text-[10px] font-bold mt-1 block">
                  {selectedListing.breakdown.inspectionFee}
                </span>

                <p className="pt-3 text-[10px] text-slate-500">
                  A one time fee required to inspect the property, this fee is
                  non-refundable and does count towards rent or other charges
                </p>
              </div>
            </div>

            <ListingInfoCard title="Property Details">
              <InfoRow
                label="Property Type"
                value={selectedListing.propertyType}
              />
              <InfoRow label="Address" value={selectedListing.address} />
              <InfoRow label="City" value={selectedListing.city} />
              <InfoRow label="State" value={selectedListing.state} />
              <InfoRow label="Country" value={selectedListing.country} />
              <InfoRow
                label="Coordinates"
                value={
                  selectedListing.latitude != null &&
                  selectedListing.longitude != null
                    ? `${selectedListing.latitude}, ${selectedListing.longitude}`
                    : null
                }
              />
              <InfoRow label="Bedrooms" value={selectedListing.beds} />
              <InfoRow label="Bathrooms" value={selectedListing.baths} />
              <InfoRow
                label="Availability"
                value={selectedListing.rentStatus}
              />
              <InfoRow
                label="Status"
                value={selectedListing.rawStatus?.replace(/_/g, " ")}
              />
              <InfoRow
                label="Date Posted"
                value={
                  selectedListing.createdAt
                    ? new Date(selectedListing.createdAt).toLocaleString()
                    : null
                }
              />
            </ListingInfoCard>

            {(selectedListing.units ?? []).length > 1 && (
              <ListingInfoCard
                title={`Units (${selectedListing.units?.length})`}
              >
                {selectedListing.units?.map((unit, index) => (
                  <div
                    key={unit.id}
                    className="py-2 border-b border-slate-50 last:border-b-0 text-[10px]"
                  >
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{unit.unitNumber ?? `Unit ${index + 1}`}</span>
                      <span>{formatNaira(unit.rentPrice)}/yr</span>
                    </div>
                    <div className="flex justify-between text-slate-400 mt-0.5">
                      <span>
                        {unit.bedrooms} Beds • {unit.bathrooms} Baths
                      </span>
                      <span>
                        {unit.isAvailable ? "Available" : "Not available"}
                      </span>
                    </div>
                  </div>
                ))}
              </ListingInfoCard>
            )}

            {selectedListing.agent && (
              <ListingInfoCard title="Listed By">
                <div className="flex items-center gap-3 pb-2">
                  {selectedListing.agent.imageUrl ? (
                    <img
                      src={selectedListing.agent.imageUrl}
                      alt={selectedListing.agent.name}
                      className="w-10 h-10 rounded-full object-cover bg-slate-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-sm font-bold">
                      {selectedListing.agent.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {selectedListing.agent.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {selectedListing.agent.email ?? "No email"}
                    </p>
                  </div>
                </div>
                <InfoRow
                  label="Username"
                  value={selectedListing.agent.username}
                />
                <InfoRow
                  label="Trust Score"
                  value={`${selectedListing.agent.trustScore}/100`}
                />
                <InfoRow
                  label="Verification"
                  value={selectedListing.agent.verificationStatus?.replace(
                    /_/g,
                    " ",
                  )}
                />
              </ListingInfoCard>
            )}

            <ListingInfoCard title="Engagement">
              <InfoRow label="Views" value={selectedListing.viewsCount ?? 0} />
              <InfoRow
                label="Favorites"
                value={selectedListing.favoritesCount ?? 0}
              />
              <InfoRow
                label="Comments"
                value={selectedListing.commentsCount ?? 0}
              />
              <InfoRow
                label="Reports"
                value={selectedListing.reportsCount ?? 0}
              />
              <InfoRow
                label="Average Rating"
                value={
                  selectedListing.averageRating != null
                    ? `★ ${selectedListing.averageRating.toFixed(1)} (${selectedListing.ratings?.length})`
                    : null
                }
              />
              {(selectedListing.ratings ?? []).length > 0 && (
                <div className="pt-2 space-y-2">
                  {selectedListing.ratings?.map((rating) => (
                    <div
                      key={rating.id}
                      className="bg-slate-50 rounded-lg p-2 text-[10px]"
                    >
                      <div className="flex justify-between">
                        <span className="text-amber-500 font-bold">
                          {"★".repeat(rating.stars)}
                          <span className="text-slate-300">
                            {"★".repeat(Math.max(0, 5 - rating.stars))}
                          </span>
                        </span>
                        <span className="text-slate-400">
                          {rating.createdAt
                            ? new Date(rating.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        {rating.comment ?? "No comment"}
                      </p>
                      <p className="text-slate-400 mt-0.5">
                        Tenant #{rating.tenantId}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ListingInfoCard>
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
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    No active listings matching your search criterion. Update
                    status filters above.
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="hover:bg-[#f4fcf8]/50 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-900 font-bold text-sm truncate text-[10px]">
                            {listing.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 truncate">
                            {listing.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 text-[10px]">
                      {listing.area}
                    </td>
                    <td className="py-4 px-5 text-slate-900 font-bold text-[10px]">
                      {listing.price}
                    </td>
                    <td className="py-4 px-5 text-slate-700 text-[10px]">
                      {listing.agentName}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold  tracking-wide ${
                          listing.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : listing.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : listing.status === "rented"
                                ? "bg-sky-50 text-sky-700 border border-sky-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
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
          <span>
            Showing {filteredListings.length} of {listings.length} listings
          </span>
          <div className="flex gap-1.5">
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">
              Previous
            </button>
            <button className="px-2.5 py-1 bg-[#004d2c] text-white rounded cursor-pointer">
              1
            </button>
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">
              2
            </button>
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>
      <ActionModal
        activeModal={activeModal}
        modalTargetAgent={null}
        modalReasonInput={modalReason}
        // modalScoreReduction={10}
        // modalExtendValue="3"
        onReasonChange={setModalReason}
        // onScoreReductionChange={() => undefined}
        // onExtendValueChange={() => undefined}
        onClose={() => setActiveModal(null)}
        // onConfirm={confirmRemove}
      />
    </div>
  );
}
