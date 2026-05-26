/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Sparkles, Home, MapPin, Key } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@ogalandlord.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent):any => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onLogin(email);
  };

  return (
    <div id="login-container" className="min-h-screen bg-[#f3faf6] flex flex-col justify-between items-center p-6 relative overflow-hidden">
      {/* Decorative background icons */}
      <div className="absolute top-1/4 left-12 text-[#d1ebd9] opacity-40 select-none hidden md:block">
        <MapPin size={120} />
      </div>
      <div className="absolute top-16 right-16 text-[#d1ebd9] opacity-40 select-none hidden md:block">
        <Key size={100} className="rotate-45" />
      </div>
      <div className="absolute bottom-1/4 right-12 text-[#d1ebd9] opacity-40 select-none hidden md:block">
        <Home size={110} />
      </div>

      {/* Decorative alignment space */}
      <div className="h-4"></div>

      {/* Content Form box */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-green-950/5 border border-slate-100 p-8 z-10 transition-all">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-[#004d2c] rounded-xl flex items-center justify-center text-white mb-4 shadow-md shadow-green-900/10">
            <img src="/public/housekey.png" alt="ogalandlord logo icon" className='w-6'/>
          </div>
          <h1 className="text-2xl font-bold text-[#004d2c] tracking-tight">
            OgaLandlord Admin Panel
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to access the admin panel
          </p>
        </div>

        {error && (
          <div id="login-error" className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 align-middle">
              Organization mail <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={16} />
              </span>
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-sm text-slate-800 rounded-lg border border-slate-200 outline-none focus:border-[#004d2c] focus:ring-1 focus:ring-[#004d2c] transition-all"
                placeholder="admin@ogalandlord.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={16} />
              </span>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-sm text-slate-800 rounded-lg border border-slate-200 outline-none focus:border-[#004d2c] focus:ring-1 focus:ring-[#004d2c] transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => alert("Please contact organizational IT layout to reset your secure administrator key.")}
              className="text-xs font-semibold text-[#004d2c] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            id="login-submit-button"
            type="submit"
            className="w-full py-3 bg-[#004d2c] hover:bg-[#003d22] active:scale-[0.99] text-white text-sm font-semibold rounded-lg shadow-md shadow-green-950/10 cursor-pointer transition-all"
          >
            Log In
          </button>
        </form>
      </div>

      {/* Footer lock statement */}
      <p className="text-[11px] text-slate-400 tracking-wide text-center uppercase py-4">
        Internal use only. Authorized personnel only.
      </p>
    </div>
  );
}
