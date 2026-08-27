import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck2,
  Grid,
  Layers,
  UserPlus,
  Settings,
  Sparkles,
  MapPin,
  LogOut,
} from 'lucide-react';
import { OwnerTab } from '../../types';

interface OwnerNavProps {
  currentTab: OwnerTab;
  onTabChange: (tab: OwnerTab) => void;
  onLogout?: () => void;
  onSwitchToCustomer?: () => void;
  pendingCount?: number;
}

export function OwnerNav({
  currentTab,
  onTabChange,
  onLogout,
  onSwitchToCustomer,
  pendingCount = 2,
}: OwnerNavProps) {
  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Venue Title */}
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
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#1B4332] border border-emerald-200">
                      Owner Portal
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <MapPin className="w-3 h-3 text-[#1B4332]" />
                    <span className="font-medium truncate max-w-[200px] sm:max-w-xs">
                      Mechi Study Pavilion • Muktinath Chowk
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                type="button"
                id="owner-nav-home"
                onClick={() => onTabChange('home')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'home'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                id="owner-nav-bookings"
                onClick={() => onTabChange('bookings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                  currentTab === 'bookings'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <CalendarCheck2 className="w-4 h-4" />
                <span>Today's Bookings</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold leading-none">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                id="owner-nav-seatmap"
                onClick={() => onTabChange('seatmap')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'seatmap'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Seat Map</span>
              </button>

              <button
                type="button"
                id="owner-nav-workspaces"
                onClick={() => onTabChange('workspaces')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'workspaces'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Zones</span>
              </button>

              <button
                type="button"
                id="owner-nav-walkin"
                onClick={() => onTabChange('walkin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  currentTab === 'walkin'
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-emerald-50 text-[#1B4332] border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Walk-in</span>
              </button>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="owner-nav-settings"
                onClick={() => onTabChange('settings')}
                className={`p-2 rounded-xl border transition-colors ${
                  currentTab === 'settings'
                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
                title="Venue Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {onLogout && (
                <button
                  type="button"
                  id="owner-nav-logout"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Log out of Owner Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Home, Bookings, Map, Settings) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 pb- safe">
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'home' ? 'text-[#1B4332] font-bold' : 'text-stone-400 font-medium'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Home</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('bookings')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              currentTab === 'bookings' ? 'text-[#1B4332] font-bold' : 'text-stone-400 font-medium'
            }`}
          >
            <CalendarCheck2 className={`w-5 h-5 ${currentTab === 'bookings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Bookings</span>
            {pendingCount > 0 && (
              <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('seatmap')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'seatmap' ? 'text-[#1B4332] font-bold' : 'text-stone-400 font-medium'
            }`}
          >
            <Grid className={`w-5 h-5 ${currentTab === 'seatmap' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Seat Map</span>
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
