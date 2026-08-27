import React from 'react';
import {
  Home,
  Compass,
  CalendarCheck2,
  User,
  Sparkles,
  MapPin,
  LayoutDashboard,
  Grid,
  Layers,
  UserPlus,
  Settings,
  Building2,
  AlertOctagon,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { Screen, UserRole, UserProfile, OwnerTab, AdminTab } from '../types';
import { StudySphereLogo } from './StudySphereLogo';

export interface SharedNavbarProps {
  role: UserRole;
  // Customer navigation
  currentScreen?: Screen;
  onNavigate?: (screen: Screen) => void;
  activeBookingsCount?: number;
  user?: UserProfile;
  // Owner navigation
  ownerTab?: OwnerTab;
  onOwnerTabChange?: (tab: OwnerTab) => void;
  ownerPendingBookings?: number;
  // Admin navigation
  adminTab?: AdminTab;
  onAdminTabChange?: (tab: AdminTab) => void;
  adminPendingVerifications?: number;
  adminActiveDisputes?: number;
  // Common
  onLogout?: () => void;
  onQuickExplore?: () => void;
}

export function Navbar({
  role,
  currentScreen = 'home',
  onNavigate,
  activeBookingsCount = 0,
  user,
  ownerTab = 'home',
  onOwnerTabChange,
  ownerPendingBookings = 0,
  adminTab = 'home',
  onAdminTabChange,
  adminPendingVerifications = 0,
  adminActiveDisputes = 0,
  onLogout,
  onQuickExplore,
}: SharedNavbarProps) {
  // Determine if bottom bar should be hidden on full-screen flows
  const isNavVisible = !['seat-selection', 'payment'].includes(currentScreen);

  // Active state checker
  const isCustomerActive = (screen: Screen) => {
    if (screen === 'explore') return currentScreen === 'explore' || currentScreen === 'workspace-details';
    if (screen === 'bookings') return currentScreen === 'bookings' || currentScreen === 'confirmed';
    if (screen === 'profile') return currentScreen === 'profile' || currentScreen === 'about';
    return currentScreen === screen;
  };

  const handleBrandClick = () => {
    if (role === 'customer' && onNavigate) onNavigate('home');
    if (role === 'owner' && onOwnerTabChange) onOwnerTabChange('home');
    if (role === 'admin' && onAdminTabChange) onAdminTabChange('home');
  };

  return (
    <>
      {/* Universal Desktop Top Navbar Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/90 transition-all overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo & Contextual Role Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="brand-logo-btn"
              onClick={handleBrandClick}
              className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1B4332] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform p-1.5 shrink-0">
                <StudySphereLogo className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-[#1B4332] font-serif">
                    StudySphere
                  </span>
                  {/* Distinctive, clean Role Badges */}
                  {role === 'customer' && (
                    <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-100 text-[#1B4332] border border-emerald-200 shrink-0">
                      Customer
                    </span>
                  )}
                  {role === 'owner' && (
                    <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-100 text-[#1B4332] border border-emerald-200 shrink-0">
                      Owner Portal
                    </span>
                  )}
                  {role === 'admin' && (
                    <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider rounded-full bg-purple-100 text-purple-900 border border-purple-200 shrink-0">
                      Admin Panel
                    </span>
                  )}
                </div>
                <div className="items-center gap-1 text-[11px] text-stone-500 hidden xl:flex">
                  <MapPin className="w-3 h-3 text-[#1B4332]" />
                  {role === 'customer' && <span>Birtamode, Jhapa</span>}
                  {role === 'owner' && <span className="truncate max-w-[180px] lg:max-w-xs">Mechi Study Pavilion • Muktinath Chowk</span>}
                  {role === 'admin' && <span>Jhapa Territory Oversight</span>}
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links — Icon-only on Tablet (md to lg), Expanded with labels on Desktop (lg+) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
            {/* === CUSTOMER NAV ITEMS === */}
            {role === 'customer' && onNavigate && (
              <>
                <button
                  type="button"
                  id="nav-customer-home"
                  onClick={() => onNavigate('home')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCustomerActive('home')
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Home"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Home</span>
                </button>

                <button
                  type="button"
                  id="nav-customer-explore"
                  onClick={() => onNavigate('explore')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCustomerActive('explore')
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Explore Spaces"
                  aria-label="Explore Spaces"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Explore</span>
                </button>

                <button
                  type="button"
                  id="nav-customer-bookings"
                  onClick={() => onNavigate('bookings')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                    isCustomerActive('bookings')
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="My Bookings"
                  aria-label="My Bookings"
                >
                  <CalendarCheck2 className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Bookings</span>
                  {activeBookingsCount > 0 && (
                    <span className="w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-emerald-600 text-white shrink-0">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="nav-customer-profile"
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCustomerActive('profile')
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="My Profile"
                  aria-label="My Profile"
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Profile</span>
                </button>
              </>
            )}

            {/* === OWNER NAV ITEMS === */}
            {role === 'owner' && onOwnerTabChange && (
              <>
                <button
                  type="button"
                  id="nav-owner-home"
                  onClick={() => onOwnerTabChange('home')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    ownerTab === 'home'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Owner Dashboard"
                  aria-label="Owner Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Home</span>
                </button>

                <button
                  type="button"
                  id="nav-owner-bookings"
                  onClick={() => onOwnerTabChange('bookings')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                    ownerTab === 'bookings'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Venue Bookings"
                  aria-label="Venue Bookings"
                >
                  <CalendarCheck2 className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Bookings</span>
                  {ownerPendingBookings > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold leading-none shrink-0">
                      {ownerPendingBookings}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="nav-owner-seatmap"
                  onClick={() => onOwnerTabChange('seatmap')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    ownerTab === 'seatmap'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Floor & Seat Map"
                  aria-label="Floor & Seat Map"
                >
                  <Grid className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Map</span>
                </button>

                <button
                  type="button"
                  id="nav-owner-workspaces"
                  onClick={() => onOwnerTabChange('workspaces')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    ownerTab === 'workspaces'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Manage Workspaces"
                  aria-label="Manage Workspaces"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Workspaces</span>
                </button>
              </>
            )}

            {/* === ADMIN NAV ITEMS === */}
            {role === 'admin' && onAdminTabChange && (
              <>
                <button
                  type="button"
                  id="nav-admin-home"
                  onClick={() => onAdminTabChange('home')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    adminTab === 'home'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Admin Analytics"
                  aria-label="Admin Analytics"
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Home</span>
                </button>

                <button
                  type="button"
                  id="nav-admin-owners"
                  onClick={() => onAdminTabChange('owners')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                    adminTab === 'owners'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Venue Owners Verification"
                  aria-label="Venue Owners Verification"
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Owners</span>
                  {adminPendingVerifications > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold leading-none shrink-0">
                      {adminPendingVerifications}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="nav-admin-disputes"
                  onClick={() => onAdminTabChange('disputes')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                    adminTab === 'disputes'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Disputes & Safety"
                  aria-label="Disputes & Safety"
                >
                  <AlertOctagon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Disputes</span>
                  {adminActiveDisputes > 0 && (
                    <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold leading-none shrink-0">
                      {adminActiveDisputes}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="nav-admin-settings"
                  onClick={() => onAdminTabChange('settings')}
                  className={`flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    adminTab === 'settings'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Platform Settings"
                  aria-label="Platform Settings"
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Settings</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Shell — Compact on Tablet (md to lg), Expanded on Desktop (lg+) */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2.5 shrink-0">
            {role === 'customer' && (
              <>
                {onQuickExplore && (
                  <button
                    type="button"
                    id="desktop-quick-explore-cta"
                    onClick={onQuickExplore}
                    className="hidden md:flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
                    title="Book a Desk"
                    aria-label="Book a Desk"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                    <span className="hidden lg:inline">Book a Desk</span>
                  </button>
                )}
              </>
            )}

            {role === 'owner' && onOwnerTabChange && (
              <>
                <button
                  type="button"
                  id="owner-quick-walkin-btn"
                  onClick={() => onOwnerTabChange('walkin')}
                  className={`hidden md:flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer shrink-0 ${
                    ownerTab === 'walkin'
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-emerald-50 text-[#1B4332] border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title="Log Walk-in Guest"
                  aria-label="Log Walk-in Guest"
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden lg:inline">+ Walk-in</span>
                </button>

                <button
                  type="button"
                  id="owner-quick-settings-btn"
                  onClick={() => onOwnerTabChange('settings')}
                  className={`p-1.5 lg:p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer shrink-0 ${
                    ownerTab === 'settings' ? 'bg-stone-200/80 text-stone-900' : ''
                  }`}
                  title="Venue Settings"
                  aria-label="Venue Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Universal Log Out Button in top bar — Icon on Tablet, Full Label on Desktop */}
            {onLogout && (
              <button
                type="button"
                id="navbar-logout-btn"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 rounded-xl border border-stone-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">Log Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Universal Mobile Bottom Navigation Bar (Persistent 4-Grid Shell) */}
      {isNavVisible && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E5E5E1] px-3 py-2 pb-5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
            {/* Customer 4 Tabs: Home, Explore, Bookings, Profile */}
            {role === 'customer' && onNavigate && (
              <>
                <button
                  type="button"
                  id="mobile-nav-home"
                  onClick={() => onNavigate('home')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                    isCustomerActive('home')
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Home className={`w-5 h-5 ${isCustomerActive('home') ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Home</span>
                </button>

                <button
                  type="button"
                  id="mobile-nav-explore"
                  onClick={() => onNavigate('explore')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                    isCustomerActive('explore')
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Compass className={`w-5 h-5 ${isCustomerActive('explore') ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Explore</span>
                </button>

                <button
                  type="button"
                  id="mobile-nav-bookings"
                  onClick={() => onNavigate('bookings')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative cursor-pointer ${
                    isCustomerActive('bookings')
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <CalendarCheck2 className={`w-5 h-5 ${isCustomerActive('bookings') ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Bookings</span>
                  {activeBookingsCount > 0 && (
                    <span className="absolute top-1 right-4 w-4 h-4 bg-[#1B4332] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="mobile-nav-profile"
                  onClick={() => onNavigate('profile')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                    isCustomerActive('profile')
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <User className={`w-5 h-5 ${isCustomerActive('profile') ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Profile</span>
                </button>
              </>
            )}

            {/* Owner 4 Tabs: Home, Bookings, Map, Workspaces */}
            {role === 'owner' && onOwnerTabChange && (
              <>
                <button
                  type="button"
                  id="mobile-owner-home"
                  onClick={() => onOwnerTabChange('home')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                    ownerTab === 'home'
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <LayoutDashboard className={`w-5 h-5 ${ownerTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Home</span>
                </button>

                <button
                  type="button"
                  id="mobile-owner-bookings"
                  onClick={() => onOwnerTabChange('bookings')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative cursor-pointer ${
                    ownerTab === 'bookings'
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <CalendarCheck2 className={`w-5 h-5 ${ownerTab === 'bookings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Bookings</span>
                  {ownerPendingBookings > 0 && (
                    <span className="absolute top-1 right-4 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {ownerPendingBookings}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="mobile-owner-map"
                  onClick={() => onOwnerTabChange('seatmap')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                    ownerTab === 'seatmap'
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Grid className={`w-5 h-5 ${ownerTab === 'seatmap' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Map</span>
                </button>

                <button
                  type="button"
                  id="mobile-owner-workspaces"
                  onClick={() => onOwnerTabChange('workspaces')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                    ownerTab === 'workspaces'
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Layers className={`w-5 h-5 ${ownerTab === 'workspaces' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Workspaces</span>
                </button>
              </>
            )}

            {/* Admin 4 Tabs: Home, Owners, Disputes, Settings */}
            {role === 'admin' && onAdminTabChange && (
              <>
                <button
                  type="button"
                  id="mobile-admin-home"
                  onClick={() => onAdminTabChange('home')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                    adminTab === 'home'
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <BarChart3 className={`w-5 h-5 ${adminTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Home</span>
                </button>

                <button
                  type="button"
                  id="mobile-admin-owners"
                  onClick={() => onAdminTabChange('owners')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative cursor-pointer ${
                    adminTab === 'owners'
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Building2 className={`w-5 h-5 ${adminTab === 'owners' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Owners</span>
                  {adminPendingVerifications > 0 && (
                    <span className="absolute top-1 right-4 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {adminPendingVerifications}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="mobile-admin-disputes"
                  onClick={() => onAdminTabChange('disputes')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative cursor-pointer ${
                    adminTab === 'disputes'
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <AlertOctagon className={`w-5 h-5 ${adminTab === 'disputes' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Disputes</span>
                  {adminActiveDisputes > 0 && (
                    <span className="absolute top-1 right-4 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {adminActiveDisputes}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="mobile-admin-settings"
                  onClick={() => onAdminTabChange('settings')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                    adminTab === 'settings'
                      ? 'text-[#1B4332] font-semibold bg-[#FAF9F6]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Settings className={`w-5 h-5 ${adminTab === 'settings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[11px] mt-1">Settings</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
