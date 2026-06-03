/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { FormEvent } from 'react';
import type { OgaSubscription } from '../../types';
import ModalShell from './ModalShell';

interface SubscriptionModalProps {
    subscription: OgaSubscription | null;
    modalExtendValue: '1' | '3' | '6' | '12';
    onExtendValueChange: (value: '1' | '3' | '6' | '12') => void;
    onClose: () => void;
    onConfirm: (event: FormEvent<HTMLFormElement>) => void;
}

export default function SubscriptionModal({
    subscription,
    modalExtendValue,
    onExtendValueChange,
    onClose,
    onConfirm,
}: SubscriptionModalProps) {
    if (!subscription) return null;

    return (
        <ModalShell
            title="Manage Subscription"
            //   description="Review subscription details and renew the agent plan from this panel."
            onClose={onClose}
        >
            <div className="space-y-5">
                <div className="rounded-lg mt-2 bg-slate-50  p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-900">Subscription Details</h3>
                    </div>
                    <dl className="grid gap-1 text-[10px] leading-6 text-slate-600">
                        <div className="flex items-center justify-between gap-3">
                            <dt className="font-semibold text-slate-700">Agent:</dt>
                            <dd className="text-right text-slate-900 font-semibold">{subscription.agentName}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <dt className="font-semibold text-slate-700">Plan:</dt>
                            <dd className="text-right text-slate-900 font-semibold">{subscription.plan}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <dt className="font-semibold text-slate-700">Amount:</dt>
                            <dd className="text-right text-slate-900 font-semibold">{subscription.amount}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <dt className="font-semibold text-slate-700">Expiry:</dt>
                            <dd className="text-right text-slate-900 font-semibold">{subscription.endDate}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <dt className="font-semibold text-slate-700">Status:</dt>
                            <dd>
                                <span
                                    className={`inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-semibold tracking-wide ${subscription.status === 'Active'
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                            : subscription.status === 'Expiring soon'
                                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                                : 'bg-red-50 text-red-600 border border-red-100'
                                        }`}
                                >
                                    {subscription.status}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>

                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-700">Extend Subscription</label>
                        <select
                            value={modalExtendValue}
                            onChange={(e) => onExtendValueChange(e.target.value as '1' | '3' | '6' | '12')}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-[#004d2c]"
                        >
                            <option value="1">1 Month extension (₦ 5,000)</option>
                            <option value="3">3 Months extension (₦ 12,500)</option>
                            <option value="6">6 Months extension (₦ 25,000)</option>
                            <option value="12">12 Months extension (₦ 50,000)</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#004d2c] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#00381e]"
                        >
                            Extend Subscription
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Resolve Payment Issue
                        </button>
                    </div>
                </form>
            </div>
        </ModalShell>
    );
}
