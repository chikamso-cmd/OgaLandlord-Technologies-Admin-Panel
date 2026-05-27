import { CheckSquare, Square } from 'lucide-react';

interface NotificationPreferenceToggleProps {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}

export default function NotificationPreferenceToggle({
    label,
    description,
    enabled,
    onToggle,
}: NotificationPreferenceToggleProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="w-full text-left flex items-start gap-3 select-none cursor-pointer text-xs font-semibold"
        >
            {enabled ? (
                <CheckSquare size={16} className="text-[#004d2c] mt-0.5" />
            ) : (
                <Square size={16} className="text-slate-300 mt-0.5" />
            )}
            <div>
                <span className="text-slate-800 font-bold block">{label}</span>
                <p className="text-[10px] text-slate-400 leading-normal font-medium">{description}</p>
            </div>
        </button>
    );
}
