import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Volume2,
  Wifi,
  Zap,
  Coffee,
  Armchair,
  PhoneCall,
  Printer,
  Sun,
  Shield,
  Tv,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Heart,
  Share2,
  Info,
  Laptop,
  Users,
  Headphones,
} from 'lucide-react';
import { Workspace, SpaceType, BookingSelection } from '../types';

interface WorkspaceDetailScreenProps {
  workspace: Workspace;
  onBack: () => void;
  onContinueToSeatSelection: (selection: BookingSelection) => void;
  isFavorited: boolean;
  onToggleFavorite: (workspaceId: string) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function WorkspaceDetailScreen({
  workspace,
  onBack,
  onContinueToSeatSelection,
  isFavorited,
  onToggleFavorite,
  onShowToast,
}: WorkspaceDetailScreenProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSpaceType, setSelectedSpaceType] = useState<SpaceType>(
    workspace.spaceTypes[0]
  );
  const [selectedDate, setSelectedDate] = useState('Today, Oct 24');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:00 PM');
  const [durationHours, setDurationHours] = useState<number>(3);

  const images = workspace.galleryImages.length > 0 ? workspace.galleryImages : [workspace.heroImage];

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wifi':
        return <Wifi className="w-4 h-4 text-[#1B4332]" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-[#1B4332]" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-[#1B4332]" />;
      case 'Armchair':
        return <Armchair className="w-4 h-4 text-[#1B4332]" />;
      case 'PhoneCall':
        return <PhoneCall className="w-4 h-4 text-[#1B4332]" />;
      case 'Printer':
        return <Printer className="w-4 h-4 text-[#1B4332]" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-[#1B4332]" />;
      case 'Tv':
        return <Tv className="w-4 h-4 text-[#1B4332]" />;
      default:
        return <Shield className="w-4 h-4 text-[#1B4332]" />;
    }
  };

  const getSpaceTypeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-[#1B4332]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#1B4332]" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-[#1B4332]" />;
      default:
        return <Armchair className="w-5 h-5 text-[#1B4332]" />;
    }
  };

  const handleProceed = () => {
    onContinueToSeatSelection({
      workspaceId: workspace.id,
      spaceTypeId: selectedSpaceType.id,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      durationHours,
    });
  };

  const estimatedTotal = selectedSpaceType.hourlyRate * durationHours;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-36 md:pb-32 text-[#1B2A22]">
      {/* Top Breadcrumb & Action Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#E5E5E1] py-3.5 sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            id="detail-back-btn"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1B4332] p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to explore</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onToggleFavorite(workspace.id);
                onShowToast(
                  isFavorited ? 'Removed from Favorites' : 'Saved to Favorites',
                  workspace.name
                );
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorited
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              aria-label="Save workspace"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={() => {
                onShowToast('Link Copied to Clipboard', 'Share this study space with classmates');
              }}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              aria-label="Share workspace"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Workspace Title & Ratings Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F5E9] text-[#1B4332] border border-[#D8F3DC]">
              {workspace.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
              {workspace.currentStatus}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B2A22]">{workspace.name}</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>{workspace.address} ({workspace.neighborhood})</span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1 font-semibold text-stone-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{workspace.rating} ({workspace.reviewCount} reviews)</span>
            </span>
          </p>
        </div>

        {/* Gallery Section (Photo showcase) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          {/* Main Large Photo */}
          <div className="md:col-span-8 h-72 sm:h-96 rounded-3xl overflow-hidden bg-stone-100 border border-[#E5E5E1] relative shadow-xs">
            <img
              src={images[activeImageIndex]}
              alt={`${workspace.name} - Quiet study room interior in ${workspace.neighborhood}, Birtamode (photo ${activeImageIndex + 1} of ${images.length})`}
              className="w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            {/* Live acoustic level meter on photo */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-md text-xs text-[#1B4332] font-semibold flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#1B4332]" />
              <span>Acoustic Profile: {workspace.noiseLevel}</span>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="md:col-span-4 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-96">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-1 md:h-28 min-w-[100px] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-[#1B4332] shadow-md ring-2 ring-[#52B788]/40'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                title={`View ${workspace.name} photo ${idx + 1}`}
                aria-label={`View ${workspace.name} photo ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${workspace.name} study area thumbnail view ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details, About, Amenities, Space Types */}
          <div className="lg:col-span-8 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5E1] shadow-xs">
              <h2 className="text-lg font-bold text-[#1B2A22] mb-3">About This Workspace</h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {workspace.about}
              </p>

              {/* Hours & Specs row */}
              <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-stone-100 text-[#1B4332]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-stone-500 uppercase">Hours</p>
                    <p className="text-xs font-semibold text-stone-800 mt-0.5">{workspace.openHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-stone-100 text-[#1B4332]">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-stone-500 uppercase">Noise Level</p>
                    <p className="text-xs font-semibold text-stone-800 mt-0.5">{workspace.noiseDb} dB average</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-stone-100 text-[#1B4332]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-stone-500 uppercase">Available Desks</p>
                    <p className="text-xs font-semibold text-emerald-700 mt-0.5">{workspace.availableSeatsCount} seats free</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workspace Types (Cards with prices and select action) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5E1] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1B2A22]">Choose Your Workspace Type</h2>
                  <p className="text-xs text-stone-500">Pick a desk category tailored to your session needs</p>
                </div>
              </div>

              <div className="space-y-4">
                {workspace.spaceTypes.map((st) => {
                  const isSelected = selectedSpaceType.id === st.id;
                  return (
                    <div
                      key={st.id}
                      id={`space-type-${st.id}`}
                      onClick={() => setSelectedSpaceType(st)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1B4332] bg-emerald-50/40 shadow-sm ring-1 ring-[#1B4332]'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className={`p-3 rounded-2xl ${isSelected ? 'bg-[#1B4332] text-white' : 'bg-stone-100 text-[#1B4332]'}`}>
                            {getSpaceTypeIcon(st.iconName)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-[#1B2A22]">{st.name}</h3>
                              {st.popular && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#E8F5E9] text-[#1B4332] rounded-full border border-[#D8F3DC]">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-600 mt-1">{st.description}</p>

                            {/* Features list */}
                            <div className="mt-2.5 flex flex-wrap gap-2">
                              {st.features.map((f, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-white px-2 py-0.5 rounded-md border border-stone-200"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-[#1B4332]" />
                                  <span>{f}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Price & Selection Button */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                          <div>
                            <span className="text-base sm:text-lg font-bold text-[#1B4332]">Rs {st.hourlyRate}</span>
                            <span className="text-xs text-stone-500">/hr</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSpaceType(st);
                            }}
                            className={`mt-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-[#1B4332] text-white shadow-xs'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5E1] shadow-xs">
              <h2 className="text-lg font-bold text-[#1B2A22] mb-1">Included Amenities</h2>
              <p className="text-xs text-stone-500 mb-5">Everything provided free with your desk booking</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {workspace.amenities.map((am, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-white text-[#1B4332] shadow-2xs">
                      {getAmenityIcon(am.icon)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1B2A22]">{am.name}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{am.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Desktop Booking Widget */}
          <div className="hidden lg:block lg:col-span-4 sticky top-36">
            <div className="bg-white rounded-3xl p-6 border border-[#E5E5E1] shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-2xl font-bold text-[#1B4332]">Rs {selectedSpaceType.hourlyRate}</span>
                  <span className="text-xs text-stone-500"> / hour</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Instant Confirmation
                  </span>
                </div>
              </div>

              {/* Date / Time / Duration selectors */}
              <div className="space-y-3.5 mt-5">
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-[#1B2A22] focus:outline-none focus:border-[#1B4332] cursor-pointer"
                  >
                    <option value="Today, Oct 24">Today, Oct 24</option>
                    <option value="Tomorrow, Oct 25">Tomorrow, Oct 25</option>
                    <option value="Saturday, Oct 26">Saturday, Oct 26</option>
                    <option value="Sunday, Oct 27">Sunday, Oct 27</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                      Start Time
                    </label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-[#1B2A22] focus:outline-none focus:border-[#1B4332] cursor-pointer"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                      Duration
                    </label>
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(parseInt(e.target.value))}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-[#1B2A22] focus:outline-none focus:border-[#1B4332] cursor-pointer"
                    >
                      <option value="1">1 Hour</option>
                      <option value="2">2 Hours</option>
                      <option value="3">3 Hours</option>
                      <option value="4">4 Hours</option>
                      <option value="6">6 Hours</option>
                      <option value="8">Full Day (8h)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                  <div className="flex justify-between text-stone-600 mb-1">
                    <span>{selectedSpaceType.name}</span>
                    <span>Rs {selectedSpaceType.hourlyRate} × {durationHours}h</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-200">
                    <span>Estimated Total</span>
                    <span className="text-[#1B4332]">Rs {estimatedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Continue to Seat Map */}
              <button
                id="desktop-select-seat-cta"
                onClick={handleProceed}
                className="w-full mt-5 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Your Seat on Map</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5E1] p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-stone-500 font-medium">Estimated for {durationHours} hrs</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#1B4332]">Rs {estimatedTotal.toFixed(2)}</span>
              <span className="text-xs text-stone-400">(Rs {selectedSpaceType.hourlyRate}/h)</span>
            </div>
          </div>

          <button
            id="mobile-select-seat-cta"
            onClick={handleProceed}
            className="flex-1 py-3 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Select Your Seat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
