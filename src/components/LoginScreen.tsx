import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Store,
  ShieldCheck,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../types';
import { StudySphereLogo } from './StudySphereLogo';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'alert') => void;
}

export function LoginScreen({ onLogin, onShowToast }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // Mock Google Authentication Handler
  const handleGoogleSignIn = () => {
    setIsGoogleSigningIn(true);
    if (onShowToast) {
      onShowToast(
        'Signed in with Google',
        'Authenticated as Ramesh Adhikari (ramesh.adhikari@gmail.com)',
        'success'
      );
    }
    setTimeout(() => {
      setIsGoogleSigningIn(false);
      onLogin(selectedRole);
    }, 400);
  };

  const handleContinue = () => {
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between items-center px-4 py-8 sm:py-12 font-['Poppins',sans-serif] antialiased">
      {/* Top Spacer */}
      <div className="w-full max-w-md mx-auto" />

      {/* Center Auth Card */}
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1B4332] text-white shadow-sm ring-4 ring-emerald-900/10 mb-1 p-2.5">
            <StudySphereLogo className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] tracking-tight font-serif">
              StudySphere
            </h1>
            <p className="text-xs sm:text-sm font-medium text-stone-600 mt-1">
              Find your focus in Birtamode
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-[#1B4332]">
            <MapPin className="w-3 h-3 text-[#1B4332]" />
            <span>Muktinath Chowk • Bhadrapur Rd • Sanischare Rd</span>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5">
          {/* Mock Continue with Google Button */}
          <div>
            <button
              type="button"
              id="login-google-btn"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSigningIn}
              className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 active:scale-[0.99] text-stone-800 font-semibold text-xs sm:text-sm rounded-2xl border border-stone-300 shadow-2xs flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              {/* Google G Logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isGoogleSigningIn ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-stone-200" />
            <span className="absolute bg-white px-3 text-[11px] font-medium text-stone-400 uppercase tracking-wider">
              or select workspace role
            </span>
          </div>

          {/* Segmented Role Selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Account Role
            </label>
            <div
              id="login-role-segmented"
              className="grid grid-cols-3 p-1.5 bg-[#F4F3EE] rounded-2xl border border-stone-200 gap-1"
            >
              <button
                type="button"
                id="role-select-customer"
                onClick={() => setSelectedRole('customer')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'customer'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                id="role-select-owner"
                onClick={() => setSelectedRole('owner')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'owner'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span className="truncate">Café Owner</span>
              </button>

              <button
                type="button"
                id="role-select-admin"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Role Context Hint */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-[11px] text-stone-600 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332] shrink-0 mt-0.5" />
              <div>
                {selectedRole === 'customer' && (
                  <span>
                    <strong>Student & Professional Mode:</strong> Book quiet desks, view real-time seat availability, and manage digital passes.
                  </span>
                )}
                {selectedRole === 'owner' && (
                  <span>
                    <strong>Venue Operator Mode:</strong> Manage Mechi Study Pavilion zones, log walk-in guests, and inspect live floor map seats.
                  </span>
                )}
                {selectedRole === 'admin' && (
                  <span>
                    <strong>Platform Oversight Mode:</strong> Audit Birtamode partner document verifications (PAN, Lease) and resolve user disputes.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            id="login-continue-btn"
            onClick={handleContinue}
            className="w-full py-3.5 px-5 bg-[#1B4332] hover:bg-[#2D6A4F] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>
              {selectedRole === 'customer' && 'Continue to StudySphere'}
              {selectedRole === 'owner' && 'Continue to Owner Dashboard'}
              {selectedRole === 'admin' && 'Continue to Admin Console'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Security & Region Notice */}
        <p className="text-center text-[11px] text-stone-400">
          StudySphere Birtamode • Solar Backup & High-Speed Optical Wi-Fi
        </p>
      </div>

      {/* Bottom Footer */}
      <footer className="w-full max-w-md mx-auto text-center pt-6 text-[11px] text-stone-400">
        © 2026 StudySphere Technologies Nepal. All rights reserved.
      </footer>
    </div>
  );
}
