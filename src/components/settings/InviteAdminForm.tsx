import type { FormEvent } from 'react';
import { Mail, Plus } from 'lucide-react';

interface InviteAdminFormProps {
    inviteEmail: string;
    inviteRole: 'Super Admin' | 'Moderator' | 'Admin';
    onEmailChange: (value: string) => void;
    onRoleChange: (value: 'Super Admin' | 'Moderator' | 'Admin') => void;
    onSubmit: (event: FormEvent) => void;
}

export default function InviteAdminForm({
    inviteEmail,
    inviteRole,
    onEmailChange,
    onRoleChange,
    onSubmit,
}: InviteAdminFormProps) {
    return (
        <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Mail size={14} className="text-[#004d2c]" />
                <span>Invite New Admin Officer</span>
            </h4>

            <form onSubmit={onSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                    <label className="block text-slate-500 mb-1.5 font-bold">Email Address ID</label>
                    <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder="officer@ogalandlord.com"
                        className="w-full p-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-none focus:border-[#004d2c] text-slate-800 transition-all font-medium"
                    />
                </div>

                <div>
                    <label className="block text-slate-500 mb-1.5 font-bold">Privilege Role</label>
                    <select
                        value={inviteRole}
                        onChange={(e) => onRoleChange(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 text-slate-700 font-semibold outline-none focus:border-[#004d2c] rounded-lg cursor-pointer"
                    >
                        <option value="Admin">Moderator Compliance (Admin)</option>
                        <option value="Moderator">System Operations (Moderator)</option>
                        <option value="Super Admin">Organization Root (Super Admin)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-[#004d2c] border border-[#004d2c] hover:border-[#00381e] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 leading-none font-black"
                    style={{ borderWidth: '2px' }}
                >
                    <Plus size={13} strokeWidth={3} />
                    <span>Send Invite</span>
                </button>
            </form>
        </div>
    );
}
