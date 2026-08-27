import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Armchair,
  ShieldCheck,
  Tag,
  CheckCircle2,
  ChevronRight,
  Info,
  Sparkles,
  Wifi,
  Zap,
} from 'lucide-react';
import { Workspace, SpaceType, BookingSelection, Seat, UserProfile } from '../types';

interface CheckoutScreenProps {
  workspace: Workspace;
  spaceType: SpaceType;
  selection: BookingSelection;
  seat: Seat;
  user: UserProfile;
  onBack: () => void;
  onProceedToPayment: (updatedSelection: BookingSelection) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function CheckoutScreen({
  workspace,
  spaceType,
  selection,
  seat,
  user,
  onBack,
  onProceedToPayment,
  onShowToast,
}: CheckoutScreenProps) {
  const [promoCodeInput, setPromoCodeInput] = useState('STUDENT20');
  const [promoApplied, setPromoApplied] = useState(true);
  const [promoError, setPromoError] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [agreedToQuietPledge, setAgreedToQuietPledge] = useState(true);

  // Price calculations
  const baseRate = spaceType.hourlyRate;
  const subtotal = baseRate * selection.durationHours;
  const discountAmount = promoApplied ? subtotal * 0.2 : 0;
  const serviceFee = 15;
  const tax = (subtotal - discountAmount) * 0.13;
  const total = subtotal - discountAmount + serviceFee + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCodeInput.trim().toUpperCase() === 'STUDENT20') {
      setPromoApplied(true);
      setPromoError('');
      onShowToast('Promo Code Applied!', '20% Student discount has been deducted.');
    } else if (promoCodeInput.trim().toUpperCase() === 'FOCUS10') {
      setPromoApplied(true);
      setPromoError('');
      onShowToast('Promo Code Applied!', '10% Welcome discount applied.');
    } else {
      setPromoError('Invalid coupon code. Try STUDENT20.');
      onShowToast('Invalid Code', 'Please enter a valid promotion code.');
    }
  };

  const handleProceed = () => {
    if (!agreedToQuietPledge) {
      onShowToast('Agreement Required', 'Please acknowledge the Quiet Atmosphere pledge.');
      return;
    }
    onProceedToPayment({
      ...selection,
      studentDiscountApplied: promoApplied,
      promoCode: promoApplied ? promoCodeInput : undefined,
      specialRequests: specialRequest,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 md:pb-20 text-[#1B2A22]">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#E5E5E1] py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            id="checkout-back-btn"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1B4332] p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to seat map</span>
          </button>

          <div className="text-right">
            <span className="text-xs text-stone-500 font-medium">Step 3 of 4</span>
            <p className="text-xs font-bold text-[#1B4332]">Review Booking</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A22]">Review & Confirm Reservation</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Check your workspace slot details before entering mock payment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Summary Card & Options */}
          <div className="md:col-span-7 space-y-6">
            {/* Workspace & Desk Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E5E1] shadow-xs">
              <div className="flex items-start gap-4">
                <img
                  src={workspace.heroImage}
                  alt={`${workspace.name} - ${workspace.category} study sanctuary reservation`}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {workspace.category}
                  </span>
                  <h3 className="font-bold text-base text-[#1B2A22] mt-1 truncate">{workspace.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5 truncate flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{workspace.address}</span>
                  </p>
                </div>
              </div>

              {/* Reserved Slot Chips */}
              <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-stone-400 text-[10px] uppercase font-semibold">Date & Time</span>
                  <p className="font-semibold text-stone-800 mt-0.5">{selection.date}</p>
                  <p className="text-stone-500 text-[11px]">{selection.timeSlot} ({selection.durationHours} hrs)</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-stone-400 text-[10px] uppercase font-semibold">Seat & Zone</span>
                  <p className="font-semibold text-[#1B4332] mt-0.5">Desk {seat.number}</p>
                  <p className="text-stone-500 text-[11px]">{seat.zone}</p>
                </div>
              </div>

              {/* Inclusions */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>Gigabit Wi-Fi</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>Power Outlet</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>Free Cancellation (1h before)</span>
                </span>
              </div>
            </div>

            {/* Special Request / Notes */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E5E1] shadow-xs">
              <label className="block text-xs font-bold text-[#1B2A22] mb-1">
                Special Requests or Accessibility Notes (Optional)
              </label>
              <input
                type="text"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g. Near window preferred, extra HDMI adapter needed..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#1B2A22] placeholder:text-stone-400 focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            {/* Quiet Pledge Checkbox */}
            <div className="bg-emerald-50/60 rounded-3xl p-5 border border-emerald-100 flex items-start gap-3">
              <input
                id="quiet-pledge-checkbox"
                type="checkbox"
                checked={agreedToQuietPledge}
                onChange={(e) => setAgreedToQuietPledge(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[#1B4332] cursor-pointer"
              />
              <label htmlFor="quiet-pledge-checkbox" className="text-xs text-stone-700 leading-relaxed cursor-pointer">
                <span className="font-bold text-[#1B4332]">Productive Serenity Pledge:</span> I agree to wear headphones for all audio playback, maintain whisper volume in designated library zones, and keep mobile phones on silent.
              </label>
            </div>
          </div>

          {/* Right Column: Price Breakdown Card */}
          <div className="md:col-span-5 sticky top-20">
            <div className="bg-white rounded-3xl p-6 border border-[#E5E5E1] shadow-xl">
              <h3 className="font-bold text-base text-[#1B2A22] pb-3 border-b border-stone-100">
                Price Breakdown
              </h3>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="mt-4 mb-4">
                <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                  Promo / Student Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="e.g. STUDENT20"
                      className="w-full pl-8 pr-2 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-semibold uppercase text-[#1B2A22] focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>20% Student discount code active</span>
                  </p>
                )}
                {promoError && <p className="text-[11px] text-rose-600 mt-1.5">{promoError}</p>}
              </form>

              {/* Line Items */}
              <div className="space-y-2.5 text-xs text-stone-600 pt-3 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>
                    {spaceType.name} (Rs {baseRate}/hr × {selection.durationHours}h)
                  </span>
                  <span className="font-medium text-stone-800">Rs {subtotal.toFixed(2)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Student Scholar Discount (20%)</span>
                    </span>
                    <span>-Rs {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <span>Clean Desk & Facility Fee</span>
                    <Info className="w-3 h-3 text-stone-400" />
                  </span>
                  <span className="font-medium text-stone-800">Rs {serviceFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Nepal VAT / Tax (13%)</span>
                  <span className="font-medium text-stone-800">Rs {tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-stone-200 text-base font-bold text-[#1B2A22]">
                  <span>Total Amount</span>
                  <div className="text-right">
                    <span className="text-xl text-[#1B4332]">Rs {total.toFixed(2)}</span>
                    <p className="text-[10px] text-stone-400 font-normal">Mock presentation charge</p>
                  </div>
                </div>
              </div>

              {/* Proceed to Payment CTA */}
              <button
                id="checkout-proceed-btn"
                onClick={handleProceed}
                className="w-full mt-6 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
