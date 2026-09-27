import { useMemo, useState, type FormEvent } from "react";
import { AlertTriangle, ArrowLeft, Loader } from "lucide-react";
import type { OgaAgent } from "../../types";
import ModalShell from "./ModalShell";
import api from "@/src/services/Axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

interface ReduceTrustScoreModalProps {
  agent: OgaAgent;
  // modalScoreReduction: number;
  // modalReasonInput: string;
  // onScoreReductionChange: (value: number) => void;
  // onReasonChange: (value: string) => void;
  onClose: () => void;
  // onConfirm: (event: FormEvent<HTMLFormElement>) => void;
}

const infractions = [
  { id: "1", label: "fraudulent_activity" },
  { id: "2", label: "misrepresentation_of_property" },
  { id: "3", label: "unprofessional_behavior" },
  { id: "4", label: "late_or_no_response" },
  { id: "5", label: "property_unavailable" },
  { id: "6", label: "pricing_issues" },
  { id: "7", label: "harassment_of_tenants" },
  { id: "8", label: "duplicate_listings" },
];
const severity = [
  { id: "1", severity_gravity: "high" },
  { id: "2", severity_gravity: "high" },
  { id: "3", severity_gravity: "medium" },
  { id: "4", severity_gravity: "low" },
  { id: "5", severity_gravity: "medium" },
  { id: "6", severity_gravity: "high" },
  { id: "7", severity_gravity: "low" },
  { id: "8", severity_gravity: "high" },
];

const severityClasses: Record<string, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-sky-100 text-sky-700",
};

export default function ReduceTrustScoreModal({
  agent,
  // modalScoreReduction,
  // modalReasonInput,
  // onScoreReductionChange,
  // onReasonChange,
  onClose,
  // onConfirm,
}: ReduceTrustScoreModalProps) {
  const [trustScoreInfarction, setTrustScoreInfarction] = useState<string>("");
  const [reasonsForReduction, setReasonsForReduction] = useState<string>("");
  const [trustScoreInfartionGravity, setTrustScoreInfartionGravity] =
    useState<string>("");
  const [trustScoreReductionNumber, settrustScoreReductionNumber] =
    useState<number>(0);
  const [loading, setLoading] = useState(false);

  const currentScore = agent?.data?.trustScore ?? 0;
  const newScore = Math.max(0, currentScore - trustScoreReductionNumber);
  const selectedList = useMemo(
    () =>
      infractions.filter((item) =>
        trustScoreInfarction?.includes(item.label.toLocaleLowerCase()),
      ),
    [trustScoreInfarction],
  );
  const selectedNumber = useMemo(
    () =>
      severity.filter((item) =>
        trustScoreInfartionGravity?.includes(item.severity_gravity),
      ),
    [trustScoreInfartionGravity],
  );
  const selectedInfraction = selectedList[0];
  const selectedGravity = selectedNumber[0];
  const canSubmit =
    Number.isFinite(trustScoreReductionNumber) &&
    trustScoreReductionNumber > 0 &&
    trustScoreInfarction.length > 0 &&
    reasonsForReduction.trim().length > 0;

  // agent id to append
  const agentId = agent?.data.id;
  // const toggleInfraction = (id: string) => {
  //   setTrustScoreInfraction((prev) =>
  //     prev?.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
  //   );
  // };

  const HandleResetTrustScore = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      toast.error("Please choose a valid reduction, infraction, and reason.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        trustScoreInfarction,
        reasonsForReduction,
        trustScoreReductionNumber,
        agentId: agentId,
        trustScoreInfartionGravity,
      };
      await api.patch(`/admin/reduced_trust_score`, payload);
      setReasonsForReduction("");
      setTrustScoreInfarction("");
      settrustScoreReductionNumber(0);
      toast.success("Trust score reduced successfully");
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to reduce trust score.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      className="h- "
      title="Reduce Trust Score"
      description="Trust score reductions are permanent and affect the agent's visibility and ranking on the platform."
      onClose={onClose}
    >
      <form onSubmit={HandleResetTrustScore} className="space-y-6  pr-1 ">
        <div className="rounded-3xl border border-slate-200 bg-orange-50 p-4 sm:p-5 mt-5 ">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Agent
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {agent.data?.name ?? "Unknown Agent"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Current Trust Score
              </p>
              <p className="mt-1 text-3xl font-black text-rose-600">
                {currentScore}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <label className="block text-sm font-semibold text-slate-800">
              Points to Reduce *
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={trustScoreReductionNumber || ""}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                settrustScoreReductionNumber(
                  Number.isNaN(nextValue) ? 0 : nextValue,
                );
              }}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#004d2c] focus:bg-white"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-sm font-semibold text-slate-800">
              Select Infractions *
            </p>
            <div className="mt-4 grid gap-3 grid-cols-1">
              <select
                value={selectedInfraction?.label || ""}
                onChange={(e) => setTrustScoreInfarction(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#004d2c]"
              >
                <option value="">Select an infraction</option>
                {infractions.map((item) => (
                  <option key={item.id} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
              {/* {infractions.map((item) => (
                <button
                  key={item.id}
                  value={item.id}
                  type="button"
                  onClick={() => toggleInfraction(item.id)}
                  className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    trustScoreInfraction.includes(item.label)
                      ? "border-[#004d2c] bg-emerald-50 text-slate-900 shadow-sm shadow-emerald-200/60"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))} */}
            </div>
            {/* select severety */}
            <p className="text-sm font-semibold text-slate-800 mt-5 px-3 ">
              Select severety *
            </p>
            <div className="mt-4 grid gap-3 grid-cols-1">
              <select
                value={selectedGravity?.severity_gravity ?? ""}
                onChange={(event) => {
                  setTrustScoreInfartionGravity(event.target.value);
                }}
                className={`rounded-xl border-gray-200 px-2.5 text-sm font-semibold border py-3 `}
              >
                <option value="">Select Infraction Gravity</option>
                {severity.map((item) => (
                  <option key={item.id} value={item.severity_gravity}>
                    {item.severity_gravity}
                  </option>
                ))}
              </select>
              {/* <select
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${severityClasses[item.severity]}`}
              ></select> */}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <AlertTriangle size={16} className="text-amber-500" />
              <p>
                Trust score reductions are permanent and affect the agent's
                visibility and ranking on the platform.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Reason for Reduction *
            </label>
            <textarea
              value={reasonsForReduction}
              onChange={(event) => setReasonsForReduction(event.target.value)}
              rows={4}
              required
              placeholder="Explain the reason for reducing the trust score. This will be logged and sent to the agent..."
              className="h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#004d2c]"
            />
          </div>

          <div className="flex items-center rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Current Score
              </p>
              <p className="text-xl font-semibold text-slate-900">
                {currentScore}
              </p>
            </div>
            <div><ArrowLeft size={20} className="rotate-180 text-gray-400"/></div>
            <div className="space-y-1 text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                New Score
              </p>
              <p className="text-xl font-semibold text-rose-600">{newScore}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={loading || !canSubmit}
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-red-600/10 transition hover:bg-red-700 sm:w-auto gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : ""}
            {loading ? "Reducing Score" : "Confirm Reduction"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
