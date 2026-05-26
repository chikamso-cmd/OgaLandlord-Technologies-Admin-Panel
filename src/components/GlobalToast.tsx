import { CheckCircle } from 'lucide-react';

interface GlobalToastProps {
    message: string | null;
}

export default function GlobalToast({ message }: GlobalToastProps) {
    if (!message) return null;

    return (
        <div
            id="global-panel-toast"
            className="fixed bottom-6 right-6 p-4 py-3 bg-[#0a522f] text-white rounded-xl shadow-xl border border-[#0d6e3f] flex items-center gap-3 animate-slide-up z-50 text-xs font-bold font-sans selection:bg-none"
        >
            <CheckCircle size={15} className="text-emerald-300" />
            <span>{message}</span>
        </div>
    );
}
