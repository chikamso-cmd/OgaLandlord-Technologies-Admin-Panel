/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Settings, Lock, Users } from 'lucide-react';
import { OgaAdminUser } from '../types';
import InviteAdminForm from './settings/InviteAdminForm';
import NotificationPreferenceToggle from './settings/NotificationPreferenceToggle';

interface SettingsViewProps {
  adminUsers: OgaAdminUser[];
  onInviteAdmin: (email: string, role: 'Super Admin' | 'Moderator' | 'Admin') => void;
  onShowToast: (message: string) => void;
}

export default function SettingsView({
  adminUsers,
  onInviteAdmin,
  onShowToast
}: SettingsViewProps) {
  // Passwords state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Super Admin' | 'Moderator' | 'Admin'>('Admin');

  // Preferences checkbox preferences
  const [preferences, setPreferences] = useState({
    verificationRequests: true,
    newReports: true,
    subExpirations: true,
    suspiciousActivity: true,
    listingApprovals: false
  });

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill out all fields to perform password updates.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Confirmation passwords do not match. Review values.');
      return;
    }
    onShowToast('Secure Administrator password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    onInviteAdmin(inviteEmail, inviteRole);
    onShowToast(`Administrative invitation dispatched to: ${inviteEmail}`);
    setInviteEmail('');
  };

  const handleTogglePref = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const handleSavePreferences = () => {
    onShowToast('Notification system guidelines stored successfully.');
  };

  return (
    <div id="settings-view" className="space-y-6">

      {/* Settings Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Side: Password and Notify settings */}
        <div className="lg:col-span-7 space-y-6">

          {/* Change Password Box */}
          <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Lock size={14} className="text-slate-400" />
              <span>Change Security Password</span>
            </h4>

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 mb-1.5 font-bold">Current Administrator Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-none focus:border-[#004d2c] text-slate-800 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1.5 font-bold">New Secure Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-none focus:border-[#004d2c] text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5 font-bold">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-none focus:border-[#004d2c] text-slate-800 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#004d2c] hover:bg-[#00381e] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>

          <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Settings size={14} className="text-slate-400" />
              <span>Real-time System Audit Alerts</span>
            </h4>

            <div className="space-y-3.5 pt-1.5">
              <NotificationPreferenceToggle
                label="Agent License Verification Submissions"
                description="Flag immediate alert when new agents register government files in system."
                enabled={preferences.verificationRequests}
                onToggle={() => handleTogglePref('verificationRequests')}
              />
              <NotificationPreferenceToggle
                label="Tenant Scam Reports and Disputes"
                description="Blink warning ribbon on dashboard when malicious fraudulent agents are flagged."
                enabled={preferences.newReports}
                onToggle={() => handleTogglePref('newReports')}
              />
              <NotificationPreferenceToggle
                label="Subscription Expirers alert"
                description="Email weekly warnings to operators containing licenses expiring within 72 hours."
                enabled={preferences.subExpirations}
                onToggle={() => handleTogglePref('subExpirations')}
              />
              <NotificationPreferenceToggle
                label="Multiple IP / Geo locations detections"
                description="Suspend agent profiles on platform automatically during rapid geographic logins mismatch."
                enabled={preferences.suspiciousActivity}
                onToggle={() => handleTogglePref('suspiciousActivity')}
              />
            </div>

            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 bg-[#004d2c] hover:bg-[#00381e] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer block"
            >
              Save Preferences
            </button>
          </div>

        </div>

        {/* Right Side: Invite & Administrators Panel List */}
        <div className="lg:col-span-5 space-y-6">

          <InviteAdminForm
            inviteEmail={inviteEmail}
            inviteRole={inviteRole}
            onEmailChange={setInviteEmail}
            onRoleChange={setInviteRole}
            onSubmit={handleInviteSubmit}
          />

          {/* Active Admins roster list */}
          <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Users size={14} className="text-slate-400" />
              <span>Active Administrators ({adminUsers.length})</span>
            </h4>

            <div className="space-y-3 pt-1.5">
              {adminUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-none last:pb-0 font-semibold text-xs text-slate-700"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#004d2c] font-black flex items-center justify-center border border-emerald-100 flex-shrink-0 uppercase">
                      {user.name.split(' ').map(s => s[0]).join('')}
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-extrabold p-0.5 text-slate-800 leading-tight block truncate">{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium block truncate leading-none mt-0.5">{user.email}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest ${user.role === 'Super Admin'
                      ? 'bg-[#004d2c] text-white'
                      : user.role === 'Moderator'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
