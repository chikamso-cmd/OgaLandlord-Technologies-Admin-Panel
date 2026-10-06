import { useState, type FormEvent } from 'react';
import type { OgaAgent } from '../../types';
import ModalShell from './ModalShell';
import { toast } from 'react-toastify';
import api from '@/src/services/Axios';
import { Loader } from 'lucide-react';

interface SuspendAgentModalProps {
    agent: OgaAgent ;
    modalReasonInput: string;
    onReasonChange: (value: string) => void;
    onClose: () => void;
    // onConfirm: (event: FormEvent<HTMLFormElement>) => void;
}

const suspensionOptions = [
    { label: '3 days', value: '3' },
    { label: '7 days', value: '7' },
    { label: '10 days', value: '10' },
    { label: '14 days', value: '14' },
];

export default function SuspendAgentModal({
    agent,
    modalReasonInput,
    onReasonChange,
    onClose,
    // onConfirm,
}: SuspendAgentModalProps) {
    const [duration, setDuration] = useState('10');
    const agentName = agent?.data?.name ?? 'the agent';
     const [loading, setLoading] = useState(false);

     const agentID = String(agent?.data?.id ?? "");
     const status = agent?.data?.verificationStatus;

     const handleSuspendAgent = async (event: FormEvent<HTMLFormElement>) => {
       event.preventDefault();

       const trimmedReason = modalReasonInput.trim();
       if (!trimmedReason) {
         toast.error("Please provide a reason before banning this agent.");
         return;
       }

       setLoading(true);

       try {
         const payload = {
           status:"suspend",
           agentID,
           reason: trimmedReason,
         };

         await api.patch(`/admin/update_agent_verification_status`, payload);
         console.log(payload, "ban payload");
         toast.success("Agent Verification Rejected Successfully");
         //   onClose();
       } catch (err: any) {
         const message =
           err?.response?.data?.message ||
           err?.message ||
           "Failed to ban agent.";
         toast.error(message);
       } finally {
         setLoading(false);
       }
     };


    return (
      <ModalShell
        title="Suspend Agent"
        description={`Suspend ${agentName} from the platform. During suspension, the agent will not be able to create or manage listings.`}
        onClose={onClose}
      >
        <form onSubmit={handleSuspendAgent} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_1.5fr] mt-5">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-800">
                Suspension Duration
              </span>
              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#004d2c] focus:bg-white"
              >
                {suspensionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Reason for Suspension
            </label>
            <textarea
              value={modalReasonInput}
              onChange={(event) => onReasonChange(event.target.value)}
              rows={4}
              required
              placeholder="This will be sent to the agent..."
              className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#004d2c] focus:bg-white"
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
              className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-700/10 transition hover:bg-[#00381e] sm:w-auto"
            >
              {loading ? <Loader size={20} className="animate-spin"/> : ""}
              {loading ? "Suspending Agent" : "Suspend Agent"}
            </button>
          </div>
        </form>
      </ModalShell>
    );
}
