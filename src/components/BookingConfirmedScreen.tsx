import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Wifi,
  Navigation,
  CalendarPlus,
  Share2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Booking } from '../types';

interface BookingConfirmedScreenProps {
  booking: Booking;
  onViewBookings: () => void;
  onBackToExplore: () => void;
  onShowQRModal: (booking: Booking) => void;
  onShowDirections: (address: string, name: string) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function BookingConfirmedScreen({
  booking,
  onViewBookings,
  onBackToExplore,
  onShowQRModal,
  onShowDirections,
  onShowToast,
}: BookingConfirmedScreenProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 md:pb-16 text-[#1B2A22] pt-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Checkmark Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B4332] flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-100 shadow-md">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#D8F3DC]">
            Reservation Guaranteed
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A22] mt-2">You're All Set to Study!</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Booking reference: <span className="font-mono font-bold text-[#1B4332]">{booking.bookingCode}</span>
          </p>
        </div>

        {/* Digital Ticket Card */}
        <div className="bg-white rounded-3xl border border-[#E5E5E1] shadow-xl overflow-hidden mb-8">
          {/* Top Venue Banner */}
          <div className="p-6 sm:p-7 bg-[#1B4332] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-200 bg-white/10 px-2 py-0.5 rounded">
                Confirmed Pass
              </span>
              <h2 className="text-xl font-bold mt-1">{booking.workspaceName}</h2>
              <p className="text-xs text-emerald-100/80 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#52B788]" />
                <span>{booking.workspaceAddress}</span>
              </p>
            </div>

            <div className="sm:text-right bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15">
              <span className="text-[10px] uppercase text-emerald-200 block">Reserved Spot</span>
              <span className="text-lg font-bold">Desk {booking.seatNumber}</span>
              <p className="text-[11px] text-emerald-100">{booking.seatZone}</p>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-2 text-stone-400 font-medium mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span className="uppercase text-[10px]">Date</span>
                </div>
                <p className="font-bold text-stone-800 text-sm">{booking.date}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-2 text-stone-400 font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span className="uppercase text-[10px]">Time Slot</span>
                </div>
                <p className="font-bold text-stone-800 text-sm">{booking.timeSlot}</p>
                <p className="text-[11px] text-stone-500">{booking.durationHours} hours booked</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-2 text-stone-400 font-medium mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span className="uppercase text-[10px]">Payment</span>
                </div>
                <p className="font-bold text-[#1B4332] text-sm">Rs {booking.totalAmount.toFixed(2)} Paid</p>
                <p className="text-[11px] text-stone-500 truncate">{booking.paymentMethod}</p>
              </div>
            </div>

            {/* Wi-Fi & QR Quick Access */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-10 h-10 rounded-xl bg-white text-[#1B4332] flex items-center justify-center shadow-2xs border border-emerald-200 shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#1B4332]">Venue Wi-Fi Network</p>
                  <p className="text-stone-600 font-mono text-[11px]">SSID: {booking.wifiSsid} • Key: {booking.wifiPass}</p>
                </div>
              </div>

              <button
                onClick={() => onShowQRModal(booking)}
                className="w-full sm:w-auto px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Show Entry QR Pass</span>
              </button>
            </div>

            {/* Secondary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => onShowDirections(booking.workspaceAddress, booking.workspaceName)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>Get Directions</span>
              </button>

              <button
                onClick={() => {
                  onShowToast('Calendar Event Created', `Added ${booking.workspaceName} to Google Calendar`);
                }}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>Add to Google Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            id="confirmed-view-bookings-btn"
            onClick={onViewBookings}
            className="w-full sm:w-auto px-6 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>View in My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="confirmed-back-explore-btn"
            onClick={onBackToExplore}
            className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
          >
            Back to Explore
          </button>
        </div>
      </div>
    </div>
  );
}
