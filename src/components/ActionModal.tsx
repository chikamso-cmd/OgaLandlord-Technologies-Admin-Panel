import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ModalActionType } from '../types';

interface ActionModalProps {
    activeModal: ModalActionType | null;
    modalReasonInput: string;
    modalScoreReduction: number;
    modalExtendValue: '1' | '3' | '6' | '12';
    onReasonChange: (value: string) => void;
    onScoreReductionChange: (value: number) => void;
    onExtendValueChange: (value: '1' | '3' | '6' | '12') => void;
    onClose: () => void;
    onConfirm: (event: React.FormEvent<HTMLFormElement>) => void;
}

const modalTitles: Record<ModalActionType, string> = {
    ban: 'Ban Agent Permanently',
    reduce: 'Reduce Trust Score',
    suspend: 'Suspend Agent Profile',
    reject: 'Reject Credentials',
    remove: 'Remove Property Listing',
    extendSub: 'Renew Agent License',
};

export default function ActionModal({
    activeModal,
    modalReasonInput,
    modalScoreReduction,
    modalExtendValue,
    onReasonChange,
    onScoreReductionChange,
    onExtendValueChange,
    onClose,
    onConfirm,
}: ActionModalProps) {
    if (!activeModal) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 space-y-4 animate-scale-up font-sans selection:bg-emerald-50 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                        {modalTitles[activeModal]}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 px-2 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                        type="button"
                    >
                        <X size={15} />
                    </button>
                </div>

                <form onSubmit={onConfirm} className="space-y-4 font-semibold">
                    {activeModal === 'reduce' && (
                        <div>
                            <label className="block text-slate-500 mb-1.5 font-bold">Penalize trust score points by:</label>
                            <select
                                value={modalScoreReduction}
                                onChange={(e) => onScoreReductionChange(parseInt(e.target.value, 10))}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800 cursor-pointer"
                            >
                                <option value={5}>- 5 points index penalty</option>
                                <option value={10}>- 10 points index penalty (Default)</option>
                                <option value={20}>- 20 points High penalty</option>
                                <option value={50}>- 50 points Severe penalty</option>
                            </select>
                        </div>
                    )}

                    {activeModal === 'extendSub' && (
                        <div>
                            <label className="block text-slate-500 mb-1.5 font-bold">Extension Duration period:</label>
                            <select
                                value={modalExtendValue}
                                onChange={(e) => onExtendValueChange(e.target.value as '1' | '3' | '6' | '12')}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800 cursor-pointer"
                            >
                                <option value="1">Extend by 1 Month (₦ 5,000)</option>
                                <option value="3">Extend by 3 Months (₦ 12,500)</option>
                                <option value="6">Extend by 6 Months (₦ 25,000)</option>
                                <option value="12">Extend by 12 Months (₦ 50,000)</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-slate-500 mb-1.5 font-bold">
                            Reason justification <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={modalReasonInput}
                            onChange={(e) => onReasonChange(e.target.value)}
                            placeholder="Insert secure justification notes verifying compliance rules..."
                            rows={3}
                            required
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#004d2c] font-medium text-slate-800 transition-all resize-none"
                        />
                    </div>

                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2.5">
                        <AlertTriangle size={15} className="text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-amber-700 leading-normal font-medium">
                            Confirming this action immediately commits updates to the database registry and triggers push notifications to the agent.
                        </p>
                    </div>

                    <div className="flex gap-2.5 pt-2 border-t border-slate-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 bg-white text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer font-bold transition-all text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 py-2 text-white rounded-lg cursor-pointer font-black transition-all text-center ${activeModal === 'ban' || activeModal === 'reject' || activeModal === 'remove'
                                    ? 'bg-red-600 hover:bg-red-700 shadow-sm shadow-red-700/15'
                                    : 'bg-[#004d2c] hover:bg-[#00381e] shadow-sm shadow-emerald-700/15'
                                }`}
                        >
                            Confirm action
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
