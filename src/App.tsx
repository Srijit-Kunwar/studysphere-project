/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Screen,
  Workspace,
  SpaceType,
  BookingSelection,
  Booking,
  UserProfile,
  Seat,
  UserRole,
} from './types';
import {
  MOCK_WORKSPACES,
  INITIAL_BOOKINGS,
  INITIAL_USER,
} from './data/mockData';

// Component Screens
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { WorkspaceDetailScreen } from './components/WorkspaceDetailScreen';
import { SeatSelectionScreen } from './components/SeatSelectionScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { BookingConfirmedScreen } from './components/BookingConfirmedScreen';
import { BookingsScreen } from './components/BookingsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AboutScreen } from './components/AboutScreen';
import { Footer } from './components/Footer';

// Role-based Dashboards & Login Screen
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginScreen } from './components/LoginScreen';

// Modals & Toasts
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  QRPassModal,
  ExtendTimeModal,
  DirectionsModal,
  FavoritesModal,
  StudentVerifyModal,
} from './components/Modals';

export default function App() {
  // Active User Role state (null = show Login Screen before app loads)
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  // Screen Routing State (for Customer mode)
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Core Data State (in-memory React state)
  const [workspaces] = useState<Workspace[]>(MOCK_WORKSPACES);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Active Flow Selection State
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>(MOCK_WORKSPACES[0]);
  const [selectedSpaceType, setSelectedSpaceType] = useState<SpaceType>(
    MOCK_WORKSPACES[0].spaceTypes[0]
  );
  const [bookingSelection, setBookingSelection] = useState<BookingSelection>({
    workspaceId: MOCK_WORKSPACES[0].id,
    spaceTypeId: MOCK_WORKSPACES[0].spaceTypes[0].id,
    date: 'Today, Oct 24',
    timeSlot: '02:00 PM',
    durationHours: 3,
    studentDiscountApplied: true,
  });

  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(INITIAL_BOOKINGS[0]);

  // Explore search & filter state
  const [exploreQuery, setExploreQuery] = useState<string>('');
  const [exploreCategory, setExploreCategory] = useState<string>('All');

  // Modals state
  const [activeQRBooking, setActiveQRBooking] = useState<Booking | null>(null);
  const [activeExtendBooking, setActiveExtendBooking] = useState<Booking | null>(null);
  const [directionsInfo, setDirectionsInfo] = useState<{ address: string; name: string } | null>(null);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isStudentVerifyModalOpen, setIsStudentVerifyModalOpen] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'alert' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Flow Navigation Handlers
  const handleExploreFromHome = (query = '', category = 'All') => {
    setExploreQuery(query);
    setExploreCategory(category);
    setCurrentScreen('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setSelectedSpaceType(workspace.spaceTypes[0]);
    setBookingSelection({
      workspaceId: workspace.id,
      spaceTypeId: workspace.spaceTypes[0].id,
      date: 'Today, Oct 24',
      timeSlot: '02:00 PM',
      durationHours: 3,
      studentDiscountApplied: true,
    });
    setCurrentScreen('workspace-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToSeatSelection = (selection: BookingSelection) => {
    const spaceType =
      selectedWorkspace.spaceTypes.find((st) => st.id === selection.spaceTypeId) ||
      selectedWorkspace.spaceTypes[0];
    setSelectedSpaceType(spaceType);
    setBookingSelection(selection);
    setCurrentScreen('seat-selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToCheckout = (updatedSelection: BookingSelection) => {
    setBookingSelection(updatedSelection);
    setCurrentScreen('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = (updatedSelection: BookingSelection) => {
    setBookingSelection(updatedSelection);
    setCurrentScreen('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setConfirmedBooking(newBooking);
    setUser((prev) => ({
      ...prev,
      studyHoursLogged: prev.studyHoursLogged + newBooking.durationHours,
    }));
    setCurrentScreen('confirmed');
    showToast('Reservation Confirmed!', `Pass #${newBooking.bookingCode} generated for ${newBooking.workspaceName}`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Booking Modifications
  const handleConfirmExtend = (bookingId: string, additionalHours: number, additionalCost: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            durationHours: b.durationHours + additionalHours,
            totalAmount: b.totalAmount + additionalCost,
          };
        }
        return b;
      })
    );
    setUser((prev) => ({
      ...prev,
      studyHoursLogged: prev.studyHoursLogged + additionalHours,
    }));
    setActiveExtendBooking(null);
    showToast('Study Session Extended', `Added +${additionalHours} hour(s) to your desk booking.`, 'success');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    showToast('Reservation Cancelled', 'Your refund will be credited according to policy.', 'alert');
  };

  // Favorite toggle
  const handleToggleFavorite = (workspaceId: string) => {
    setUser((prev) => {
      const exists = prev.savedFavorites.includes(workspaceId);
      const newFavorites = exists
        ? prev.savedFavorites.filter((id) => id !== workspaceId)
        : [...prev.savedFavorites, workspaceId];

      return {
        ...prev,
        savedFavorites: newFavorites,
      };
    });
  };

  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'customer') {
      setCurrentScreen('home');
    }
    showToast(
      'Welcome to StudySphere',
      role === 'customer'
        ? 'Signed in to Birtamode workspace discovery.'
        : role === 'owner'
        ? 'Entered Mechi Study Pavilion Owner Portal.'
        : 'Entered Birtamode Platform Administration Console.',
      'success'
    );
  };

  const handleSignOut = () => {
    showToast('Signed Out', 'Returned to login screen. Welcome back anytime!');
    setCurrentRole(null);
    setCurrentScreen('home');
  };

  const activeBookingsCount = bookings.filter((b) => b.status === 'active').length;
  const favoriteWorkspaces = workspaces.filter((ws) => user.savedFavorites.includes(ws.id));
  const currentSeat =
    selectedWorkspace.seatMap.find((s) => s.id === bookingSelection.seatId) ||
    selectedWorkspace.seatMap[0];

  // If NOT logged in, show the dedicated Login Screen
  if (currentRole === null) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-['Poppins',sans-serif] antialiased">
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <LoginScreen onLogin={handleLogin} onShowToast={showToast} />
      </div>
    );
  }

  // If in OWNER mode, render the dedicated Owner Dashboard
  if (currentRole === 'owner') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-['Poppins',sans-serif] antialiased">
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <OwnerDashboard
          onShowToast={(t, d, tp) => showToast(t, d, tp === 'error' ? 'alert' : tp || 'info')}
          onLogout={handleSignOut}
          onSwitchToCustomer={() => setCurrentRole('customer')}
        />
      </div>
    );
  }

  // If in ADMIN mode, render the dedicated Admin Dashboard (routes directly to Owner Verification Queue)
  if (currentRole === 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-['Poppins',sans-serif] antialiased">
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <AdminDashboard
          initialTab="owners"
          onShowToast={(t, d, tp) => showToast(t, d, tp === 'error' ? 'alert' : tp || 'info')}
          onLogout={handleSignOut}
          onSwitchToCustomer={() => setCurrentRole('customer')}
        />
      </div>
    );
  }

  // Default: CUSTOMER view
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-['Poppins',sans-serif] antialiased">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Persistent Navigation (Desktop top + Mobile bottom) */}
      <Navbar
        role="customer"
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeBookingsCount={activeBookingsCount}
        user={user}
        onQuickExplore={() => {
          setCurrentScreen('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleSignOut}
      />

      {/* Screen Views */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <HomeScreen
            workspaces={workspaces}
            onExplore={handleExploreFromHome}
            onSelectWorkspace={handleSelectWorkspace}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'explore' && (
          <ExploreScreen
            workspaces={workspaces}
            onSelectWorkspace={handleSelectWorkspace}
            initialQuery={exploreQuery}
            initialCategory={exploreCategory}
            savedFavorites={user.savedFavorites}
            onToggleFavorite={handleToggleFavorite}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'workspace-details' && (
          <WorkspaceDetailScreen
            workspace={selectedWorkspace}
            onBack={() => setCurrentScreen('explore')}
            onContinueToSeatSelection={handleContinueToSeatSelection}
            isFavorited={user.savedFavorites.includes(selectedWorkspace.id)}
            onToggleFavorite={handleToggleFavorite}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'seat-selection' && (
          <SeatSelectionScreen
            workspace={selectedWorkspace}
            spaceType={selectedSpaceType}
            selection={bookingSelection}
            onBack={() => setCurrentScreen('workspace-details')}
            onContinueToCheckout={handleContinueToCheckout}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'checkout' && (
          <CheckoutScreen
            workspace={selectedWorkspace}
            spaceType={selectedSpaceType}
            selection={bookingSelection}
            seat={currentSeat}
            user={user}
            onBack={() => setCurrentScreen('seat-selection')}
            onProceedToPayment={handleProceedToPayment}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'payment' && (
          <PaymentScreen
            workspace={selectedWorkspace}
            spaceType={selectedSpaceType}
            selection={bookingSelection}
            seat={currentSeat}
            user={user}
            onBack={() => setCurrentScreen('checkout')}
            onConfirmBooking={handleConfirmBooking}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'confirmed' && confirmedBooking && (
          <BookingConfirmedScreen
            booking={confirmedBooking}
            onViewBookings={() => setCurrentScreen('bookings')}
            onBackToExplore={() => setCurrentScreen('explore')}
            onShowQRModal={(b) => setActiveQRBooking(b)}
            onShowDirections={(address, name) => setDirectionsInfo({ address, name })}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'bookings' && (
          <BookingsScreen
            bookings={bookings}
            onShowQRModal={(b) => setActiveQRBooking(b)}
            onShowExtendTimeModal={(b) => setActiveExtendBooking(b)}
            onShowDirections={(address, name) => setDirectionsInfo({ address, name })}
            onCancelBooking={handleCancelBooking}
            onNavigateToExplore={() => setCurrentScreen('explore')}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            user={user}
            workspaces={workspaces}
            onNavigateToBookings={() => setCurrentScreen('bookings')}
            onShowFavorites={() => setIsFavoritesModalOpen(true)}
            onShowStudentVerify={() => setIsStudentVerifyModalOpen(true)}
            onNavigateToAbout={() => setCurrentScreen('about')}
            onSignOut={handleSignOut}
            onShowToast={showToast}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
          />
        )}

        {currentScreen === 'about' && (
          <AboutScreen
            onBack={() => setCurrentScreen('profile')}
            onShowToast={showToast}
          />
        )}

        {/* Desktop Footer on all Customer scrollable screens including Bookings, Profile, and About */}
        {['home', 'explore', 'workspace-details', 'bookings', 'profile', 'about', 'confirmed'].includes(currentScreen) && (
          <Footer
            onNavigateExplore={() => handleExploreFromHome()}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Interactive Action Modals */}
      <QRPassModal
        booking={activeQRBooking}
        onClose={() => setActiveQRBooking(null)}
        onShowToast={showToast}
      />

      <ExtendTimeModal
        booking={activeExtendBooking}
        onClose={() => setActiveExtendBooking(null)}
        onConfirmExtend={handleConfirmExtend}
      />

      {directionsInfo && (
        <DirectionsModal
          address={directionsInfo.address}
          name={directionsInfo.name}
          onClose={() => setDirectionsInfo(null)}
          onShowToast={showToast}
        />
      )}

      {isFavoritesModalOpen && (
        <FavoritesModal
          favorites={favoriteWorkspaces}
          onClose={() => setIsFavoritesModalOpen(false)}
          onSelectWorkspace={(ws) => {
            setIsFavoritesModalOpen(false);
            handleSelectWorkspace(ws);
          }}
        />
      )}

      {isStudentVerifyModalOpen && (
        <StudentVerifyModal
          onClose={() => setIsStudentVerifyModalOpen(false)}
          onShowToast={showToast}
        />
      )}
    </div>
  );
}
