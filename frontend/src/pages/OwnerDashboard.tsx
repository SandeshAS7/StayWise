import React, { useState, useEffect } from 'react';
import { Building, Plus, CheckCircle, XCircle, Clock, ShieldCheck, MapPin, Users, AlertCircle } from 'lucide-react';
import { Property, Booking, Amenity } from '../types';
import { api } from '../services/api';

export const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'properties' | 'bookings'>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Property Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('BTM Layout');
  const [pincode, setPincode] = useState('560076');
  const [genderPreference, setGenderPreference] = useState('UNISEX');
  const [foodType, setFoodType] = useState('BOTH');
  const [rules, setRules] = useState('');
  const [minRent, setMinRent] = useState(7000);
  const [depositAmount, setDepositAmount] = useState(5000);
  const [contactPhone, setContactPhone] = useState('+91 98450 12345');
  const [contactEmail, setContactEmail] = useState('owner@staywise.com');
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([1, 2, 4, 5, 8]);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');

  useEffect(() => {
    loadData();
    api.getAmenities().then(setAmenities).catch(console.error);
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'properties') {
        const data = await api.getOwnerProperties();
        setProperties(data);
      } else {
        const data = await api.getOwnerBookings();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId: number, status: 'CONFIRMED' | 'REJECTED') => {
    try {
      await api.updateBookingStatus(bookingId, status, `Updated by PG Owner to ${status}`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProperty({
        title,
        description,
        address,
        area,
        city: 'Bengaluru',
        pincode,
        genderPreference,
        foodType,
        rules,
        minRent,
        depositAmount,
        contactPhone,
        contactEmail,
        amenityIds: selectedAmenityIds,
        imageUrls: [imageUrl],
      });
      setIsAddOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create property');
    }
  };

  const toggleAmenity = (id: number) => {
    if (selectedAmenityIds.includes(id)) {
      setSelectedAmenityIds(selectedAmenityIds.filter(aId => aId !== id));
    } else {
      setSelectedAmenityIds([...selectedAmenityIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">PG Owner Dashboard</h1>
          <p className="text-xs text-slate-500">Manage accommodation properties, room capacities, and tenant booking requests</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 transition"
        >
          <Plus className="h-4 w-4" /> Add New PG Listing
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('properties')}
          className={`py-3 px-6 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'properties'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="h-4 w-4" /> My PG Listings ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-6 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" /> Tenant Booking Requests ({bookings.length})
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading owner records...</div>
      ) : activeTab === 'properties' ? (
        properties.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Building className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No properties listed yet</h3>
            <p className="text-xs text-slate-500 mt-1">Add your PG property to get verified by StayWise.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-44 bg-slate-100">
                    <img
                      src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      {p.verificationStatus === 'APPROVED' ? (
                        <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                          <ShieldCheck className="h-3 w-3" /> Approved & Verified
                        </span>
                      ) : p.verificationStatus === 'PENDING' ? (
                        <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                          <Clock className="h-3 w-3" /> Under Verification
                        </span>
                      ) : (
                        <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                          {p.verificationStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" /> {p.area}, {p.city}
                    </p>
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                      <span className="text-slate-500">Rent starts from:</span>
                      <span className="font-bold text-slate-900">₹{p.minRent?.toLocaleString()} / mo</span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 block">Room Types:</span>
                      {p.roomTypes?.map((r) => (
                        <div key={r.id} className="flex justify-between text-[11px] text-slate-600">
                          <span>{r.name}</span>
                          <span className="font-semibold text-emerald-600">{r.availableBeds} / {r.totalBeds} beds available</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Bookings Table */
        bookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No booking requests received yet</h3>
            <p className="text-xs text-slate-500 mt-1">Tenant booking requests will appear here in real-time.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Tenant</th>
                    <th className="p-4">Property & Room</th>
                    <th className="p-4">Move-in Date</th>
                    <th className="p-4">Rent / Deposit</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{b.user?.fullName}</div>
                        <div className="text-[11px] text-slate-500">{b.user?.email}</div>
                        {b.user?.phoneNumber && <div className="text-[11px] text-slate-500">{b.user?.phoneNumber}</div>}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{b.property?.title}</div>
                        <div className="text-[11px] text-slate-500">{b.roomType?.name} ({b.bedsCount} bed)</div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{b.moveInDate}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">₹{b.totalRent?.toLocaleString()} / mo</div>
                        <div className="text-[11px] text-slate-500">Deposit: ₹{b.depositAmount?.toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        {b.status === 'CONFIRMED' ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            ✓ Confirmed
                          </span>
                        ) : b.status === 'PENDING' ? (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            ● Pending
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {b.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {b.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleBookingAction(b.id, 'CONFIRMED')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleBookingAction(b.id, 'REJECTED')}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Add Property Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 my-8">
            <div className="bg-indigo-600 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Owner Portal</span>
                <h3 className="text-lg font-bold">List a New PG Property</h3>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-white/80 hover:text-white p-1 rounded-lg">✕</button>
            </div>

            <form onSubmit={handleCreateProperty} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">PG Title / Name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Royal Comforts Luxury PG"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Property Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe facilities, walking distance to transit, atmosphere..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Bengaluru Locality / Area</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="BTM Layout">BTM Layout</option>
                    <option value="Koramangala">Koramangala</option>
                    <option value="HSR Layout">HSR Layout</option>
                    <option value="Indiranagar">Indiranagar</option>
                    <option value="Marathahalli">Marathahalli</option>
                    <option value="Electronic City">Electronic City</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 14th Main, 7th Cross, BTM 2nd Stage"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Gender Preference</label>
                  <select
                    value={genderPreference}
                    onChange={(e) => setGenderPreference(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="UNISEX">Coliving / Unisex</option>
                    <option value="MALE">Gents Only</option>
                    <option value="FEMALE">Ladies Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Food Provision</label>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="BOTH">Veg & Non-Veg</option>
                    <option value="VEG">Strictly Veg</option>
                    <option value="NONE">Self Cooking / No Food</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Starting Rent (₹ / month)</label>
                  <input
                    type="number"
                    required
                    value={minRent}
                    onChange={(e) => setMinRent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Amenities checkboxes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Amenities Included</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenities.map((a) => (
                    <label key={a.id} className="flex items-center gap-2 p-2 border rounded-lg text-xs cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={selectedAmenityIds.includes(a.id)}
                        onChange={() => toggleAmenity(a.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                      />
                      <span className="truncate">{a.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition"
              >
                Submit Property for Admin Verification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
