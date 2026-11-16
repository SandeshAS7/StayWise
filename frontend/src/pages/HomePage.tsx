import React, { useState } from 'react';
import { Search, MapPin, ShieldCheck, Star, Users, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { Property } from '../types';

interface HomePageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onSearch: (filters: { location?: string; gender?: string; maxRent?: number }) => void;
  wishlistIds: number[];
  onToggleWishlist: (propertyId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  onSelectProperty,
  onSearch,
  wishlistIds,
  onToggleWishlist,
}) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [selectedBudget, setSelectedBudget] = useState<number | undefined>(undefined);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location: selectedLocation || undefined,
      gender: selectedGender !== 'ALL' ? selectedGender : undefined,
      maxRent: selectedBudget || undefined,
    });
  };

  const localities = [
    { name: 'BTM Layout', desc: 'Udupi Garden, 2nd Stage, Forum Mall', count: '45+ Verified PGs' },
    { name: 'Koramangala', desc: '5th & 4th Block, Startups, Cafes', count: '60+ Verified PGs' },
    { name: 'HSR Layout', desc: 'Sector 1 to 7, Agara Lake', count: '50+ Verified PGs' },
    { name: 'Indiranagar', desc: '100ft Rd, Metro, Coliving', count: '35+ Verified PGs' },
    { name: 'Marathahalli', desc: 'ORR, Embassy Tech Village', count: '40+ Verified PGs' },
    { name: 'Electronic City', desc: 'Phase 1 & 2, Infosys, Wipro', count: '30+ Verified PGs' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Bengaluru’s First 100% Verified Accommodation Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find your stay.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              Verify before you book.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Stop wasting weekends visiting full or fake PGs. Compare live bed availability, verified real photos, food reviews, and book directly with transparent pricing.
          </p>

          {/* Interactive Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl text-slate-900 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-3 text-left border border-slate-100"
          >
            {/* Area */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Locality / Area
              </label>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent py-1.5 border-b border-slate-200 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="">All Bengaluru Areas</option>
                  <option value="BTM">BTM Layout</option>
                  <option value="Koramangala">Koramangala</option>
                  <option value="HSR">HSR Layout</option>
                  <option value="Indiranagar">Indiranagar</option>
                  <option value="Marathahalli">Marathahalli</option>
                  <option value="Electronic City">Electronic City</option>
                </select>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Gender Preference
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-transparent py-1.5 border-b border-slate-200 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="ALL">Any / All</option>
                <option value="MALE">Gents / Male PG</option>
                <option value="FEMALE">Ladies / Female PG</option>
                <option value="UNISEX">Coliving / Unisex</option>
              </select>
            </div>

            {/* Budget */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Max Monthly Rent
              </label>
              <select
                value={selectedBudget || ''}
                onChange={(e) => setSelectedBudget(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full text-xs font-semibold text-slate-800 bg-transparent py-1.5 border-b border-slate-200 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="7000">Up to ₹7,000 / mo</option>
                <option value="10000">Up to ₹10,000 / mo</option>
                <option value="14000">Up to ₹14,000 / mo</option>
                <option value="20000">Up to ₹20,000 / mo</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition text-xs"
              >
                <Search className="h-4 w-4" /> Search Verified PGs
              </button>
            </div>
          </form>

          {/* Quick stats pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> Physical & Document Verification
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> Real-Time Bed Availability
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> Zero Brokerage Commission
            </span>
          </div>
        </div>
      </section>

      {/* Popular Localities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Popular Bengaluru Localities</h2>
            <p className="text-xs text-slate-500">Explore PGs near top colleges, tech parks, and metro lines</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {localities.map((loc) => (
            <div
              key={loc.name}
              onClick={() => onSearch({ location: loc.name })}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">{loc.name}</h3>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{loc.desc}</p>
              <span className="text-[10px] font-semibold text-emerald-600 mt-2 block">{loc.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Verified PGs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1">
              <ShieldCheck className="h-4 w-4" /> Verified Listings
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Accommodations</h2>
          </div>
          <button
            onClick={() => onSearch({})}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View all ({properties.length}) <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 6).map((property) => {
            const isWishlisted = wishlistIds.includes(property.id);
            const totalAvailableBeds = property.roomTypes?.reduce((acc, r) => acc + r.availableBeds, 0) || 0;

            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col group"
              >
                {/* Image & Wishlist Button */}
                <div className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectProperty(property)}>
                  <img
                    src={property.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {property.verificationStatus === 'APPROVED' && (
                      <span className="bg-emerald-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                    <span className="bg-slate-900/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow">
                      {property.genderPreference}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(property.id);
                    }}
                    className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition ${
                      isWishlisted ? 'bg-rose-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-indigo-600" /> {property.area}, {property.city}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3
                        onClick={() => onSelectProperty(property)}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                      >
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{property.averageRating || '4.5'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {property.description}
                    </p>

                    {/* Amenities tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.amenities?.slice(0, 3).map((amenity) => (
                        <span key={amenity.id} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md">
                          {amenity.name}
                        </span>
                      ))}
                      {property.amenities && property.amenities.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-medium self-center">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bed availability & Price */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Starts from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-slate-900">₹{property.minRent?.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 font-medium">/month</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        totalAvailableBeds > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {totalAvailableBeds > 0 ? `${totalAvailableBeds} beds available` : 'Full'}
                      </span>
                      <button
                        onClick={() => onSelectProperty(property)}
                        className="block mt-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        View Rooms & Book →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why StayWise Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> The StayWise Verification Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              We physically verify what brokers and classifieds hide.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs">
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">No Photo Deception</h4>
                <p className="text-slate-300">Every approved PG has verified room photos matching actual room layouts and dimensions.</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">Real Availability Lock</h4>
                <p className="text-slate-300">Never travel across Bangalore only to be told the room was booked an hour ago.</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">Transparent Deposits</h4>
                <p className="text-slate-300">Exact advance deposit, notice period, and house rules clearly published before you visit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
