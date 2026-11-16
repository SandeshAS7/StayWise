import React from 'react';
import { Home, ShieldCheck, Heart, User as UserIcon, LogOut, Building, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  wishlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openAuthModal,
  wishlistCount,
}) => {
  const { user, logout, demoLogin } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro-banner for fast role testing */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-white">Bengaluru's Verified PG Platform</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">No fake photos, guaranteed bed availability</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Quick Test Login:</span>
            <button
              onClick={() => demoLogin('student')}
              className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-2 py-0.5 rounded text-[11px] font-medium transition"
            >
              Tenant/Student
            </button>
            <button
              onClick={() => demoLogin('owner')}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2 py-0.5 rounded text-[11px] font-medium transition"
            >
              PG Owner
            </button>
            <button
              onClick={() => demoLogin('admin')}
              className="bg-slate-800 hover:bg-slate-700 text-purple-400 px-2 py-0.5 rounded text-[11px] font-medium transition"
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="bg-indigo-600 group-hover:bg-indigo-700 text-white p-2 rounded-xl shadow-md shadow-indigo-100 transition">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-transparent">
                  StayWise
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <ShieldCheck className="h-2.5 w-2.5" /> Verified
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">Find your stay. Verify before you book.</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`text-sm font-medium transition ${
                currentView === 'home' ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('search')}
              className={`text-sm font-medium transition ${
                currentView === 'search' ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Explore PGs
            </button>

            {user?.role === 'ROLE_STUDENT' && (
              <button
                onClick={() => setCurrentView('student-dashboard')}
                className={`text-sm font-medium transition ${
                  currentView === 'student-dashboard' ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Bookings
              </button>
            )}

            {user?.role === 'ROLE_OWNER' && (
              <button
                onClick={() => setCurrentView('owner-dashboard')}
                className={`text-sm font-medium transition flex items-center gap-1.5 ${
                  currentView === 'owner-dashboard' ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="h-4 w-4" />
                Owner Portal
              </button>
            )}

            {user?.role === 'ROLE_ADMIN' && (
              <button
                onClick={() => setCurrentView('admin-dashboard')}
                className={`text-sm font-medium transition flex items-center gap-1.5 ${
                  currentView === 'admin-dashboard' ? 'text-purple-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="h-4 w-4 text-purple-600" />
                Admin Console
              </button>
            )}
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (user?.role === 'ROLE_STUDENT') {
                  setCurrentView('student-dashboard');
                } else {
                  setCurrentView('search');
                }
              }}
              className="relative p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
              title="Saved PGs"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">{user.fullName}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700">
                    {user.role === 'ROLE_ADMIN' ? 'Administrator' : user.role === 'ROLE_OWNER' ? 'PG Owner' : 'Student/Tenant'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
