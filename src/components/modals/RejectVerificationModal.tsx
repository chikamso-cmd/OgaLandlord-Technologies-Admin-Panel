import type { FormEvent } from 'react';
// import { X } from 'lucide-react';
import type { OgaAgent } from '../../types';
import ModalShell from './ModalShell';

interface RejectVerificationModalProps {
    agent: OgaAgent | null;
    modalReasonInput: string;
    onReasonChange: (value: string) => void;
    onClose: () => void;
    onConfirm: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RejectVerificationModal({
    agent,
    modalReasonInput,
    onReasonChange,
    onClose,
    onConfirm,
}: RejectVerificationModalProps) {
    const agentName = agent?.name ?? 'this agent';

    return (
        <ModalShell
            title="Reject Verification"
            description={`You are about to reject ${agentName}'s verification. This message will be sent to the agent and logged in the administration audit trail.`}
            onClose={onClose}
        >
            <form onSubmit={onConfirm} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Reason for verification rejection</label>
                    <textarea
                        value={modalReasonInput}
                        onChange={(event) => onReasonChange(event.target.value)}
                        rows={4}
                        required
                        placeholder="This will be sent to the agent..."
                        className="h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#004d2c] focus:bg-white"
                    />
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
                        Reject Verification
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}
