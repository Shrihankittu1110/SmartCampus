import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, ArrowLeft, Sparkles, Shield, User } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const initialEmail = searchParams.get('email') || '';
  const initialPassword = searchParams.get('password') || '';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-indigo-400" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
          Anurag University
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-white">Sign in to your portal</h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your institutional role workspace
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Email Address
          </label>
          <div className="mt-1 relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@apex.edu"
              className="block w-full pl-10 pr-3 py-2.5 text-xs text-white bg-slate-950/60 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="mt-1 relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-10 pr-3 py-2.5 text-xs text-white bg-slate-950/60 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:brightness-110 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Demo Credentials Quick Switcher */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Demo Logins (Click to Autofill):</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px]">
          <button
            type="button"
            onClick={() => handleFillDemo('superadmin@campusflow.edu', 'Admin@123')}
            className="p-2 text-left rounded-xl bg-slate-950/60 hover:bg-purple-950/40 hover:border-purple-500/50 border border-slate-800 transition-all text-slate-300 min-w-0"
          >
            <span className="font-bold text-white block truncate">Super Admin</span>
            <span className="text-purple-400 text-[9px] sm:text-[10px] block truncate">Global Control</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('admin@anurag.edu.in', 'Admin@123')}
            className="p-2 text-left rounded-xl bg-slate-950/60 hover:bg-indigo-950/40 hover:border-indigo-500/50 border border-slate-800 transition-all text-slate-300 min-w-0"
          >
            <span className="font-bold text-white block truncate">Campus Admin</span>
            <span className="text-indigo-400 text-[9px] sm:text-[10px] block truncate">Anurag University</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('faculty.cs@anurag.edu.in', 'Faculty@123')}
            className="p-2 text-left rounded-xl bg-slate-950/60 hover:bg-teal-950/40 hover:border-teal-500/50 border border-slate-800 transition-all text-slate-300 min-w-0"
          >
            <span className="font-bold text-white block truncate">Faculty (CSE)</span>
            <span className="text-teal-400 text-[9px] sm:text-[10px] block truncate">Dr. Alan Turing</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('student1@anurag.edu.in', 'Student@123')}
            className="p-2 text-left rounded-xl bg-slate-950/60 hover:bg-cyan-950/40 hover:border-cyan-500/50 border border-slate-800 transition-all text-slate-300 min-w-0"
          >
            <span className="font-bold text-white block truncate">Student (Safe)</span>
            <span className="text-cyan-400 text-[9px] sm:text-[10px] block truncate">Rahul (CGPA 8.8)</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('student3@anurag.edu.in', 'Student@123')}
            className="p-2 text-left rounded-xl bg-slate-950/60 hover:bg-amber-950/40 hover:border-amber-500/50 border border-slate-800 transition-all text-slate-300 min-w-0"
          >
            <span className="font-bold text-white block truncate">Student (Alert)</span>
            <span className="text-amber-400 text-[9px] sm:text-[10px] block truncate">Amit (Att: 58%)</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('placement@anurag.edu.in', 'Placement@123')}
            className="p-2 text-left rounded-xl bg-slate-950/60 hover:bg-violet-950/40 hover:border-violet-500/50 border border-slate-800 transition-all text-slate-300 min-w-0"
          >
            <span className="font-bold text-white block truncate">Placement Cell</span>
            <span className="text-violet-400 text-[9px] sm:text-[10px] block truncate">Marcus Brody</span>
          </button>
        </div>
      </div>
    </div>
  );
}
