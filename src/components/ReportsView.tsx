/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  User,
  Clock,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  X,
  FileCheck
} from 'lucide-react';
import { OgaReport, OgaAgent, OgaListing } from '../types';
import ReportFilters from './reports/ReportFilters';

interface ReportsViewProps {
  reports: OgaReport[];
  agents: OgaAgent[];
  listings: OgaListing[];
  onViewAgentProfile: (agentId: string) => void;
  onViewListingDetail: (listingId: string) => void;
  onMarkReviewed: (id: string) => void;
  onTriggerModal: (type: 'ban' | 'reduce' | 'suspend', agentId: string) => void;
}

export default function ReportsView({
  reports,
  agents,
  listings,
  onViewAgentProfile,
  onViewListingDetail,
  onMarkReviewed,
  onTriggerModal
}: ReportsViewProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [internalNote, setInternalNote] = useState('');
  const [notesList, setNotesList] = useState<Record<string, string[]>>({
    'RPT001': ['Admin Officer: Pattern of requesting upfront payment. Highly suspicious pattern.', 'System: Secondary audit triggered due to past reports threshold (5)']
  });

  // Find selected report
  const selectedReport = reports.find(r => r.id === selectedReportId);

  // Filter reports
  const filteredReports = reports.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || r.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  // Save internal notes
  const handleSaveNote = (reportId: string) => {
    if (!internalNote.trim()) return;
    const currentNotes = notesList[reportId] || [];
    setNotesList({
      ...notesList,
      [reportId]: [...currentNotes, `Admin Officer: ${internalNote}`]
    });
    setInternalNote('');
  };

  if (selectedReport) {
    const relatedAgent = agents.find(a => a.id === selectedReport.agentId);
    const relatedListing = listings.find(l => l.id === selectedReport.relatedListingId);
    const reportNotes = notesList[selectedReport.id] || [];

    return (
      <div id="report-detail-wrapper" className="space-y-6">

        {/* Back Link Nav */}
        <button
          onClick={() => setSelectedReportId(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#004d2c] font-bold text-xs select-none uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>View Report Details</span>
        </button>

        {/* Action Header Card */}
        <div className="bg-white p-5 rounded-xl border border-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wide text-white ${selectedReport.severity === 'High' ? 'bg-red-600 shadow-sm shadow-red-500/15' : 'bg-amber-500'
                }`}>
                {selectedReport.severity} Severity
              </span>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight leading-none truncate">
                {selectedReport.reason}
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              ID: {selectedReport.id} • Registered {selectedReport.date}
            </p>
          </div>

          <div className="flex items-center gap-2 select-none">
            {selectedReport.status !== 'Resolved' && (
              <button
                onClick={() => onMarkReviewed(selectedReport.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle size={14} />
                <span>Mark as Reviewed</span>
              </button>
            )}
            <span className={`px-3 py-1 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-lg ${selectedReport.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : ''
              }`}>
              Status: {selectedReport.status}
            </span>
          </div>
        </div>

        {/* Content Columns Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: General complaints descriptions, evidence images */}
          <div className="lg:col-span-8 space-y-6">

            {/* Case Details Summary Line */}
            <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Case Details
              </h4>

              <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-50 py-3.5 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px]">Submitted Date</span>
                  <p className="font-bold text-slate-700">{selectedReport.date}, 2:34 PM</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px]">Reporter Username</span>
                  <p className="font-semibold text-[#004d2c] flex items-center gap-1">
                    <User size={12} className="text-slate-400" />
                    <span>{selectedReport.reporter}</span>
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px]">Past Reported Offenses</span>
                  <p className="font-black text-red-600">{selectedReport.pastReportsCount} previous times</p>
                </div>
              </div>

              {/* Main Complaint text card */}
              <div className="space-y-1.5 pt-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Complaint narrative description</span>
                <div className="p-4 bg-red-50/50 rounded-xl border border-red-100/40 text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                  {selectedReport.description}
                </div>
              </div>
            </div>

            {/* Related Listing */}
            {selectedReport.relatedListingId && (
              <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-3.5">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Associated Property listing
                </h4>

                <div className="border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&q=80"
                        alt="Property preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 leading-tight">
                        {selectedReport.relatedListingName || 'Listed Property Flat'}
                      </h5>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                        ID: {selectedReport.relatedListingId} • {selectedReport.relatedListingPrice || '₦1.2M/yr'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedReport.relatedListingId) {
                        onViewListingDetail(selectedReport.relatedListingId);
                      }
                    }}
                    className="p-1.5 px-3 bg-[#f4fbf7]/40 hover:bg-[#e6f4ea] text-[#004d2c] text-[11px] font-bold border border-slate-200 hover:border-[#004d2c] rounded-lg transition-colors cursor-pointer flex items-center gap-1 select-none"
                  >
                    <span>View Listing</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Evidence details image attachments */}
            {selectedReport.evidenceImages.length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Evidence & attachments
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedReport.evidenceImages.map((img, i) => (
                    <div key={i} className="aspect-square bg-slate-100 border border-slate-200 rounded-lg overflow-hidden relative group">
                      <img src={img} alt="Evidence document" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-bold text-white tracking-widest leading-none">VIEW FULL</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous reports table */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 overflow-hidden text-xs space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Previous reports logs against this agent
              </h4>

              <div className="space-y-3">
                {selectedReport.previousOffenses && selectedReport.previousOffenses.length > 0 ? (
                  selectedReport.previousOffenses.map((offense) => (
                    <div
                      key={offense.id}
                      className="pb-3 border-b border-slate-50 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-800">{offense.reason}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] uppercase tracking-wider">
                          {offense.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 pb-1">
                        <span>Submitted: {offense.date}</span>
                        <span className="text-red-600 font-semibold">{offense.actionTaken}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 py-3 text-center">No record of previous offenses found against this profile.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right sidebar quick action panel and internal administrative note board */}
          <div className="lg:col-span-4 space-y-6">

            {/* Target Reported Agent Box summary */}
            {relatedAgent && (
              <div className="bg-white p-5 rounded-xl border border-[#fee2e2] bg-red-50/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-full overflow-hidden flex-shrink-0">
                    <img src={relatedAgent.avatar} alt={relatedAgent.name} className="w-[100%] h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 truncate leading-tight">
                      {relatedAgent.name}
                    </h5>
                    <span className="text-[10px] font-bold text-rose-600 block mt-1 uppercase">
                      Trust score: {relatedAgent.trustScore}/100
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => onViewAgentProfile(relatedAgent.id)}
                    className="w-full py-2 bg-slate-100 hover:bg-[#004d2c]/5 text-[#004d2c] text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                  >
                    View Agent Profile
                  </button>

                  <button
                    onClick={() => onTriggerModal('ban', relatedAgent.id)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer text-center shadow-xs"
                  >
                    Ban Agent permanently
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onTriggerModal('suspend', relatedAgent.id)}
                      className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                    >
                      Suspend Agent
                    </button>
                    <button
                      onClick={() => onTriggerModal('reduce', relatedAgent.id)}
                      className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                    >
                      Reduce Trust
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Internal Admin Note board */}
            <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Internal Memo Notes ({reportNotes.length})
              </h4>

              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {reportNotes.length === 0 ? (
                  <p className="text-[11px] text-slate-400 p-2 text-center">No internal notes logged. Write below.</p>
                ) : (
                  reportNotes.map((note, i) => (
                    <div key={i} className="bg-slate-50 p-2 py-2.5 border border-slate-100 rounded-lg text-[11px] text-slate-600 leading-relaxed font-semibold">
                      <span className="text-[#004d2c] font-black block text-[10px] uppercase">
                        {note.split(': ')[0]}
                      </span>
                      <span className="mt-0.5 block font-medium">
                        {note.split(': ')[1]}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2">
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Insert secure administrative note concerning investigations..."
                  rows={3}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-[#004d2c] text-slate-800 transition-all resize-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleSaveNote(selectedReport.id)}
                  className="w-full py-1.5 bg-[#004d2c] hover:bg-[#00381e] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Save Note
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div id="reports-view" className="space-y-6">

      {/* Control panel & filter */}
      <ReportFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Reports Table Grid */}
      <div className="bg-white rounded-xl border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Reporter Account</th>
                <th className="py-3 px-5">Agent Reported</th>
                <th className="py-3 px-5">Reason Category</th>
                <th className="py-3 px-5">Registered Date</th>
                <th className="py-3 px-5 text-center">Severity</th>
                <th className="py-3 px-5">Status Case</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No active complaint cases matching status flags.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#f4fcf8]/50 transition-all font-medium">
                    <td className="py-3.5 px-5 font-bold text-slate-800 text-[10px]">
                      {report.reporter}
                    </td>

                    <td className="py-3 px-5 text-slate-700 text-[10px]">
                      <span className="font-bold hover:text-[#004d2c] cursor-pointer" onClick={() => setSelectedReportId(report.id)}>
                        {report.agentName}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-semibold">{report.agentId}</span>
                    </td>

                    <td className="py-3 px-5 text-slate-600 font-bold max-w-[150px] truncate text-[10px]">
                      {report.reason}
                    </td>

                    <td className="py-3 px-5 text-slate-500 font-semibold text-[10px]">
                      {report.date}
                    </td>

                    <td className="py-3 px-5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${report.severity === 'High' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700'
                        }`}>
                        {report.severity}
                      </span>
                    </td>

                    <td className="py-3 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${report.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                          : report.status === 'Reviewed'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {report.status}
                      </span>
                    </td>

                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => setSelectedReportId(report.id)}
                        className="px-3 py-1 bg-white hover:bg-[#004d2c] hover:text-white text-[#004d2c] font-bold border border-slate-200 hover:border-[#004d2c] rounded-lg transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
