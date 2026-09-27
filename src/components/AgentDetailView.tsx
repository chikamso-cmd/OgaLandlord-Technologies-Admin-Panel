import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Loader } from "lucide-react";
import ActionModal from "./ActionModal";
import AgentActionPanel from "./agents/AgentActionPanel";
import AgentDetailBody from "./agents/AgentDetailBody";
import AgentDetailHeader from "./agents/AgentDetailHeader";
import { initialAgents, initialListings } from "../data";
import useProperties from "../hooks/useProperties";
import type { OgaAgent } from "../types";

export default function AgentDetailView() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { data: fetchedAgents, isLoading, isError, error } = useProperties();
  const [agents, setAgents] = useState<OgaAgent[]>(initialAgents);
  const [activeModal, setActiveModal] = useState<
    "ban" | "reduce" | "suspend" | "reject" | null
  >(null);
  const [modalReason, setModalReason] = useState("");
  const [scoreReduction, setScoreReduction] = useState(10);

  useEffect(() => {
    if (fetchedAgents) setAgents(fetchedAgents);
  }, [fetchedAgents]);

  const agent = agents.find((item) => item?.data?.id === Number(agentId));

  const openModal = (type: "ban" | "reduce" | "suspend" | "reject") => {
    setActiveModal(type);
    setModalReason("");
    setScoreReduction(10);
  };

  const closeModal = () => setActiveModal(null);

  //   const confirmModal = (event: FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     if (!activeModal || !agentId) return;

  //     setAgents((current) =>
  //       current.map((item) => {
  //         if (item.data.id !== agentId) return item;
  //         if (
  //           activeModal === "ban" ||
  //           activeModal === "suspend" ||
  //           activeModal === "reject"
  //         ) {
  //           return {
  //             ...item,
  //             data: {
  //               ...item.data,
  //               verificationStatus: "Blocked",
  //               ...(activeModal === "ban"
  //                 ? { trustScore: 0, activeListingsCount: 0 }
  //                 : {}),
  //             },
  //           };
  //         }

  //         const reduction = Math.round(scoreReduction / 2);
  //         return {
  //           ...item,
  //           data: {
  //             ...item.data,
  //             trustScore: Math.max(0, item.data.trustScore - scoreReduction),
  //             responseTime: Math.max(0, item.data.responseTime - reduction),
  //             clientSatisfaction: Math.max(
  //               0,
  //               item.data.clientSatisfaction - reduction,
  //             ),
  //           },
  //         };
  //       }),
  //     );
  //     closeModal();
  //   };

  if (isLoading) {
    return (
      <div className="py-20 text-center font-bold flex items-center gap-3 justify-center text-emerald-800">
        <Loader size={20} className="animate-spin" /> Loading agent...
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

  if (!agent) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="font-bold text-slate-700">Agent not found.</p>
        <button
          type="button"
          onClick={() => navigate("/agents")}
          className="text-sm font-bold text-emerald-800 hover:underline"
        >
          Back to agents
        </button>
      </div>
    );
  }

  return (
    <div id="agent-detail-wrapper" className="space-y-6">
      <AgentDetailHeader agent={agent} onBack={() => navigate("/agents")} />
      <AgentActionPanel
        agent={agent}
        onTriggerModal={openModal}
        onApproveVerification={(id) =>
          setAgents((current) =>
            current.map((item) =>
              item.data.id === id
                ? {
                    ...item,
                    data: {
                      ...item.data,
                      verificationStatus: "Verified",
                      trustScore: 90,
                    },
                  }
                : item,
            ),
          )
        }
        onResetTrustScore={() => undefined}
      />
      <AgentDetailBody
        agent={agent}
        listings={initialListings.filter(
          (listing) => listing.agentId === agent.data.id,
        )}
      />
      <ActionModal
        activeModal={activeModal}
        modalTargetAgent={agent}
        modalReasonInput={modalReason}
        modalScoreReduction={scoreReduction}
        modalExtendValue="3"
        onReasonChange={setModalReason}
        onScoreReductionChange={setScoreReduction}
        onExtendValueChange={() => undefined}
        onClose={closeModal}
        // onConfirm={confirmModal}
      />
    </div>
  );
}
