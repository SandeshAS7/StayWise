import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, ShieldCheck, Star, Heart, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Property } from '../types';
import { api } from '../services/api';

interface SearchPageProps {
  initialFilters?: { location?: string; gender?: string; maxRent?: number };
  onSelectProperty: (property: Property) => void;
  wishlistIds: number[];
  onToggleWishlist: (propertyId: number) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialFilters = {},
  onSelectProperty,
  wishlistIds,
  onToggleWishlist,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [location, setLocation] = useState(initialFilters.location || '');
  const [gender, setGender] = useState(initialFilters.gender || 'ALL');
  const [maxRent, setMaxRent] = useState<number | undefined>(initialFilters.maxRent);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortOption, setSortOption] = useState('createdAt,desc');

  useEffect(() => {
    fetchProperties();
  }, [location, gender, maxRent, verifiedOnly, sortOption]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await api.getProperties({
        location: location || undefined,
        gender: gender !== 'ALL' ? gender : undefined,
        maxRent: maxRent || undefined,
        verifiedOnly: verifiedOnly || undefined,
        sort: sortOption,
      });
      setProperties(data.content);
    } catch (err) {
      console.error('Error fetching properties', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Explore Accommodations in Bengaluru</h1>
            <p className="text-xs text-slate-500">Showing {properties.length} verified PG & coliving options</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="createdAt,desc">Newly Listed</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search area (e.g. BTM, HSR, Koramangala)"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Gender filter */}
          <div>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Genders</option>
              <option value="MALE">Gents Only</option>
              <option value="FEMALE">Ladies Only</option>
              <option value="UNISEX">Coliving / Unisex</option>
            </select>
          </div>

          {/* Max Rent */}
          <div>
            <select
              value={maxRent || ''}
              onChange={(e) => setMaxRent(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="">Any Budget</option>
              <option value="7000">Under ₹7,000</option>
              <option value="9000">Under ₹9,000</option>
              <option value="12000">Under ₹12,000</option>
              <option value="16000">Under ₹16,000</option>
              <option value="25000">Under ₹25,000</option>
            </select>
          </div>

          {/* Verified Only toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 w-full transition">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Finding verified accommodations...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No PGs found matching your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your budget or searching in nearby Bengaluru locations like BTM, Koramangala, or HSR Layout.
          </p>
          <button
            onClick={() => { setLocation(''); setGender('ALL'); setMaxRent(undefined); setVerifiedOnly(false); }}
            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const isWishlisted = wishlistIds.includes(property.id);
            const totalAvailableBeds = property.roomTypes?.reduce((acc, r) => acc + r.availableBeds, 0) || 0;

            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col group"
              >
                {/* Photo & badges */}
                <div
                  className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => onSelectProperty(property)}
                >
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

                {/* Info */}
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

                    {/* Room types tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.roomTypes?.map((room) => (
                        <span key={room.id} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                          {room.name}: ₹{room.rentPerMonth.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Starting at</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-slate-900">₹{property.minRent?.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 font-medium">/mo</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        totalAvailableBeds > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {totalAvailableBeds > 0 ? `${totalAvailableBeds} beds left` : 'Fully Booked'}
                      </span>
                      <button
                        onClick={() => onSelectProperty(property)}
                        className="block mt-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Details & Booking →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
