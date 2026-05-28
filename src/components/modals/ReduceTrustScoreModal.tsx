import { useMemo, useState, type FormEvent } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { OgaAgent } from '../../types';
import ModalShell from './ModalShell';

interface ReduceTrustScoreModalProps {
    agent: OgaAgent | null;
    modalScoreReduction: number;
    modalReasonInput: string;
    onScoreReductionChange: (value: number) => void;
    onReasonChange: (value: string) => void;
    onClose: () => void;
    onConfirm: (event: FormEvent<HTMLFormElement>) => void;
}

const infractions = [
    { id: 'fraud', label: 'Fraudulent Activity', severity: 'high' },
    { id: 'misinfo', label: 'Misrepresentation of Property', severity: 'high' },
    { id: 'unprofessional', label: 'Unprofessional Behavior', severity: 'medium' },
    { id: 'late', label: 'Late/No Response', severity: 'low' },
    { id: 'unavailable', label: 'Property Unavailable', severity: 'medium' },
    { id: 'pricing', label: 'Pricing Issues', severity: 'low' },
    { id: 'harassment', label: 'Harassment of Tenants', severity: 'high' },
    { id: 'duplicate', label: 'Duplicate Listings', severity: 'low' },
];

const severityClasses: Record<string, string> = {
    high: 'bg-rose-100 text-rose-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-sky-100 text-sky-700',
};

export default function ReduceTrustScoreModal({
    agent,
    modalScoreReduction,
    modalReasonInput,
    onScoreReductionChange,
    onReasonChange,
    onClose,
    onConfirm,
}: ReduceTrustScoreModalProps) {
    const [selectedInfractions, setSelectedInfractions] = useState<string[]>(['fraud']);

    const currentScore = agent?.trustScore ?? 0;
    const newScore = Math.max(0, currentScore - modalScoreReduction);

    const selectedList = useMemo(
        () => infractions.filter((item) => selectedInfractions.includes(item.id)),
        [selectedInfractions]
    );

    const toggleInfraction = (id: string) => {
        setSelectedInfractions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <ModalShell
            title="Reduce Trust Score"
            description="Trust score reductions are permanent and affect the agent's visibility and ranking on the platform."
            onClose={onClose}
        >
            <form onSubmit={onConfirm} className="space-y-6 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
                <div className="rounded-3xl border border-slate-200 bg-orange-50 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Agent</p>
                            <p className="mt-1 text-base font-semibold text-slate-900">{agent?.name ?? 'Unknown Agent'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current Trust Score</p>
                            <p className="mt-1 text-3xl font-black text-rose-600">{currentScore}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                        <label className="block text-sm font-semibold text-slate-800">Points to Reduce *</label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={modalScoreReduction}
                            onChange={(event) => onScoreReductionChange(Number(event.target.value))}
                            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#004d2c] focus:bg-white"
                        />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                        <p className="text-sm font-semibold text-slate-800">Select Infractions *</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {infractions.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => toggleInfraction(item.id)}
                                    className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${selectedInfractions.includes(item.id)
                                            ? 'border-[#004d2c] bg-emerald-50 text-slate-900 shadow-sm shadow-emerald-200/60'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <span>{item.label}</span>
                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${severityClasses[item.severity]}`}>
                                        {item.severity}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                        <div className="flex items-center gap-3 text-sm text-slate-700">
                            <AlertTriangle size={16} className="text-amber-500" />
                            <p>Trust score reductions are permanent and affect the agent's visibility and ranking on the platform.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Reason for Reduction *</label>
                        <textarea
                            value={modalReasonInput}
                            onChange={(event) => onReasonChange(event.target.value)}
                            rows={4}
                            required
                            placeholder="Explain the reason for reducing the trust score. This will be logged and sent to the agent..."
                            className="h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#004d2c]"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1fr_1fr] rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current Score</p>
                            <p className="text-xl font-semibold text-slate-900">{currentScore}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">New Score</p>
                            <p className="text-xl font-semibold text-rose-600">{newScore}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-red-600/10 transition hover:bg-red-700 sm:w-auto"
                    >
                        Confirm Reduction
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}
