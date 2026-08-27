import React, { useState } from 'react';
import {
  CalendarCheck2,
  Clock,
  MapPin,
  QrCode,
  Navigation,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Ban,
  ArrowRight,
  Receipt,
  MoreVertical,
  PlusCircle,
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';

interface BookingsScreenProps {
  bookings: Booking[];
  onShowQRModal: (booking: Booking) => void;
  onShowExtendTimeModal: (booking: Booking) => void;
  onShowDirections: (address: string, name: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onNavigateToExplore: () => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function BookingsScreen({
  bookings,
  onShowQRModal,
  onShowExtendTimeModal,
  onShowDirections,
  onCancelBooking,
  onNavigateToExplore,
  onShowToast,
}: BookingsScreenProps) {
  const [activeTab, setActiveTab] = useState<BookingStatus>('active');

  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F5E9] text-[#1B4332] border border-[#D8F3DC]">
            <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
            <span>Active Session Now</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
            <Ban className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 md:pb-16 text-[#1B2A22] pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A22]">My Study Bookings</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Manage your reserved silent carrels, focus pods, and entry passes
            </p>
          </div>

          <button
            onClick={onNavigateToExplore}
            className="self-start sm:self-auto px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Book Another Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-[#E5E5E1] pb-3 mb-6 overflow-x-auto no-scrollbar">
          {(['active', 'upcoming', 'completed', 'cancelled'] as BookingStatus[]).map((tab) => {
            const count = bookings.filter((b) => b.status === tab).length;
            const isCurrent = activeTab === tab;
            return (
              <button
                key={tab}
                id={`bookings-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all flex items-center gap-2 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#1B4332] text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Booking Cards List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E5E1] shadow-xs max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-800 capitalize">No {activeTab} bookings</h3>
            <p className="text-xs text-stone-500 mt-2 mb-6">
              You don't have any reservations under the {activeTab} filter right now.
            </p>
            <button
              onClick={onNavigateToExplore}
              className="px-4 py-2.5 bg-[#1B4332] text-white text-xs font-medium rounded-lg hover:bg-[#2D6A4F] transition-colors"
            >
              Explore Peaceful Spaces
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((bkg) => (
              <div
                key={bkg.id}
                id={`booking-card-${bkg.id}`}
                className="bg-white rounded-3xl border border-[#E5E5E1] shadow-xs hover:shadow-md transition-all p-5 sm:p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={bkg.workspaceImage}
                      alt={`${bkg.workspaceName} - Verified pass for ${bkg.spaceTypeName} (Seat ${bkg.seatNumber})`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {getStatusBadge(bkg.status)}
                        <span className="text-xs font-mono font-semibold text-stone-400">
                          {bkg.bookingCode}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-[#1B2A22]">{bkg.workspaceName}</h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{bkg.workspaceAddress}</span>
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
                        <span className="font-semibold text-[#1B4332] bg-[#FAF9F6] px-2.5 py-1 rounded-lg border border-stone-200">
                          Desk {bkg.seatNumber} ({bkg.seatZone})
                        </span>
                        <span className="text-stone-600">
                          {bkg.date} • {bkg.timeSlot}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Quick Action buttons */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                    <div className="md:text-right">
                      <span className="text-xs text-stone-400 block">Total Paid</span>
                      <span className="text-lg font-bold text-[#1B4332]">Rs {bkg.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onShowQRModal(bkg)}
                        className="px-3.5 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Digital Pass</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secondary Action Toolbar for Active/Upcoming */}
                {(bkg.status === 'active' || bkg.status === 'upcoming') && (
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => onShowDirections(bkg.workspaceAddress, bkg.workspaceName)}
                        className="text-stone-600 hover:text-[#1B4332] font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#1B4332]" />
                        <span>Directions</span>
                      </button>

                      {bkg.status === 'active' && (
                        <button
                          onClick={() => onShowExtendTimeModal(bkg)}
                          className="text-[#1B4332] bg-emerald-50 hover:bg-emerald-100 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Extend Time</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onShowToast('Receipt Downloaded', `PDF receipt generated for ${bkg.bookingCode}`);
                        }}
                        className="text-stone-500 hover:text-stone-800 text-xs flex items-center gap-1 px-2 py-1"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>

                    {bkg.status === 'upcoming' && (
                      <button
                        onClick={() => onCancelBooking(bkg.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
