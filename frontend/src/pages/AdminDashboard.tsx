import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, Users, Building, Calendar, AlertTriangle } from 'lucide-react';
import { Property, AdminStats } from '../types';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, verificationsData] = await Promise.all([
        api.getAdminStats(),
        api.getPendingVerifications(),
      ]);
      setStats(statsData);
      setPendingProperties(verificationsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.approveVerification(id);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Please enter the reason for rejection:', 'Submitted property photos or documentation did not match on-site inspection standards.');
    if (!reason) return;

    try {
      await api.rejectVerification(id, reason);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldAlert className="h-4 w-4" /> Operations & Verification Management
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">StayWise Administrator Console</h1>
        <p className="text-xs text-slate-500">Monitor Bengaluru platform operations, verify PG listings, and maintain quality assurance</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.totalUsers}</span>
            <span className="text-[10px] text-slate-500 font-medium">{stats.totalStudents} tenants, {stats.totalOwners} owners</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PG Listings</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.totalProperties}</span>
            <span className="text-[10px] text-slate-500 font-medium">Across Bengaluru</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Verified PGs</span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{stats.verifiedProperties}</span>
            <span className="text-[10px] text-emerald-600 font-medium">✓ Passed checks</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Pending Queue</span>
            <span className="text-2xl font-extrabold text-amber-700 mt-1 block">{stats.pendingVerifications}</span>
            <span className="text-[10px] text-amber-600 font-medium">Requires review</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.totalBookings}</span>
            <span className="text-[10px] text-slate-500 font-medium">Platform requests</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirmed</span>
            <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">{stats.confirmedBookings}</span>
            <span className="text-[10px] text-slate-500 font-medium">Active tenant stays</span>
          </div>
        </div>
      )}

      {/* Verification Queue Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              PG Verification & Quality Assurance Queue
            </h2>
            <p className="text-xs text-slate-500">
              Review owner property submissions. Approving will publish the "Verified by StayWise" badge on the live platform.
            </p>
          </div>
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
            {pendingProperties.length} Awaiting Verification
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading pending verification queue...</div>
        ) : pendingProperties.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-800">All submissions verified!</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">There are no pending PG verification submissions right now.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">PG Property</th>
                  <th className="p-3">Owner Contact</th>
                  <th className="p-3">Locality & Address</th>
                  <th className="p-3">Rent / Gender</th>
                  <th className="p-3 text-right">Verification Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{p.description}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{p.ownerName}</div>
                      <div className="text-[11px] text-slate-500">{p.contactPhone}</div>
                      <div className="text-[11px] text-slate-500">{p.contactEmail}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{p.area}, {p.city}</div>
                      <div className="text-[11px] text-slate-500">{p.address}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">₹{p.minRent?.toLocaleString()} / mo</div>
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        {p.genderPreference}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-sm transition"
                      >
                        ✓ Approve & Verify
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        ✕ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
