import React, { useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  Smartphone,
  ShieldCheck,
  Lock,
  Sparkles,
  Check,
  Loader2,
  QrCode,
  Wallet,
} from 'lucide-react';
import { Workspace, SpaceType, BookingSelection, Seat, UserProfile, Booking } from '../types';

interface PaymentScreenProps {
  workspace: Workspace;
  spaceType: SpaceType;
  selection: BookingSelection;
  seat: Seat;
  user: UserProfile;
  onBack: () => void;
  onConfirmBooking: (newBooking: Booking) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function PaymentScreen({
  workspace,
  spaceType,
  selection,
  seat,
  user,
  onBack,
  onConfirmBooking,
  onShowToast,
}: PaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | 'cash'>('esewa');
  const [walletPhone, setWalletPhone] = useState(user.phone || '9801234567');
  const [khaltiPin, setKhaltiPin] = useState('••••');
  const [isProcessing, setIsProcessing] = useState(false);

  // Price calculations
  const baseRate = spaceType.hourlyRate;
  const subtotal = baseRate * selection.durationHours;
  const discountAmount = selection.studentDiscountApplied ? subtotal * 0.2 : 0;
  const serviceFee = 15;
  const tax = (subtotal - discountAmount) * 0.13;
  const total = subtotal - discountAmount + serviceFee + tax;

  const handleConfirm = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const generatedCode = 'SS-' + Math.floor(1000 + Math.random() * 9000);
      const newBooking: Booking = {
        id: 'bkg-' + Date.now(),
        bookingCode: generatedCode,
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        workspaceAddress: workspace.address,
        workspaceImage: workspace.heroImage,
        spaceTypeName: spaceType.name,
        seatNumber: seat.number,
        seatZone: seat.zone,
        date: selection.date,
        timeSlot: selection.timeSlot,
        durationHours: selection.durationHours,
        totalAmount: total,
        paymentMethod:
          paymentMethod === 'esewa'
            ? `eSewa Wallet (${walletPhone})`
            : paymentMethod === 'khalti'
            ? `Khalti Digital Wallet (${walletPhone})`
            : 'Cash at Venue Front Desk',
        status: 'active',
        wifiSsid: `${workspace.name.split(' ')[0] || 'StudySphere'}_Member_5G`,
        wifiPass: 'namaste2026',
        createdAt: new Date().toISOString(),
      };

      onConfirmBooking(newBooking);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 md:pb-20 text-[#1B2A22]">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#E5E5E1] py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            id="payment-back-btn"
            onClick={onBack}
            disabled={isProcessing}
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1B4332] p-1.5 rounded-lg hover:bg-stone-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to review</span>
          </button>

          <div className="text-right">
            <span className="text-xs text-stone-500 font-medium">Step 4 of 4</span>
            <p className="text-xs font-bold text-[#1B4332]">Nepal Instant Checkout</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium mb-2 border border-stone-200">
            <Lock className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>Mock Simulation • No Real Funds Charged</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A22] font-serif">
            Complete Your Desk Reservation
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Total due today: <span className="font-bold text-[#1B4332]">Rs {total.toFixed(2)}</span>
          </p>
        </div>

        {/* Nepal Payment Method Selector Tabs: eSewa, Khalti, Cash */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
          {/* eSewa Pill */}
          <button
            id="pay-method-esewa"
            type="button"
            onClick={() => setPaymentMethod('esewa')}
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              paymentMethod === 'esewa'
                ? 'border-[#60BB46] bg-emerald-50/70 text-[#1B4332] shadow-sm ring-2 ring-[#60BB46]'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#60BB46] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              eS
            </div>
            <span className="font-bold text-xs">eSewa</span>
          </button>

          {/* Khalti Pill */}
          <button
            id="pay-method-khalti"
            type="button"
            onClick={() => setPaymentMethod('khalti')}
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              paymentMethod === 'khalti'
                ? 'border-[#5D2E8E] bg-purple-50/70 text-purple-950 shadow-sm ring-2 ring-[#5D2E8E]'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#5D2E8E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              Kh
            </div>
            <span className="font-bold text-xs">Khalti</span>
          </button>

          {/* Cash Pill */}
          <button
            id="pay-method-cash"
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              paymentMethod === 'cash'
                ? 'border-[#1B4332] bg-stone-100 text-[#1B4332] shadow-sm ring-2 ring-[#1B4332]'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs shadow-xs">
              <Banknote className="w-4 h-4 text-stone-700" />
            </div>
            <span className="font-bold text-xs">Cash</span>
          </button>
        </div>

        {/* Payment Details Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E1] shadow-xl">
          {/* === eSewa Panel === */}
          {paymentMethod === 'esewa' && (
            <div className="py-2 text-center max-w-sm mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#60BB46] flex items-center justify-center mx-auto border border-emerald-200">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#60BB46]/15 text-[#1B4332] mb-1">
                  eSewa Nepal Digital Payment
                </div>
                <h3 className="font-bold text-base text-stone-800">Direct eSewa Mobile Checkout</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Instant mobile wallet settlement for <span className="font-bold text-[#1B4332]">Rs {total.toFixed(2)}</span>
                </p>
              </div>

              <div className="text-left space-y-1.5">
                <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                  eSewa ID / Registered Mobile Number
                </label>
                <input
                  type="text"
                  value={walletPhone}
                  onChange={(e) => setWalletPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-semibold text-[#1B2A22] focus:outline-none focus:border-[#60BB46]"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left flex items-start gap-2.5">
                <QrCode className="w-5 h-5 text-[#60BB46] shrink-0 mt-0.5" />
                <p className="text-[11px] text-stone-500 leading-snug">
                  You can also scan the QR on arrival at <strong>{workspace.name}</strong> using your eSewa app.
                </p>
              </div>
            </div>
          )}

          {/* === Khalti Panel === */}
          {paymentMethod === 'khalti' && (
            <div className="py-2 text-center max-w-sm mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#5D2E8E] flex items-center justify-center mx-auto border border-purple-200">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5D2E8E]/15 text-[#5D2E8E] mb-1">
                  Khalti Digital Wallet Nepal
                </div>
                <h3 className="font-bold text-base text-stone-800">Direct Khalti Mobile Checkout</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Instant mobile wallet settlement for <span className="font-bold text-[#5D2E8E]">Rs {total.toFixed(2)}</span>
                </p>
              </div>

              <div className="text-left space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                    Khalti Mobile Number
                  </label>
                  <input
                    type="text"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-semibold text-[#1B2A22] focus:outline-none focus:border-[#5D2E8E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                    Khalti Transaction PIN (Mock)
                  </label>
                  <input
                    type="password"
                    value={khaltiPin}
                    onChange={(e) => setKhaltiPin(e.target.value)}
                    placeholder="4-digit PIN"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-semibold text-[#1B2A22] focus:outline-none focus:border-[#5D2E8E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* === Cash Panel === */}
          {paymentMethod === 'cash' && (
            <div className="py-6 text-center max-w-sm mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B4332] flex items-center justify-center mx-auto">
                <Banknote className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-stone-800">Pay at Venue Entrance</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Your seat (Desk {seat.number}) will be held for 15 minutes past start time. Settle <span className="font-semibold text-[#1B4332]">Rs {total.toFixed(2)}</span> in cash or Fonepay QR at the front counter.
              </p>
            </div>
          )}

          {/* Guarantee pill */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
            <span>256-Bit SSL Encrypted Mock Nepal Gateway</span>
          </div>

          {/* Confirm Button */}
          <button
            id="payment-confirm-btn"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full mt-6 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Securing Desk {seat.number}...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Booking (Rs {total.toFixed(2)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
