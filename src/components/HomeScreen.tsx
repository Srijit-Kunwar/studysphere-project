import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Volume2,
  Wifi,
  Zap,
  ArrowRight,
  Star,
  ShieldCheck,
  Coffee,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Workspace } from '../types';

interface HomeScreenProps {
  workspaces: Workspace[];
  onExplore: (searchQuery?: string, category?: string) => void;
  onSelectWorkspace: (workspace: Workspace) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function HomeScreen({
  workspaces,
  onExplore,
  onSelectWorkspace,
  onShowToast,
}: HomeScreenProps) {
  const [searchLocation, setSearchLocation] = useState('Birtamode');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('2:00 PM');
  const [duration, setDuration] = useState('3 Hours');

  const featured = workspaces.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExplore(searchLocation);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 md:pb-16 text-[#1B2A22]">
      {/* Hero Section */}
      <section className="relative pt-8 pb-14 md:pt-14 md:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top subtle badge */}
          <div className="flex justify-center md:justify-start mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#D8F3DC] text-[#1B4332] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              <span>Real-Time Seat Availability Across 6 Venues in Birtamode, Jhapa</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B4332] leading-[1.15]">
                Find a peaceful place to <span className="underline decoration-[#52B788]/40 decoration-wavy underline-offset-8">study or work</span>.
              </h1>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Reserve dedicated silent carrels, sunlit cafe benches, and soundproof focus pods across Birtamode, Jhapa with guaranteed power, fast Wi-Fi, and acoustic calm.
              </p>

              {/* Serene Quick Stats Pills */}
              <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 text-xs text-stone-600">
                <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                  <Volume2 className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>Noise-rated (&lt;40 dB)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>Outlets at every seat</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                  <Wifi className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>200+ Mbps Fiber</span>
                </div>
              </div>
            </div>

            {/* Right Ambient Gallery Preview - Visible and stacked on mobile below text */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 w-full max-w-md mx-auto">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border border-[#E5E5E1] shadow-xl bg-white p-3 rotate-0 sm:rotate-1 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                    alt="Acoustically treated quiet study hall at Mechi Study Pavilion in Birtamode"
                    className="w-full h-48 sm:h-64 object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <p className="text-xs font-semibold text-[#1B4332]">{workspaces[0]?.name || 'Mechi Study Pavilion'}</p>
                      <p className="text-[11px] text-stone-500">14 seats available now • 35 dB</p>
                    </div>
                    <button
                      onClick={() => onSelectWorkspace(workspaces[0])}
                      className="min-h-[44px] px-3.5 py-2 bg-[#1B4332] text-white text-xs font-medium rounded-xl hover:bg-[#2D6A4F] transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      Book from Rs {workspaces[0]?.pricePerHour || 60}/hr
                    </button>
                  </div>
                </div>

                {/* Floating Tag */}
                <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-200 shadow-lg items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-xs">
                    98%
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-stone-800">Student Satisfaction</p>
                    <p className="text-[10px] text-stone-500">Zero noise complaints</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Peaceful Search Bar Card */}
          <div className="mt-10 sm:mt-12 bg-white rounded-3xl p-4 sm:p-6 border border-[#E5E5E1] shadow-xl shadow-stone-200/50">
            <form onSubmit={handleSearchSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
                {/* Location Input */}
                <div className="p-3 bg-stone-50/80 hover:bg-stone-50 rounded-2xl border border-stone-200/80 transition-colors">
                  <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1B4332] shrink-0" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="e.g. Muktinath Chowk, Charpane, or Main Road"
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#1B2A22] focus:outline-none placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* Date Picker */}
                <div className="p-3 bg-stone-50/80 hover:bg-stone-50 rounded-2xl border border-stone-200/80 transition-colors">
                  <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1B4332] shrink-0" />
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#1B2A22] focus:outline-none cursor-pointer"
                    >
                      <option value="Today">Today, Oct 24</option>
                      <option value="Tomorrow">Tomorrow, Oct 25</option>
                      <option value="Saturday">Saturday, Oct 26</option>
                      <option value="Sunday">Sunday, Oct 27</option>
                    </select>
                  </div>
                </div>

                {/* Time & Duration */}
                <div className="p-3 bg-stone-50/80 hover:bg-stone-50 rounded-2xl border border-stone-200/80 transition-colors">
                  <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                    Start & Duration
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1B4332] shrink-0" />
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-semibold text-[#1B2A22] focus:outline-none cursor-pointer"
                    >
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                    </select>
                    <span className="text-stone-300">•</span>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-medium text-stone-600 focus:outline-none cursor-pointer"
                    >
                      <option value="1 Hour">1 hr</option>
                      <option value="2 Hours">2 hrs</option>
                      <option value="3 Hours">3 hrs</option>
                      <option value="4 Hours">4 hrs</option>
                      <option value="Full Day">Full Day</option>
                    </select>
                  </div>
                </div>

                {/* Search CTA Button */}
                <div className="h-full flex items-center">
                  <button
                    id="home-explore-spaces-btn"
                    type="submit"
                    className="w-full h-full min-h-[52px] bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Explore Spaces</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Category Filters */}
            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap mr-1">Quick Filters:</span>
              {[
                { label: 'Whisper Quiet', query: 'Quiet' },
                { label: 'Fast Wi-Fi', query: 'Fast Wi-Fi' },
                { label: 'Outlets Guaranteed', query: 'Power Outlets' },
                { label: 'Natural Light', query: 'Natural Light' },
                { label: 'Late Night Study', query: 'Late Hours' },
                { label: 'Cafe & Espresso', query: 'Cafe & Bites' },
              ].map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => onExplore('', cat.query)}
                  className="px-3.5 py-1.5 bg-stone-100/80 hover:bg-emerald-50 hover:text-[#1B4332] hover:border-[#52B788] text-xs text-stone-700 font-medium rounded-full border border-stone-200 transition-all whitespace-nowrap"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spaces Section */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
              <span>Handpicked Sanctuaries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A22]">Popular Workspaces Near You</h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Highest rated by students and remote researchers this week
            </p>
          </div>

          <button
            id="home-view-all-explore-btn"
            onClick={() => onExplore()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B4332] hover:text-[#2D6A4F] group self-start sm:self-auto"
          >
            <span>View all 6 workspaces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((ws) => (
            <div
              key={ws.id}
              onClick={() => onSelectWorkspace(ws)}
              className="bg-white rounded-3xl border border-[#E5E5E1] shadow-sm hover:shadow-xl hover:border-[#1B4332]/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group"
            >
              {/* Photo & badges */}
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={ws.heroImage}
                  alt={`${ws.name} - ${ws.category} in ${ws.neighborhood}, Birtamode (${ws.noiseLevel})`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#1B4332] border border-stone-200">
                  {ws.noiseLevel}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-stone-800 flex items-center gap-1 border border-stone-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{ws.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="bg-[#1B4332]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg font-medium">
                    {ws.availableSeatsCount} seats available
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1B2A22] group-hover:text-[#1B4332] transition-colors line-clamp-1">
                    {ws.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{ws.neighborhood} • {ws.distance}</span>
                  </p>
                  <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {ws.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400">from </span>
                    <span className="text-lg font-bold text-[#1B4332]">Rs {ws.pricePerHour}</span>
                    <span className="text-xs text-stone-500">/hr</span>
                  </div>

                  <span className="text-xs font-semibold text-[#1B4332] group-hover:underline flex items-center gap-1">
                    <span>Select Space</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Serene Value Pillars */}
      <section className="py-12 bg-white/70 border-y border-[#E5E5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-[#1B4332]">Built for Deep, Undisturbed Focus</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Unlike ordinary cafes or crowded campus libraries, every StudySphere venue is curated for productive serenity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E1]">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#1B4332] flex items-center justify-center mb-4">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#1B2A22]">Live Noise dB Transparency</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Know the ambient volume before arriving. Venues enforce whisper policies in designated library zones.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E1]">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#1B4332] flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#1B2A22]">Guaranteed Power & Desk Reserve</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Never hunt for an outlet or hover over cafe tables. Your exact desk number and power strip are held exclusively for you.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E1]">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#1B4332] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#1B2A22]">Student Verified Discounts</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Connect university credentials to unlock 20% off all individual study carrels and group conference pods.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
