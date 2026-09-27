import type { FormEvent } from 'react';
import type { OgaAgent } from '../types';
import type { ModalActionType } from '../types';
import BanAgentModal from './modals/BanAgentModal';
import RejectVerificationModal from './modals/RejectVerificationModal';
import SuspendAgentModal from './modals/SuspendAgentModal';
import ReduceTrustScoreModal from './modals/ReduceTrustScoreModal';

interface ActionModalProps {
    activeModal: ModalActionType | null;
    modalTargetAgent: OgaAgent;
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
    modalReasonInput,
    // modalScoreReduction,
    // modalExtendValue,
    onReasonChange,
    // onScoreReductionChange,
    // onExtendValueChange,
    onClose,
    // onConfirm,
}: ActionModalProps) {
    if (!activeModal) return null;

    if (activeModal === 'ban') {
        return (
            <BanAgentModal
                agent={modalTargetAgent}
                modalReasonInput={modalReasonInput}
                onReasonChange={onReasonChange}
                onClose={onClose}
                // onConfirm={onConfirm}
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
                // onConfirm={onConfirm}
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
                // onConfirm={onConfirm}
            />
        );
    }

    if (activeModal === 'reduce') {
        return (
            <ReduceTrustScoreModal
                agent={modalTargetAgent}
                // modalScoreReduction={modalScoreReduction}
                // modalReasonInput={modalReasonInput}
                // onScoreReductionChange={onScoreReductionChange}
                // onReasonChange={onReasonChange}
                onClose={onClose}
                // onConfirm={onConfirm}
            />
        );
    }

    return null;
}
