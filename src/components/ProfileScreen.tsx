import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  School,
  ShieldCheck,
  Clock,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  CalendarCheck2,
  Share2,
  Info,
  Camera,
  Upload,
  RotateCcw,
  Edit3,
  X,
  Check,
  Phone,
} from 'lucide-react';
import { UserProfile, Workspace } from '../types';
import { getDefaultAvatar } from '../utils/avatar';

interface ProfileScreenProps {
  user: UserProfile;
  workspaces: Workspace[];
  onNavigateToBookings: () => void;
  onShowFavorites: () => void;
  onShowStudentVerify: () => void;
  onNavigateToAbout: () => void;
  onSignOut: () => void;
  onShowToast: (title: string, desc?: string) => void;
  onUpdateUser?: (updatedUser: Partial<UserProfile>) => void;
}

export function ProfileScreen({
  user,
  workspaces,
  onNavigateToBookings,
  onShowFavorites,
  onShowStudentVerify,
  onNavigateToAbout,
  onSignOut,
  onShowToast,
  onUpdateUser,
}: ProfileScreenProps) {
  const favoriteCount = user.savedFavorites.length;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneInput, setPhoneInput] = useState(user.phone || '+977 98012 34567');
  const [institutionInput, setInstitutionInput] = useState(user.institution || 'Lincoln University, Birtamode');
  const [roleInput, setRoleInput] = useState(user.role || 'Graduate Scholar');
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);

  const handleOpenEdit = () => {
    setNameInput(user.name);
    setEmailInput(user.email);
    setPhoneInput(user.phone || '+977 98012 34567');
    setInstitutionInput(user.institution || 'Lincoln University, Birtamode');
    setRoleInput(user.role || 'Graduate Scholar');
    setPreviewAvatar(user.avatar);
    setIsEditModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('File Too Large', 'Please select an image under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPreviewAvatar(result);
          if (!isEditModalOpen) {
            // Direct photo change from avatar button
            if (onUpdateUser) {
              onUpdateUser({ avatar: result });
            }
            onShowToast('Photo Updated', 'Your profile photo has been updated');
          } else {
            onShowToast('Photo Selected', 'Preview updated. Click Save Profile to apply.');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRevertToDefaultAvatar = () => {
    const defaultSvg = getDefaultAvatar(nameInput || user.name);
    setPreviewAvatar(defaultSvg);
    onShowToast('Default Avatar Selected', 'Reverted to Forest Green initials avatar');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      onShowToast('Name Required', 'Please enter your full name');
      return;
    }

    if (onUpdateUser) {
      onUpdateUser({
        name: nameInput.trim(),
        email: emailInput.trim(),
        phone: phoneInput.trim(),
        institution: institutionInput.trim(),
        role: roleInput.trim(),
        avatar: previewAvatar,
      });
    }

    setIsEditModalOpen(false);
    onShowToast('Profile Updated', 'Your details and avatar have been saved.');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-28 md:pb-16 text-[#1B2A22] pt-6 font-['Poppins',sans-serif]">
      {/* Hidden File Input for Device Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E1] shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative group">
              <img
                src={user.avatar}
                alt={`${user.name}'s verified profile portrait`}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 shadow-md ring-2 ring-emerald-800/10"
                referrerPolicy="no-referrer"
              />
              <button
                id="profile-edit-photo-badge-btn"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-[#1B4332] text-white rounded-full border-2 border-white text-xs hover:bg-[#2D6A4F] transition-all shadow-xs cursor-pointer"
                title="Upload Photo from Device"
                aria-label="Upload Photo from Device"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1B2A22] tracking-tight">{user.name}</h1>
                {user.isStudentVerified && (
                  <button
                    onClick={onShowStudentVerify}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F5E9] text-[#1B4332] border border-[#D8F3DC] hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Student Verified</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-stone-500 font-medium">{user.email}</p>
              <p className="text-xs text-stone-600 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <School className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>{user.institution} ({user.role})</span>
              </p>
              <p className="text-[11px] text-stone-400 mt-1">Member since {user.memberSince}</p>

              {/* Action Buttons: Edit Profile & Edit Photo */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  id="profile-open-edit-btn"
                  onClick={handleOpenEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>Edit Profile</span>
                </button>

                <button
                  id="profile-direct-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[#1B4332] text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Study Activity Metric Bar */}
          <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <span className="text-xl sm:text-2xl font-bold text-[#1B4332] block">
                {user.studyHoursLogged}h
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Focus Logged</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <span className="text-xl sm:text-2xl font-bold text-[#1B4332] block">
                {user.placesVisited}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Sanctuaries</span>
            </div>

            <div
              onClick={onShowFavorites}
              className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 hover:bg-rose-50/50 hover:border-rose-200 cursor-pointer transition-colors"
            >
              <span className="text-xl sm:text-2xl font-bold text-rose-600 block">
                {favoriteCount}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Favorites</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation Sections */}
        <div className="space-y-4">
          {/* Main Account Actions */}
          <div className="bg-white rounded-3xl border border-[#E5E5E1] shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-stone-50/80 border-b border-stone-100 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Workspace & Passes
            </div>

            <div className="divide-y divide-stone-100">
              {/* My Active & Past Bookings */}
              <button
                id="profile-menu-bookings"
                onClick={onNavigateToBookings}
                className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#1B4332] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#1B4332]">
                    <CalendarCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block">My Bookings & Passes</span>
                    <span className="text-[10px] text-stone-400 font-normal">Active desks, QR receipts & history</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* Saved Favorite Desks */}
              <button
                id="profile-menu-favorites"
                onClick={onShowFavorites}
                className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#1B4332] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block">Saved Quiet Havens ({favoriteCount})</span>
                    <span className="text-[10px] text-stone-400 font-normal">Bookmarked study hubs in Birtamode</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* Student Verification Portal */}
              <button
                id="profile-menu-student-verify"
                onClick={onShowStudentVerify}
                className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#1B4332] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#1B4332]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block">Student Status & Discount Rate</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Active: Lincoln University, Birtamode (20% off)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-700 font-bold">20% Off Active</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </button>
            </div>
          </div>

          {/* Preferences & Settings */}
          <div className="bg-white rounded-3xl border border-[#E5E5E1] shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-stone-50/80 border-b border-stone-100 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Preferences & Support
            </div>

            <div className="divide-y divide-stone-100">
              {/* Payment Methods */}
              <button
                id="profile-menu-payments"
                onClick={() =>
                  onShowToast(
                    'Payment Methods',
                    'Default: eSewa (9801234567) & Debit Card ending in 4921'
                  )
                }
                className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#1B4332] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span>Payment Methods & Billing</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* Notification Preferences */}
              <button
                id="profile-menu-notifications"
                onClick={() =>
                  onShowToast(
                    'Notifications Updated',
                    'Session start reminders set to 15m prior'
                  )
                }
                className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#1B4332] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span>Notification Preferences</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* Help & FAQ */}
              <button
                id="profile-menu-help"
                onClick={() =>
                  onShowToast(
                    'StudySphere Support Concierge',
                    '24/7 Desk assistance: host@studysphere.app'
                  )
                }
                className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#1B4332] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span>Help, House Rules & FAQ</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* About StudySphere & Meet the Team */}
              <button
                id="profile-menu-about"
                onClick={onNavigateToAbout}
                className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#1B4332] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#1B4332]">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block">About StudySphere</span>
                    <span className="text-[10px] text-stone-400 font-normal">Mission, Tagline & Meet the Team</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            id="profile-sign-out-btn"
            onClick={onSignOut}
            className="w-full py-3.5 px-5 bg-white hover:bg-rose-50 text-rose-600 font-semibold text-xs rounded-2xl border border-[#E5E5E1] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out / Switch Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Profile & Photo Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1B4332] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Edit Profile & Photo</h3>
                  <p className="text-[11px] text-stone-500">Update your scholar bio, institution, and avatar</p>
                </div>
              </div>
              <button
                id="edit-profile-close-btn"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Edit & Preview Section */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 mb-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <img
                  src={previewAvatar}
                  alt={`Preview of ${nameInput || user.name}'s updated avatar photo`}
                  className="w-20 h-20 rounded-full object-cover border-3 border-emerald-700/20 shadow-xs ring-2 ring-white"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <p className="text-xs font-bold text-stone-800">Profile Photo</p>
                <p className="text-[11px] text-stone-500">
                  Upload an image from your device, or revert to the default Forest Green initials avatar.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    id="modal-upload-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>

                  <button
                    type="button"
                    id="modal-revert-avatar-btn"
                    onClick={handleRevertToDefaultAvatar}
                    className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                    <span>Revert to Initials</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="edit-profile-name-input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                    placeholder="e.g. Srijit Kunwar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Academic Institution / Campus
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="edit-profile-institution-input"
                    value={institutionInput}
                    onChange={(e) => setInstitutionInput(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                    placeholder="e.g. Lincoln University, Birtamode"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Role / Degree Program
                  </label>
                  <input
                    type="text"
                    id="edit-profile-role-input"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                    placeholder="e.g. Graduate Scholar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="edit-profile-phone-input"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                      placeholder="+977 98012 34567"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    id="edit-profile-email-input"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                    placeholder="srijit.kunwar@lincoln.edu.np"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-stone-100">
                <button
                  type="button"
                  id="edit-profile-cancel-btn"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="edit-profile-save-btn"
                  className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
