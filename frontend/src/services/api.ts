import { User, Property, Amenity, Booking, Review, AdminStats } from '../types';

const API_BASE = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('staywise_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok || json.success === false) {
    throw new Error(json.message || 'Request failed');
  }

  return json.data;
}

export const api = {
  // Auth
  async login(email: string, password: string):Promise<{ token: string; user: User }> {
    const data = await request<{
      token: string;
      id: number;
      email: string;
      fullName: string;
      phoneNumber?: string;
      role: User['role'];
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const user: User = {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      role: data.role,
    };

    localStorage.setItem('staywise_token', data.token);
    return { token: data.token, user };
  },

  async register(params: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: 'ROLE_STUDENT' | 'ROLE_OWNER';
    businessName?: string;
  }): Promise<{ token: string; user: User }> {
    const data = await request<{
      token: string;
      id: number;
      email: string;
      fullName: string;
      phoneNumber?: string;
      role: User['role'];
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    const user: User = {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      role: data.role,
    };

    localStorage.setItem('staywise_token', data.token);
    return { token: data.token, user };
  },

  async getCurrentUser(): Promise<User> {
    const data = await request<{
      id: number;
      email: string;
      fullName: string;
      phoneNumber?: string;
      role: User['role'];
    }>('/auth/me');

    return {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      role: data.role,
    };
  },

  logout() {
    localStorage.removeItem('staywise_token');
  },

  // Properties
  async getProperties(params: {
    location?: string;
    gender?: string;
    maxRent?: number;
    verifiedOnly?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  } = {}): Promise<{ content: Property[]; totalElements: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.location) query.append('location', params.location);
    if (params.gender && params.gender !== 'ALL') query.append('gender', params.gender);
    if (params.maxRent) query.append('maxRent', params.maxRent.toString());
    if (params.verifiedOnly) query.append('verifiedOnly', 'true');
    if (params.page !== undefined) query.append('page', params.page.toString());
    if (params.size !== undefined) query.append('size', params.size.toString());
    if (params.sort) query.append('sort', params.sort);

    return request<{ content: Property[]; totalElements: number; totalPages: number }>(
      `/properties?${query.toString()}`
    );
  },

  async getPropertyById(id: number): Promise<Property> {
    return request<Property>(`/properties/${id}`);
  },

  // Owner
  async getOwnerProperties(): Promise<Property[]> {
    return request<Property[]>('/owner/properties');
  },

  async createProperty(propertyData: any): Promise<Property> {
    return request<Property>('/owner/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  async addRoomType(propertyId: number, roomData: any): Promise<any> {
    return request(`/owner/properties/${propertyId}/rooms`, {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  // Amenities
  async getAmenities(): Promise<Amenity[]> {
    return request<Amenity[]>('/amenities');
  },

  // Bookings
  async createBooking(bookingData: {
    propertyId: number;
    roomTypeId: number;
    moveInDate: string;
    bedsCount: number;
    userNotes?: string;
  }): Promise<Booking> {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async getMyBookings(): Promise<Booking[]> {
    return request<Booking[]>('/bookings/my');
  },

  async getOwnerBookings(): Promise<Booking[]> {
    return request<Booking[]>('/owner/bookings');
  },

  async updateBookingStatus(id: number, status: string, notes?: string): Promise<Booking> {
    return request<Booking>(`/owner/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  async cancelBooking(id: number): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  // Reviews
  async getReviews(propertyId: number): Promise<Review[]> {
    return request<Review[]>(`/properties/${propertyId}/reviews`);
  },

  async addReview(propertyId: number, rating: number, comment: string): Promise<Review> {
    return request<Review>(`/properties/${propertyId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },

  // Wishlist
  async getWishlist(): Promise<Property[]> {
    return request<Property[]>('/wishlist');
  },

  async addToWishlist(propertyId: number): Promise<void> {
    await request(`/wishlist/${propertyId}`, { method: 'POST' });
  },

  async removeFromWishlist(propertyId: number): Promise<void> {
    await request(`/wishlist/${propertyId}`, { method: 'DELETE' });
  },

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    return request<AdminStats>('/admin/stats');
  },

  async getPendingVerifications(): Promise<Property[]> {
    return request<Property[]>('/admin/verifications');
  },

  async approveVerification(id: number): Promise<Property> {
    return request<Property>(`/admin/verifications/${id}/approve`, {
      method: 'PATCH',
    });
  },

  async rejectVerification(id: number, reason: string): Promise<Property> {
    return request<Property>(`/admin/verifications/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },
};
