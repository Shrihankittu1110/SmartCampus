import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, AlertCircle, ArrowRight, ArrowLeft, Sparkles, Shield, User, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast, flashToast } = useToast();

  const searchParams = new URLSearchParams(location.search);
  const initialEmail = searchParams.get('email') || '';
  const initialPassword = searchParams.get('password') || '';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qEmail = params.get('email');
    const qPass = params.get('password');
    if (qEmail) setEmail(qEmail);
    if (qPass) setPassword(qPass);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      flashToast('Welcome back to Anurag University.', 'success', 'Login Successful');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      setError(msg);
      showToast(msg, 'error', 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword, roleLabel) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    showToast(`Autofilled ${roleLabel} demo credentials into form`, 'info', 'Credentials Loaded');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-orange-400" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
          Anurag University
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-white">Sign in to your portal</h2>
        <p className="text-xs text-blue-200/80 mt-1">
          Access your institutional role workspace
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider">
            Email Address
          </label>
          <div className="mt-1 relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-blue-300/60" />
            </div>
            <input
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@apex.edu"
              className="block w-full pl-10 pr-3 py-2.5 text-xs text-white bg-[#0a0e38]/80 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 placeholder-blue-200/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#0a0e38]/40"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              tabIndex={loading ? -1 : 0}
              className={`text-xs text-orange-400 font-medium transition-colors ${
                loading ? 'pointer-events-none opacity-50' : 'hover:text-orange-300'
              }`}
            >
              Forgot password?
            </Link>
          </div>
          <div className="mt-1 relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-blue-300/60" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-10 pr-10 py-2.5 text-xs text-white bg-[#0a0e38]/80 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 placeholder-blue-200/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#0a0e38]/40"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-blue-300/70 hover:text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-orange-400" />
              ) : (
                <Eye className="h-4 w-4 text-blue-200 hover:text-white" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white btn-vivid-orange shadow-lg shadow-orange-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Quick Switcher */}
      <div className="mt-6 pt-5 border-t border-white/15">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Quick Demo Logins (Click to Autofill):</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px]">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleFillDemo('superadmin@campusflow.edu', 'Admin@123', 'Super Admin')}
            className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/15 hover:border-orange-500/50 border border-white/10 transition-all text-white min-w-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <span className="font-bold text-white block truncate">Super Admin</span>
            <span className="text-orange-300 text-[9px] sm:text-[10px] block truncate">Global Control</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleFillDemo('admin@anurag.edu.in', 'Admin@123', 'Campus Admin')}
            className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/15 hover:border-orange-500/50 border border-white/10 transition-all text-white min-w-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <span className="font-bold text-white block truncate">Campus Admin</span>
            <span className="text-orange-300 text-[9px] sm:text-[10px] block truncate">Anurag University</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleFillDemo('faculty.cs@anurag.edu.in', 'Faculty@123', 'Faculty (CSE)')}
            className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/15 hover:border-orange-500/50 border border-white/10 transition-all text-white min-w-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <span className="font-bold text-white block truncate">Faculty (CSE)</span>
            <span className="text-emerald-400 text-[9px] sm:text-[10px] block truncate">Dr. Alan Turing</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleFillDemo('student1@anurag.edu.in', 'Student@123', 'Rahul Sharma')}
            className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/15 hover:border-orange-500/50 border border-white/10 transition-all text-white min-w-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <span className="font-bold text-white block truncate">Student (Safe)</span>
            <span className="text-cyan-300 text-[9px] sm:text-[10px] block truncate">Rahul (CGPA 8.8)</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleFillDemo('student3@anurag.edu.in', 'Student@123', 'Amit Kumar')}
            className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/15 hover:border-orange-500/50 border border-white/10 transition-all text-white min-w-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <span className="font-bold text-white block truncate">Student (Alert)</span>
            <span className="text-amber-300 text-[9px] sm:text-[10px] block truncate">Amit (Att: 58%)</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleFillDemo('placement@anurag.edu.in', 'Placement@123', 'Placement Cell')}
            className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/15 hover:border-orange-500/50 border border-white/10 transition-all text-white min-w-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <span className="font-bold text-white block truncate">Placement Cell</span>
            <span className="text-orange-300 text-[9px] sm:text-[10px] block truncate">Marcus Brody</span>
          </button>
        </div>
      </div>
    </div>
  );
}
