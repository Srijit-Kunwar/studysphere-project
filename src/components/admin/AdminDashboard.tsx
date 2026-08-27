import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Clock,
  Banknote,
  Search,
  Eye,
  FileCheck,
  Check,
  X,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertTriangle,
  Send,
  Sparkles,
  TrendingUp,
  Store,
  Layers,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AdminTab,
  OwnerVerificationRequest,
  PlatformDispute,
  DisputeCategory,
  VerificationDocument,
} from '../../types';
import {
  MOCK_ADMIN_STATS,
  INITIAL_VERIFICATION_REQUESTS,
  INITIAL_PLATFORM_DISPUTES,
} from '../../data/ownerAdminMockData';
import { Navbar } from '../Navbar';
import { LogOut } from 'lucide-react';

interface AdminDashboardProps {
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  onLogout?: () => void;
  onSwitchToCustomer?: () => void;
  initialTab?: AdminTab;
}

export function AdminDashboard({
  onShowToast,
  onLogout,
  onSwitchToCustomer,
  initialTab = 'owners',
}: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);
  const [verificationRequests, setVerificationRequests] = useState<OwnerVerificationRequest[]>(
    INITIAL_VERIFICATION_REQUESTS
  );
  const [disputes, setDisputes] = useState<PlatformDispute[]>(INITIAL_PLATFORM_DISPUTES);

  // Document review modal state
  const [selectedReviewRequest, setSelectedReviewRequest] = useState<OwnerVerificationRequest | null>(
    null
  );
  const [previewDocument, setPreviewDocument] = useState<VerificationDocument | null>(null);

  // Dispute investigation modal state
  const [selectedDispute, setSelectedDispute] = useState<PlatformDispute | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Filters
  const [disputeFilter, setDisputeFilter] = useState<'All' | DisputeCategory>('All');
  const [disputeSearch, setDisputeSearch] = useState('');
  const [ownerSearch, setOwnerSearch] = useState('');

  // Dynamic calculations
  const pendingRequestsCount = verificationRequests.filter((r) => r.status === 'pending').length;
  const activeDisputesCount = disputes.filter((d) => d.status === 'Active').length;
  const highPriorityDisputesCount = disputes.filter(
    (d) => d.status === 'Active' && d.priority === 'High'
  ).length;

  // --- ACTIONS ---

  // Approve Owner Request
  const handleApproveOwner = (requestId: string) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );
    const req = verificationRequests.find((r) => r.id === requestId);
    if (req) {
      onShowToast(
        'Venue Approved & Activated',
        `${req.businessName} is now live on the Birtamode network!`,
        'success'
      );
    }
    setSelectedReviewRequest(null);
  };

  // Reject Owner Request
  const handleRejectOwner = (requestId: string) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
    const req = verificationRequests.find((r) => r.id === requestId);
    if (req) {
      onShowToast(
        'Request Rejected',
        `Notification sent to ${req.ownerName} with revision guidelines.`,
        'info'
      );
    }
    setSelectedReviewRequest(null);
  };

  // Resolve Dispute
  const handleResolveDispute = (disputeId: string, customMessage?: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: 'Resolved',
              timeline: [
                ...d.timeline,
                {
                  time: 'Just now',
                  sender: 'Admin System',
                  message: customMessage || 'Dispute investigated and marked as Resolved by Admin.',
                },
              ],
            }
          : d
      )
    );
    onShowToast('Dispute Resolved', `Case ${disputeId} closed successfully.`, 'success');
    setSelectedDispute(null);
  };

  // Issue Instant Refund
  const handleIssueRefund = (dispute: PlatformDispute) => {
    handleResolveDispute(
      dispute.id,
      `Instant eSewa refund of Rs ${dispute.amount} processed directly to ${dispute.customerName}.`
    );
    onShowToast(
      'Refund Dispatched',
      `Rs ${dispute.amount} refunded to ${dispute.customerName} via eSewa gateway.`,
      'success'
    );
  };

  // Add note to dispute
  const handleAddAdminNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNoteInput.trim() || !selectedDispute) return;

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              timeline: [
                ...d.timeline,
                {
                  time: 'Just now',
                  sender: 'Admin System',
                  message: adminNoteInput.trim(),
                },
              ],
            }
          : d
      )
    );

    // Update current selected dispute modal view
    setSelectedDispute((prev) =>
      prev
        ? {
            ...prev,
            timeline: [
              ...prev.timeline,
              {
                time: 'Just now',
                sender: 'Admin System',
                message: adminNoteInput.trim(),
              },
            ],
          }
        : null
    );

    setAdminNoteInput('');
    onShowToast('Admin Log Added', 'Note saved to case timeline.', 'info');
  };

  // Filtered lists
  const filteredDisputes = disputes.filter((d) => {
    const matchesCategory = disputeFilter === 'All' ? true : d.category === disputeFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(disputeSearch.toLowerCase()) ||
      d.customerName.toLowerCase().includes(disputeSearch.toLowerCase()) ||
      d.venueName.toLowerCase().includes(disputeSearch.toLowerCase()) ||
      d.disputeCode.toLowerCase().includes(disputeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredRequests = verificationRequests.filter((r) => {
    return (
      r.businessName.toLowerCase().includes(ownerSearch.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(ownerSearch.toLowerCase()) ||
      r.address.toLowerCase().includes(ownerSearch.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1B2A22] pb-24 md:pb-12">
      {/* Unified Shared Navbar in Admin Mode */}
      <Navbar
        role="admin"
        adminTab={currentTab}
        onAdminTabChange={(tab) => setCurrentTab(tab)}
        adminPendingVerifications={pendingRequestsCount}
        adminActiveDisputes={activeDisputesCount}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ======================================================== */}
        {/* 1. PLATFORM OVERVIEW (HOME) */}
        {/* ======================================================== */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span>Birtamode Operations Command Center</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332] tracking-tight">
                  StudySphere Birtamode Overview
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Supervising study hubs, partner verifications, and user satisfaction across Jhapa District.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentTab('owners')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Review Owners ({pendingRequestsCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('disputes')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold rounded-xl transition-colors border border-rose-200"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Active Disputes ({activeDisputesCount})</span>
                </button>
              </div>
            </div>

            {/* High-Level Platform Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Registered Venues</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1B4332]">
                    <Store className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1B4332]">
                    {MOCK_ADMIN_STATS.totalRegisteredVenues}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">in Birtamode</span>
                </div>
                <p className="mt-3 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  100% verified & active
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Today's Platform GMV</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <Banknote className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                    Rs {MOCK_ADMIN_STATS.todayPlatformGmvNpr.toLocaleString()}
                  </span>
                </div>
                <p className="mt-3 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.4% weekly surge
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Pending Verifications</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-700">
                    {pendingRequestsCount}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">venues awaiting audit</span>
                </div>
                <p className="mt-3 text-[11px] text-stone-500">Avg review turnaround: 4 hours</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Active Disputes</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-rose-700">
                    {activeDisputesCount}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    ({highPriorityDisputesCount} urgent)
                  </span>
                </div>
                <p className="mt-3 text-[11px] text-rose-700 font-medium">Requires admin arbitration</p>
              </div>
            </div>

            {/* Birtamode Territorial Clusters */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Birtamode Hub Distribution by Neighborhood
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Real-time network capacity and venue coverage in Jhapa.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#1B4332] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Jhapa District Zone
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {[
                  { name: 'Muktinath Chowk (Ward 4)', venue: 'Mechi Study Pavilion', seats: '25 seats', status: '76% Occupied' },
                  { name: 'Bhadrapur Road (Ward 3)', venue: 'Kanchanjunga Café Hub', seats: '32 seats', status: '84% Occupied' },
                  { name: 'Sanischare Road (Ward 5)', venue: 'Deonia Silent Reading', seats: '18 seats', status: '62% Occupied' },
                  { name: 'Damak Road (Ward 1)', venue: 'Jhapa Focus Works', seats: '28 seats', status: '71% Occupied' },
                  { name: 'Charpane Highway (Ward 2)', venue: 'Charpane Focus Hub', seats: '16 seats', status: '50% Occupied' },
                  { name: 'Bus Park Commercial Area', venue: 'Birtamode Reading Pods', seats: '20 seats', status: '80% Occupied' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                        <span>{item.venue}</span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full font-semibold">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{item.name}</span>
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600">
                      <span>Total: {item.seats}</span>
                      <span className="text-[#1B4332] font-semibold">Healthy Feed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. OWNER VERIFICATION QUEUE */}
        {/* ======================================================== */}
        {currentTab === 'owners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-[#1B4332]">Owner Verification Queue</h1>
                <p className="text-xs text-stone-500 mt-1">
                  Audit legal documentation, municipality tax licenses, and building clearances before onboarding.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ownerSearch}
                  onChange={(e) => setOwnerSearch(e.target.value)}
                  placeholder="Search business or owner..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#1B4332] bg-white"
                />
              </div>
            </div>

            {/* List of Applications */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-xs">
                  No verification applications found.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {filteredRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                    >
                      {/* Left: Info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-sm font-bold text-stone-900">{req.businessName}</h3>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              req.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : req.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {req.status}
                          </span>
                          <span className="text-[11px] text-stone-400 font-medium">
                            Submitted: {req.submittedDate}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                          <span className="font-semibold text-stone-800">
                            Owner: {req.ownerName}
                          </span>
                          <span>• {req.phone}</span>
                          <span>• PAN: <span className="font-mono">{req.panNumber}</span></span>
                          <span>• Capacity: {req.capacityRequested} seats</span>
                        </div>

                        <p className="text-xs text-stone-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{req.address}</span>
                        </p>

                        {req.notes && (
                          <p className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-200/60 mt-1">
                            <span className="font-semibold text-stone-700">Applicant note:</span> {req.notes}
                          </p>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedReviewRequest(req)}
                          className="px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Review Documents ({req.documents.length})</span>
                        </button>

                        {req.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveOwner(req.id)}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-colors border border-emerald-200"
                              title="Quick Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectOwner(req.id)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl transition-colors border border-rose-200"
                              title="Reject Application"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
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
        {/* 3. DISPUTES MANAGEMENT */}
        {/* ======================================================== */}
        {currentTab === 'disputes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-[#1B4332]">Disputes & Resolutions</h1>
                <p className="text-xs text-stone-500 mt-1">
                  Arbitrate customer reports, double bookings, and eSewa payment discrepancies.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={disputeSearch}
                  onChange={(e) => setDisputeSearch(e.target.value)}
                  placeholder="Search dispute code or user..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#1B4332] bg-white"
                />
              </div>
            </div>

            {/* 3 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs text-stone-500 font-medium">Total Active Disputes</span>
                <p className="text-2xl font-bold text-stone-900 mt-1">{activeDisputesCount} cases</p>
                <p className="text-[11px] text-stone-400 mt-1">Pending resolution</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs text-stone-500 font-medium">High Priority (Urgent)</span>
                <p className="text-2xl font-bold text-rose-700 mt-1">{highPriorityDisputesCount} cases</p>
                <p className="text-[11px] text-rose-600 mt-1">SLA response: &lt; 30 mins</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs text-stone-500 font-medium">Resolved Today</span>
                <p className="text-2xl font-bold text-emerald-700 mt-1">5 resolved</p>
                <p className="text-[11px] text-emerald-600 mt-1">100% customer retention</p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['All', 'Double Booking', 'Payment Issue', 'Cancellation', 'Amenity Failure'] as const).map(
                (pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => setDisputeFilter(pill as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      disputeFilter === pill
                        ? 'bg-[#1B4332] text-white'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {pill}
                  </button>
                )
              )}
            </div>

            {/* Disputes List */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              {filteredDisputes.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-xs">
                  No disputes found matching filter.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {filteredDisputes.map((d) => (
                    <div
                      key={d.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono font-bold text-xs text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
                            {d.disputeCode}
                          </span>
                          <h3 className="text-sm font-bold text-stone-900">{d.title}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              d.priority === 'High'
                                ? 'bg-rose-100 text-rose-800'
                                : d.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-800'
                            }`}
                          >
                            {d.priority} Priority
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              d.status === 'Active'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {d.status}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {d.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-0.5">
                          <span>User: <strong className="text-stone-700">{d.customerName}</strong> ({d.customerPhone})</span>
                          <span>• Venue: <strong className="text-stone-700">{d.venueName}</strong></span>
                          <span>• Amount: <strong className="text-stone-900">Rs {d.amount}</strong></span>
                          <span>• Booking: <span className="font-mono">{d.bookingCode}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedDispute(d)}
                          className="px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Investigate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. SETTINGS */}
        {/* ======================================================== */}
        {currentTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-xl font-bold text-[#1B4332]">Platform Administrator Settings</h1>
              <p className="text-xs text-stone-500 mt-1">
                Configure commission rates, payment gateway webhooks, and Birtamode bounds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Marketplace Commission & Rules
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-500 block mb-1">Platform Commission Rate (%)</label>
                  <input
                    type="number"
                    defaultValue="5.0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-bold"
                  />
                  <p className="text-[11px] text-stone-400 mt-0.5">Applied to all digital reservations across Birtamode venues.</p>
                </div>
                <div>
                  <label className="text-stone-500 block mb-1">Default Territory Scope</label>
                  <input
                    type="text"
                    defaultValue="Birtamode Municipality, Jhapa District, Koshi Province, Nepal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-1">Admin Notification Email</label>
                  <input
                    type="email"
                    defaultValue="learningcodes247@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Payment Gateway Gateways (Nepal)
                </h3>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-800">eSewa Merchant API</span>
                    <p className="text-[11px] text-emerald-700">Connected • Production Key active</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onShowToast('Admin Config Saved', 'Global platform parameters updated.', 'success')}
                className="w-full py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Save Platform Configuration
              </button>
            </div>

            {/* Admin Session & Log Out */}
            {onLogout && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Administrator Session
                </h3>
                <p className="text-xs text-stone-500">
                  Signed in as Platform Super-Admin (Jhapa Territory).
                </p>
                <button
                  type="button"
                  id="admin-settings-logout-btn"
                  onClick={onLogout}
                  className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Admin Console</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* DOCUMENT REVIEW MODAL */}
      {/* ======================================================== */}
      {selectedReviewRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
                  Partner Document Audit
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  {selectedReviewRequest.businessName}
                </h3>
                <p className="text-xs text-stone-500">
                  Owner: {selectedReviewRequest.ownerName} • {selectedReviewRequest.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReviewRequest(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Thumbnails Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Submitted Verification Documents ({selectedReviewRequest.documents.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedReviewRequest.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between hover:border-[#1B4332] hover:shadow-xs transition-all cursor-pointer group"
                    onClick={() => setPreviewDocument(doc)}
                  >
                    <div>
                      {/* Document Style Placeholder Card (Light gray/off-white background + Centered Forest Green Outline Icon) */}
                      <div className="h-28 w-full bg-[#FAF9F6] rounded-xl border border-stone-200/90 relative overflow-hidden flex flex-col items-center justify-center p-3 mb-2.5 group-hover:bg-emerald-50/40 group-hover:border-emerald-300 transition-all">
                        {/* Corner PDF / Page Count Tag */}
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          {doc.pageCount && doc.pageCount > 1 ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-stone-200/80 text-stone-700 tracking-wider">
                              {doc.pageCount} PGS • PDF
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-stone-200/80 text-stone-700 tracking-wider">
                              PDF
                            </span>
                          )}
                        </div>

                        {/* Top-left Verified Dot */}
                        {doc.status === 'verified' && (
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
                            <span className="text-[9px] font-medium text-emerald-800">Verified</span>
                          </div>
                        )}

                        {/* Faux document text lines in background */}
                        <div className="w-16 space-y-1 opacity-25 mb-1.5">
                          <div className="h-1 bg-stone-400 rounded-full w-full"></div>
                          <div className="h-1 bg-stone-400 rounded-full w-3/4 mx-auto"></div>
                        </div>

                        {/* Centered Large Outline Document Icon in Forest Green #1B4332 */}
                        <div className="p-2 rounded-xl bg-white shadow-2xs border border-stone-100 group-hover:scale-105 group-hover:border-emerald-200 transition-transform">
                          <FileText className="w-7 h-7 text-[#1B4332] stroke-[1.75]" />
                        </div>

                        {/* Faux document bottom lines */}
                        <div className="w-20 space-y-1 opacity-25 mt-1.5">
                          <div className="h-1 bg-stone-400 rounded-full w-5/6 mx-auto"></div>
                          <div className="h-1 bg-stone-400 rounded-full w-2/3 mx-auto"></div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#1B4332]/10 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1B4332] text-white text-[11px] font-semibold shadow-sm">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-stone-800 line-clamp-1 group-hover:text-[#1B4332] transition-colors">
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{doc.issuedBy}</p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between">
                      <span className="text-[10px] text-[#1B4332] bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md font-semibold truncate max-w-[140px]">
                        {doc.type}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 font-medium">
                        {doc.fileSize || '1.5 MB'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Overview details */}
            <div className="p-4 bg-stone-50 rounded-xl space-y-2 text-xs border border-stone-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-400 block text-[10px]">PAN / VAT Registration</span>
                  <span className="font-mono font-bold text-stone-800">{selectedReviewRequest.panNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Requested Capacity</span>
                  <span className="font-bold text-stone-800">{selectedReviewRequest.capacityRequested} Desks</span>
                </div>
              </div>
              <div className="pt-2 border-t border-stone-200/60">
                <span className="text-stone-400 block text-[10px]">Physical Address in Birtamode</span>
                <span className="font-medium text-stone-700">{selectedReviewRequest.address}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleApproveOwner(selectedReviewRequest.id)}
                className="flex-1 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Activate Venue</span>
              </button>
              <button
                type="button"
                onClick={() => handleRejectOwner(selectedReviewRequest.id)}
                className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold rounded-xl transition-colors border border-rose-200"
              >
                Reject / Request Revision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SINGLE DOCUMENT ZOOM PREVIEW MODAL */}
      {/* ======================================================== */}
      {previewDocument && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#1B4332]">
                  <FileCheck className="w-4 h-4 text-[#1B4332]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">{previewDocument.name}</h4>
                  <p className="text-[11px] text-stone-500 font-mono">
                    {previewDocument.docNumber || 'DOC-REF-88421'} • {previewDocument.fileSize || '1.8 MB'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocument(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Document Sheet Inspection View */}
            <div className="rounded-2xl border border-stone-200 bg-[#FAF9F6] p-5 shadow-inner space-y-4">
              {/* Document Header Bar */}
              <div className="flex items-start justify-between pb-3 border-b border-stone-200/80">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Official Document Record
                  </span>
                  <h5 className="text-xs font-bold text-[#1B4332]">{previewDocument.type}</h5>
                  <p className="text-[11px] text-stone-600 font-medium">{previewDocument.issuedBy}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>{previewDocument.status === 'verified' ? 'Verified Copy' : 'Audit Pending'}</span>
                  </span>
                  <p className="text-[10px] font-mono text-stone-400 mt-1">
                    Issued: {previewDocument.issueDate || '2080 B.S.'}
                  </p>
                </div>
              </div>

              {/* Simulated Document Canvas Sheet */}
              <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#1B4332]" />
                    <span className="text-xs font-bold text-stone-800">Government of Nepal / Local Authority</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#1B4332] bg-emerald-50 px-1.5 py-0.5 rounded">
                    Birtamode, Jhapa
                  </span>
                </div>

                <div className="space-y-1.5 py-1 text-xs text-stone-700">
                  <div className="flex justify-between py-1 border-b border-stone-100 text-[11px]">
                    <span className="text-stone-500">Document Identifier:</span>
                    <span className="font-mono font-bold text-stone-800">{previewDocument.docNumber || 'DOC-VER-2080'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 text-[11px]">
                    <span className="text-stone-500">Document Title:</span>
                    <span className="font-semibold text-stone-800">{previewDocument.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 text-[11px]">
                    <span className="text-stone-500">Issuing Department:</span>
                    <span className="font-semibold text-stone-800">{previewDocument.issuedBy}</span>
                  </div>
                  <div className="flex justify-between py-1 text-[11px]">
                    <span className="text-stone-500">Audit Status:</span>
                    <span className="font-bold text-emerald-700">Valid & Verified for Commercial Co-working</span>
                  </div>
                </div>

                {/* Document preview lines graphic */}
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60 space-y-1.5">
                  <div className="h-1.5 bg-stone-200 rounded-full w-full"></div>
                  <div className="h-1.5 bg-stone-200 rounded-full w-11/12"></div>
                  <div className="h-1.5 bg-stone-200 rounded-full w-4/5"></div>
                  <div className="h-1.5 bg-stone-200 rounded-full w-2/3"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                <span>Format: PDF Document Scan</span>
                <span>Page 1 of {previewDocument.pageCount || 1}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => onShowToast('Document Downloaded', `${previewDocument.name} saved to local downloads.`, 'info')}
                className="flex-1 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF File</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDocument(null)}
                className="py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Back to Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DISPUTE INVESTIGATION MODAL */}
      {/* ======================================================== */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
                    {selectedDispute.disputeCode}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {selectedDispute.priority} Priority
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  {selectedDispute.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Background Details */}
            <div className="p-4 bg-stone-50 rounded-xl space-y-2 text-xs border border-stone-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-stone-400 block text-[10px]">Customer</span>
                  <span className="font-bold text-stone-800">{selectedDispute.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Phone</span>
                  <span className="font-medium text-stone-700">{selectedDispute.customerPhone}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Venue</span>
                  <span className="font-bold text-stone-800">{selectedDispute.venueName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Amount in Dispute</span>
                  <span className="font-bold text-[#1B4332]">Rs {selectedDispute.amount}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200/60">
                <span className="text-stone-400 block text-[10px]">Incident Summary</span>
                <p className="text-stone-700 leading-relaxed mt-0.5">{selectedDispute.description}</p>
              </div>
            </div>

            {/* Timeline Log */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Case Activity Timeline
              </label>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedDispute.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl text-xs space-y-0.5 ${
                      item.sender === 'Admin System'
                        ? 'bg-purple-50 border border-purple-200 text-purple-950'
                        : item.sender === 'Venue'
                        ? 'bg-amber-50 border border-amber-200 text-amber-950'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-[11px]">
                      <span>{item.sender}</span>
                      <span className="text-[10px] opacity-60 font-normal">{item.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Admin Note / Message Form */}
            <form onSubmit={handleAddAdminNote} className="flex gap-2">
              <input
                type="text"
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Log internal note or reply to dispute..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1B4332]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log Note</span>
              </button>
            </form>

            {/* Actions for dispute */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => handleIssueRefund(selectedDispute)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Issue Instant eSewa Refund (Rs {selectedDispute.amount})</span>
              </button>

              <button
                type="button"
                onClick={() => handleResolveDispute(selectedDispute.id)}
                className="flex-1 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Dispute Resolved</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
