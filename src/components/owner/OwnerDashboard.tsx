import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Banknote,
  TrendingUp,
  UserPlus,
  Grid,
  Layers,
  Sparkles,
  Phone,
  Search,
  Check,
  X,
  AlertCircle,
  Zap,
  Wifi,
  ChevronRight,
  Shield,
  Sun,
  Laptop,
  ArrowRight,
  FileText,
  CreditCard,
  Wallet,
  RefreshCw,
  Edit2,
  Sliders,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  OwnerTab,
  OwnerActivity,
  WorkspaceZone,
  OwnerSeat,
  OwnerBookingItem,
  OwnerSeatStatus,
} from '../../types';
import {
  OWNER_PROFILE,
  MOCK_OWNER_STATS,
  MOCK_RECENT_ACTIVITIES,
  MOCK_WORKSPACE_ZONES,
  INITIAL_OWNER_SEATS,
  INITIAL_OWNER_BOOKINGS,
} from '../../data/ownerAdminMockData';
import { Navbar } from '../Navbar';
import { LogOut } from 'lucide-react';

interface OwnerDashboardProps {
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  onLogout?: () => void;
  onSwitchToCustomer?: () => void;
}

export function OwnerDashboard({ onShowToast, onLogout, onSwitchToCustomer }: OwnerDashboardProps) {
  const [currentTab, setCurrentTab] = useState<OwnerTab>('home');
  const [seats, setSeats] = useState<OwnerSeat[]>(INITIAL_OWNER_SEATS);
  const [zones, setZones] = useState<WorkspaceZone[]>(MOCK_WORKSPACE_ZONES);
  const [bookings, setBookings] = useState<OwnerBookingItem[]>(INITIAL_OWNER_BOOKINGS);
  const [activities, setActivities] = useState<OwnerActivity[]>(MOCK_RECENT_ACTIVITIES);

  // Selected seat for modal inspect/edit
  const [selectedSeatForModal, setSelectedSeatForModal] = useState<OwnerSeat | null>(null);

  // Filter states
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled'>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [seatMapZoneFilter, setSeatMapZoneFilter] = useState<string>('all');

  // Walk-in form state
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInZoneId, setWalkInZoneId] = useState('zone-1');
  const [walkInSeatId, setWalkInSeatId] = useState('');
  const [walkInDuration, setWalkInDuration] = useState(2);
  const [walkInPaymentMethod, setWalkInPaymentMethod] = useState<'Cash' | 'Card' | 'eSewa'>('Cash');

  // Edit Zone Modal state
  const [editingZone, setEditingZone] = useState<WorkspaceZone | null>(null);

  // View booking ticket modal
  const [viewingBooking, setViewingBooking] = useState<OwnerBookingItem | null>(null);

  // Dynamic calculations
  const occupiedSeatsCount = seats.filter((s) => s.status === 'occupied').length;
  const availableSeatsCount = seats.filter((s) => s.status === 'available').length;
  const reservedSeatsCount = seats.filter((s) => s.status === 'reserved').length;
  const maintenanceSeatsCount = seats.filter((s) => s.status === 'maintenance').length;
  const occupancyPercent = Math.round((occupiedSeatsCount / seats.length) * 100);

  const todayRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.amount, 0);

  // --- ACTIONS ---

  // Update seat status
  const handleUpdateSeatStatus = (seatId: string, newStatus: OwnerSeatStatus) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          return {
            ...seat,
            status: newStatus,
            currentOccupant: newStatus === 'available' ? undefined : seat.currentOccupant,
          };
        }
        return seat;
      })
    );

    const seat = seats.find((s) => s.id === seatId);
    if (seat) {
      onShowToast(
        `Seat ${seat.number} Updated`,
        `Status changed to ${newStatus.toUpperCase()}`,
        'success'
      );
    }
    setSelectedSeatForModal(null);
  };

  // Submit Walk-in Booking
  const handleConfirmWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      onShowToast('Missing Name', 'Please enter the guest’s name.', 'error');
      return;
    }
    if (!walkInSeatId) {
      onShowToast('Select a Seat', 'Please pick an available seat from the grid.', 'error');
      return;
    }

    const targetSeat = seats.find((s) => s.id === walkInSeatId);
    const targetZone = zones.find((z) => z.id === walkInZoneId) || zones[0];
    const cost = (targetZone.hourlyRate || 60) * walkInDuration;
    const bookingCode = `SS-WALK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: OwnerBookingItem = {
      id: `ob-walk-${Date.now()}`,
      bookingCode,
      guestName: walkInName.trim(),
      guestPhone: walkInPhone.trim() || 'N/A',
      seatNumber: targetSeat?.number || 'Desk',
      zoneName: targetZone.name,
      startTime: 'Now',
      endTime: `+${walkInDuration} hrs`,
      durationHours: walkInDuration,
      amount: cost,
      paymentMethod: walkInPaymentMethod,
      status: 'checked_in',
      isWalkIn: true,
    };

    // Update Bookings
    setBookings((prev) => [newBooking, ...prev]);

    // Update Seat Status to Occupied
    setSeats((prev) =>
      prev.map((s) =>
        s.id === walkInSeatId
          ? {
              ...s,
              status: 'occupied',
              currentOccupant: {
                name: walkInName.trim(),
                phone: walkInPhone.trim(),
                bookingCode,
                startTime: 'Now',
                endTime: `+${walkInDuration} hrs`,
                paymentMethod: walkInPaymentMethod,
                paidAmount: cost,
              },
            }
          : s
      )
    );

    // Add to activity feed
    const newActivity: OwnerActivity = {
      id: `act-${Date.now()}`,
      type: 'walk_in',
      guestName: walkInName.trim(),
      seatNumber: targetSeat?.number || '',
      timestamp: 'Just now',
      details: `Walk-in checked in (${walkInDuration} hrs, Rs ${cost})`,
      amount: cost,
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Reset Form
    setWalkInName('');
    setWalkInPhone('');
    setWalkInSeatId('');
    setWalkInDuration(2);

    onShowToast(
      'Walk-in Confirmed!',
      `${newBooking.guestName} seated at ${newBooking.seatNumber} (Rs ${cost} ${walkInPaymentMethod})`,
      'success'
    );
    setCurrentTab('bookings');
  };

  // Check-in a confirmed booking
  const handleCheckInBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'checked_in' } : b))
    );
    const b = bookings.find((item) => item.id === bookingId);
    if (b) {
      // Mark seat occupied
      setSeats((prev) =>
        prev.map((s) =>
          s.number === b.seatNumber
            ? {
                ...s,
                status: 'occupied',
                currentOccupant: {
                  name: b.guestName,
                  phone: b.guestPhone,
                  bookingCode: b.bookingCode,
                  startTime: b.startTime,
                  endTime: b.endTime,
                  paymentMethod: b.paymentMethod,
                  paidAmount: b.amount,
                },
              }
            : s
        )
      );

      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: 'check_in',
          guestName: b.guestName,
          seatNumber: b.seatNumber,
          timestamp: 'Just now',
          details: `Digital pass check-in confirmed`,
          amount: b.amount,
        },
        ...prev,
      ]);

      onShowToast(
        'Guest Checked In',
        `${b.guestName} checked into ${b.seatNumber}`,
        'success'
      );
    }
  };

  // Mark booking completed and release seat
  const handleCompleteBooking = (bookingId: string) => {
    const b = bookings.find((item) => item.id === bookingId);
    setBookings((prev) =>
      prev.map((item) => (item.id === bookingId ? { ...item, status: 'completed' } : item))
    );
    if (b) {
      setSeats((prev) =>
        prev.map((s) =>
          s.number === b.seatNumber
            ? { ...s, status: 'available', currentOccupant: undefined }
            : s
        )
      );
      onShowToast(
        'Session Completed',
        `Desk ${b.seatNumber} has been released to Available`,
        'info'
      );
    }
  };

  // Cancel booking
  const handleCancelBooking = (bookingId: string) => {
    const b = bookings.find((item) => item.id === bookingId);
    setBookings((prev) =>
      prev.map((item) => (item.id === bookingId ? { ...item, status: 'cancelled' } : item))
    );
    if (b) {
      setSeats((prev) =>
        prev.map((s) =>
          s.number === b.seatNumber
            ? { ...s, status: 'available', currentOccupant: undefined }
            : s
        )
      );
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: 'cancellation',
          guestName: b.guestName,
          seatNumber: b.seatNumber,
          timestamp: 'Just now',
          details: `Booking ${b.bookingCode} cancelled by desk manager`,
          amount: -b.amount,
        },
        ...prev,
      ]);
      onShowToast('Booking Cancelled', `Seat ${b.seatNumber} freed`, 'info');
    }
  };

  // Filtered lists
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter =
      bookingFilter === 'all' ? true : b.status === bookingFilter;
    const matchesSearch =
      b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.seatNumber.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredSeats = seats.filter((s) => {
    if (seatMapZoneFilter === 'all') return true;
    return s.zoneId === seatMapZoneFilter;
  });

  // Available seats for walk-in picker
  const availableSeatsForWalkIn = seats.filter(
    (s) => s.status === 'available' && s.zoneId === walkInZoneId
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1B2A22] pb-24 md:pb-12">
      {/* Unified Shared Navbar in Owner Mode */}
      <Navbar
        role="owner"
        ownerTab={currentTab}
        onOwnerTabChange={(tab) => setCurrentTab(tab)}
        ownerPendingBookings={bookings.filter((b) => b.status === 'confirmed').length}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ======================================================== */}
        {/* 1. DASHBOARD HOME */}
        {/* ======================================================== */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#1B4332] text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Birtamode Venue Host Console</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332] tracking-tight">
                  Hello, {OWNER_PROFILE.name} 👋
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Managing <span className="font-semibold text-stone-700">{OWNER_PROFILE.businessName}</span> • Muktinath Chowk, Birtamode
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  id="quick-action-walkin"
                  onClick={() => setCurrentTab('walkin')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add Walk-in</span>
                </button>
                <button
                  type="button"
                  id="quick-action-manage-seats"
                  onClick={() => setCurrentTab('seatmap')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors border border-stone-200"
                >
                  <Grid className="w-4 h-4" />
                  <span>Manage Seats</span>
                </button>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Occupancy */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Current Occupancy</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1B4332]">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1B4332]">
                    {occupancyPercent}%
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    ({occupiedSeatsCount}/{seats.length} seats)
                  </span>
                </div>
                <div className="mt-3 w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#1B4332] h-full rounded-full transition-all duration-500"
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>

              {/* Card 2: Seats Available */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Seats Available</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-700">
                    {availableSeatsCount}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">ready to book</span>
                </div>
                <p className="mt-3 text-[11px] text-stone-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {reservedSeatsCount} reserved for afternoon
                </p>
              </div>

              {/* Card 3: Today's Bookings */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Today's Bookings</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                    {bookings.length}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">sessions</span>
                </div>
                <p className="mt-3 text-[11px] text-amber-700 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +14% vs yesterday
                </p>
              </div>

              {/* Card 4: Revenue Today */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Revenue Today (NPR)</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1B4332]">
                    <Banknote className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1B4332]">
                    Rs {todayRevenue.toLocaleString()}
                  </span>
                </div>
                <p className="mt-3 text-[11px] text-emerald-700 font-medium">
                  Across app & offline cash walk-ins
                </p>
              </div>
            </div>

            {/* Main Content Grid: Live Floor Snapshot & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Zone Status Overview */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#1B4332]" />
                    <span>Workspace Zones Snapshot</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('workspaces')}
                    className="text-xs font-semibold text-[#1B4332] hover:underline flex items-center gap-1"
                  >
                    <span>View all zones</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {zones.map((zone) => {
                    const zoneSeats = seats.filter((s) => s.zoneId === zone.id);
                    const zoneOccupied = zoneSeats.filter((s) => s.status === 'occupied').length;
                    const zoneAvailable = zoneSeats.filter((s) => s.status === 'available').length;
                    const pct = zoneSeats.length ? Math.round((zoneOccupied / zoneSeats.length) * 100) : 0;

                    return (
                      <div
                        key={zone.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500/40 transition-all cursor-pointer"
                        onClick={() => {
                          setSeatMapZoneFilter(zone.id);
                          setCurrentTab('seatmap');
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-stone-900">{zone.name}</h4>
                            <p className="text-[11px] text-stone-500 mt-0.5">Rs {zone.hourlyRate}/hr</p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              zone.status === 'Filling Fast'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {zone.status}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-stone-600">
                          <span>{zoneAvailable} seats free</span>
                          <span className="font-semibold text-stone-900">{pct}% filled</span>
                        </div>

                        <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#1B4332] h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Venue Quick Features in Birtamode */}
                <div className="bg-[#1B4332] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-300" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                        Power & Fiber Redundancy
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100">
                      Dual Solar Inverter active. WorldLink 200 Mbps fiber line reporting 0ms latency.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onShowToast('System Health Optimal', 'All backup systems running normally in Birtamode.')}
                    className="px-3.5 py-2 bg-white/15 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    Check Health
                  </button>
                </div>
              </div>

              {/* Right Col: Recent Activity Feed */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Recent Activity Feed
                  </h3>
                  <span className="text-[10px] text-stone-400">Live updates</span>
                </div>

                <div className="space-y-3">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3 text-xs">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          act.type === 'check_in'
                            ? 'bg-emerald-100 text-emerald-800'
                            : act.type === 'walk_in'
                            ? 'bg-blue-100 text-blue-800'
                            : act.type === 'cancellation'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {act.type === 'check_in' && <Check className="w-3.5 h-3.5" />}
                        {act.type === 'walk_in' && <UserPlus className="w-3.5 h-3.5" />}
                        {act.type === 'cancellation' && <X className="w-3.5 h-3.5" />}
                        {act.type === 'extension' && <Clock className="w-3.5 h-3.5" />}
                        {act.type === 'booking_created' && <Calendar className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-stone-900 truncate">
                            {act.guestName}{' '}
                            <span className="text-stone-400 font-normal">({act.seatNumber})</span>
                          </p>
                          <span className="text-[10px] text-stone-400">{act.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">{act.details}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentTab('bookings')}
                  className="w-full py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition-colors border border-stone-200"
                >
                  View Full Day Ledger
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. WORKSPACE MANAGEMENT */}
        {/* ======================================================== */}
        {currentTab === 'workspaces' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-[#1B4332]">Workspace Zones Management</h1>
                <p className="text-xs text-stone-500 mt-1">
                  Configure seating sections, hourly pricing, and capacity for Mechi Study Pavilion.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onShowToast('New Zone', 'Zone creation modal ready for next revision.')}
                className="px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                + Add New Zone
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones.map((zone) => {
                const zoneSeats = seats.filter((s) => s.zoneId === zone.id);
                const zoneOccupied = zoneSeats.filter((s) => s.status === 'occupied').length;
                const zoneAvailable = zoneSeats.filter((s) => s.status === 'available').length;

                return (
                  <div
                    key={zone.id}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B4332] flex items-center justify-center">
                          {zone.iconName === 'Laptop' && <Laptop className="w-5 h-5" />}
                          {zone.iconName === 'Users' && <Users className="w-5 h-5" />}
                          {zone.iconName === 'Shield' && <Shield className="w-5 h-5" />}
                          {zone.iconName === 'Sun' && <Sun className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-stone-900">{zone.name}</h3>
                          <p className="text-xs text-stone-500">{zone.tagline}</p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          zone.status === 'Filling Fast'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {zone.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-stone-50 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Total Units</span>
                        <span className="font-bold text-stone-800">{zone.totalSeats} Desks</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Occupied</span>
                        <span className="font-bold text-emerald-700">{zoneOccupied} Active</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Hourly Rate</span>
                        <span className="font-bold text-[#1B4332]">Rs {zone.hourlyRate}/hr</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-500">
                      <span className="font-semibold text-stone-700">Amenities:</span> {zone.amenitiesSummary}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setEditingZone(zone)}
                        className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Pricing & Info</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSeatMapZoneFilter(zone.id);
                          setCurrentTab('seatmap');
                        }}
                        className="flex-1 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span>View on Map</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. SEAT MAP */}
        {/* ======================================================== */}
        {currentTab === 'seatmap' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-[#1B4332]">Interactive Floor & Seat Map</h1>
                <p className="text-xs text-stone-500 mt-1">
                  Click any seat to inspect current guest details, change status, or release.
                </p>
              </div>

              {/* Zone Filter Pill Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSeatMapZoneFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    seatMapZoneFilter === 'all'
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  All Desks ({seats.length})
                </button>
                {zones.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setSeatMapZoneFilter(z.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      seatMapZoneFilter === z.id
                        ? 'bg-[#1B4332] text-white'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {z.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color-Coded Status Legend */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="font-semibold text-stone-700">Status Legend:</span>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 border border-emerald-600" />
                  <span className="text-stone-600">Available ({availableSeatsCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-stone-800 border border-stone-900" />
                  <span className="text-stone-600">Occupied ({occupiedSeatsCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-amber-400 border border-amber-500" />
                  <span className="text-stone-600">Reserved ({reservedSeatsCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-rose-400 border border-rose-500" />
                  <span className="text-stone-600">Maintenance ({maintenanceSeatsCount})</span>
                </div>
              </div>
            </div>

            {/* Visual Grid of Seats */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {filteredSeats.map((seat) => {
                  let statusBg = 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:border-emerald-500';
                  if (seat.status === 'occupied') {
                    statusBg = 'bg-stone-800 border-stone-900 text-white hover:bg-stone-700';
                  } else if (seat.status === 'reserved') {
                    statusBg = 'bg-amber-50 border-amber-300 text-amber-900 hover:border-amber-500';
                  } else if (seat.status === 'maintenance') {
                    statusBg = 'bg-rose-50 border-rose-300 text-rose-900 hover:border-rose-500';
                  }

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      id={`owner-seat-${seat.id}`}
                      onClick={() => setSelectedSeatForModal(seat)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-150 flex flex-col justify-between h-28 relative group cursor-pointer shadow-xs ${statusBg}`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="font-mono font-bold text-sm tracking-tight">
                          {seat.number}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                          {seat.status}
                        </span>
                      </div>

                      <div className="mt-1">
                        <p className="text-[10px] font-medium truncate opacity-75">
                          {seat.zoneName.replace('Individual ', '')}
                        </p>
                        {seat.currentOccupant ? (
                          <p className="text-[11px] font-semibold truncate mt-0.5">
                            {seat.currentOccupant.name}
                          </p>
                        ) : (
                          <p className="text-[10px] opacity-60 mt-0.5">Click to allocate</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] opacity-60">
                        {seat.hasPower && <Zap className="w-2.5 h-2.5" />}
                        {seat.hasMonitor && <Laptop className="w-2.5 h-2.5" />}
                        {seat.isWindow && <Sun className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. NEW WALK-IN BOOKING FORM */}
        {/* ======================================================== */}
        {currentTab === 'walkin' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-xl font-bold text-[#1B4332]">New Walk-in Booking</h1>
              <p className="text-xs text-stone-500 mt-1">
                Manually register an in-person guest at the front desk in Birtamode.
              </p>
            </div>

            <form
              onSubmit={handleConfirmWalkIn}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5"
            >
              {/* Guest Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Guest Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    placeholder="e.g. Sujan Karki"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#1B4332] bg-stone-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    placeholder="e.g. 98526 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#1B4332] bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Workspace Zone Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Select Workspace Zone
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {zones.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => {
                        setWalkInZoneId(z.id);
                        setWalkInSeatId('');
                      }}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        walkInZoneId === z.id
                          ? 'border-[#1B4332] bg-emerald-50/60 text-[#1B4332] font-semibold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{z.name}</span>
                        <span className="font-bold">Rs {z.hourlyRate}/hr</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Session Duration
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 8].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setWalkInDuration(hrs)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                        walkInDuration === hrs
                          ? 'bg-[#1B4332] text-white border-[#1B4332]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {hrs === 8 ? 'Full Day' : `${hrs} hr${hrs > 1 ? 's' : ''}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seat Picker */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Pick an Available Seat ({availableSeatsForWalkIn.length} free in this zone)
                </label>
                {availableSeatsForWalkIn.length === 0 ? (
                  <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl">
                    No seats currently available in this zone. Please select another zone above.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableSeatsForWalkIn.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setWalkInSeatId(s.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          walkInSeatId === s.id
                            ? 'bg-[#1B4332] text-white border-[#1B4332] font-bold shadow-xs'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-400 font-semibold'
                        }`}
                      >
                        <span className="font-mono text-xs block">{s.number}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method Toggle */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Cash', label: 'Cash at Counter', icon: Wallet },
                    { id: 'Card', label: 'POS Debit/Card', icon: CreditCard },
                    { id: 'eSewa', label: 'eSewa / QR', icon: Banknote },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setWalkInPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                          walkInPaymentMethod === m.id
                            ? 'border-[#1B4332] bg-emerald-50 text-[#1B4332]'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation & Confirm */}
              {(() => {
                const zone = zones.find((z) => z.id === walkInZoneId) || zones[0];
                const totalCost = zone.hourlyRate * walkInDuration;

                return (
                  <div className="pt-4 border-t border-stone-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">Rate: Rs {zone.hourlyRate}/hr × {walkInDuration} hrs</span>
                      <span className="text-base font-bold text-[#1B4332]">Total: Rs {totalCost}</span>
                    </div>

                    <button
                      type="submit"
                      id="confirm-walkin-btn"
                      className="w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      Confirm Walk-in & Issue Desk
                    </button>
                  </div>
                );
              })()}
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. TODAY'S BOOKINGS */}
        {/* ======================================================== */}
        {currentTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-[#1B4332]">Today's Guest Bookings</h1>
                <p className="text-xs text-stone-500 mt-1">
                  Manage digital pass check-ins, extensions, and walk-in records.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentTab('walkin')}
                className="px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                + Add Walk-in
              </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'All', count: bookings.length },
                  { id: 'confirmed', label: 'Confirmed', count: bookings.filter((b) => b.status === 'confirmed').length },
                  { id: 'checked_in', label: 'Checked-in', count: bookings.filter((b) => b.status === 'checked_in').length },
                  { id: 'completed', label: 'Completed', count: bookings.filter((b) => b.status === 'completed').length },
                  { id: 'cancelled', label: 'Cancelled', count: bookings.filter((b) => b.status === 'cancelled').length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBookingFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      bookingFilter === tab.id
                        ? 'bg-[#1B4332] text-white'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search guest or code..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#1B4332]"
                />
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-xs">
                  No bookings found matching your search.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                    >
                      {/* Left: Guest Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-stone-900">{b.guestName}</span>
                          <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                            {b.bookingCode}
                          </span>
                          {b.isWalkIn && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              Walk-in
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            Desk {b.seatNumber} ({b.zoneName})
                          </span>
                          <span>• {b.startTime} to {b.endTime} ({b.durationHours} hrs)</span>
                          <span>• Rs {b.amount} ({b.paymentMethod})</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {b.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleCheckInBooking(b.id)}
                            className="px-3 py-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Check-in</span>
                          </button>
                        )}

                        {b.status === 'checked_in' && (
                          <button
                            type="button"
                            onClick={() => handleCompleteBooking(b.id)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition-colors border border-emerald-200"
                          >
                            Release Seat
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setViewingBooking(b)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                        >
                          View Pass
                        </button>

                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(b.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Cancel Booking"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. SETTINGS */}
        {/* ======================================================== */}
        {currentTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-xl font-bold text-[#1B4332]">Venue Profile & Settings</h1>
              <p className="text-xs text-stone-500 mt-1">
                Configure business information, solar backup thresholds, and network details.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Venue Information
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-500 block mb-1">Business Name</label>
                  <input
                    type="text"
                    defaultValue={OWNER_PROFILE.businessName}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-1">Address in Birtamode</label>
                  <input
                    type="text"
                    defaultValue={OWNER_PROFILE.address}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-500 block mb-1">PAN / VAT Number</label>
                    <input
                      type="text"
                      defaultValue={OWNER_PROFILE.panNumber}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-stone-500 block mb-1">Operating Hours</label>
                    <input
                      type="text"
                      defaultValue={OWNER_PROFILE.operatingHours}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Power & Wi-Fi Configuration
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-stone-500 block mb-1">Wi-Fi SSID</label>
                    <input
                      type="text"
                      defaultValue="Mechi_Member_5G"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-stone-500 block mb-1">Wi-Fi Password</label>
                    <input
                      type="text"
                      defaultValue="shantifocus2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onShowToast('Settings Saved', 'Venue details updated in Birtamode registry.', 'success')}
                className="w-full py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>

            {/* Account & Session Management */}
            {onLogout && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Account Session
                </h3>
                <p className="text-xs text-stone-500">
                  Logged in as Ramesh Adhikari (Mechi Study Pavilion Owner).
                </p>
                <button
                  type="button"
                  id="owner-settings-logout-btn"
                  onClick={onLogout}
                  className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Owner Portal</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* SEAT INSPECT / STATUS MODAL */}
      {/* ======================================================== */}
      {selectedSeatForModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-stone-400">Desk Details</span>
                <h3 className="text-lg font-bold text-[#1B4332]">
                  Seat {selectedSeatForModal.number} ({selectedSeatForModal.zoneName})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSeatForModal(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Occupant Info if occupied */}
            {selectedSeatForModal.currentOccupant ? (
              <div className="p-4 bg-stone-50 rounded-xl space-y-2 text-xs border border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Current Occupant:</span>
                  <span className="font-bold text-stone-900">{selectedSeatForModal.currentOccupant.name}</span>
                </div>
                {selectedSeatForModal.currentOccupant.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Phone:</span>
                    <span className="font-medium text-stone-700">{selectedSeatForModal.currentOccupant.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Pass Code:</span>
                  <span className="font-mono font-bold text-[#1B4332]">{selectedSeatForModal.currentOccupant.bookingCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Session Window:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedSeatForModal.currentOccupant.startTime} – {selectedSeatForModal.currentOccupant.endTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-800">
                    Rs {selectedSeatForModal.currentOccupant.paidAmount} ({selectedSeatForModal.currentOccupant.paymentMethod})
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                This seat is currently unassigned and available for booking or walk-in assignment.
              </p>
            )}

            {/* Change Status Controls */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Set Seat Status:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateSeatStatus(selectedSeatForModal.id, 'available')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSeatForModal.status === 'available'
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  Mark Available
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateSeatStatus(selectedSeatForModal.id, 'occupied')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSeatForModal.status === 'occupied'
                      ? 'bg-stone-800 text-white border-stone-900'
                      : 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  Mark Occupied
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateSeatStatus(selectedSeatForModal.id, 'reserved')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSeatForModal.status === 'reserved'
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Mark Reserved
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateSeatStatus(selectedSeatForModal.id, 'maintenance')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSeatForModal.status === 'maintenance'
                      ? 'bg-rose-600 text-white border-rose-700'
                      : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  Maintenance
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSeatForModal(null)}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT ZONE MODAL */}
      {/* ======================================================== */}
      {editingZone && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-[#1B4332]">Edit Zone: {editingZone.name}</h3>
              <button
                type="button"
                onClick={() => setEditingZone(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-500 block mb-1">Hourly Rate (NPR)</label>
                <input
                  type="number"
                  value={editingZone.hourlyRate}
                  onChange={(e) =>
                    setEditingZone({ ...editingZone, hourlyRate: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-stone-500 block mb-1">Status</label>
                <select
                  value={editingZone.status}
                  onChange={(e) =>
                    setEditingZone({ ...editingZone, status: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="Filling Fast">Filling Fast</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="text-stone-500 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingZone.tagline}
                  onChange={(e) =>
                    setEditingZone({ ...editingZone, tagline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setZones((prev) =>
                    prev.map((z) => (z.id === editingZone.id ? editingZone : z))
                  );
                  onShowToast('Zone Updated', `${editingZone.name} settings saved.`, 'success');
                  setEditingZone(null);
                }}
                className="flex-1 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingZone(null)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW BOOKING TICKET MODAL */}
      {/* ======================================================== */}
      {viewingBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#52B788]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                  Digital Pass Detail
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingBooking(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#1B4332] text-white p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-emerald-200 uppercase font-semibold">Pass Code</p>
                  <p className="font-mono font-bold text-lg">{viewingBooking.bookingCode}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-100 font-bold capitalize">
                  {viewingBooking.status}
                </span>
              </div>

              <div className="border-t border-white/10 pt-3 space-y-1 text-xs">
                <p className="font-semibold text-white">{viewingBooking.guestName}</p>
                <p className="text-emerald-100 text-[11px]">Seat {viewingBooking.seatNumber} • {viewingBooking.zoneName}</p>
                <p className="text-emerald-200 text-[11px]">{viewingBooking.startTime} – {viewingBooking.endTime}</p>
              </div>

              <div className="border-t border-white/10 pt-2 flex justify-between items-center text-xs">
                <span className="text-emerald-200">Paid Amount</span>
                <span className="font-bold text-white">Rs {viewingBooking.amount} ({viewingBooking.paymentMethod})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewingBooking(null)}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
