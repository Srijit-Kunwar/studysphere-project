import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Zap,
  Wifi,
  Volume2,
  Heart,
  Grid,
  Map,
  ArrowUpDown,
  Check,
  Sparkles,
  Users,
} from 'lucide-react';
import { Workspace } from '../types';

interface ExploreScreenProps {
  workspaces: Workspace[];
  onSelectWorkspace: (workspace: Workspace) => void;
  initialQuery?: string;
  initialCategory?: string;
  savedFavorites: string[];
  onToggleFavorite: (workspaceId: string) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export function ExploreScreen({
  workspaces,
  onSelectWorkspace,
  initialQuery = '',
  initialCategory = 'All',
  savedFavorites,
  onToggleFavorite,
  onShowToast,
}: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState<string>(initialCategory === 'All' ? 'All' : initialCategory);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'rating' | 'seats'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [activeMapPin, setActiveMapPin] = useState<Workspace | null>(workspaces[0]);

  const tags = [
    'All',
    'Quiet',
    'Fast Wi-Fi',
    'Power Outlets',
    'Natural Light',
    'Late Hours',
    'Cafe & Bites',
  ];

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((ws) => {
      const matchesQuery =
        searchQuery.trim() === '' ||
        ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === 'All' || ws.tags.includes(selectedTag);
      const matchesPrice = ws.pricePerHour <= maxPrice;

      return matchesQuery && matchesTag && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerHour - b.pricePerHour;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'seats') return b.availableSeatsCount - a.availableSeatsCount;
      return 0; // recommended
    });
  }, [workspaces, searchQuery, selectedTag, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 md:pb-16 text-[#1B2A22]">
      {/* Top Header & Search Area */}
      <section className="bg-white/80 backdrop-blur-md border-b border-[#E5E5E1] py-6 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="explore-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search spaces in Birtamode by name, neighborhood, or amenities..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#1B2A22] placeholder:text-stone-400 focus:outline-none focus:border-[#1B4332] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Right Controls: Sort & View Toggle */}
            <div className="flex items-center gap-3">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-medium text-stone-700 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="rating">Highest Rating</option>
                  <option value="seats">Most Seats Available</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#1B4332] shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'map'
                      ? 'bg-white text-[#1B4332] shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  aria-label="Map view"
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Chips Bar */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
            {tags.map((tag) => (
              <button
                key={tag}
                id={`filter-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 border border-stone-200/60'
                }`}
              >
                {tag}
              </button>
            ))}

            <div className="ml-auto hidden lg:flex items-center gap-2 pl-4 border-l border-stone-200">
              <span className="text-[11px] text-stone-500">Max rate:</span>
              <span className="text-xs font-bold text-[#1B4332]">Rs {maxPrice}/hr</span>
              <input
                type="range"
                min="30"
                max="150"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-20 accent-[#1B4332] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Results Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B2A22]">
              {selectedTag === 'All' ? 'All Workspaces in Birtamode' : `${selectedTag} Workspaces in Birtamode`}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Showing {filteredWorkspaces.length} peaceful locations ready for booking
            </p>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">Live Availability</span>
          </div>
        </div>

        {/* Empty state */}
        {filteredWorkspaces.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E5E1] shadow-xs max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-800">No spaces matched your filters</h3>
            <p className="text-xs text-stone-500 mt-2 mb-6">
              Try adjusting your search query, increasing your price ceiling, or switching filter tags.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('All');
                setMaxPrice(100);
              }}
              className="px-4 py-2 bg-[#1B4332] text-white text-xs font-medium rounded-lg hover:bg-[#2D6A4F] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredWorkspaces.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((ws) => {
              const isFavorited = savedFavorites.includes(ws.id);
              return (
                <div
                  key={ws.id}
                  id={`workspace-card-${ws.id}`}
                  className="bg-white rounded-3xl border border-[#E5E5E1] shadow-sm hover:shadow-xl hover:border-[#1B4332]/40 transition-all duration-300 overflow-hidden flex flex-col group relative"
                >
                  {/* Photo container */}
                  <div
                    onClick={() => onSelectWorkspace(ws)}
                    className="relative h-52 sm:h-56 overflow-hidden bg-stone-100 cursor-pointer"
                  >
                    <img
                      src={ws.heroImage}
                      alt={`${ws.name} - ${ws.category} study space located in ${ws.neighborhood}, Birtamode`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Noise meter pill */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#1B4332] border border-stone-200/80 shadow-2xs flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-[#1B4332]" />
                      <span>{ws.noiseDb} dB • {ws.noiseLevel.split(' ')[0]}</span>
                    </div>

                    {/* Live Seats availability */}
                    <div className="absolute bottom-3 left-3 bg-[#1B4332]/95 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
                      <span>{ws.availableSeatsCount} seats free</span>
                    </div>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(ws.id);
                    }}
                    className={`min-w-[44px] min-h-[44px] absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-xs flex items-center justify-center cursor-pointer ${
                      isFavorited
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-white/80 hover:bg-white text-stone-600 border border-stone-200/80 hover:text-rose-500'
                    }`}
                    aria-label="Save to favorites"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  </button>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={() => onSelectWorkspace(ws)}
                          className="font-bold text-base text-[#1B2A22] group-hover:text-[#1B4332] transition-colors line-clamp-1 cursor-pointer"
                        >
                          {ws.name}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-stone-800">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{ws.rating}</span>
                          <span className="text-[10px] text-stone-400 font-normal">({ws.reviewCount})</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{ws.neighborhood} • {ws.distance}</span>
                      </p>

                      <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                        {ws.tagline}
                      </p>

                      {/* Tag badges */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {ws.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-medium rounded-md"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom action row */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-400 font-normal">from </span>
                        <span className="text-lg font-bold text-[#1B4332]">Rs {ws.pricePerHour}</span>
                        <span className="text-xs text-stone-500">/hr</span>
                      </div>

                      <button
                        onClick={() => onSelectWorkspace(ws)}
                        className="min-h-[44px] px-3.5 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-medium rounded-xl transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
                      >
                        View & Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Map View Interactive Simulation */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Map Canvas */}
            <div className="lg:col-span-8 bg-[#E6ECE6] rounded-3xl border border-[#E5E5E1] h-[540px] relative overflow-hidden shadow-inner flex flex-col justify-between p-6">
              {/* Simulated streets / map grid background */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1B4332_1px,transparent_1px)] [background-size:24px_24px]" />
              
              {/* Top Map Context Pill */}
              <div className="relative z-10 self-start bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200 shadow-sm text-xs font-medium text-[#1B4332] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>Birtamode Study Hubs Map (Jhapa, Nepal)</span>
              </div>

              {/* Workspace Pins on Map */}
              <div className="relative w-full h-full my-auto">
                {workspaces.map((ws) => {
                  const isSelected = activeMapPin?.id === ws.id;
                  return (
                    <button
                      key={ws.id}
                      onClick={() => setActiveMapPin(ws)}
                      style={{ left: `${ws.coordinates.x}%`, top: `${ws.coordinates.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 z-20 group ${
                        isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                      }`}
                    >
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#1B4332] text-white ring-4 ring-emerald-300/60'
                            : 'bg-white text-[#1B4332] border border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#52B788]" />
                        <span>Rs {ws.pricePerHour}/hr</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Map Legend */}
              <div className="relative z-10 self-end bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Open with free desks</span>
                <span className="text-stone-300">•</span>
                <span>Click pin to view preview</span>
              </div>
            </div>

            {/* Selected Pin Preview Card */}
            <div className="lg:col-span-4">
              {activeMapPin ? (
                <div className="bg-white rounded-3xl border border-[#E5E5E1] p-5 shadow-lg">
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={activeMapPin.heroImage}
                      alt={`${activeMapPin.name} map pin preview - ${activeMapPin.address}, Birtamode`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#1B4332]">
                      {activeMapPin.noiseLevel}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-[#1B2A22]">{activeMapPin.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{activeMapPin.address}</p>

                  <div className="mt-3 flex items-center justify-between text-xs py-2 border-y border-stone-100">
                    <span className="text-stone-600">{activeMapPin.availableSeatsCount} seats available</span>
                    <span className="font-bold text-[#1B4332]">Rs {activeMapPin.pricePerHour}/hr</span>
                  </div>

                  <button
                    onClick={() => onSelectWorkspace(activeMapPin)}
                    className="w-full mt-4 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Select This Space
                  </button>
                </div>
              ) : (
                <p className="text-xs text-stone-500 text-center py-12">Click a pin on the map to preview.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
