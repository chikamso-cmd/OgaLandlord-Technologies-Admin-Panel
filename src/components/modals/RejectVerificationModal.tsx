import { useState, type FormEvent } from 'react';
// import { X } from 'lucide-react';
import type { OgaAgent } from '../../types';
import ModalShell from './ModalShell';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';
import api from '@/src/services/Axios';

interface RejectVerificationModalProps {
    agent: OgaAgent;
    modalReasonInput: string;
    onReasonChange: (value: string) => void;
    onClose: () => void;
    // onConfirm: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RejectVerificationModal({
    agent,
    modalReasonInput,
    onReasonChange,
    onClose,
    // onConfirm,
}: RejectVerificationModalProps) {
    const agentName = agent?.data?.name ?? 'this agent';

     const [loading, setLoading] = useState(false);
    
      const agentID = String(agent?.data?.id ?? "");
      const status = agent?.data?.verificationStatus ;
    
      const handleRejectAgent = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const trimmedReason = modalReasonInput.trim();
        if (!trimmedReason) {
          toast.error("Please provide a reason before banning this agent.");
          return;
        }
    
        setLoading(true);
    
        try {
          const payload = {
            status: "blocked",
            agentID,
            reason: trimmedReason,
          };
    
          await api.patch(
            `/admin/update_agent_verification_status`,
            payload,
          );
          console.log(payload, "ban payload");
          toast.success("Agent Verification Rejected Successfully");
        //   onClose();
        } catch (err: any) {
          const message =
            err?.response?.data?.message || err?.message || "Failed to ban agent.";
          toast.error(message);
        } finally {
          setLoading(false);
        }
      };

    return (
      <ModalShell
        title="Reject Verification"
        description={`You are about to reject ${agentName}'s verification. This message will be sent to the agent and logged in the administration audit trail.`}
        onClose={onClose}
      >
        <form onSubmit={handleRejectAgent} className="space-y-6">
          <div className="space-y-2 mt-5">
            <label className="block text-sm font-semibold text-slate-800">
              Reason for verification rejection
            </label>
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
            disabled={loading}
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-red-600/10 transition hover:bg-red-700 sm:w-auto gap-3"
            >
                {loading ? <Loader size={20} className='animate-spin'/> : ""}
              {loading ? "Rejecting Verification" : " Reject Verification"}
            </button>
          </div>
        </form>
      </ModalShell>
    );
}
