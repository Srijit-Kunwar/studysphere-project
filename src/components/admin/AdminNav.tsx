import React from 'react';
import {
  ShieldAlert,
  Building2,
  AlertOctagon,
  Settings,
  Sparkles,
  MapPin,
  LogOut,
  BarChart3,
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminNavProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout?: () => void;
  onSwitchToCustomer?: () => void;
  pendingVerificationsCount?: number;
  activeDisputesCount?: number;
}

export function AdminNav({
  currentTab,
  onTabChange,
  onLogout,
  onSwitchToCustomer,
  pendingVerificationsCount = 3,
  activeDisputesCount = 2,
}: AdminNavProps) {
  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Admin Badge */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => onTabChange('home')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1B4332] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-[#52B788]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#1B4332] tracking-tight font-serif">
                      StudySphere
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                      Platform Admin
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <MapPin className="w-3 h-3 text-[#1B4332]" />
                    <span className="font-medium">Jhapa & Birtamode Territory</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                type="button"
                id="admin-nav-home"
                onClick={() => onTabChange('home')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'home'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                id="admin-nav-owners"
                onClick={() => onTabChange('owners')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                  currentTab === 'owners'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Owner Verification</span>
                {pendingVerificationsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold leading-none">
                    {pendingVerificationsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                id="admin-nav-disputes"
                onClick={() => onTabChange('disputes')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                  currentTab === 'disputes'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Disputes</span>
                {activeDisputesCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold leading-none">
                    {activeDisputesCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                id="admin-nav-settings"
                onClick={() => onTabChange('settings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'settings'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {onLogout && (
                <button
                  type="button"
                  id="admin-nav-logout"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Log out of Admin Console"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Home, Owners, Disputes, Settings) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 pb- safe">
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'home' ? 'text-[#1B4332] font-bold' : 'text-stone-400 font-medium'
            }`}
          >
            <BarChart3 className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Overview</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('owners')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              currentTab === 'owners' ? 'text-[#1B4332] font-bold' : 'text-stone-400 font-medium'
            }`}
          >
            <Building2 className={`w-5 h-5 ${currentTab === 'owners' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Owners</span>
            {pendingVerificationsCount > 0 && (
              <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('disputes')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              currentTab === 'disputes' ? 'text-[#1B4332] font-bold' : 'text-stone-400 font-medium'
            }`}
          >
            <AlertOctagon className={`w-5 h-5 ${currentTab === 'disputes' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Disputes</span>
            {activeDisputesCount > 0 && (
              <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('settings')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'settings' ? 'text-[#1B4332] font-bold' : 'text-stone-400 font-medium'
            }`}
          >
            <Settings className={`w-5 h-5 ${currentTab === 'settings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
}
