import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Zap,
  Tv,
  Sun,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  Armchair,
  Volume2,
} from 'lucide-react';
import { Workspace, SpaceType, BookingSelection, Seat } from '../types';

interface SeatSelectionScreenProps {
  workspace: Workspace;
  spaceType: SpaceType;
  selection: BookingSelection;
  onBack: () => void;
  onContinueToCheckout: (updatedSelection: BookingSelection) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function SeatSelectionScreen({
  workspace,
  spaceType,
  selection,
  onBack,
  onContinueToCheckout,
  onShowToast,
}: SeatSelectionScreenProps) {
  // Find first available seat by default or use existing selection
  const defaultSeat =
    workspace.seatMap.find((s) => s.id === selection.seatId) ||
    workspace.seatMap.find((s) => s.status === 'available') ||
    workspace.seatMap[0];

  const [selectedSeatId, setSelectedSeatId] = useState<string>(defaultSeat.id);

  const currentSeat = workspace.seatMap.find((s) => s.id === selectedSeatId) || defaultSeat;

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied' || seat.status === 'reserved') {
      onShowToast('Seat Unavailable', `Desk ${seat.number} is currently occupied.`);
      return;
    }
    setSelectedSeatId(seat.id);
  };

  const handleContinue = () => {
    if (!currentSeat) {
      onShowToast('Please Select a Seat', 'Pick any available desk on the floor map.');
      return;
    }
    onContinueToCheckout({
      ...selection,
      seatId: currentSeat.id,
    });
  };

  const zones = Array.from(new Set(workspace.seatMap.map((s) => s.zone)));

  const totalCost = spaceType.hourlyRate * selection.durationHours;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 md:pb-20 text-[#1B2A22]">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#E5E5E1] py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            id="seat-map-back-btn"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1B4332] p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to space details</span>
          </button>

          <div className="text-right">
            <span className="text-xs text-stone-500 font-medium">Step 2 of 4</span>
            <p className="text-xs font-bold text-[#1B4332]">Seat Map</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
            <span>Interactive Floor Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A22]">Select Your Dedicated Spot</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {workspace.name} • {selection.date} ({selection.timeSlot}, {selection.durationHours} hrs)
          </p>
        </div>

        {/* Legend Row */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E1] shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-stone-600 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-emerald-50 border-2 border-[#1B4332]" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-[#1B4332] border-2 border-[#1B4332] text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span className="font-semibold text-[#1B4332]">Your Selection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-stone-200 border-2 border-stone-300" />
              <span className="text-stone-400">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-amber-100 border-2 border-amber-300" />
              <span className="text-stone-400">Reserved</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Tap any green desk to select</span>
          </div>
        </div>

        {/* 2-Column: Floor Blueprint Layout + Selected Seat Preview Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Floor Blueprint Map */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E1] shadow-sm relative overflow-hidden">
            {/* Architectural Entrance & Sun direction markers */}
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono mb-6 pb-3 border-b border-stone-100">
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> North Daylight Exposure
              </span>
              <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-semibold">
                ENTRANCE & SILENCE GATE
              </span>
            </div>

            {/* Zones Map Layout */}
            <div className="space-y-8">
              {zones.map((zoneName) => {
                const zoneSeats = workspace.seatMap.filter((s) => s.zone === zoneName);
                return (
                  <div key={zoneName} className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-stone-200/80">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-xs sm:text-sm text-[#1B4332] tracking-wide uppercase">
                        {zoneName}
                      </h3>
                      <span className="text-[11px] text-stone-500">
                        {zoneSeats.filter((s) => s.status === 'available').length} desks open
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {zoneSeats.map((seat) => {
                        const isSelected = selectedSeatId === seat.id;
                        const isOccupied = seat.status === 'occupied';
                        const isReserved = seat.status === 'reserved';

                        return (
                          <button
                            key={seat.id}
                            id={`seat-btn-${seat.id}`}
                            onClick={() => handleSeatClick(seat)}
                            disabled={isOccupied || isReserved}
                            className={`p-3.5 rounded-xl text-left border-2 transition-all relative flex flex-col justify-between h-24 ${
                              isSelected
                                ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-md scale-102 ring-4 ring-emerald-400/30'
                                : isOccupied
                                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                                : isReserved
                                ? 'bg-amber-50 text-amber-600 border-amber-200 cursor-not-allowed opacity-70'
                                : 'bg-white text-[#1B2A22] border-emerald-800/20 hover:border-[#1B4332] hover:bg-emerald-50/40 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-mono font-bold text-sm">{seat.number}</span>
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full bg-white text-[#1B4332] flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : (
                                <span className="text-[10px] font-medium opacity-80">{seat.type.split(' ')[0]}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 pt-2 border-t border-current/10 text-[10px]">
                              {seat.hasPower && <Zap className="w-3 h-3" />}
                              {seat.hasMonitor && <Tv className="w-3 h-3" />}
                              {seat.isWindow && <Sun className="w-3 h-3" />}
                              <span className="ml-auto font-medium">
                                {isOccupied ? 'Occupied' : isReserved ? 'Reserved' : 'Ready'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Seat Info & Quick Summary */}
          <div className="lg:col-span-4 sticky top-20">
            <div className="bg-white rounded-3xl p-6 border border-[#E5E5E1] shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Choice</span>
                  <h3 className="text-lg font-bold text-[#1B4332] mt-0.5">Desk {currentSeat.number}</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#1B4332] flex items-center justify-center">
                  <Armchair className="w-5 h-5" />
                </div>
              </div>

              {/* Desk Attributes */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-50">
                  <span className="text-stone-500">Zone Area:</span>
                  <span className="font-semibold text-stone-800">{currentSeat.zone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-50">
                  <span className="text-stone-500">Desk Type:</span>
                  <span className="font-semibold text-stone-800">{currentSeat.type}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-50">
                  <span className="text-stone-500">Power Outlet:</span>
                  <span className="font-semibold text-emerald-700">Dedicated 65W PD</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-50">
                  <span className="text-stone-500">Monitor Screen:</span>
                  <span className="font-semibold text-stone-800">
                    {currentSeat.hasMonitor ? '27" 4K Dell Included' : 'Bring your own display'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-50">
                  <span className="text-stone-500">Ergonomic Chair:</span>
                  <span className="font-semibold text-stone-800">Herman Miller Mirra</span>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="mt-5 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>{spaceType.name}</span>
                  <span>Rs {spaceType.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Duration</span>
                  <span>{selection.durationHours} hours</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#1B2A22] pt-2 border-t border-stone-200">
                  <span>Subtotal</span>
                  <span className="text-[#1B4332]">Rs {totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Continue CTA */}
              <button
                id="seat-map-checkout-btn"
                onClick={handleContinue}
                className="w-full mt-5 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
              >
                <span>Continue to Checkout</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar on Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5E1] p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-stone-500 font-medium">Selected: Desk {currentSeat.number}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#1B4332]">Rs {totalCost.toFixed(2)}</span>
              <span className="text-xs text-stone-400">({selection.durationHours}h)</span>
            </div>
          </div>

          <button
            id="mobile-seat-checkout-btn"
            onClick={handleContinue}
            className="flex-1 min-h-[44px] py-3 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Confirm & Review</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
