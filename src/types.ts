export type Screen =
  | 'home'
  | 'explore'
  | 'workspace-details'
  | 'seat-selection'
  | 'checkout'
  | 'payment'
  | 'confirmed'
  | 'bookings'
  | 'profile'
  | 'about';

export type WorkspaceCategory = 'All' | 'Quiet' | 'Fast Wi-Fi' | 'Power Outlets' | 'Natural Light' | 'Late Hours' | 'Cafe & Bites';

export interface SpaceType {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  iconName: 'Laptop' | 'Users' | 'Shield' | 'Coffee' | 'Headphones' | 'Armchair' | 'Sun';
  features: string[];
  capacity: string;
  popular?: boolean;
}

export type SeatStatus = 'available' | 'selected' | 'occupied' | 'reserved';

export interface Seat {
  id: string;
  number: string;
  zone: 'Deep Focus Library' | 'Sunlit Window Bay' | 'Oak Central Table' | 'Acoustic Pods';
  type: string;
  status: SeatStatus;
  hasPower: boolean;
  hasMonitor: boolean;
  isWindow: boolean;
  ergonomicChair: boolean;
}

export interface Amenity {
  name: string;
  icon: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Workspace {
  id: string;
  name: string;
  tagline: string;
  category: string;
  tags: string[];
  address: string;
  neighborhood: string;
  distance: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  availableSeatsCount: number;
  totalSeatsCount: number;
  heroImage: string;
  galleryImages: string[];
  noiseLevel: string;
  noiseDb: number;
  openHours: string;
  currentStatus: 'Open now' | 'Closing soon';
  about: string;
  amenities: Amenity[];
  spaceTypes: SpaceType[];
  seatMap: Seat[];
  coordinates: { x: number; y: number };
}

export interface BookingSelection {
  workspaceId: string;
  spaceTypeId: string;
  seatId?: string;
  date: string;
  timeSlot: string;
  durationHours: number;
  specialRequests?: string;
  studentDiscountApplied?: boolean;
  promoCode?: string;
}

export type BookingStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  bookingCode: string;
  workspaceId: string;
  workspaceName: string;
  workspaceAddress: string;
  workspaceImage: string;
  spaceTypeName: string;
  seatNumber: string;
  seatZone: string;
  date: string;
  timeSlot: string;
  durationHours: number;
  totalAmount: number;
  paymentMethod: string;
  status: BookingStatus;
  qrCodeUrl?: string;
  wifiSsid: string;
  wifiPass: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: string;
  institution: string;
  isStudentVerified: boolean;
  studyHoursLogged: number;
  placesVisited: number;
  savedFavorites: string[];
  memberSince: string;
}

export type UserRole = 'customer' | 'owner' | 'admin';

// --- OWNER DASHBOARD TYPES ---
export type OwnerTab = 'home' | 'workspaces' | 'seatmap' | 'walkin' | 'bookings' | 'settings';

export interface OwnerActivity {
  id: string;
  type: 'check_in' | 'cancellation' | 'booking_created' | 'extension' | 'walk_in';
  guestName: string;
  seatNumber: string;
  timestamp: string;
  details: string;
  amount?: number;
}

export interface WorkspaceZone {
  id: string;
  name: string;
  tagline: string;
  totalSeats: number;
  occupiedSeats: number;
  hourlyRate: number;
  status: 'Active' | 'Filling Fast' | 'Maintenance';
  iconName: string;
  amenitiesSummary: string;
}

export type OwnerSeatStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface OwnerSeat {
  id: string;
  number: string;
  zoneId: string;
  zoneName: string;
  status: OwnerSeatStatus;
  currentOccupant?: {
    name: string;
    phone?: string;
    bookingCode?: string;
    startTime: string;
    endTime: string;
    paymentMethod: string;
    paidAmount: number;
  };
  hasPower: boolean;
  hasMonitor: boolean;
  isWindow: boolean;
}

export interface OwnerBookingItem {
  id: string;
  bookingCode: string;
  guestName: string;
  guestPhone: string;
  seatNumber: string;
  zoneName: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'eSewa' | 'Khalti' | 'Fonepay';
  status: 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  isWalkIn?: boolean;
}

// --- ADMIN DASHBOARD TYPES ---
export type AdminTab = 'home' | 'owners' | 'disputes' | 'settings';

export interface VerificationDocument {
  id: string;
  name: string;
  type: 'PAN / VAT Certificate' | 'Municipality Registration' | 'Lease Deed' | 'Safety Clearance';
  status: 'verified' | 'pending';
  fileUrl?: string;
  issuedBy: string;
  docNumber?: string;
  issueDate?: string;
  fileSize?: string;
  pageCount?: number;
}

export interface OwnerVerificationRequest {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  submittedDate: string;
  panNumber: string;
  capacityRequested: number;
  status: 'pending' | 'approved' | 'rejected';
  documents: VerificationDocument[];
  notes?: string;
}

export type DisputeCategory = 'Double Booking' | 'Payment Issue' | 'Cancellation' | 'Amenity Failure';
export type DisputePriority = 'High' | 'Medium' | 'Low';
export type DisputeStatus = 'Active' | 'Resolved';

export interface PlatformDispute {
  id: string;
  disputeCode: string;
  title: string;
  category: DisputeCategory;
  priority: DisputePriority;
  status: DisputeStatus;
  customerName: string;
  customerPhone: string;
  venueName: string;
  venueOwner: string;
  bookingCode: string;
  amount: number;
  reportedDate: string;
  description: string;
  timeline: {
    time: string;
    sender: 'Customer' | 'Venue' | 'Admin System';
    message: string;
  }[];
}
