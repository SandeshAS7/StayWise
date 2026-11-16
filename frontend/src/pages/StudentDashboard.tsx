import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, AlertCircle, CheckCircle, Clock, XCircle, Heart, Building } from 'lucide-react';
import { Booking, Property } from '../types';
import { api } from '../services/api';

interface StudentDashboardProps {
  onSelectProperty: (property: Property) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onSelectProperty }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'wishlist'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bookings') {
        const data = await api.getMyBookings();
        setBookings(data);
      } else {
        const data = await api.getWishlist();
        setWishlist(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.cancelBooking(bookingId);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const handleRemoveWishlist = async (propertyId: number) => {
    try {
      await api.removeFromWishlist(propertyId);
      setWishlist(wishlist.filter(p => p.id !== propertyId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove item');
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Confirmed
          </span>
        );
      case 'PENDING':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending Owner Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
            Cancelled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tenant & Student Dashboard</h1>
        <p className="text-xs text-slate-500">Track your room reservation requests and saved accommodations</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-6 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4" /> My Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 px-6 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="h-4 w-4" /> Saved Wishlist ({wishlist.length})
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading your data...</div>
      ) : activeTab === 'bookings' ? (
        bookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No bookings yet</h3>
            <p className="text-xs text-slate-500 mt-1">Explore verified PGs across Bengaluru and request a stay.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-slate-900">{b.property?.title}</h3>
                    {getStatusBadge(b.status)}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    {b.property?.area}, {b.property?.city}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-600 pt-1">
                    <span><strong>Room:</strong> {b.roomType?.name} ({b.bedsCount} Bed)</span>
                    <span><strong>Move-In:</strong> {b.moveInDate}</span>
                    <span><strong>Rent:</strong> ₹{b.totalRent?.toLocaleString()} / mo</span>
                    <span><strong>Deposit:</strong> ₹{b.depositAmount?.toLocaleString()}</span>
                  </div>
                  {b.ownerNotes && (
                    <div className="p-2 bg-indigo-50 rounded text-[11px] text-indigo-900 mt-2">
                      <strong>Owner Note:</strong> {b.ownerNotes}
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <button
                    onClick={() => onSelectProperty(b.property)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    View Property →
                  </button>
                  {b.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Wishlist Grid */
        wishlist.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Heart className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 mt-1">Tap the heart icon on any PG card to save it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <img
                    src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{p.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" /> {p.area}, {p.city}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">₹{p.minRent?.toLocaleString()} <span className="text-xs font-normal text-slate-500">/mo</span></p>
                  </div>
                </div>
                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => onSelectProperty(p)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-xl transition"
                  >
                    View & Book
                  </button>
                  <button
                    onClick={() => handleRemoveWishlist(p.id)}
                    className="px-3 py-2 border border-slate-200 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
