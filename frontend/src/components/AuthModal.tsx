import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Building, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'ROLE_STUDENT' | 'ROLE_OWNER'>('ROLE_STUDENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register, demoLogin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({
          fullName,
          email,
          password,
          phoneNumber,
          role,
          businessName: role === 'ROLE_OWNER' ? businessName : undefined,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole: 'student' | 'owner' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(demoRole);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              StayWise Access
            </span>
          </div>
          <h3 className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-indigo-100 mt-1">
            {mode === 'login'
              ? 'Sign in to manage your bookings and verified properties'
              : 'Join Bangalore’s fastest growing verified PG community'}
          </p>

          {/* Quick Demo Login Row */}
          <div className="mt-4 pt-3 border-t border-indigo-500/40">
            <span className="text-[11px] font-medium text-indigo-200 block mb-1.5 flex items-center gap-1">
              <Key className="h-3 w-3" /> 1-Click Quick Demo Login:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('student')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-medium py-1 rounded transition text-center"
              >
                Tenant
              </button>
              <button
                type="button"
                onClick={() => handleDemo('owner')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-emerald-300 text-[11px] font-medium py-1 rounded transition text-center"
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => handleDemo('admin')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-purple-200 text-[11px] font-medium py-1 rounded transition text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-3 text-xs font-semibold transition ${
              mode === 'login'
                ? 'text-indigo-600 bg-white border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-3 text-xs font-semibold transition ${
              mode === 'register'
                ? 'text-indigo-600 bg-white border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">I am registering as</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('ROLE_STUDENT')}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition ${
                    role === 'ROLE_STUDENT'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="h-4 w-4" /> Student / Tenant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ROLE_OWNER')}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition ${
                    role === 'ROLE_OWNER'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="h-4 w-4" /> PG Owner
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Sandesh Kumar"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {mode === 'register' && role === 'ROLE_OWNER' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PG / Business Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Suresh Luxury PG"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-indigo-100 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
