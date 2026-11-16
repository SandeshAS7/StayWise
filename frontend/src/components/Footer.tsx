import React from 'react';
import { Home, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">StayWise</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find your stay. Verify before you book. StayWise connects college students and working professionals to verified PGs with guaranteed room availability across Bengaluru.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" /> 100% Platform Verified Properties
            </div>
          </div>

          {/* Popular Localities */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Bengaluru Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#search" className="hover:text-white transition">PG in BTM Layout (Udupi Garden, 2nd Stage)</a></li>
              <li><a href="#search" className="hover:text-white transition">PG in Koramangala (5th & 4th Block)</a></li>
              <li><a href="#search" className="hover:text-white transition">PG in HSR Layout (Sector 1, 2, 3)</a></li>
              <li><a href="#search" className="hover:text-white transition">PG in Indiranagar (100 Feet Rd)</a></li>
              <li><a href="#search" className="hover:text-white transition">PG in Marathahalli & ORR Tech Parks</a></li>
              <li><a href="#search" className="hover:text-white transition">PG in Electronic City Phase 1 & 2</a></li>
            </ul>
          </div>

          {/* For Owners & Tenants */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform Features</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white">Live Bed Availability Check</span></li>
              <li><span className="hover:text-white">Admin Physical & Doc Verification</span></li>
              <li><span className="hover:text-white">Transparent Rent & Zero Hidden Fees</span></li>
              <li><span className="hover:text-white">Instant Booking Request & Status Tracking</span></li>
              <li><span className="hover:text-white">Verified Student Reviews & Ratings</span></li>
              <li><span className="hover:text-white">Owner Property Management Suite</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Bangalore Support</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Indiranagar & BTM Tech Hub, Bengaluru, Karnataka 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>+91 98450 12345 (Mon-Sat, 9AM-8PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>support@staywise.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 StayWise Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Owner Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
