export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'ROLE_STUDENT' | 'ROLE_OWNER' | 'ROLE_ADMIN';
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

export interface PropertyImage {
  id: number;
  imageUrl: string;
  caption?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface RoomType {
  id: number;
  name: string;
  sharingCount: number;
  totalBeds: number;
  availableBeds: number;
  rentPerMonth: number;
  deposit: number;
  roomFeatures?: string;
}

export interface Property {
  id: number;
  ownerId: number;
  ownerName: string;
  title: string;
  description: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  genderPreference: 'MALE' | 'FEMALE' | 'UNISEX';
  foodType: 'VEG' | 'NON_VEG' | 'BOTH' | 'NONE';
  rules?: string;
  depositAmount: number;
  minRent: number;
  verificationStatus: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
  images: PropertyImage[];
  amenities: Amenity[];
  roomTypes: RoomType[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface Booking {
  id: number;
  user: User;
  property: Property;
  roomType: RoomType;
  moveInDate: string;
  bedsCount: number;
  totalRent: number;
  depositAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  ownerNotes?: string;
  userNotes?: string;
  createdAt: string;
}

export interface Review {
  id: number;
  user: {
    id: number;
    fullName: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalOwners: number;
  totalProperties: number;
  verifiedProperties: number;
  pendingVerifications: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
}
