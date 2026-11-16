import React, { useState, useEffect } from 'react';
import {
  MapPin, ShieldCheck, Star, Heart, Check, Users, Calendar,
  Phone, Mail, ArrowLeft, MessageSquare, AlertCircle, Utensils, Info
} from 'lucide-react';
import { Property, Review, RoomType } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface PropertyDetailPageProps {
  property: Property;
  onBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (propertyId: number) => void;
  openAuthModal: () => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  onBack,
  isWishlisted,
  onToggleWishlist,
  openAuthModal,
}) => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string>(
    property.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
  );

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Booking Modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(property.roomTypes?.[0] || null);
  const [moveInDate, setMoveInDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [bedsCount, setBedsCount] = useState(1);
  const [userNotes, setUserNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    api.getReviews(property.id)
      .then(res => setReviews(res))
      .catch(err => console.error('Failed to load reviews', err));
  }, [property.id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!selectedRoom) return;

    setBookingLoading(true);
    setBookingStatus(null);

    try {
      await api.createBooking({
        propertyId: property.id,
        roomTypeId: selectedRoom.id,
        moveInDate,
        bedsCount,
        userNotes,
      });
      setBookingStatus('SUCCESS');
      setTimeout(() => {
        setIsBookingOpen(false);
        setBookingStatus(null);
      }, 2000);
    } catch (err: any) {
      setBookingStatus(`ERROR: ${err.message || 'Booking failed'}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const added = await api.addReview(property.id, newRating, newComment);
      setReviews([added, ...reviews]);
      setNewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Listings
        </button>

        <button
          onClick={() => onToggleWishlist(property.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
            isWishlisted
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
          {isWishlisted ? 'Saved in Wishlist' : 'Save Property'}
        </button>
      </div>

      {/* Main Grid: Gallery & Quick Booking Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Images and Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
              <img
                src={selectedImage}
                alt={property.title}
                className="w-full h-full object-cover transition duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {property.verificationStatus === 'APPROVED' && (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified by StayWise
                  </span>
                )}
                <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {property.genderPreference}
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`h-16 w-24 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      selectedImage === img.imageUrl ? 'border-indigo-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Address & Badges */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{property.title}</h1>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
                  {property.address}, {property.area}, {property.city} - {property.pincode}
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="h-4 w-4 fill-current text-amber-500" />
                  <span className="text-sm font-bold">{property.averageRating || '4.5'}</span>
                  <span className="text-[11px] text-amber-600 font-medium">({reviews.length} reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {property.description}
            </p>

            {/* Key highlights pill bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Food Policy</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Utensils className="h-3.5 w-3.5 text-indigo-600" /> {property.foodType} Food
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Deposit</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  ₹{property.depositAmount?.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Notice Period</span>
                <span className="font-bold text-slate-800 mt-0.5 block">30 Days</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Verification</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> 100% Genuine
                </span>
              </div>
            </div>
          </div>

          {/* Room Categories & Bed Availability Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Available Room Categories</h2>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Live availability verified
              </span>
            </div>

            <div className="space-y-3">
              {property.roomTypes?.map((room) => (
                <div
                  key={room.id}
                  className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedRoom?.id === room.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{room.name}</h3>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {room.sharingCount} Sharing
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{room.roomFeatures}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-semibold ${
                        room.availableBeds > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {room.availableBeds} of {room.totalBeds} beds available
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        ₹{room.rentPerMonth.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500">/mo</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-medium">Deposit: ₹{room.deposit.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRoom(room);
                        setIsBookingOpen(true);
                      }}
                      disabled={room.availableBeds <= 0}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      {room.availableBeds > 0 ? 'Book Room' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Included Amenities & Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities?.map((amenity) => (
                <div key={amenity.id} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="h-6 w-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{amenity.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{amenity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          {property.rules && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-600" /> House Rules & Restrictions
              </h2>
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {property.rules}
              </div>
            </div>
          )}

          {/* Reviews & Ratings Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Resident Reviews & Feedback</h2>
                <p className="text-xs text-slate-500">Verified tenant experiences</p>
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-xl text-indigo-800 text-xs font-bold">
                <Star className="h-4 w-4 fill-current text-amber-500" />
                <span>{property.averageRating || '4.5'} out of 5</span>
              </div>
            </div>

            {/* Write Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Leave a Review</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`h-4 w-4 ${star <= newRating ? 'fill-current text-amber-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience regarding food, Wi-Fi, cleanliness and owner responsiveness..."
                rows={2}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReview || !newComment.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  {submittingReview ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No reviews yet. Be the first to review this PG!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.user?.fullName || 'Resident'}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Sticky Booking Action Box & Owner Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg sticky top-24 space-y-6">
            <div>
              <span className="text-xs text-slate-500 font-medium">Monthly Rent from</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-900">₹{property.minRent?.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-medium">/month</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> No Brokerage. Direct Owner Rates.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Select Sharing Category</label>
              <div className="space-y-2">
                {property.roomTypes?.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoom(r)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      selectedRoom?.id === r.id
                        ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <span>{r.name}</span>
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {r.availableBeds > 0 ? `${r.availableBeds} beds available` : 'Full'}
                      </span>
                    </div>
                    <span className="font-bold">₹{r.rentPerMonth.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 text-xs transition"
            >
              Request Room Booking
            </button>

            {/* Owner verification card */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Managed By
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
                  {property.ownerName?.charAt(0) || 'O'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{property.ownerName || 'Property Owner'}</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="h-3 w-3" /> Identity Verified Owner
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{property.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{property.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Booking Request Modal */}
      {isBookingOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="bg-indigo-600 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                  StayWise Secure Booking
                </span>
                <h3 className="text-lg font-bold">Reserve Room Bed</h3>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              {bookingStatus && (
                <div className={`p-3 rounded-lg text-xs ${
                  bookingStatus === 'SUCCESS'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {bookingStatus === 'SUCCESS'
                    ? '✓ Booking request submitted! The owner will review and confirm.'
                    : bookingStatus}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Selected Property & Room</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <p className="font-bold text-slate-900">{property.title}</p>
                  <p className="text-slate-500 mt-0.5">{selectedRoom.name} - ₹{selectedRoom.rentPerMonth.toLocaleString()} / mo</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Expected Move-in Date</label>
                <input
                  type="date"
                  required
                  value={moveInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Number of Beds</label>
                <select
                  value={bedsCount}
                  onChange={(e) => setBedsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  {[...Array(Math.min(selectedRoom.availableBeds, 3))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Bed {i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes for Owner (Optional)</label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Moving for job at Infosys, preferred upper floor bed..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Price Calculation breakdown */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Monthly Rent ({bedsCount} bed):</span>
                  <span className="font-semibold text-slate-900">₹{(selectedRoom.rentPerMonth * bedsCount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-semibold text-slate-900">₹{(selectedRoom.deposit * bedsCount).toLocaleString()}</span>
                </div>
                <div className="pt-1.5 border-t border-indigo-200/50 flex justify-between font-bold text-slate-900">
                  <span>Total Due on Move-In:</span>
                  <span className="text-indigo-700 text-sm">₹{((selectedRoom.rentPerMonth + selectedRoom.deposit) * bedsCount).toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
              >
                {bookingLoading ? 'Submitting...' : 'Confirm & Send Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
