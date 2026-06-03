import type { FormEvent } from 'react';
import type { OgaAgent, OgaSubscription } from '../types';
import type { ModalActionType } from '../types';
import BanAgentModal from './modals/BanAgentModal';
import RejectVerificationModal from './modals/RejectVerificationModal';
import SuspendAgentModal from './modals/SuspendAgentModal';
import ReduceTrustScoreModal from './modals/ReduceTrustScoreModal';
import SubscriptionModal from './modals/SubscriptionModal';

interface ActionModalProps {
    activeModal: ModalActionType | null;
    modalTargetAgent: OgaAgent | null;
    modalTargetSubscription: OgaSubscription | null;
    modalReasonInput: string;
    modalScoreReduction: number;
    modalExtendValue: '1' | '3' | '6' | '12';
    onReasonChange: (value: string) => void;
    onScoreReductionChange: (value: number) => void;
    onExtendValueChange: (value: '1' | '3' | '6' | '12') => void;
    onClose: () => void;
    onConfirm: (event: FormEvent<HTMLFormElement>) => void;
}

export default function ActionModal({
    activeModal,
    modalTargetAgent,
    modalTargetSubscription,
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

    if (activeModal === 'ban') {
        return (
            <BanAgentModal
                agent={modalTargetAgent}
                modalReasonInput={modalReasonInput}
                onReasonChange={onReasonChange}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );
    }

    if (activeModal === 'reject') {
        return (
            <RejectVerificationModal
                agent={modalTargetAgent}
                modalReasonInput={modalReasonInput}
                onReasonChange={onReasonChange}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );
    }

    if (activeModal === 'suspend') {
        return (
            <SuspendAgentModal
                agent={modalTargetAgent}
                modalReasonInput={modalReasonInput}
                onReasonChange={onReasonChange}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );
    }

    if (activeModal === 'reduce') {
        return (
            <ReduceTrustScoreModal
                agent={modalTargetAgent}
                modalScoreReduction={modalScoreReduction}
                modalReasonInput={modalReasonInput}
                onScoreReductionChange={onScoreReductionChange}
                onReasonChange={onReasonChange}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );
    }

    if (activeModal === 'extendSub') {
        return (
            <SubscriptionModal
                subscription={modalTargetSubscription}
                modalExtendValue={modalExtendValue}
                onExtendValueChange={onExtendValueChange}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 space-y-4 animate-scale-up font-sans selection:bg-emerald-50 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                        Remove Property Listing
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 px-2 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                        type="button"
                    >
                        <span className="text-[16px]">×</span>
                    </button>
                </div>
                <form onSubmit={onConfirm} className="space-y-4 font-semibold">
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
                            className="flex-1 py-2 bg-[#004d2c] text-white rounded-lg cursor-pointer font-black transition-all text-center hover:bg-[#00381e] shadow-sm shadow-emerald-700/15"
                        >
                            Confirm action
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
