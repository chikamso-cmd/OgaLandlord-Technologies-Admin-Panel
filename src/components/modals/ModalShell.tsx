import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalShellProps {
    title: string;
    description?: string;
    children: ReactNode;
    onClose: () => void;
}

export default function ModalShell({
    title,
    description,
    children,
    onClose,
}: ModalShellProps) {
    return (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-lg sm:max-w-xl max-h-[calc(100vh-3rem)] overflow-hidden rounded-[28px] bg-white border border-slate-200 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
                    <div className="space-y-2">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">{title}</h2>
                        {description ? (
                            <p className="text-sm leading-6 text-slate-600">{description}</p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 overflow-y-auto max-h-[calc(100vh-16rem)]">{children}</div>
            </div>
        </div>
    );
}
