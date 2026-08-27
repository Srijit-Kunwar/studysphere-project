import React, { useState } from 'react';
import { X, QrCode, MapPin, Navigation, Clock, ShieldCheck, Check, Sparkles, HelpCircle, Heart, Wifi, ExternalLink } from 'lucide-react';
import { Booking, Workspace } from '../types';

interface QRPassModalProps {
  booking: Booking | null;
  onClose: () => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function QRPassModal({ booking, onClose, onShowToast }: QRPassModalProps) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-sm rounded-none sm:rounded-3xl border-0 sm:border border-[#E5E5E1] shadow-2xl overflow-y-auto sm:overflow-hidden flex flex-col justify-between">
        <div>
          <div className="bg-[#1B4332] p-6 text-white text-center relative">
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-medium text-emerald-100 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#52B788]" />
              <span>Digital Member Pass</span>
            </div>
            <h3 className="font-bold text-lg leading-snug">{booking.workspaceName}</h3>
            <p className="text-xs text-emerald-100/80 mt-1">Seat {booking.seatNumber} • {booking.seatZone}</p>
          </div>

          <div className="p-6 text-center">
            {/* Mock QR Code graphic */}
            <div className="bg-stone-50 border-2 border-dashed border-stone-200 p-6 rounded-2xl inline-block mx-auto mb-4 relative group">
              <div className="w-44 h-44 bg-white p-3 rounded-xl shadow-xs flex flex-col items-center justify-center border border-stone-200">
                <QrCode className="w-32 h-32 text-[#1B4332]" />
                <p className="text-[10px] font-mono text-stone-500 mt-1 font-semibold tracking-wider">{booking.bookingCode}</p>
              </div>
            </div>

            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Scan this QR code at the turnstile reader or present it to the host at the entrance.
            </p>

            <div className="mt-5 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-left flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wifi className="w-4 h-4 text-[#1B4332]" />
                <div>
                  <p className="text-xs font-semibold text-[#1B4332]">Wi-Fi: {booking.wifiSsid}</p>
                  <p className="text-[11px] text-stone-600 font-mono">Password: {booking.wifiPass}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(booking.wifiPass);
                  onShowToast('Wi-Fi Password Copied', 'Connect to ' + booking.wifiSsid);
                }}
                className="min-h-[44px] px-3 py-1.5 text-xs font-medium bg-white text-[#1B4332] rounded-xl border border-emerald-200 hover:bg-emerald-50 transition-colors flex items-center cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              onShowToast('Pass Saved to Wallet', 'Saved offline digital pass');
              onClose();
            }}
            className="min-h-[44px] flex-1 py-3 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center cursor-pointer"
          >
            Save Digital Pass
          </button>
          <button
            onClick={onClose}
            className="min-h-[44px] py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors flex items-center justify-center cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

interface ExtendTimeModalProps {
  booking: Booking | null;
  onClose: () => void;
  onConfirmExtend: (bookingId: string, additionalHours: number, additionalCost: number) => void;
}

export function ExtendTimeModal({ booking, onClose, onConfirmExtend }: ExtendTimeModalProps) {
  const [selectedHours, setSelectedHours] = useState<number>(1);

  if (!booking) return null;

  const ratePerHour = booking.totalAmount / booking.durationHours;
  const cost = selectedHours * ratePerHour;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-sm rounded-none sm:rounded-3xl border-0 sm:border border-[#E5E5E1] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#1B4332]">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-[#1B2A22]">Extend Study Session</h3>
            </div>
            <button onClick={onClose} className="min-w-[44px] min-h-[44px] p-2 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-stone-600 mb-4">
            Need more quiet time at <span className="font-semibold text-[#1B4332]">{booking.workspaceName}</span> (Seat {booking.seatNumber})?
          </p>

          <div className="space-y-2.5 mb-6">
            {[1, 2, 3].map((hrs) => (
              <button
                key={hrs}
                onClick={() => setSelectedHours(hrs)}
                className={`w-full min-h-[48px] flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  selectedHours === hrs
                    ? 'border-[#1B4332] bg-emerald-50/50 text-[#1B4332] shadow-xs font-semibold'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedHours === hrs ? 'border-[#1B4332] bg-[#1B4332]' : 'border-stone-300'}`}>
                    {selectedHours === hrs && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span>+{hrs} {hrs === 1 ? 'Hour' : 'Hours'}</span>
                </div>
                <span className="font-semibold">Rs {(hrs * ratePerHour).toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-4">
          <button
            onClick={() => onConfirmExtend(booking.id, selectedHours, cost)}
            className="min-h-[44px] flex-1 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center cursor-pointer"
          >
            Extend for Rs {cost.toFixed(2)}
          </button>
          <button
            onClick={onClose}
            className="min-h-[44px] py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors flex items-center justify-center cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

interface DirectionsModalProps {
  address: string;
  name: string;
  onClose: () => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function DirectionsModal({ address, name, onClose, onShowToast }: DirectionsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-md rounded-none sm:rounded-3xl border-0 sm:border border-[#E5E5E1] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#1B4332]">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-[#1B2A22]">Directions & Arrival</h3>
            </div>
            <button onClick={onClose} className="min-w-[44px] min-h-[44px] p-2 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-stone-100 rounded-2xl h-44 border border-stone-200 overflow-hidden relative mb-4 flex items-center justify-center">
            {/* Simulated Map Visual */}
            <div className="absolute inset-0 bg-[#E8EFE9] flex flex-col items-center justify-center p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center shadow-lg animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#1B4332] mt-2">{name}</p>
              <p className="text-[11px] text-stone-500">{address}</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-stone-600 mb-6 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <p><span className="font-semibold text-stone-800">Transit:</span> 3-5 min walk from the main chowk & Sajha/microbus stops.</p>
            <p><span className="font-semibold text-stone-800">Parking:</span> Dedicated two-wheeler & car parking available on premises.</p>
            <p><span className="font-semibold text-stone-800">Check-in:</span> Scan your StudySphere digital pass at the entrance counter.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => {
              onShowToast('Opening Map Navigation', `Routing to ${address}`);
              onClose();
            }}
            className="min-h-[44px] flex-1 flex items-center justify-center gap-2 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </button>
          <button
            onClick={onClose}
            className="min-h-[44px] py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors flex items-center justify-center cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface FavoritesModalProps {
  favorites: Workspace[];
  onClose: () => void;
  onSelectWorkspace: (ws: Workspace) => void;
}

export function FavoritesModal({ favorites, onClose, onSelectWorkspace }: FavoritesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-lg rounded-none sm:rounded-3xl border-0 sm:border border-[#E5E5E1] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4 fill-rose-600" />
              </div>
              <h3 className="font-bold text-base text-[#1B2A22]">Saved Quiet Sanctuaries ({favorites.length})</h3>
            </div>
            <button onClick={onClose} className="min-w-[44px] min-h-[44px] p-2 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          {favorites.length === 0 ? (
            <p className="text-xs text-stone-500 py-8 text-center">No saved spaces yet. Tap the heart on any space to bookmark it!</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {favorites.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200 hover:border-[#1B4332] hover:bg-emerald-50/20 cursor-pointer transition-all"
                >
                  <img
                    src={ws.heroImage}
                    alt={`${ws.name} - Saved study hub in ${ws.neighborhood}`}
                    className="w-16 h-16 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-[#1B4332] truncate">{ws.name}</h4>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">{ws.neighborhood} • {ws.distance}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-stone-800">Rs {ws.pricePerHour}/hr</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                        {ws.availableSeatsCount} seats free
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#1B4332] px-3 py-1.5 bg-stone-100 rounded-lg hover:bg-[#1B4332] hover:text-white transition-colors">
                    View
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="min-h-[44px] w-full sm:w-auto py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface StudentVerifyModalProps {
  onClose: () => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function StudentVerifyModal({ onClose, onShowToast }: StudentVerifyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-md rounded-none sm:rounded-3xl border-0 sm:border border-[#E5E5E1] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#1B4332]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-[#1B2A22]">Student Status: Verified</h3>
            </div>
            <button onClick={onClose} className="min-w-[44px] min-h-[44px] p-2 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-[#1B4332] text-white rounded-2xl mb-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Verified Academic Pass
              </span>
              <Sparkles className="w-4 h-4 text-[#52B788]" />
            </div>
            <p className="font-bold text-base">Lincoln University, Birtamode</p>
            <p className="text-xs text-emerald-100">srijit.kunwar@lincoln.edu.np</p>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[11px] text-emerald-200">
              <span>20% Student Discount Active</span>
              <span>Valid thru Ashadh 2083</span>
            </div>
          </div>

          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            Your verified student account automatically applies discounts to all study carrels and focus booths across the StudySphere Birtamode network. Use promo code <span className="font-mono font-bold text-[#1B4332] bg-emerald-50 px-1.5 py-0.5 rounded">STUDENT20</span> at checkout for additional seasonal perks.
          </p>
        </div>

        <button
          onClick={() => {
            onShowToast('Student Pass Refreshed', 'Connected to Lincoln University Academic Portal');
            onClose();
          }}
          className="min-h-[44px] w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
