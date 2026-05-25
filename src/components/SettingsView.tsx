/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ShieldCheck, Settings, Lock, Plus, Users, CheckSquare, Square } from 'lucide-react';
import { OgaAdminUser } from '../types';

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

          {/* Notification System Prefs Box */}
          <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Settings size={14} className="text-slate-400" />
              <span>Real-time System Audit Alerts</span>
            </h4>

            <div className="space-y-3.5 pt-1.5">
              <button
                type="button"
                onClick={() => handleTogglePref('verificationRequests')}
                className="w-full text-left flex items-start gap-3 select-none cursor-pointer text-xs font-semibold"
              >
                {preferences.verificationRequests ? (
                  <CheckSquare size={16} className="text-[#004d2c] mt-0.5" />
                ) : (
                  <Square size={16} className="text-slate-300 mt-0.5" />
                )}
                <div>
                  <span className="text-slate-800 font-bold block">Agent License Verification Submissions</span>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">Flag immediate alert when new agents register government files in system.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTogglePref('newReports')}
                className="w-full text-left flex items-start gap-3 select-none cursor-pointer text-xs font-semibold"
              >
                {preferences.newReports ? (
                  <CheckSquare size={16} className="text-[#004d2c] mt-0.5" />
                ) : (
                  <Square size={16} className="text-slate-300 mt-0.5" />
                )}
                <div>
                  <span className="text-slate-800 font-bold block">Tenant Scam Reports and Disputes</span>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">Blink warning ribbon on dashboard when malicious fraudulent agents are flagged.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTogglePref('subExpirations')}
                className="w-full text-left flex items-start gap-3 select-none cursor-pointer text-xs font-semibold"
              >
                {preferences.subExpirations ? (
                  <CheckSquare size={16} className="text-[#004d2c] mt-0.5" />
                ) : (
                  <Square size={16} className="text-slate-300 mt-0.5" />
                )}
                <div>
                  <span className="text-slate-800 font-bold block">Subscription Expirers alert</span>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">Email weekly warnings to operators containing licenses expiring within 72 hours.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTogglePref('suspiciousActivity')}
                className="w-full text-left flex items-start gap-3 select-none cursor-pointer text-xs font-semibold"
              >
                {preferences.suspiciousActivity ? (
                  <CheckSquare size={16} className="text-[#004d2c] mt-0.5" />
                ) : (
                  <Square size={16} className="text-slate-300 mt-0.5" />
                )}
                <div>
                  <span className="text-slate-800 font-bold block">Multiple IP / Geo locations detections</span>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">Suspend agent profiles on platform automatically during rapid geographic logins mismatch.</p>
                </div>
              </button>
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
          
          {/* Invite Admin Form */}
          <div className="bg-white p-5 rounded-xl border border-emerald-950/5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Mail size={14} className="text-[#004d2c]" />
              <span>Invite New Admin Officer</span>
            </h4>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 mb-1.5 font-bold">Email Address ID</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="officer@ogalandlord.com"
                  className="w-full p-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-none focus:border-[#004d2c] text-slate-800 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1.5 font-bold">Privilege Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
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
                      {user.name.split(' ').map(s=>s[0]).join('')}
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-extrabold p-0.5 text-slate-800 leading-tight block truncate">{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium block truncate leading-none mt-0.5">{user.email}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest ${
                    user.role === 'Super Admin'
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
